# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isMap = (x) ->
  x._type is "ext_map"

# type ExtMap = Object[Any]
newMap = ->
  out = {}
  toMap(out)

# (POJO) => ExtMap
toMap = (obj) ->
  Object.defineProperty(obj, "_type", { enumerable: false, value: "ext_map", writable: false })
  obj

module.exports = {

  porter: {
    canHandle:   isMap
    dump:        (x) -> "{{nlmap:  #{JSON.stringify(x)}}}"
    importState: (x, reify) ->
      out = newMap()
      for k of x
        out[k] = reify(x[k])
      out
  }

  init: (workspace) ->

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

    # NLMAP => String
    mapToJson = (nlmap) ->
      if nlmap._type isnt "ext_map"
        throw new Error("Only nlmap type values can be converted to JSON format.")
      JSON.stringify(nlmap)

    # NLMAP => String
    mapToUrlEncoded = (nlmap) ->
      if nlmap._type isnt "ext_map"
        throw new Error("Only nlmap type values can be converted to URL format.")
      else
        kvps = []

        for own key,value of nlmap
          if (typeof value isnt 'object')
            kvps.push("#{encodeURIComponent(key)}=#{encodeURIComponent(value)}")

        kvps.join('&')

    # String => NLMAP
    jsonToMap = (json) ->
      JSON.parse(json, (key, value) ->
        if (typeof value is 'object')
          toMap(value)
        else
          value
      )

    {
      name: "nlmap"
    , prims: {
        "FROM-LIST": fromList
      ,   "TO-LIST": toList
      ,   "IS-MAP?": isMap
      ,       "ADD": add
      ,       "GET": get
      ,    "REMOVE": remove
      ,   "TO-JSON": mapToJson
      , "TO-URLENC": mapToUrlEncoded
      , "FROM-JSON": jsonToMap
      }
    }

}
