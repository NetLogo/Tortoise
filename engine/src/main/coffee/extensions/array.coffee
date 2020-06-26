# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isArray = (x) ->
  x._type is "ext_array"

notArrayException = (x, primitive) ->
  "Extension exception: not an array: #{JSON.stringify(x).replace(/,/g, ' ')} error while observer running #{primitive}"

invalidIndexException = (extArray, index) ->
  "Extension exception: #{index} is not a valid index into an array of length #{Object.keys(extArray).length}"


module.exports = {

  dumper: {
    canDump: isArray,
    dump: (x) ->
      array = []
      for index of x
        array.push(JSON.stringify(x[index]))
      # when array contains lists, it's a simple way to return lists in an array by replace ',' by ' ' --XZ (6/25/20)
      "{{array:  #{array.join(' ').replace(/,/g, ' ')}}}"
  }

  init: (workspace) ->

    # type ExtArray = Object[Number]
    newArray = ->
      out = {}
      toArray(out)

    toArray = (obj) ->
      Object.defineProperty(obj, "_type", { enumerable: false, value: "ext_array", writable: false })
      obj

    # List[Any] => ExtArray
    fromList = (list) ->
      out = newArray()
      for value, index in list
        out[index] = value
      out

    # (ExtArray) => List[Any]
    toList = (extArray) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray, "ARRAY:TO-LIST"))
      for index of extArray
        extArray[index]

    # (ExtArray) => Number
    length = (extArray) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray, "ARRAY:LENGTH"))
      Object.keys(extArray).length

    # (ExtArray, Number) => Any
    item = (extArray, index) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray, "ARRAY:ITEM"))
      extArray[index] ?
        throw new Error(
          invalidIndexException(extArray, index)
        )

    # (ExtArray, Number, Any) => Unit
    set = (extArray, index, value) ->
      if extArray._type isnt "ext_array"
        throw new Error(notArrayException(extArray, "ARRAY:SET"))
      if extArray[index]
        extArray[index] = value
      else
        throw new Error(
          invalidIndexException(extArray, index)
        )

    {
      name: "array"
    , prims: {
        "FROM-LIST": fromList
      ,   "TO-LIST": toList
      , "IS-ARRAY?": isArray
      ,    "LENGTH": length
      ,      "ITEM": item
      ,       "SET": set
      }
    }

}
