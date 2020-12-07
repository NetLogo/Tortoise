# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims) ->
    @validateLput   = @validator.makeTypeCheck("LPUT", types.List)
    @validateLength = @validator.makeTypeCheck("LENGTH", types.String, types.List)
    @validateFilter = @validator.makeTypeCheck("FILTER", types.Boolean)

  indexBoundsChecks: (index, list) ->
    @validator.check(index < 0, '_ isn_t greater than or equal to zero.', index)
    @validator.check(index >= list.length, 'Can_t find element _ of the list _, which is only of length _.', index, @dumper(list), list.length)

  butFirst: (prim) -> (list) =>
    @validator.check(list.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butFirst(list)

  butLast: (prim) -> (list) =>
    @validator.check(list.length is 0, '_ got an empty list as input.', prim)
    @listPrims.butLast(list)

  filter: (f, list) ->
    fTypeCheck = @validateFilter
    checkedF = (item) ->
      result = f(item)
      fTypeCheck(result)
    @listPrims.filter(checkedF, list)

  # (Array[T]) => T
  first: (list) ->
    @validator.check(list.length is 0, 'List is empty.')
    @listPrims.first(list)

  item: (index, list) ->
    @indexBoundsChecks(index, list)
    @listPrims.item(index, list)

  last: (list) ->
    @validator.check(list.length is 0, 'List is empty.')
    @listPrims.last(list)

  length: (list) ->
    @listPrims.length(@validateLength(list))

  # (T, Array[T]) => Array[T]
  lput: (item, list) ->
    @listPrims.lput(item, @validateLput(list))

  # Array[Any] => Number
  median: (vals) ->
    @validator.checkNumber(@listPrims.median(vals))

  reduce: (f, list) ->
    @validator.check(list.length is 0, 'The list argument to reduce must not be empty.')
    @listPrims.reduce(f, list)

  remove: (item, listOrString) ->
    @validator.checkTypeError("REMOVE", checks.isString(listOrString) and not checks.isString(item), item, types.String)
    @listPrims.remove(item, listOrString)

  removeItem: (index, list) ->
    @indexBoundsChecks(index, list)
    @listPrims.removeItem(index, list)

  replaceItem: (index, list, item) ->
    @indexBoundsChecks(index, list)
    @listPrims.replaceItem(index, list, item)

  # Array[Any] => Number
  standardDeviation: (vals) ->
    @validator.checkNumber(@listPrims.standardDeviation(vals))

  sublist: (list, startIndex, endIndex) ->
    @validator.check(startIndex < 0, '_ is less than zero.', startIndex)
    @validator.check(endIndex > list.length, '_ is greater than the length of the input list (_).', endIndex, list.length)
    @validator.check(endIndex < startIndex, '_ is less than _.', endIndex, startIndex)
    @listPrims.sublist(list, startIndex, endIndex)

module.exports = ListChecks
