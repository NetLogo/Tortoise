# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims) ->

  indexBoundsChecks: (index, listOrString) ->
    @validator.check(index < 0, '_ isn_t greater than or equal to zero.', index)
    @validator.check(index >= listOrString.length, 'Can_t find element _ of the list _, which is only of length _.', index, @dumper(listOrString), listOrString.length)

  butFirst: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    @validator.check(listOrString.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butFirst(listOrString)

  butLast: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    @validator.check(listOrString.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butLast(listOrString)

  filter: (f, list) ->
    @validator.commonArgChecks.reporter_list("FILTER", arguments)
    fTypeCheck = @validator.checkValueType("FILTER", types.Boolean)
    checkedF = (item) ->
      result = f(item)
      fTypeCheck(result)
    @listPrims.filter(checkedF, list)

  first: (listOrString) ->
    @validator.commonArgChecks.stringOrList("FIRST", arguments)
    @validator.check(listOrString.length is 0, 'List is empty.')
    @listPrims.first(listOrString)

  item: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("ITEM", arguments)
    @indexBoundsChecks(index, listOrString)
    @listPrims.item(index, listOrString)

  last: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LAST", arguments)
    @validator.check(listOrString.length is 0, 'List is empty.')
    @listPrims.last(listOrString)

  length: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LENGTH", arguments)
    @listPrims.length(listOrString)

  # (T, Array[T]) => Array[T]
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

  remove: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("REMOVE", arguments)
    @validator.checkTypeError("REMOVE", checks.isString(listOrString) and not checks.isString(item), item, types.String)
    @listPrims.remove(item, listOrString)

  removeItem: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("REMOVE-ITEM", arguments)
    @indexBoundsChecks(index, listOrString)
    @listPrims.removeItem(index, listOrString)

  replaceItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("REPLACE-ITEM", arguments)
    @validator.checkTypeError("REPLACE-ITEM", checks.isString(listOrString) and not checks.isString(item), item, types.String)
    @indexBoundsChecks(index, listOrString)
    @listPrims.replaceItem(index, listOrString, item)

  # Array[Any] => Number
  standardDeviation: (vals) ->
    @validator.commonArgChecks.list("STANDARD-DEVIATION", arguments)
    @validator.checkNumber(@listPrims.standardDeviation(vals))

  sublist: (list, startIndex, endIndex) ->
    @validator.commonArgChecks.list_number_number("SUBLIST", arguments)
    @validator.check(startIndex < 0, '_ is less than zero.', startIndex)
    @validator.check(endIndex > list.length, '_ is greater than the length of the input list (_).', endIndex, list.length)
    @validator.check(endIndex < startIndex, '_ is less than _.', endIndex, startIndex)
    @listPrims.sublist(list, startIndex, endIndex)

module.exports = ListChecks
