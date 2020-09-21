# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Any) => Boolean
isArray = (x) ->
  x.type is "ext_array"

module.exports = {

  porter: {
    canHandle: isArray
    dump:      (x) -> "{{array: #{x.dump()}}}"
  }

  init: (workspace) ->

    # type ExtArray = { type: "ext_array", items: Array[Any], dump: () => String }
    extArray = (array) ->
      this.items = array
      this.type = "ext_array"
      this.dump = () -> this.items.map( (item) => workspace.dump(item, true) ).join(' ')
      return

    # List[Any] => ExtArray
    fromList = (list) ->
      new extArray(list.slice(0))

    # (ExtArray) => Number|List[Any]
    toList = (extArray) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray))
      extArray.items.slice(0)

    # (ExtArray) => Number
    length = (extArray) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray))
      extArray.items.length

    # (ExtArray, Number) => Any
    item = (extArray, index) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray))
      extArray.items[index] ?
        throw new Error(
          invalidIndexException(extArray, index)
        )

    # (ExtArray, Number, Any) => Unit
    set = (extArray, index, value) ->
      if not isArray(extArray)
        throw new Error(notArrayException(extArray))
      if extArray.items[index]?
        extArray.items[index] = value
      else
        throw new Error(invalidIndexException(extArray, index))
      return

    notArrayException = (x) ->
      "Extension exception: not an array: #{workspace.dump(x, true)}"

    invalidIndexException = (extArray, index) ->
      "Extension exception: #{index} is not a valid index into an array of length #{length(extArray)}"

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
