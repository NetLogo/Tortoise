# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims) ->

  # (Number, Array[Any] | String) => Unit
  indexBoundsChecks: (index, listOrString) ->
    @validator.check(index < 0, '_ isn_t greater than or equal to zero.', index)
    @validator.check(index >= listOrString.length, 'Can_t find element _ of the list _, which is only of length _.', index, @dumper(listOrString), listOrString.length)
    return

  # (String) => (Array | String) => Array | String
  butFirst: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    @validator.check(listOrString.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butFirst(listOrString)

  # (String) => (Array | String) => Array | String
  butLast: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    @validator.check(listOrString.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butLast(listOrString)

  # ((T) => Boolean, Array[T]) => Array[T]
  filter: (f, list) ->
    @validator.commonArgChecks.reporter_list("FILTER", arguments)
    fTypeCheck = @validator.checkValueType("FILTER", types.Boolean)
    checkedF = (item) ->
      result = f(item)
      fTypeCheck(result)
    @listPrims.filter(checkedF, list)

  # (Array[Any] | String) => Any | String
  first: (listOrString) ->
    @validator.commonArgChecks.stringOrList("FIRST", arguments)
    @validator.check(listOrString.length is 0, 'List is empty.')
    @listPrims.first(listOrString)

  # (Number, Array[Any] | String) => Any | String
  item: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("ITEM", arguments)
    @indexBoundsChecks(index, listOrString)
    @listPrims.item(index, listOrString)

  # (Array[Any] | String) => Any | String
  last: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LAST", arguments)
    @validator.check(listOrString.length is 0, 'List is empty.')
    @listPrims.last(listOrString)

  # (Array[Any] | String) => Number
  length: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LENGTH", arguments)
    @listPrims.length(listOrString)

  # (Any, Array[Any]) => Array[Any]
  lput: (item, list) ->
    @validator.commonArgChecks.wildcard_list("LPUT", arguments)
    @listPrims.lput(item, list)

  # Array[Any] => Number
  median: (vals) ->
    @validator.commonArgChecks.list("MEDIAN", arguments)
    @validator.checkNumber(@listPrims.median(vals))

  reduce: (f, list) ->
    @validator.commonArgChecks.reporter_list("REDUCE", arguments)
    @validator.check(list.length is 0, 'The list argument to reduce must not be empty.')
    @listPrims.reduce(f, list)

  # (Any | String, Array[Any] | String) => Array[Any] | String
  remove: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("REMOVE", arguments)
    @validator.checkTypeError("REMOVE", checks.isString(listOrString) and not checks.isString(item), item, types.String)
    @listPrims.remove(item, listOrString)

  # (Number, Array[Any] | String) => Array[Any] | String
  removeItem: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("REMOVE-ITEM", arguments)
    @indexBoundsChecks(index, listOrString)
    @listPrims.removeItem(index, listOrString)

  # (Number, Array[Any] | String, Any | String) => Array[Any] | String
  replaceItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("REPLACE-ITEM", arguments)
    @validator.checkTypeError("REPLACE-ITEM", checks.isString(listOrString) and not checks.isString(item), item, types.String)
    @indexBoundsChecks(index, listOrString)
    @listPrims.replaceItem(index, listOrString, item)

  # Array[Any] => Number
  standardDeviation: (vals) ->
    @validator.commonArgChecks.list("STANDARD-DEVIATION", arguments)
    @validator.checkNumber(@listPrims.standardDeviation(vals))

  # (Array[Any], Number, Number) => Array[Any]
  sublist: (list, startIndex, endIndex) ->
    @validator.commonArgChecks.list_number_number("SUBLIST", arguments)
    @validator.check(startIndex < 0, '_ is less than zero.', startIndex)
    @validator.check(endIndex > list.length, '_ is greater than the length of the input list (_).', endIndex, list.length)
    @validator.check(endIndex < startIndex, '_ is less than _.', endIndex, startIndex)
    @listPrims.sublist(list, startIndex, endIndex)

module.exports = ListChecks
