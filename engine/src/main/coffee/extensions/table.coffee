# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isTable = (x) ->
  x instanceof Map

# (Table) => String
dumpTable = (table) ->
  inner = Array.from(table).map( (item) => workspace.dump(item, true) ).join(' ')
  "[#{inner}]"

# (Any, Any) => Boolean
equals = (a, b) ->
  if a instanceof Array and b instanceof Array
    a.length is b.length and a.every((val, index) -> equals(val, b[index]))
  else
    a is b

module.exports = {

  dumper: { canDump: isTable, dump: (x) -> "{{table: #{dumpTable(x)}}}" }

  init: (workspace) ->

    # () => Table
    make = ->
      new Map()

    # (List) => Map
    fromList = (list) ->
      new Map(list.slice(0))

    # (Table) => List
    toList = (table) ->
      Array.from(table).slice(0)

    # (Table) => Unit
    clear = (table) ->
      table.clear()
      return

    # (Table, Any) => Any
    get = (table, key) ->
      if key instanceof Array
        if key = Array.from(table.keys()).find((k) -> equals(k, key))
          table.get(key)
      else
        table.get(key)

    # (Table, Any) => Boolean
    hasKey = (table, key) ->
      if key instanceof Array
        Array.from(table.keys()).some((k) -> equals(k, key))
      else
        table.has(key)

    # (Table) => List
    keys = (table) ->
      Array.from(table.keys())

    # (Table) => List
    values = (table) ->
      Array.from(table.values())

    # (Table) => Number
    length = (table) ->
      table.size

    # (Table, Any, Any) => Unit
    put = (table, key, value) ->
      if not hasKey(table, key)
        table.set(key, value)

      if key instanceof Array
        if key = Array.from(table.keys()).find((k) -> equals(k, key))
          table.set(key, value)
      else
        table.set(key, value)

      return

    # (Table, Any) => Unit
    remove = (table, key) ->
      if key instanceof Array
        if key = Array.from(table.keys()).find((k) -> equals(k, key))
          table.delete(key)
      else
        table.delete(key)

      return

    # (List) => Table
    counts = (list) ->
      counts = new Map()

      for key in list
        count = if hasKey(counts, key) then get(counts, key) + 1 else 1
        put(counts, key, count)

      counts

    # (Table, Any, Any) => Any
    getOrDefault = (table, key, defaultValue) ->
      if hasKey(table, key)
        get(table, key)
      else
        defaultValue

    # (Agentset, Reporter) => Table
    groupAgents = (agentset, reporter) ->
      return

    # (List, (Number => Number)) => Table
    groupItems = (list, reporter) ->
      group = new Map()

      for item in list
        key = Array.from(group.keys()).find((k) -> equals(k, reporter(item))) ? reporter(item)
        value = group.get(key) ? []
        value.push(item)
        group.set(key, value)

      group

    {
      name: "table"
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
      ,         "VALUES": values
      ,      "IS-TABLE?": isTable
      }
    }

}
