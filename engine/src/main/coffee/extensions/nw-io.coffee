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

  # --- agent variables and breeds, shared by the formats that can carry them (gdf, graphml, gml, gexf) ---
  #
  # Every such format stores the same two things per agent: a `breed` naming its breed, and one entry per agent
  # variable.  The variable set is the union of the default breed's variables and every breed's own variables, since
  # one file holds agents of many breeds; an agent simply omits the ones it doesn't own.  -Jeremy B July 2026

  BREED_KEY = "breed"

  # (String) => Boolean
  isDefaultBreedName = (name) ->
    name is "TURTLES" or name is "LINKS"

  # (Boolean) => Array[String] -- the union of the default breed's vars and each breed's own vars, in breed order.
  agentVarNames = (isLinky) ->
    manager   = workspace.world.breedManager
    breedName = if isLinky then "LINKS" else "TURTLES"
    names     = manager.get(breedName).varNames.slice()
    ordered   = if isLinky then manager.orderedLinkBreeds() else manager.orderedTurtleBreeds()
    for name in ordered when name isnt breedName
      for varName in manager.get(name).varNames when varName not in names
        names.push(varName)
    names

  # NetLogo variables are untyped, so a variable's type is whatever its values happen to be, taken across the agents
  # that own it -- mirroring desktop's `getBestType`.  Mixed or absent values fall back to a string.
  # (Array[Agent], String) => String
  bestVarType = (agents, varName) ->
    values = (a.getVariable(varName) for a in agents when varName in a.varNames())
    if values.length is 0                              then "string"
    else if values.every((v) -> typeof v is "number")  then "double"
    else if values.every((v) -> typeof v is "boolean") then "boolean"
    else "string"

  # (Agent, String) => Boolean
  ownsVar = (agent, varName) ->
    varName in agent.varNames()

  # Only user-defined breeds are matched, never the default TURTLES/LINKS.  Desktop's `world.breeds` holds just the
  # user's breeds, so a breed of "turtles" falls through to the caller's breed there, and must here too -- otherwise
  # loading an unbreeded save into a specific breed would silently ignore the caller.  -Jeremy B July 2026
  # (String, Boolean, String) => String
  resolveBreedName = (rawName, isLinky, defaultBreedName) ->
    return defaultBreedName if not rawName? or String(rawName).trim() is ""
    breed = workspace.world.breedManager.get(String(rawName).trim())
    if breed? and not isDefaultBreedName(breed.name) and breed.isLinky() is isLinky
      breed.name
    else
      defaultBreedName

  # The default breeds are written as blank rather than "turtles"/"links", so loading the result into a caller-chosen
  # breed still honors that choice.  See `resolveBreedName`.
  # (Agent) => String
  breedNameToWrite = (agent) ->
    name = agent.getBreedName()
    if isDefaultBreedName(name) then "" else name.toLowerCase()

  # Names are stored in the case the model declared, but formats may carry any case, so match case-insensitively.
  # Entries naming no variable of this agent's breed are skipped.
  # (Agent, Array[{ varName: String, value: Any }]) => Unit
  setAgentAttributes = (agent, attrs) ->
    ownedByLower = new Map()
    for name in agent.varNames()
      ownedByLower.set(name.toLowerCase(), name)
    for attr in attrs
      owned = ownedByLower.get(attr.varName.toLowerCase())
      agent.setVariable(owned, attr.value) if owned?
    return

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

  # Split a line into whitespace-separated tokens, keeping "..." / '...' quoted spans together (quotes stripped, so an
  # empty quoted field becomes "").  Each token records whether it was quoted, which is the only type signal vna has;
  # see `vnaTokenValue`.  There is deliberately no escape handling: Gephi's vna reader splits on
  # `[^\s"]+|"([^"]*)"`, so a quote simply cannot appear inside a value.  Used by the vna and dl parsers.
  # -Jeremy B July 2026
  # (String) => Array[{ text: String, quoted: Boolean }]
  tokenizeWhitespaceQuotedDetailed = (line) ->
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
        tokens.push({ text: s, quoted: true })
        i = j + 1
      else
        j   = i
        tok = ""
        while j < n and not /\s/.test(line[j])
          tok += line[j]
          j += 1
        tokens.push({ text: tok, quoted: false })
        i = j
    tokens

  # (String) => Array[String]
  tokenizeWhitespaceQuoted = (line) ->
    (t.text for t in tokenizeWhitespaceQuotedDetailed(line))

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

  # (Any) => String -- numbers and booleans are bare tokens; everything else is a quoted string.  See `gmlPairValue`.
  gmlValueText = (value) ->
    if typeof value is "number"
      "#{value}"
    else if typeof value is "boolean"
      if value then "true" else "false"
    else
      "\"#{String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}\""

  # (Agent, Array[String]) => Array[String]
  gmlVarLines = (agent, varNames) ->
    lines     = []
    breedName = breedNameToWrite(agent)
    lines.push("    #{BREED_KEY} #{gmlValueText(breedName)}") if breedName isnt ""
    for name in varNames when ownsVar(agent, name)
      lines.push("    #{name} #{gmlValueText(agent.getVariable(name))}")
    lines

  # () => String
  saveGml = ->
    { turtles, edges, isDirected } = contextEdges()
    nodeVars = agentVarNames(false)
    edgeVars = agentVarNames(true)

    lines = ["graph", "[", "  directed #{if isDirected then 1 else 0}"]
    for t in turtles
      lines.push("  node", "  [", "    id #{t.id}", gmlVarLines(t, nodeVars)..., "  ]")
    for link in edges
      lines.push(
        "  edge", "  ["
      , "    source #{link.end1.id}"
      , "    target #{link.end2.id}"
      , "    directed #{if link.isDirected then 1 else 0}"
      , gmlVarLines(link, edgeVars)...
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
          if text[j] is "\\" and j + 1 < n and (text[j + 1] is "\"" or text[j + 1] is "\\")
            s += text[j + 1]
            j += 2
          else
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
          # gml has no schema, so a value's type is carried only by its syntax: a quoted token is a string, a bare one
          # is a number or boolean.  `quoted` preserves that distinction, which `gmlPairValue` reads back.
          pairs.push({ key, value: (if typeof v is "object" then v.str else v), quoted: (typeof v is "object") })
      pairs
    parseList()

  # (Array[{ key: String, value: Any }], String) => Any
  gmlValue = (pairs, key) ->
    for p in pairs when typeof p.key is "string" and p.key.toLowerCase() is key
      return p.value
    null

  # A quoted token is always a string; a bare one is a number if it looks like one, a boolean if it reads as one, and
  # otherwise a string.  This is the read side of `gmlValueText`.
  # ({ value: Any, quoted: Boolean }) => Number | Boolean | String
  gmlPairValue = (pair) ->
    return pair.value if pair.quoted
    text = String(pair.value)
    if text is "true" or text is "false"        then text is "true"
    else if text isnt "" and not Number.isNaN(Number(text)) then Number(text)
    else text

  # Structural keys describe the graph rather than the agent, so they're never treated as variables.
  GML_NODE_KEYS = ["id", BREED_KEY]
  GML_EDGE_KEYS = ["source", "target", "directed", BREED_KEY]

  # (Array[{ key, value, quoted }], Array[String]) => Array[{ varName: String, value: Any }]
  gmlAttributes = (pairs, structuralKeys) ->
    attrs = []
    for p in pairs when typeof p.key is "string" and not Array.isArray(p.value)
      attrs.push({ varName: p.key, value: gmlPairValue(p) }) if p.key.toLowerCase() not in structuralKeys
    attrs

  # (String, String, String, Boolean, Command) => Unit
  loadGml = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    top  = parseGml(data)
    body = gmlValue(top, "graph") ? top

    nodeIds    = []
    nodeBreeds = []
    nodeAttrs  = new Map()
    edges      = []
    for p in body when typeof p.key is "string" and Array.isArray(p.value)
      switch p.key.toLowerCase()
        when "node"
          nodeId = gmlValue(p.value, "id")
          if nodeId?
            nodeIds.push(nodeId)
            nodeBreeds.push(resolveBreedName(gmlValue(p.value, BREED_KEY), false, turtleBreedName))
            nodeAttrs.set(String(nodeId), gmlAttributes(p.value, GML_NODE_KEYS))
        when "edge"
          directedVal = gmlValue(p.value, "directed")
          edges.push({
            from:      gmlValue(p.value, "source")
            to:        gmlValue(p.value, "target")
            directed:  if directedVal? then String(directedVal) is "1" else null
            breedName: resolveBreedName(gmlValue(p.value, BREED_KEY), true, linkBreedName)
            attrs:     gmlAttributes(p.value, GML_EDGE_KEYS)
          })

    onNode = (nodeId, turtle) ->
      setAgentAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setAgentAttributes(link, edge.attrs ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode, onEdge, nodeBreeds })

  # vna carries no types at all -- Gephi's importer adds every node and edge column as `String.class` (ImporterVNA
  # `addNodeColumn`/`addEdgeColumn`), so a file alone can't say whether `7` was a number or a string.  We write every
  # string quoted and every number and boolean bare, which costs nothing on Gephi's side (it reads both as strings)
  # and lets our own reader recover the type.  A file from elsewhere quotes only values containing spaces, so its bare
  # numeric-looking strings do load as numbers -- the format has no way to tell us otherwise.  -Jeremy B July 2026
  #
  # A quote cannot appear in a vna value at all: Gephi's reader splits on `[^\s"]+|"([^"]*)"` and its writer replaces
  # `"` with a space rather than escaping.  We do the same, so quotes in a string are lost by design.
  # (Any) => String
  vnaField = (value) ->
    if typeof value is "number"
      "#{value}"
    else if typeof value is "boolean"
      if value then "true" else "false"
    else
      "\"#{String(value).replace(/[\r\n]+/g, " ").replace(/"/g, " ")}\""

  # An agent omits the columns it doesn't own, and Gephi requires every row to have as many fields as its header, so
  # the gap is filled with `""` -- the same marker Gephi's exporter uses for an empty attribute.
  # (Agent, Array[String]) => Array[String]
  vnaVarFields = (agent, varNames) ->
    for varName in varNames
      if ownsVar(agent, varName) then vnaField(agent.getVariable(varName)) else "\"\""

  # (Agent) => String
  vnaBreedField = (agent) ->
    vnaField(breedNameToWrite(agent))

  # () => String
  saveVna = ->
    { turtles, edges } = contextEdges()
    nodeVars = agentVarNames(false)
    edgeVars = agentVarNames(true)

    # `*Node properties` is deliberately not written: Gephi's reader accepts only x/y/color/size/shortlabel/shape
    # there and throws on anything else, so agent variables belong in `*Node data`.
    lines = ["*Node data", ["ID", BREED_KEY].concat(nodeVars).join(" ")]
    for t in turtles
      lines.push([String(t.id), vnaBreedField(t)].concat(vnaVarFields(t, nodeVars)).join(" "))

    lines.push("*Tie data", ["from", "to", BREED_KEY].concat(edgeVars).join(" "))
    for link in edges
      lines.push([String(link.end1.id), String(link.end2.id), vnaBreedField(link)].concat(vnaVarFields(link, edgeVars)).join(" "))

    lines.join("\n") + "\n"

  # The read side of `vnaField`: a quoted token is always a string, a bare one is a number or boolean if it reads as
  # one.  Same rule as the gml loader, and for the same reason -- neither format records a type.
  # ({ text: String, quoted: Boolean }) => Number | Boolean | String
  vnaTokenValue = (token) ->
    return token.text if token.quoted
    text = token.text
    if text is "true" or text is "false"                    then text is "true"
    else if text isnt "" and not Number.isNaN(Number(text)) then Number(text)
    else text

  # Structural columns describe the graph rather than the agent, so they're never treated as variables.
  VNA_NODE_COLUMNS = ["id", BREED_KEY]
  VNA_TIE_COLUMNS  = ["from", "to", BREED_KEY]

  # (Array[String], Array[{ text, quoted }], Array[String]) => Array[{ varName: String, value: Any }]
  vnaAttributes = (header, toks, structuralColumns) ->
    attrs = []
    for name, i in header when name not in structuralColumns
      token = toks[i]
      # An empty field is Gephi's marker for an absent attribute, so it's left unset rather than written as "".
      attrs.push({ varName: name, value: vnaTokenValue(token) }) if token? and token.text isnt ""
    attrs

  # (String, String, String, Boolean, Command) => Unit
  loadVna = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    section    = null
    headerSeen = false
    nodeHeader = []
    tieHeader  = []
    fromIdx    = 0
    toIdx      = 1
    idIdx      = 0
    nodeIds    = []
    nodeBreeds = []
    nodeAttrs  = new Map()
    edges      = []
    for raw in data.split("\n")
      line = raw.trim()
      continue if line is ""
      if line[0] is "*"
        # Anchored at the start of the section name, not searched for anywhere in it: "*Node properties" -- which Gephi
        # writes into every vna file it exports -- contains "tie" inside "properties", and a loose search read its
        # rows as ties.  Anything we don't recognize (properties included) is skipped.  -Jeremy B July 2026
        lower      = line.toLowerCase().replace(/^\*+\s*/, "")
        section    = if lower.indexOf("tie") is 0 then "tie" else if lower.indexOf("node data") is 0 then "node" else "other"
        headerSeen = false
        continue
      toks = tokenizeWhitespaceQuotedDetailed(line)
      if section is "node"
        if not headerSeen
          headerSeen = true
          nodeHeader = (t.text.toLowerCase() for t in toks)
          idi        = nodeHeader.indexOf("id")
          idIdx      = if idi isnt -1 then idi else 0
          continue
        if toks.length > idIdx
          nodeId   = toks[idIdx].text
          breedIdx = nodeHeader.indexOf(BREED_KEY)
          rawBreed = if breedIdx isnt -1 then toks[breedIdx]?.text else null
          nodeIds.push(nodeId)
          nodeBreeds.push(resolveBreedName(rawBreed, false, turtleBreedName))
          nodeAttrs.set(String(nodeId), vnaAttributes(nodeHeader, toks, VNA_NODE_COLUMNS))
      else if section is "tie"
        if not headerSeen
          headerSeen = true
          tieHeader  = (t.text.toLowerCase() for t in toks)
          fi         = tieHeader.indexOf("from")
          ti         = tieHeader.indexOf("to")
          fromIdx    = if fi isnt -1 then fi else 0
          toIdx      = if ti isnt -1 then ti else 1
          continue
        if toks.length > Math.max(fromIdx, toIdx)
          breedIdx = tieHeader.indexOf(BREED_KEY)
          rawBreed = if breedIdx isnt -1 then toks[breedIdx]?.text else null
          edges.push({
            from:      toks[fromIdx].text
          , to:        toks[toIdx].text
          , breedName: resolveBreedName(rawBreed, true, linkBreedName)
          , attrs:     vnaAttributes(tieHeader, toks, VNA_TIE_COLUMNS)
          })

    onNode = (nodeId, turtle) ->
      setAgentAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setAgentAttributes(link, edge.attrs ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode, onEdge, nodeBreeds })

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

  # (Any) => String -- quote a field if it would otherwise break the comma-separated framing.
  gdfField = (value) ->
    text = if typeof value is "boolean" then (if value then "true" else "false") else String(value)
    if /[,'"\\]/.test(text)
      "'#{text.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'"
    else
      text

  # (Agent) => String
  gdfBreedField = (agent) ->
    gdfField(breedNameToWrite(agent))

  # (Agent, Array[String]) => Array[String]
  gdfVarFields = (agent, varNames) ->
    for varName in varNames
      if ownsVar(agent, varName) then gdfField(agent.getVariable(varName)) else ""

  # gdf spells its types VARCHAR/DOUBLE/BOOLEAN; `deserializeVarValue` already reads them back case-insensitively.
  # (Array[Agent], String) => String
  gdfColumnType = (agents, varName) ->
    switch bestVarType(agents, varName)
      when "double"  then "DOUBLE"
      when "boolean" then "BOOLEAN"
      else "VARCHAR"

  # () => String
  saveGdf = ->
    { turtles, edges } = contextEdges()

    nodeVars = agentVarNames(false)
    nodeCols = ("#{v} #{gdfColumnType(turtles, v)}" for v in nodeVars)
    lines    = ["nodedef>name VARCHAR,breed VARCHAR#{("," + c for c in nodeCols).join("")}"]
    for t in turtles
      lines.push([String(t.id), gdfBreedField(t)].concat(gdfVarFields(t, nodeVars)).join(","))

    edgeVars = agentVarNames(true)
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

  # `name`/`node1`/`node2`/`breed` carry structure rather than agent state, so they're never set as variables.
  STRUCTURAL_GDF_COLUMNS = ["name", "node1", "node2", BREED_KEY]

  # (Array[{ name: String, type: String }], Array[String]) => Array[{ varName: String, value: Any }]
  gdfAttributes = (cols, fields) ->
    attrs = []
    for col, i in cols when col.name not in STRUCTURAL_GDF_COLUMNS
      value = fields[i]
      attrs.push({ varName: col.name, value: deserializeVarValue(col.type, value) }) if value? and value isnt ""
    attrs

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
            nodeBreeds.push(resolveBreedName(rawBreed, false, turtleBreedName))
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
            , breedName: resolveBreedName(rawBreed, true, linkBreedName)
            , attrs:     gdfAttributes(edgeCols, fields)
            })

    onNode = (nodeId, turtle) ->
      setAgentAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setAgentAttributes(link, edge.attrs ? [])
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

  # graphml key ids must be unique across the whole file, but a turtle variable and a link variable may share a name,
  # so ids are namespaced by what they're `for=`.  The name a variable loads back under comes from `attr.name`, so
  # files written before the namespacing (bare `id="tvar"`) still read correctly.  -Jeremy B July 2026
  # (String, String) => String
  graphmlKeyId = (forWhat, name) ->
    "#{forWhat}-#{name}"

  # (String, Array[String], Array[Agent]) => Array[String]
  graphmlKeys = (forWhat, varNames, agents) ->
    keys = ["  <key id=\"#{graphmlKeyId(forWhat, BREED_KEY)}\" for=\"#{forWhat}\" attr.name=\"#{BREED_KEY}\" attr.type=\"string\"/>"]
    for name in varNames
      id = xmlEscape(graphmlKeyId(forWhat, name))
      keys.push("  <key id=\"#{id}\" for=\"#{forWhat}\" attr.name=\"#{xmlEscape(name)}\" attr.type=\"#{bestVarType(agents, name)}\"/>")
    keys

  # (Agent, String, Array[String]) => Array[String]
  graphmlData = (agent, forWhat, varNames) ->
    data      = []
    breedName = breedNameToWrite(agent)
    if breedName isnt ""
      data.push("      <data key=\"#{graphmlKeyId(forWhat, BREED_KEY)}\">#{xmlEscape(breedName)}</data>")
    for name in varNames when ownsVar(agent, name)
      id = xmlEscape(graphmlKeyId(forWhat, name))
      data.push("      <data key=\"#{id}\">#{xmlEscape(serializeVarValue(agent.getVariable(name)).text)}</data>")
    data

  # () => String
  saveGraphml = ->
    { turtles, edges, isDirected } = contextEdges()
    nodeVars = agentVarNames(false)
    edgeVars = agentVarNames(true)

    lines = ['<?xml version="1.0" encoding="UTF-8"?>', "<graphml>"]
    lines.push(graphmlKeys("node", nodeVars, turtles)...)
    lines.push(graphmlKeys("edge", edgeVars, edges)...)
    lines.push("  <graph edgedefault=\"#{if isDirected then "directed" else "undirected"}\">")

    for t in turtles
      data = graphmlData(t, "node", nodeVars)
      if data.length is 0
        lines.push("    <node id=\"#{t.id}\"/>")
      else
        lines.push("    <node id=\"#{t.id}\">", data..., "    </node>")

    for link in edges
      open = "    <edge source=\"#{link.end1.id}\" target=\"#{link.end2.id}\" directed=\"#{if link.isDirected then "true" else "false"}\""
      data = graphmlData(link, "edge", edgeVars)
      if data.length is 0
        lines.push("#{open}/>")
      else
        lines.push("#{open}>", data..., "    </edge>")

    lines.push("  </graph>", "</graphml>")
    lines.join("\n") + "\n"

  # (XmlNode, Map[String, { name: String, type: String }]) => { breed: String | null, attrs: Array[{ varName, value }] }
  graphmlElementData = (element, keys) ->
    breed = null
    attrs = []
    for d in xmlChildren(element, "data")
      key = keys.get(d.attrs.get("key"))
      continue if not key?
      if String(key.name).toLowerCase() is BREED_KEY
        breed = d.text
      else
        attrs.push({ varName: String(key.name), value: deserializeVarValue(key.type, d.text) })
    { breed, attrs }

  # (String, String, String, Boolean, Command) => Unit
  loadGraphml = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    root = parseXml(data)

    keys = new Map()
    for k in xmlDescendants(root, "key")
      keys.set(k.attrs.get("id"), { name: (k.attrs.get("attr.name") ? k.attrs.get("id")), type: (k.attrs.get("attr.type") ? "string") })

    edgedefault = xmlDescendants(root, "graph")[0]?.attrs.get("edgedefault")

    nodeIds    = []
    nodeBreeds = []
    nodeAttrs  = new Map()
    for nd in xmlDescendants(root, "node")
      id = String(nd.attrs.get("id"))
      { breed, attrs } = graphmlElementData(nd, keys)
      nodeIds.push(id)
      nodeBreeds.push(resolveBreedName(breed, false, turtleBreedName))
      nodeAttrs.set(id, attrs)

    edges = []
    for ed in xmlDescendants(root, "edge")
      dir      = ed.attrs.get("directed")
      directed = if dir? then (dir is "true") else (if edgedefault? then edgedefault is "directed" else null)
      { breed, attrs } = graphmlElementData(ed, keys)
      edges.push({
        from:      String(ed.attrs.get("source"))
      , to:        String(ed.attrs.get("target"))
      , directed
      , breedName: resolveBreedName(breed, true, linkBreedName)
      , attrs
      })

    onNode = (nodeId, turtle) ->
      setAgentAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setAgentAttributes(link, edge.attrs ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode, onEdge, nodeBreeds })

  # As in graphml, attribute ids are namespaced by class so a turtle and a link variable of the same name don't
  # collide; the name a variable loads back under is the `title`.  -Jeremy B July 2026
  # (String, String) => String
  gexfAttrId = (klass, name) ->
    "#{klass}-#{name}"

  # (String, Array[String], Array[Agent]) => Array[String]
  gexfAttributeDecls = (klass, varNames, agents) ->
    lines = ["    <attributes class=\"#{klass}\">"]
    lines.push("      <attribute id=\"#{gexfAttrId(klass, BREED_KEY)}\" title=\"#{BREED_KEY}\" type=\"string\"/>")
    for name in varNames
      id = xmlEscape(gexfAttrId(klass, name))
      lines.push("      <attribute id=\"#{id}\" title=\"#{xmlEscape(name)}\" type=\"#{bestVarType(agents, name)}\"/>")
    lines.push("    </attributes>")
    lines

  # (Agent, String, Array[String], String) => Array[String]
  gexfAttValues = (agent, klass, varNames, indent) ->
    values    = []
    breedName = breedNameToWrite(agent)
    if breedName isnt ""
      values.push("#{indent}  <attvalue for=\"#{gexfAttrId(klass, BREED_KEY)}\" value=\"#{xmlEscape(breedName)}\"/>")
    for name in varNames when ownsVar(agent, name)
      id = xmlEscape(gexfAttrId(klass, name))
      values.push("#{indent}  <attvalue for=\"#{id}\" value=\"#{xmlEscape(serializeVarValue(agent.getVariable(name)).text)}\"/>")
    if values.length is 0 then [] else ["#{indent}<attvalues>", values..., "#{indent}</attvalues>"]

  # () => String
  saveGexf = ->
    { turtles, edges, isDirected } = contextEdges()
    nodeVars = agentVarNames(false)
    edgeVars = agentVarNames(true)

    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<gexf version="1.2">']
    lines.push("  <graph defaultedgetype=\"#{if isDirected then "directed" else "undirected"}\">")
    lines.push(gexfAttributeDecls("node", nodeVars, turtles)...)
    lines.push(gexfAttributeDecls("edge", edgeVars, edges)...)

    lines.push("    <nodes>")
    for t in turtles
      open   = "      <node id=\"#{t.id}\" label=\"#{t.id}\""
      values = gexfAttValues(t, "node", nodeVars, "        ")
      if values.length is 0 then lines.push("#{open}/>") else lines.push("#{open}>", values..., "      </node>")
    lines.push("    </nodes>")

    lines.push("    <edges>")
    for link, i in edges
      open   = "      <edge id=\"#{i}\" source=\"#{link.end1.id}\" target=\"#{link.end2.id}\" type=\"#{if link.isDirected then "directed" else "undirected"}\""
      values = gexfAttValues(link, "edge", edgeVars, "        ")
      if values.length is 0 then lines.push("#{open}/>") else lines.push("#{open}>", values..., "      </edge>")
    lines.push("    </edges>")

    lines.push("  </graph>", "</gexf>")
    lines.join("\n") + "\n"

  # gexf attribute ids are unique only within their `class`, so a foreign file may well use id "0" for both a node and
  # an edge attribute.  Declarations are keyed by class as well as id to keep those apart.  -Jeremy B July 2026
  # (String, String) => String
  gexfDeclKey = (klass, id) ->
    "#{klass}|#{id}"

  # (XmlNode, String, Map[String, { name: String, type: String }]) => { breed: String | null, attrs: Array[...] }
  gexfElementData = (element, klass, decls) ->
    breed = null
    attrs = []
    for av in xmlDescendants(element, "attvalue")
      decl = decls.get(gexfDeclKey(klass, av.attrs.get("for")))
      continue if not decl?
      value = av.attrs.get("value")
      continue if not value?
      if String(decl.name).toLowerCase() is BREED_KEY
        breed = value
      else
        attrs.push({ varName: String(decl.name), value: deserializeVarValue(decl.type, value) })
    { breed, attrs }

  # (String, String, String, Boolean, Command) => Unit
  loadGexf = (data, turtleBreedName, linkBreedName, breedDirected, runBlock) ->
    root        = parseXml(data)
    defaultType = xmlDescendants(root, "graph")[0]?.attrs.get("defaultedgetype")

    decls = new Map()
    for decl in xmlDescendants(root, "attributes")
      klass = decl.attrs.get("class") ? "node"
      for a in xmlChildren(decl, "attribute")
        id = a.attrs.get("id")
        decls.set(gexfDeclKey(klass, id), { name: (a.attrs.get("title") ? id), type: (a.attrs.get("type") ? "string") }) if id?

    nodeIds    = []
    nodeBreeds = []
    nodeAttrs  = new Map()
    for nd in xmlDescendants(root, "node")
      id = String(nd.attrs.get("id"))
      { breed, attrs } = gexfElementData(nd, "node", decls)
      nodeIds.push(id)
      nodeBreeds.push(resolveBreedName(breed, false, turtleBreedName))
      nodeAttrs.set(id, attrs)

    edges = []
    for ed in xmlDescendants(root, "edge")
      t        = ed.attrs.get("type")
      directed = if t? then (t is "directed") else (if defaultType? then defaultType is "directed" else null)
      { breed, attrs } = gexfElementData(ed, "edge", decls)
      edges.push({
        from:      String(ed.attrs.get("source"))
      , to:        String(ed.attrs.get("target"))
      , directed
      , breedName: resolveBreedName(breed, true, linkBreedName)
      , attrs
      })

    onNode = (nodeId, turtle) ->
      setAgentAttributes(turtle, nodeAttrs.get(nodeId) ? [])
      return
    onEdge = (edge, link) ->
      setAgentAttributes(link, edge.attrs ? [])
      return
    buildLoadedGraph(nodeIds, edges, turtleBreedName, linkBreedName, breedDirected, runBlock, { onNode, onEdge, nodeBreeds })

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
