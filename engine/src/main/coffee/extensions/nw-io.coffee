# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions, ExtensionException, HaltInterrupt, InternalException, RuntimeException } = require('util/exception')

# (Any) => Boolean
isEngineException = (err) ->
  err instanceof ExtensionException or err instanceof HaltInterrupt or err instanceof InternalException or err instanceof RuntimeException

SUPPORTED_NETWORK_FORMATS = ["dl", "gdf", "gexf", "gml", "graphml", "matrix", "vna"]

# (String) => String
normalizeNetworkFormat = (rawFormat) ->
  rawFormat.trim().toLowerCase().replace(/^\./, "")

# (String) => ExtensionException
unsupportedNetworkFormatError = (rawFormat) ->
  exceptions.extension("'#{rawFormat}' is not a supported network format. Valid formats are: dl, gdf, gexf, gml, graphml, matrix, and vna.")

{ isValidLink, getBreedName } = require('extensions/nw-core')

# Shapes used by the loaders/parsers below:
# type Edge    = { from: Any, to: Any, directed: Boolean | null }
# type XmlNode = { tag: String, attrs: Map[String, String], children: Array[XmlNode], text: String }

# ({ workspace: Workspace, getCurrentContext: () => Context }) => Object
module.exports = (deps) ->
  { workspace, getCurrentContext } = deps

  # (String) => Turtle -- append a fresh turtle of the given breed and return it.
  createTurtleOfBreed = (turtleBreedName) ->
    workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
    allTurtles = workspace.world.turtles().toArray()
    allTurtles[allTurtles.length - 1]

  # The optional `opts` are: `onNode`/`onEdge` hooks, called with each created agent, and `nodeBreeds`, an array of
  # breed names parallel to `nodeIds` (breeds must be known at creation time, so they can't go through `onNode`).
  # (Array[Any], Array[Edge], String, String, Boolean, Command, { onNode, onEdge, nodeBreeds }) => Unit
  buildLoadedGraph = (nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, opts = {}) ->
    { onNode, onEdge, nodeBreeds } = opts
    idToTurtle     = new Map()
    createdTurtles = []
    for nodeId, i in nodeIds
      breedName = nodeBreeds?[i] ? turtleBreedName
      t = createTurtleOfBreed(breedName)
      createdTurtles.push(t)
      idToTurtle.set(String(nodeId), t)
      onNode(String(nodeId), t) if onNode?

    seen = new Set()
    for edge in edges
      src = idToTurtle.get(String(edge.from))
      tgt = idToTurtle.get(String(edge.to))
      continue if not (src? and tgt?)
      breedName = edge.breedName ? linkBreedName
      # A user-defined breed's own directedness wins, so one file can mix directed and undirected link breeds.  The
      # default LINKS breed has no intrinsic directedness -- it just tracks the links made so far -- so there the
      # file's own per-edge value still decides.
      breed    = workspace.world.breedManager.get(breedName)
      directed =
        if breed? and breed.isLinky() and breed.name isnt "LINKS" then breed.isDirected()
        else if edge.directed?                                    then edge.directed
        else                                                           breedDirected
      if directed
        link = workspace.world.linkManager.createDirectedLink(src, tgt, breedName)
        onEdge(edge, link) if onEdge? and link?
      else
        key = if src.id < tgt.id then "#{src.id}-#{tgt.id}-#{breedName}" else "#{tgt.id}-#{src.id}-#{breedName}"
        if not seen.has(key)
          seen.add(key)
          link = workspace.world.linkManager.createUndirectedLink(src, tgt, breedName)
          onEdge(edge, link) if onEdge? and link?

    if runBlock?
      for t in createdTurtles
        workspace.world.selfManager.askAgent(runBlock)(t)
    return

  # Split a line into whitespace-separated tokens, keeping "..." / '...' quoted spans together (quotes stripped, so an
  # empty quoted field becomes "").  Used by the vna and dl parsers.  -Jeremy B July 2026
  # (String) => Array[String]
  tokenizeWhitespaceQuoted = (line) ->
    tokens = []
    i      = 0
    n      = line.length
    while i < n
      c = line[i]
      if /\s/.test(c)
        i += 1
      else if c is "\"" or c is "'"
        j = i + 1
        s = ""
        while j < n and line[j] isnt c
          s += line[j]
          j += 1
        tokens.push(s)
        i = j + 1
      else
        j   = i
        tok = ""
        while j < n and not /\s/.test(line[j])
          tok += line[j]
          j += 1
        tokens.push(tok)
        i = j
    tokens

  # Split a comma-separated line into (trimmed, unquoted) fields, honoring "..." / '...' quoting and keeping empty
  # fields positional.  Used by the gdf parser.  -Jeremy B July 2026
  # (String) => Array[String]
  splitCommaQuoted = (line) ->
    fields = []
    cur    = ""
    quote  = null
    i      = 0
    while i < line.length
      c = line[i]
      if quote?
        if c is "\\" and i + 1 < line.length and (line[i + 1] is quote or line[i + 1] is "\\")
          cur += line[i + 1]
          i   += 1
        else if c is quote then quote = null
        else cur += c
      else if c is "\"" or c is "'"
        quote = c
      else if c is ","
        fields.push(cur.trim())
        cur = ""
      else
        cur += c
      i += 1
    fields.push(cur.trim())
    fields

  # () => { turtles: Array[Turtle], edges: Array[Link], isDirected: Boolean }
  contextEdges = ->
    ctx     = getCurrentContext()
    turtles = ctx.turtles.toArray()
    ids     = new Set(t.id for t in turtles)
    edges   = []
    for link in ctx.links.toArray() when isValidLink(link) and ids.has(link.end1.id) and ids.has(link.end2.id)
      edges.push(link)
    { turtles, edges, isDirected: ctx.isDirected }

  # () => String
  saveMatrix = ->
    { turtles, edges } = contextEdges()
    n     = turtles.length
    index = new Map()
    for t, i in turtles
      index.set(t.id, i)

    matrix = ((0 for _ in [0...n]) for _ in [0...n])
    for link in edges
      i = index.get(link.end1.id)
      j = index.get(link.end2.id)
      matrix[i][j] = 1
      matrix[j][i] = 1 if not link.isDirected

    rows = for row in matrix
      (cell.toFixed(2) for cell in row).join(" ")
    if rows.length is 0 then "" else rows.join("\n") + "\n"

  # (String, String, String, Boolean, Command) => Unit
  loadMatrix = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    cells = for line in data.split("\n") when line.trim() isnt ""
      (parseFloat(tok) for tok in line.trim().split(/\s+/))
    for row in cells
      for cell in row
        throw new Error("non-numeric matrix entry") if Number.isNaN(cell)
    n = cells.length

    nodeIds = (String(i) for i in [0...n])
    edges   = []
    for i in [0...n]
      for j in [0...n] when i isnt j and (cells[i][j] ? 0) > 0
        edges.push({ from: i, to: j })
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # --- gml (Graph Modelling Language) ---

  # () => String
  saveGml = ->
    { turtles, edges, isDirected } = contextEdges()

    lines = ["graph", "[", "  directed #{if isDirected then 1 else 0}"]
    for t in turtles
      lines.push("  node", "  [", "    id #{t.id}", "  ]")
    for link in edges
      lines.push(
        "  edge", "  ["
      , "    source #{link.end1.id}"
      , "    target #{link.end2.id}"
      , "    directed #{if link.isDirected then 1 else 0}"
      , "  ]"
      )
    lines.push("]")
    lines.join("\n") + "\n"

  # (String) => Array[String | { str: String }]
  tokenizeGml = (text) ->
    tokens = []
    i      = 0
    n      = text.length
    while i < n
      c = text[i]
      if c is "[" or c is "]"
        tokens.push(c)
        i += 1
      else if c is "\""
        j = i + 1
        s = ""
        while j < n and text[j] isnt "\""
          s += text[j]
          j += 1
        tokens.push({ str: s })
        i = j + 1
      else if /\s/.test(c)
        i += 1
      else
        j   = i
        tok = ""
        while j < n and not /\s/.test(text[j]) and text[j] isnt "[" and text[j] isnt "]" and text[j] isnt "\""
          tok += text[j]
          j += 1
        tokens.push(tok)
        i = j
    tokens

  # (String) => Array[{ key: String, value: Any }]
  parseGml = (text) ->
    tokens = tokenizeGml(text)
    pos    = 0
    parseList = ->
      pairs = []
      while pos < tokens.length and tokens[pos] isnt "]"
        key = tokens[pos]
        pos += 1
        break if pos >= tokens.length
        v = tokens[pos]
        if v is "["
          pos += 1
          val = parseList()
          pos += 1 # consume matching "]"
          pairs.push({ key, value: val })
        else
          pos += 1
          pairs.push({ key, value: (if typeof v is "object" then v.str else v) })
      pairs
    parseList()

  # (Array[{ key: String, value: Any }], String) => Any
  gmlValue = (pairs, key) ->
    for p in pairs when typeof p.key is "string" and p.key.toLowerCase() is key
      return p.value
    null

  # (String, String, String, Boolean, Command) => Unit
  loadGml = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    top  = parseGml(data)
    body = gmlValue(top, "graph") ? top

    nodeIds = []
    edges   = []
    for p in body when typeof p.key is "string" and Array.isArray(p.value)
      switch p.key.toLowerCase()
        when "node"
          nodeId = gmlValue(p.value, "id")
          nodeIds.push(nodeId) if nodeId?
        when "edge"
          directedVal = gmlValue(p.value, "directed")
          edges.push({
            from:     gmlValue(p.value, "source")
            to:       gmlValue(p.value, "target")
            directed: if directedVal? then String(directedVal) is "1" else null
          })
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # () => String
  saveVna = ->
    { turtles, edges } = contextEdges()
    lines = ["*Node data", "ID"]
    lines.push(String(t.id)) for t in turtles
    lines.push("*Tie data", "from to")
    lines.push("#{link.end1.id} #{link.end2.id}") for link in edges
    lines.join("\n") + "\n"

  # (String, String, String, Boolean, Command) => Unit
  loadVna = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    section    = null
    headerSeen = false
    fromIdx    = 0
    toIdx      = 1
    nodeIds    = []
    edges      = []
    for raw in data.split("\n")
      line = raw.trim()
      continue if line is ""
      if line[0] is "*"
        lower      = line.toLowerCase()
        section    = if lower.indexOf("tie") isnt -1 then "tie" else if lower.indexOf("node data") isnt -1 then "node" else "other"
        headerSeen = false
        continue
      toks = tokenizeWhitespaceQuoted(line)
      if section is "node"
        if not headerSeen
          headerSeen = true
        else
          nodeIds.push(toks[0]) if toks.length > 0
      else if section is "tie"
        if not headerSeen
          headerSeen = true
          header     = (h.toLowerCase() for h in toks)
          fi = header.indexOf("from")
          ti = header.indexOf("to")
          fromIdx = if fi isnt -1 then fi else 0
          toIdx   = if ti isnt -1 then ti else 1
          continue
        edges.push({ from: toks[fromIdx], to: toks[toIdx] }) if toks.length > Math.max(fromIdx, toIdx)
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # () => String
  saveDl = ->
    { turtles, edges } = contextEdges()
    index = new Map()
    for t, i in turtles
      index.set(t.id, i + 1) # DL node labels are 1-based
    lines = ["dl n=#{turtles.length} format=edgelist1", "data:"]
    lines.push("#{index.get(link.end1.id)} #{index.get(link.end2.id)}") for link in edges
    lines.join("\n") + "\n"

  # (String, String, String, Boolean, Command) => Unit
  loadDl = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    n      = 0
    inData = false
    edges  = []
    for raw in data.split("\n")
      line = raw.trim()
      continue if line is ""
      if not inData
        m = line.toLowerCase().match(/n\s*=\s*(\d+)/)
        n = parseInt(m[1], 10) if m
        inData = true if line.toLowerCase().indexOf("data:") isnt -1
        continue
      toks = tokenizeWhitespaceQuoted(line)
      edges.push({ from: toks[0], to: toks[1] }) if toks.length >= 2
    nodeIds = (String(i + 1) for i in [0...n])
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # gdf carries agent variables as typed columns, and a `breed` column naming the agent's breed, so the node/edge
  # columns are the union of the default breed's variables and every relevant breed's own variables.  An agent leaves
  # columns it doesn't own empty.  -Jeremy B July 2026

  # (Boolean) => Array[String] -- the union of the default breed's vars and each breed's own vars, in breed order.
  gdfVarNames = (isLinky) ->
    manager   = workspace.world.breedManager
    breedName = if isLinky then "LINKS" else "TURTLES"
    names     = manager.get(breedName).varNames.slice()
    ordered   = if isLinky then manager.orderedLinkBreeds() else manager.orderedTurtleBreeds()
    for name in ordered when name isnt breedName
      for varName in manager.get(name).varNames when varName not in names
        names.push(varName)
    names

  # (Array[Agent], String) => String -- gdf's column type, from the values of the agents that own the variable.
  gdfColumnType = (agents, varName) ->
    values = (a.getVariable(varName) for a in agents when varName in a.varNames())
    if values.length is 0 then "VARCHAR"
    else if values.every((v) -> typeof v is "number")  then "DOUBLE"
    else if values.every((v) -> typeof v is "boolean") then "BOOLEAN"
    else "VARCHAR"

  # (Any) => String -- quote a field if it would otherwise break the comma-separated framing.
  gdfField = (value) ->
    text = if typeof value is "boolean" then (if value then "true" else "false") else String(value)
    if /[,'"\\]/.test(text)
      "'#{text.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'"
    else
      text

  # The default breeds are left blank rather than written as "turtles"/"links", so that loading the result into a
  # caller-chosen breed still honors that choice.  See `gdfBreedName`.
  # (Agent) => String
  gdfBreedField = (agent) ->
    name = agent.getBreedName()
    if name is "TURTLES" or name is "LINKS" then "" else gdfField(name.toLowerCase())

  # (Agent, Array[String]) => Array[String]
  gdfVarFields = (agent, varNames) ->
    owned = agent.varNames()
    for varName in varNames
      if varName in owned then gdfField(agent.getVariable(varName)) else ""

  # () => String
  saveGdf = ->
    { turtles, edges } = contextEdges()

    nodeVars = gdfVarNames(false)
    nodeCols = ("#{v} #{gdfColumnType(turtles, v)}" for v in nodeVars)
    lines    = ["nodedef>name VARCHAR,breed VARCHAR#{("," + c for c in nodeCols).join("")}"]
    for t in turtles
      lines.push([String(t.id), gdfBreedField(t)].concat(gdfVarFields(t, nodeVars)).join(","))

    edgeVars = gdfVarNames(true)
    edgeCols = ("#{v} #{gdfColumnType(edges, v)}" for v in edgeVars)
    lines.push("edgedef>node1 VARCHAR,node2 VARCHAR,breed VARCHAR,directed BOOLEAN#{("," + c for c in edgeCols).join("")}")
    for link in edges
      fields = [String(link.end1.id), String(link.end2.id), gdfBreedField(link), gdfField(link.isDirected)]
      lines.push(fields.concat(gdfVarFields(link, edgeVars)).join(","))

    lines.join("\n") + "\n"

  # (String) => Array[{ name: String, type: String }]
  gdfHeaderColumns = (line) ->
    rest = line.substring(line.indexOf(">") + 1)
    for col in rest.split(",")
      parts = col.trim().split(/\s+/)
      { name: parts[0].toLowerCase(), type: (parts[1] ? "varchar").toLowerCase() }

  # (Array[{ name: String, type: String }], String) => Number
  gdfColumnIndex = (cols, name) ->
    for col, i in cols when col.name is name
      return i
    -1

  # Only user-defined breeds are matched, never the default TURTLES/LINKS.  Desktop's `world.breeds` holds just the
  # user's breeds, so a `breed` column of "turtles" falls through to the caller's breed there, and must here too --
  # otherwise loading an unbreeded save into a specific breed would silently ignore the caller.  -Jeremy B July 2026
  # (String, Boolean, String) => String
  gdfBreedName = (rawName, isLinky, defaultBreedName) ->
    return defaultBreedName if not rawName? or rawName.trim() is ""
    breed = workspace.world.breedManager.get(rawName.trim())
    isDefaultBreed = breed?.name is "TURTLES" or breed?.name is "LINKS"
    if breed? and not isDefaultBreed and breed.isLinky() is isLinky then breed.name else defaultBreedName

  # `name`/`node1`/`node2`/`breed` carry structure rather than agent state, so they're never set as variables.
  STRUCTURAL_GDF_COLUMNS = ["name", "node1", "node2", "breed"]

  # (Array[{ name: String, type: String }], Array[String]) => Array[{ varName: String, value: Any }]
  gdfAttributes = (cols, fields) ->
    attrs = []
    for col, i in cols when col.name not in STRUCTURAL_GDF_COLUMNS
      value = fields[i]
      attrs.push({ varName: col.name, value: deserializeVarValue(col.type, value) }) if value? and value isnt ""
    attrs

  # Column names are lowercased when parsed, but variables are stored in the case the model declared, so match the
  # agent's own names case-insensitively.  Columns that name no variable of this agent's breed are skipped.
  # (Agent, Array[{ varName: String, value: Any }]) => Unit
  setGdfAttributes = (agent, attrs) ->
    ownedByLower = new Map()
    for name in agent.varNames()
      ownedByLower.set(name.toLowerCase(), name)
    for attr in attrs
      owned = ownedByLower.get(attr.varName.toLowerCase())
      agent.setVariable(owned, attr.value) if owned?
    return

  # (String, String, String, Boolean, Command) => Unit
  loadGdf = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    mode       = null
    nodeCols   = []
    edgeCols   = []
    nameIdx    = 0
    n1Idx      = 0
    n2Idx      = 1
    nodeIds    = []
    nodeBreeds = []
    nodeAttrs  = new Map()
    edges      = []
    for raw in data.split("\n")
      line = raw.trim()
      continue if line is ""
      lower = line.toLowerCase()
      if lower.indexOf("nodedef>") is 0
        nodeCols = gdfHeaderColumns(line)
        idx      = gdfColumnIndex(nodeCols, "name")
        nameIdx  = if idx isnt -1 then idx else 0
        mode     = "node"
      else if lower.indexOf("edgedef>") is 0
        edgeCols = gdfHeaderColumns(line)
        i1       = gdfColumnIndex(edgeCols, "node1")
        i2       = gdfColumnIndex(edgeCols, "node2")
        n1Idx    = if i1 isnt -1 then i1 else 0
        n2Idx    = if i2 isnt -1 then i2 else 1
        mode     = "edge"
      else
        fields = splitCommaQuoted(line)
        if mode is "node"
          if fields.length > nameIdx
            nodeId    = fields[nameIdx]
            breedIdx  = gdfColumnIndex(nodeCols, "breed")
            rawBreed  = if breedIdx isnt -1 then fields[breedIdx] else null
            nodeIds.push(nodeId)
            nodeBreeds.push(gdfBreedName(rawBreed, false, turtleBreedName))
            nodeAttrs.set(String(nodeId), gdfAttributes(nodeCols, fields))
        else if mode is "edge"
          if fields.length > Math.max(n1Idx, n2Idx)
            breedIdx = gdfColumnIndex(edgeCols, "breed")
            rawBreed = if breedIdx isnt -1 then fields[breedIdx] else null
            dirIdx   = gdfColumnIndex(edgeCols, "directed")
            directed = if dirIdx isnt -1 and fields[dirIdx] isnt "" then fields[dirIdx] is "true" else null
            edges.push({
              from:      fields[n1Idx]
            , to:        fields[n2Idx]
            , directed
            , breedName: gdfBreedName(rawBreed, true, linkBreedName)
            , attrs:     gdfAttributes(edgeCols, fields)
            })

    onNode = (nodeId, turtle) ->
      setGdfAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setGdfAttributes(link, edge.attrs ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode, onEdge, nodeBreeds })

  # We parse XML with the host's XML facilities rather than a hand-rolled parser: the browser's native DOMParser in
  # production, and a javax.xml-backed parser in the GraalJS test runtime (which has full Java interop but no
  # DOMParser).  Both are normalized into a lightweight tree { tag, attrs: Map, children: [tree], text }.
  # -Jeremy B July 2026

  # (Any) => String
  xmlEscape = (s) ->
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

  # (Element) => XmlNode -- normalize a browser DOM element into our lightweight tree.
  walkDomElement = (el) ->
    attrs = new Map()
    i     = 0
    while i < el.attributes.length
      a = el.attributes[i]
      attrs.set(a.name, a.value)
      i += 1
    children = (walkDomElement(c) for c in el.children)
    { tag: el.tagName, attrs, children, text: el.textContent }

  # (Element) => XmlNode -- normalize a javax.xml (W3C) element into our lightweight tree.
  walkW3cElement = (el) ->
    attrs    = new Map()
    namedMap = el.getAttributes()
    if namedMap?
      for i in [0...namedMap.getLength()]
        a = namedMap.item(i)
        attrs.set(a.getNodeName(), a.getNodeValue())
    children = []
    nodeList = el.getChildNodes()
    for i in [0...nodeList.getLength()]
      child = nodeList.item(i)
      children.push(walkW3cElement(child)) if child.getNodeType() is 1 # ELEMENT_NODE
    { tag: el.getTagName(), attrs, children, text: el.getTextContent() }

  # (String) => XmlNode
  parseXml = (text) ->
    if typeof DOMParser isnt "undefined"
      doc = new DOMParser().parseFromString(text, "application/xml")
      # Browsers report malformed XML with a <parsererror> element rather than throwing, so check for it explicitly.  -Jeremy B 2026
      if doc.getElementsByTagName("parsererror").length > 0
        throw new Error("malformed XML")
      walkDomElement(doc.documentElement)
    else
      doc =
        try
          DBF = Java.type("javax.xml.parsers.DocumentBuilderFactory")
          IS  = Java.type("org.xml.sax.InputSource")
          SR  = Java.type("java.io.StringReader")
          DBF.newInstance().newDocumentBuilder().parse(new IS(new SR(text)))
        catch err
          throw new Error("malformed XML")
      walkW3cElement(doc.getDocumentElement())

  # (XmlNode, String) => Array[XmlNode]
  xmlChildren = (node, tag) ->
    (c for c in node.children when c.tag.toLowerCase() is tag.toLowerCase())

  # (XmlNode, String) => Array[XmlNode]
  xmlDescendants = (node, tag) ->
    results = []
    visit = (n) ->
      for c in n.children
        results.push(c) if c.tag.toLowerCase() is tag.toLowerCase()
        visit(c)
      return
    visit(node)
    results

  # () => Array[String]
  turtleOwnVarNames = -> workspace.world.breedManager.turtles().varNames

  # (Any) => { type: String, text: String }
  serializeVarValue = (value) ->
    if typeof value is "number"       then { type: "double",  text: "#{value}" }
    else if typeof value is "boolean" then { type: "boolean", text: (if value then "true" else "false") }
    else                                   { type: "string",  text: "#{value}" }

  # (String, String) => Number | Boolean | String
  deserializeVarValue = (type, text) ->
    switch type
      when "double", "float", "int", "integer", "long" then parseFloat(text)
      when "boolean", "bool"                            then text is "true"
      else text

  # () => String
  saveGraphml = ->
    { turtles, edges, isDirected } = contextEdges()
    varNames = turtleOwnVarNames()
    keyType = (name) ->
      if turtles.length > 0 then serializeVarValue(turtles[0].getVariable(name)).type else "string"

    lines = ['<?xml version="1.0" encoding="UTF-8"?>', "<graphml>"]
    for name in varNames
      lines.push("  <key id=\"#{xmlEscape(name)}\" for=\"node\" attr.name=\"#{xmlEscape(name)}\" attr.type=\"#{keyType(name)}\"/>")
    lines.push("  <graph edgedefault=\"#{if isDirected then "directed" else "undirected"}\">")
    for t in turtles
      if varNames.length is 0
        lines.push("    <node id=\"#{t.id}\"/>")
      else
        lines.push("    <node id=\"#{t.id}\">")
        for name in varNames
          lines.push("      <data key=\"#{xmlEscape(name)}\">#{xmlEscape(serializeVarValue(t.getVariable(name)).text)}</data>")
        lines.push("    </node>")
    for link in edges
      lines.push("    <edge source=\"#{link.end1.id}\" target=\"#{link.end2.id}\" directed=\"#{if link.isDirected then "true" else "false"}\"/>")
    lines.push("  </graph>", "</graphml>")
    lines.join("\n") + "\n"

  # (String, String, String, Boolean, Command) => Unit
  loadGraphml = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    root = parseXml(data)

    keys = new Map()
    for k in xmlDescendants(root, "key")
      keys.set(k.attrs.get("id"), { name: (k.attrs.get("attr.name") ? k.attrs.get("id")), type: (k.attrs.get("attr.type") ? "string") })

    edgedefault = xmlDescendants(root, "graph")[0]?.attrs.get("edgedefault")

    varNameByLower = new Map()
    for name in turtleOwnVarNames()
      varNameByLower.set(name.toLowerCase(), name)

    nodeIds   = []
    nodeAttrs = new Map()
    for nd in xmlDescendants(root, "node")
      id = String(nd.attrs.get("id"))
      nodeIds.push(id)
      attrs = []
      for d in xmlChildren(nd, "data")
        key = keys.get(d.attrs.get("key"))
        if key?
          varName = varNameByLower.get(String(key.name).toLowerCase())
          attrs.push({ varName, value: deserializeVarValue(key.type, d.text) }) if varName?
      nodeAttrs.set(id, attrs)

    edges = []
    for ed in xmlDescendants(root, "edge")
      dir      = ed.attrs.get("directed")
      directed = if dir? then (dir is "true") else (if edgedefault? then edgedefault is "directed" else null)
      edges.push({ from: String(ed.attrs.get("source")), to: String(ed.attrs.get("target")), directed })

    onNode = (nodeId, turtle) ->
      turtle.setVariable(a.varName, a.value) for a in (nodeAttrs.get(nodeId) ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode })

  # () => String
  saveGexf = ->
    { turtles, edges, isDirected } = contextEdges()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<gexf version="1.2">']
    lines.push("  <graph defaultedgetype=\"#{if isDirected then "directed" else "undirected"}\">")
    lines.push("    <nodes>")
    lines.push("      <node id=\"#{t.id}\" label=\"#{t.id}\"/>") for t in turtles
    lines.push("    </nodes>", "    <edges>")
    lines.push("      <edge id=\"#{i}\" source=\"#{link.end1.id}\" target=\"#{link.end2.id}\" type=\"#{if link.isDirected then "directed" else "undirected"}\"/>") for link, i in edges
    lines.push("    </edges>", "  </graph>", "</gexf>")
    lines.join("\n") + "\n"

  # (String, String, String, Boolean, Command) => Unit
  loadGexf = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    root        = parseXml(data)
    defaultType = xmlDescendants(root, "graph")[0]?.attrs.get("defaultedgetype")
    nodeIds     = (String(nd.attrs.get("id")) for nd in xmlDescendants(root, "node"))
    edges       = []
    for ed in xmlDescendants(root, "edge")
      t        = ed.attrs.get("type")
      directed = if t? then (t is "directed") else (if defaultType? then defaultType is "directed" else null)
      edges.push({ from: String(ed.attrs.get("source")), to: String(ed.attrs.get("target")), directed })
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # (String) => String
  saveToString = (rawFormat) ->
    format = normalizeNetworkFormat(rawFormat)
    if SUPPORTED_NETWORK_FORMATS.indexOf(format) is -1
      throw unsupportedNetworkFormatError(rawFormat)
    switch format
      when "matrix"  then saveMatrix()
      when "gml"     then saveGml()
      when "vna"     then saveVna()
      when "dl"      then saveDl()
      when "gdf"     then saveGdf()
      when "graphml" then saveGraphml()
      when "gexf"    then saveGexf()
      else throw exceptions.extension("nw:save-to-string does not yet support the '#{format}' format in NetLogo Web.")

  # (String, String, AgentSet, AgentSet, Command) => Unit
  loadFromString = (rawFormat, data, turtleBreed, linkBreed, runBlock) ->
    format = normalizeNetworkFormat(rawFormat)
    if SUPPORTED_NETWORK_FORMATS.indexOf(format) is -1
      throw unsupportedNetworkFormatError(rawFormat)
    turtleBreedName = getBreedName(turtleBreed)
    linkBreedName   = getBreedName(linkBreed)
    breedDirected   = workspace.world.breedManager.get(linkBreedName).isDirected()
    try
      switch format
        when "matrix"  then loadMatrix(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "gml"     then loadGml(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "vna"     then loadVna(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "dl"      then loadDl(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "gdf"     then loadGdf(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "graphml" then loadGraphml(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        when "gexf"    then loadGexf(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
        else throw exceptions.extension("nw:load-from-string does not yet support the '#{format}' format in NetLogo Web.")
    catch err
      # Surface malformed data as a clean extension exception (mirroring desktop), but let engine exceptions
      # (already-meaningful extension errors, user halts, errors from the optional command block) propagate as-is.
      throw err if isEngineException(err)
      throw exceptions.extension("nw:load-from-string could not parse the given #{format} data.")

  {
    "SAVE-TO-STRING":   saveToString
  , "LOAD-FROM-STRING": loadFromString
  }
