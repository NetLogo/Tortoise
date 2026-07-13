# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

# The string-based I/O primitives (nw:save-to-string / nw:load-from-string) accept an explicit format argument.  Keep
# the supported-format list, the normalization, and the error message in one place so `save` and `load` stay in
# lock-step, mirroring the desktop extension's NetworkExtensionUtil.  -Jeremy B
SUPPORTED_NETWORK_FORMATS = ["dl", "gdf", "gexf", "gml", "graphml", "matrix", "vna"]

# Normalize like desktop: trim, lower-case, and strip a single leading dot.  So "gml", "GML", ".gml", and " .GML "
# all normalize to "gml".
normalizeNetworkFormat = (rawFormat) ->
  rawFormat.trim().toLowerCase().replace(/^\./, "")

# Echoes the raw (un-normalized) format back, matching the desktop message exactly.
unsupportedNetworkFormatError = (rawFormat) ->
  exceptions.extension("'#{rawFormat}' is not a supported network format. Valid formats are: dl, gdf, gexf, gml, graphml, matrix, and vna.")

# String-based network I/O for the nw extension (nw:save-to-string / nw:load-from-string).  Extracted from
# nw.coffee; receives the shared foundation helpers it needs from its caller.  See string-io-for-netlogo-web.md.
{ isValidLink, getBreedName } = require('extensions/nw-core')

module.exports = (deps) ->
  { workspace, getCurrentContext } = deps

  # ----- String-based network I/O ---------------------------------------------------------------------------------
  #
  # nw:save-to-string / nw:load-from-string are the file-system-free counterparts to nw:save / nw:load: they move
  # network data through an in-memory string instead of a file.  Each format has a serializer (context -> string) and
  # a parser (string -> a list of node ids + a list of edges).  Round-tripping (web save -> web load) is the
  # correctness bar; see string-io-for-netlogo-web.md.

  # (Turtle) => Turtle -- append a fresh turtle of the given breed and return it.
  createTurtleOfBreed = (turtleBreedName) ->
    workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
    allTurtles = workspace.world.turtles().toArray()
    allTurtles[allTurtles.length - 1]

  # Shared graph builder used by every load-* parser.  `nodeIds` is a list of id strings (creation order); `edges` is
  # a list of { from, to, directed } where from/to are node-id strings and `directed` is true/false to force the
  # link's directedness or null to fall back to `breedDirected`.  Runs the optional -T-- command block once per
  # created turtle, in that turtle's context.
  buildLoadedGraph = (nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, onNode) ->
    idToTurtle     = new Map()
    createdTurtles = []
    for nodeId in nodeIds
      t = createTurtleOfBreed(turtleBreedName)
      createdTurtles.push(t)
      idToTurtle.set(String(nodeId), t)
      onNode(String(nodeId), t) if onNode?

    seen = new Set()
    for edge in edges
      src = idToTurtle.get(String(edge.from))
      tgt = idToTurtle.get(String(edge.to))
      continue if not (src? and tgt?)
      directed = if edge.directed? then edge.directed else breedDirected
      if directed
        workspace.world.linkManager.createDirectedLink(src, tgt, linkBreedName)
      else
        key = if src.id < tgt.id then "#{src.id}-#{tgt.id}" else "#{tgt.id}-#{src.id}"
        if not seen.has(key)
          seen.add(key)
          workspace.world.linkManager.createUndirectedLink(src, tgt, linkBreedName)

    if runBlock?
      for t in createdTurtles
        workspace.world.selfManager.askAgent(runBlock)(t)
    return

  # Split a line into whitespace-separated tokens, keeping "..." / '...' quoted spans together (quotes stripped, so an
  # empty quoted field becomes "").  Used by the vna and dl parsers.
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
  # fields positional.  Used by the gdf parser.
  splitCommaQuoted = (line) ->
    fields = []
    cur    = ""
    quote  = null
    i      = 0
    while i < line.length
      c = line[i]
      if quote?
        if c is quote then quote = null else cur += c
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

  # Iterate the current context's links whose endpoints are both in the context, yielding [end1, end2, isDirected].
  contextEdges = ->
    ctx     = getCurrentContext()
    turtles = ctx.turtles.toArray()
    ids     = new Set(t.id for t in turtles)
    edges   = []
    for link in ctx.links.toArray() when isValidLink(link) and ids.has(link.end1.id) and ids.has(link.end2.id)
      edges.push(link)
    { turtles, edges, isDirected: ctx.isDirected }

  # --- matrix (plain adjacency matrix) ---

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

  loadMatrix = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    cells = for line in data.split("\n") when line.trim() isnt ""
      (parseFloat(tok) for tok in line.trim().split(/\s+/))
    n = cells.length

    nodeIds = (String(i) for i in [0...n])
    edges   = []
    for i in [0...n]
      for j in [0...n] when i isnt j and (cells[i][j] ? 0) > 0
        edges.push({ from: i, to: j })
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # --- gml (Graph Modelling Language) ---

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

  # Tokenize a GML string into '[', ']', bare tokens, and { str } for quoted strings.
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

  # Parse GML tokens into a list of { key, value } pairs; value is a nested pair-list or a scalar string.
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

  gmlValue = (pairs, key) ->
    for p in pairs when typeof p.key is "string" and p.key.toLowerCase() is key
      return p.value
    null

  loadGml = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    top  = parseGml(data)
    # The graph body is the value of the top-level `graph` key; fall back to the top level if absent.
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

  # --- vna (Netdraw VNA) --- section-based; VNA does not record directedness, so links follow the load breed.

  saveVna = ->
    { turtles, edges } = contextEdges()
    lines = ["*Node data", "ID"]
    lines.push(String(t.id)) for t in turtles
    lines.push("*Tie data", "from to")
    lines.push("#{link.end1.id} #{link.end2.id}") for link in edges
    lines.join("\n") + "\n"

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

  # --- dl (UCINET DL, edgelist form) --- DL does not record directedness, so links follow the load breed.

  saveDl = ->
    { turtles, edges } = contextEdges()
    index = new Map()
    for t, i in turtles
      index.set(t.id, i + 1) # DL node labels are 1-based
    lines = ["dl n=#{turtles.length} format=edgelist1", "data:"]
    lines.push("#{index.get(link.end1.id)} #{index.get(link.end2.id)}") for link in edges
    lines.join("\n") + "\n"

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

  # --- gdf (GUESS GDF) --- GDF defaults to undirected on import, so links follow the load breed.

  saveGdf = ->
    { turtles, edges } = contextEdges()
    lines = ["nodedef>name VARCHAR"]
    lines.push(String(t.id)) for t in turtles
    lines.push("edgedef>node1 VARCHAR,node2 VARCHAR")
    lines.push("#{link.end1.id},#{link.end2.id}") for link in edges
    lines.join("\n") + "\n"

  # Column names from a `nodedef>`/`edgedef>` header line (each column's name is its first whitespace token).
  gdfHeaderColumns = (line) ->
    rest = line.substring(line.indexOf(">") + 1)
    (col.trim().split(/\s+/)[0].toLowerCase() for col in rest.split(","))

  loadGdf = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    mode    = null
    nameIdx = 0
    n1Idx   = 0
    n2Idx   = 1
    nodeIds = []
    edges   = []
    for raw in data.split("\n")
      line = raw.trim()
      continue if line is ""
      lower = line.toLowerCase()
      if lower.indexOf("nodedef>") is 0
        cols    = gdfHeaderColumns(line)
        idx     = cols.indexOf("name")
        nameIdx = if idx isnt -1 then idx else 0
        mode    = "node"
      else if lower.indexOf("edgedef>") is 0
        cols  = gdfHeaderColumns(line)
        i1    = cols.indexOf("node1")
        i2    = cols.indexOf("node2")
        n1Idx = if i1 isnt -1 then i1 else 0
        n2Idx = if i2 isnt -1 then i2 else 1
        mode  = "edge"
      else
        fields = splitCommaQuoted(line)
        if mode is "node"
          nodeIds.push(fields[nameIdx]) if fields.length > nameIdx
        else if mode is "edge"
          edges.push({ from: fields[n1Idx], to: fields[n2Idx] }) if fields.length > Math.max(n1Idx, n2Idx)
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock)

  # --- XML support (graphml, gexf) ---
  #
  # We parse XML with the host's XML facilities rather than a hand-rolled parser: the browser's native DOMParser in
  # production, and a javax.xml-backed parser in the GraalJS test runtime (which has full Java interop but no
  # DOMParser).  Both are normalized into a lightweight tree { tag, attrs: Map, children: [tree], text }.

  xmlEscape = (s) ->
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

  walkDomElement = (el) ->
    attrs = new Map()
    i     = 0
    while i < el.attributes.length
      a = el.attributes[i]
      attrs.set(a.name, a.value)
      i += 1
    children = (walkDomElement(c) for c in el.children)
    { tag: el.tagName, attrs, children, text: el.textContent }

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

  parseXml = (text) ->
    if typeof DOMParser isnt "undefined"
      doc = new DOMParser().parseFromString(text, "application/xml")
      walkDomElement(doc.documentElement)
    else
      DBF = Java.type("javax.xml.parsers.DocumentBuilderFactory")
      IS  = Java.type("org.xml.sax.InputSource")
      SR  = Java.type("java.io.StringReader")
      doc = DBF.newInstance().newDocumentBuilder().parse(new IS(new SR(text)))
      walkW3cElement(doc.getDocumentElement())

  xmlChildren = (node, tag) ->
    (c for c in node.children when c.tag.toLowerCase() is tag.toLowerCase())

  xmlDescendants = (node, tag) ->
    results = []
    visit = (n) ->
      for c in n.children
        results.push(c) if c.tag.toLowerCase() is tag.toLowerCase()
        visit(c)
      return
    visit(node)
    results

  # --- turtle/link own-variable helpers (for attribute round-tripping) ---

  turtleOwnVarNames = -> workspace.world.breedManager.turtles().varNames

  serializeVarValue = (value) ->
    if typeof value is "number"       then { type: "double",  text: "#{value}" }
    else if typeof value is "boolean" then { type: "boolean", text: (if value then "true" else "false") }
    else                                   { type: "string",  text: "#{value}" }

  deserializeVarValue = (type, text) ->
    switch type
      when "double", "float", "int", "integer", "long" then parseFloat(text)
      when "boolean", "bool"                            then text is "true"
      else text

  # --- graphml (GraphML XML) --- round-trips node attributes against turtle-own variables (case-insensitive).

  saveGraphml = ->
    { turtles, edges, isDirected } = contextEdges()
    varNames = turtleOwnVarNames()
    # GraphML <key>s are graph-wide, so sample each variable's type from the first turtle.
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
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, onNode)

  # --- gexf (Gephi GEXF XML) --- structural (ids/edges/directedness).

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

  # --- dispatch ---

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

  loadFromString = (rawFormat, data, turtleBreed, linkBreed, runBlock) ->
    format = normalizeNetworkFormat(rawFormat)
    if SUPPORTED_NETWORK_FORMATS.indexOf(format) is -1
      throw unsupportedNetworkFormatError(rawFormat)
    turtleBreedName = getBreedName(turtleBreed)
    linkBreedName   = getBreedName(linkBreed)
    breedDirected   = workspace.world.breedManager.get(linkBreedName).isDirected()
    switch format
      when "matrix"  then loadMatrix(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "gml"     then loadGml(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "vna"     then loadVna(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "dl"      then loadDl(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "gdf"     then loadGdf(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "graphml" then loadGraphml(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      when "gexf"    then loadGexf(data, turtleBreedName, linkBreedName, breedDirected, runBlock)
      else throw exceptions.extension("nw:load-from-string does not yet support the '#{format}' format in NetLogo Web.")

  {
    "SAVE-TO-STRING":   saveToString
  , "LOAD-FROM-STRING": loadFromString
  }
