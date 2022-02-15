# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../engine/core/typechecker')

SingleObjectExtensionPorter = require('../engine/core/world/singleobjectextensionporter')

{ exceptionFactory: exceptions } = require('util/exception')

# (Any) => Boolean
isTable = (x) ->
  x instanceof Map

# This method is to get the same-value key in a table.
# e.g (table:get glob1 [1 2]) where passing `key` param is an array; array is a reference type in JavaScript.
# So we need to find whether there's a same-value key in the table.
# -- XZ (July, 2020)
# (Table, Any) => Any | Undefined
getOriginKey = (table, key) ->
  Array.from(table.keys()).find((k) -> equals(k, key))

# Compare two Array by their values instead of references.
# (Any, Any) => Boolean
equals = (a, b) ->
  if a instanceof Array and b instanceof Array
    a.length is b.length and a.every((val, index) -> equals(val, b[index]))
  else
    a is b

# (Any) => Boolean
isValidKey = (x) ->
  if not checks.isList(x)
    return checks.isString(x) or checks.isNumber(x) or checks.isBoolean(x)
  else
    x.every((item) -> isValidKey(item))

# (List) => Boolean
checkIsValidList = (list) ->
  for pair in list
    if not (pair instanceof Array and pair.length >= 2)
      throw exceptions.extension("expected a two-element list: #{workspace.dump(pair, true)}")
  return

# (Any, String|Boolean|Number|List) ->
checkInput = ({table, key}) ->
  if not isTable(table)
    throw exceptions.extension("not a table #{workspace.dump(table, true)}")

  if key? and not isValidKey(key)
      throw exceptions.extension("" +
        "#{workspace.dump(key, true)} is not a valid table key " +
        "(a table key may only be a number, a string, true or false, or a list whose items are valid keys)")

extensionName = "table"

dumpTable = (x, dumpValue) ->
  "[#{Array.from(x).map( (item) => dumpValue(item, true) ).join(' ')}]"

exportTable = (x, exportValue) ->
  map = new Map()
  Array.from(x.keys()).forEach( (key) ->
    value = x.get(key)
    map.set(key, exportValue(value))
    return
  )
  map

formatTable = (exportedObj, formatAny) ->
  values = Array.from(exportedObj.data.keys()).map( (key) ->
    "[\"\"#{key}\"\" #{formatAny(exportedObj.data.get(key))}]"
  )
  "[#{values.join(' ')}]"

readTable = (x, parseAny) ->
  list = parseAny(x)
  new Map(list)

# (ExportedExtensionObject, (Any) => Any)) => Table
importTable = (exportedObj, reify) ->
  map = new Map()
  Array.from(exportedObj.data.keys()).forEach( (key) ->
    value = exportedObj.data.get(key)
    map.set(key, reify(value))
    return
  )
  map
  
reifyTable = (jsonObj) ->
  if not Array.isArray(jsonObj)
    map = new Map()
    Object.keys(jsonObj).forEach( (key) ->
      value = jsonObj[key]
      if (typeof(value) is "object")
        value = reifyTable(value)
      map.set(key, value)
      return
    )
    map
  else
    jsonObj.map( (item) ->
      if (typeof(item) is "object")
        reifyTable(item)
      else
        item
    )

convertObject = (map) ->
  result = Object.fromEntries(map)
  Object.keys(result).forEach( (key) ->
    value = result[key]
    if (value instanceof Map)
      result[key] = convertObject(value)
    else if (Array.isArray(value))
      result[key] = value.map( (item) -> convertObject(item) )
  )
  result

module.exports = {

  porter: new SingleObjectExtensionPorter(extensionName, isTable, dumpTable, exportTable, formatTable, readTable, importTable)

  init: (workspace) ->

    # () => Table
    make = ->
      new Map()

    # (List) => Map
    fromList = (list) ->
      checkIsValidList(list)
      new Map(list.slice(0))

    # (Table) => List
    toList = (table) ->
      checkInput({table: table})
      Array.from(table).slice(0)

    # (String) => Table
    fromJson = (source) ->
      table = reifyTable(JSON.parse(source))
      checkInput({table: table})
      table
      
    # (Table) => String
    toJson = (table) ->
      checkInput({table: table})
      JSON.stringify(convertObject(table))

    # (Table) => Unit
    clear = (table) ->
      checkInput({table: table})
      table.clear()
      return

    # (Table, Any) => Any
    get = (table, key) ->
      checkInput({table: table})
      if key not instanceof Array
        return table.get(key)

      originKey = getOriginKey(table, key)
      if originKey?
        table.get(originKey)
      else
        throw exceptions.extension("No value for #{key} in table.")

    # (Table, Any) => Boolean
    hasKey = (table, key) ->
      checkInput({table: table})
      if key not instanceof Array
        return table.has(key)

      Array.from(table.keys()).some((k) -> equals(k, key))

    # (Table) => List
    keys = (table) ->
      checkInput({table: table})
      Array.from(table.keys()).slice(0)

    # (Table) => List
    values = (table) ->
      checkInput({table: table})
      Array.from(table.values()).slice(0)

    # (Table) => Number
    length = (table) ->
      checkInput({table: table})
      table.size

    # (Table, Any, Any) => Unit
    put = (table, key, value) ->
      checkInput({table: table, key: key})

      if key not instanceof Array
        table.set(key, value)
        return

      key = getOriginKey(table, key) ? key
      table.set(key, value)
      return

    # (Table, Any) => Unit
    remove = (table, key) ->
      checkInput({table: table})

      if key not instanceof Array
        table.delete(key)
        return

      originKey = getOriginKey(table, key)
      if originKey?
        table.delete(originKey)

      return

    # (List) => Table
    counts = (list) ->
      counts = new Map()

      for item in list
        count = if hasKey(counts, item) then get(counts, item) + 1 else 1
        put(counts, item, count)

      counts

    # (Table, Any, Any) => Any
    getOrDefault = (table, key, defaultValue) ->
      checkInput({table: table})

      if hasKey(table, key)
        get(table, key)
      else
        defaultValue

    # (Agentset, Reporter) => Table
    groupAgents = (agentset, reporter) ->
      group = new Map()

      agentset.shufflerator().forEach( (agent) ->
        key = workspace.world.selfManager.askAgent(reporter)(agent)
        value = group.get(key) ? []
        value.push(agent)
        group.set(key, value)
      )

      group.forEach( (value, key) ->
        newAgentset = switch agentset._agentTypeName
          when "turtles" then new TurtleSet(value, workspace.world)
          when "patches" then new PatchSet(value, workspace.world)
          when "links"   then new LinkSet(value, workspace.world)
          else throw exceptions.internal("Unknown agentset type")
        group.set(key, newAgentset)
      )

      group

    # (List, (Number => Number)) => Table
    groupItems = (list, reporter) ->
      group = new Map()

      for item in list
        key = getOriginKey(group, reporter(item)) ? reporter(item)
        value = group.get(key) ? []
        value.push(item)
        group.set(key, value)

      group

    {
      name: extensionName
    , prims: {
                 "CLEAR": clear
      ,         "COUNTS": counts
      ,   "GROUP-AGENTS": groupAgents
      ,    "GROUP-ITEMS": groupItems
      ,      "FROM-LIST": fromList
      ,            "GET": get
      , "GET-OR-DEFAULT": getOrDefault
      ,       "HAS-KEY?": hasKey
      ,           "KEYS": keys
      ,         "LENGTH": length
      ,           "MAKE": make
      ,            "PUT": put
      ,         "REMOVE": remove
      ,        "TO-LIST": toList
      ,        "TO-JSON": toJson
      ,      "FROM-JSON": fromJson
      ,         "VALUES": values
      ,      "IS-TABLE?": isTable
      }
    }

}
