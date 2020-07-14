# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isTable = (x) ->
  x.type = "table"

module.exports = {

  dumper: { canDump: isTable, dump: (x) -> "{{table: [#{Array.from(x).map( (item) => workspace.dump(item, true) ).join(' ')}]}}" }

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

    # (Table, Any) => Any
    get = (table, key) ->
      table.get(key)

    # (Table, Any) => Boolean
    hasKey = (table, key) ->
      table.has(key)

    # (Table) => List
    keys = (table) ->
      Array.from(table.keys())

    # (Table) => List
    values = (table) ->
      Array.from(table.values())

    length = (table) ->
      table.size

    put = (table, key, value) ->
      table.set(key, value)
      return

    remove = (table, key) ->
      table.delete(key)
      return

    counts = () ->
      return

    groupAgents = () ->
      return

    groupItems = () ->
      return

    getOrDefault = () ->
      return

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
      }
    }

}
