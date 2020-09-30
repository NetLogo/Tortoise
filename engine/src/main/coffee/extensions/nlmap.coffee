# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isMap = (x) ->
  x._type is "nl_map"

# type NLMap = Object[Any]

# ((NLMap) => String) => NLMap
newMap = () ->
  out = {}
  toMap(out)

# (POJO, (NLMap) => String) => NLMap
toMap = (obj) ->
  Object.defineProperty(obj, "_type", { enumerable: false, value: "nl_map", writable: false })
  obj

module.exports = {

  porter: {

    extensionName: "nlmap"

    canHandle:   isMap

    dump: (x, dumpValue) ->
      values = Object.keys(x).map( (key) => "[\"#{key}\" #{dumpValue(x[key], true)}]" ).join(' ')
      " #{values}"

    exportState: (x, exportValue) ->
      out = {}
      Object.keys(x).map( (k) -> out[k] = exportValue(x[k]) )
      toMap(out)

    formatCsv: (x, formatAny) ->
      Object.keys(x).map( (key) => "[\"#{key}\" #{formatAny(x[key])}]" ).join(' ')

    importState: (x, reify) ->
      out = {}
      Object.keys(x).map( (k) -> out[k] = reify(x[k]) )
      toMap(out)

  }

  init: (workspace) ->

    # List[(String, Any)] => NLMap
    fromList = (list) ->
      out = newMap()
      for [k, v] in list
        out[k] = v
      out

    # (NLMap) => List[(String, Any)]
    toList = (nlMap) ->
      for k of nlMap
        [k, nlMap[k]]

    # (NLMap, String, Any) -> NLMap
    add = (nlMap, key, value) ->
      out = newMap()
      for k of nlMap
        out[k] = nlMap[k]
      out[key] = value
      out

    # (NLMap, String) => Any
    get = (nlMap, key) ->
      nlMap[key] ? throw new Error("#{key} does not exist in this map")

    # (NLMap, String) => NLMap
    remove = (nlMap, key) ->
      out = newMap()
      for k of nlMap when k isnt key
        out[k] = nlMap[k]
      out

    # NLMap => String
    mapToJson = (nlMap) ->
      if nlMap._type isnt "nl_map"
        throw new Error("Only nlmap type values can be converted to JSON format.")
      JSON.stringify(nlMap)

    # NLMap => String
    mapToUrlEncoded = (nlMap) ->
      if nlMap._type isnt "nl_map"
        throw new Error("Only nlmap type values can be converted to URL format.")
      else
        kvps = []

        for own key,value of nlMap
          if (typeof value isnt 'object')
            kvps.push("#{encodeURIComponent(key)}=#{encodeURIComponent(value)}")

        kvps.join('&')

    # String => NLMap
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
