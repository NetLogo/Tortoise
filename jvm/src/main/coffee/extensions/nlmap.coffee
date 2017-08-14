# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  (workspace) ->

    # type ExtMap = Object[Any]
    newMap = ->
      out = {}
      Object.defineProperty(out, "_type", { enumerable: false, value: "ext_map", writable: false })
      out

    # List[(String, Any)] => ExtMap
    fromList = (list) ->
      out = newMap()
      for [k, v] in list
        out[k] = v
      out

    # (ExtMap) => List[(String, Any)]
    toList = (extMap) ->
      for k of extMap
        [k, extMap[k]]

    # (Any) => Boolean
    isMap = (x) ->
      x._type is "ext_map"

    # (ExtMap, String, Any) -> ExtMap
    add = (extMap, key, value) ->
      out = newMap()
      for k of extMap
        out[k] = extMap[k]
      out[key] = value
      out

    # (ExtMap, String) => Any
    get = (extMap, key) ->
      extMap[key] ? throw new Error("#{key} does not exist in this map")

    # (ExtMap, String) => ExtMap
    remove = (extMap, key) ->
      out = newMap()
      for k of extMap when k isnt key
        out[k] = extMap[k]
      out

    {
      name: "nlmap"
    , prims: {
        "FROM-LIST": fromList
      ,   "TO-LIST": toList
      ,   "IS-MAP?": isMap
      ,       "ADD": add
      ,       "GET": get
      ,    "REMOVE": remove
      }
    }
