# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, getTypeOf, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims, @stringPrims) ->

  # (Number, Array[Any] | String) => Unit
  indexBoundsChecks: (prim, index, listOrString, inclusive = true) ->
    if index < 0
      @validator.error(prim, '_ isn_t greater than or equal to zero.', index)
    if index > listOrString.length or (inclusive and index is listOrString.length)
      @validator.error(prim, 'Can_t find element _ of the _ _, which is only of length _.', index, getTypeOf(listOrString).niceName(), @dumper(listOrString), listOrString.length)
    return

  # (String, Array | String) => Unit
  checkNotEmpty: (prim, listOrString) ->
    if listOrString.length is 0
      argType  = getTypeOf(listOrString)
      primName = if argType is types.String then prim else prim.toUpperCase()
      @validator.error(prim, '_ got an empty _ as input.', primName, argType.niceName())

  # (String, Array | String) => Array | String
  butFirst: (prim, listOrString) ->
    @checkNotEmpty(prim, listOrString)
    @listPrims.butFirst(listOrString)

  # (String) => (Array | String) => Array | String
  butLast: (prim, listOrString) ->
    @checkNotEmpty(prim, listOrString)
    @listPrims.butLast(listOrString)

  # (Array[Any] | String) => Boolean
  empty: (listOrString) ->
    @listPrims.empty(listOrString)

  # ((T) => Boolean, Array[T]) => Array[T]
  filter: (f, list) ->
    checkedF = (item) =>
      result = f(item)
      @validator.commonValueChecks.boolean("FILTER", result)

    @listPrims.filter(checkedF, list)

  # (Array[Any] | String) => Any | String
  first: (listOrString) ->
    if listOrString.length is 0
      @validator.error('first', 'List is empty.')

    @listPrims.first(listOrString)

  # (Any, Array[Any]) => Array[Any]
  fput: (item, list) ->
    @listPrims.fput(item, list)

  # (Number, Array[Any] | String, Any) => Array[Any] | String
  insertItem: (index, listOrString, item) ->
    @indexBoundsChecks('insert-item', index, listOrString, inclusive = false)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("INSERT-ITEM", item, types.String)

      @stringPrims.insertItem(index, listOrString, item)
    else
      @listPrims.insertItem(index, listOrString, item)

  # (Number, Array[Any] | String) => Any | String
  item: (index, listOrString) ->
    @indexBoundsChecks('item', index, listOrString)

    @listPrims.item(index, listOrString)

  # (Array[Any] | String) => Any | String
  last: (listOrString) ->
    if listOrString.length is 0
      @validator.error('last', 'List is empty.')

    @listPrims.last(listOrString)

  # (Array[Any] | String) => Number
  length: (listOrString) ->
    @listPrims.length(listOrString)

  # (Any, Array[Any]) => Array[Any]
  lput: (item, list) ->
    @listPrims.lput(item, list)

  # Array[Any] => Number
  max: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('max', 'Can_t find the _ of a list with no numbers: __', "maximum", @dumper(values), "")

    @listPrims.max(nums)

  # Array[Any] => Number
  mean: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('mean', 'Can_t find the _ of a list with no numbers: __', "mean", @dumper(values), ".")

    @listPrims.mean(nums)

  # Array[Any] => Number
  median: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('median', 'Can_t find the _ of a list with no numbers: __', "median", @dumper(values), ".")

    @validator.checkNumber('median', @listPrims.median(nums))

  # (Any, Array[Any] | AbstractAgentSet | String) => Boolean
  member: (item, items) ->
    if checks.isList(items)
      @listPrims.member(item, items)
    else if checks.isString(items)
      @stringPrims.member(item, items)
    else # agentset
      items.exists((a) -> item is a)

  # (Array[Any]) => Number
  min: (values) ->
    nums = values.filter(checks.isNumber)

    if nums.length < 1
      @validator.error('min', 'Can_t find the _ of a list with no numbers: __', "minimum", @dumper(values), "")

    @validator.checkNumber('min', @listPrims.min(nums))

  # (Array[Any]) => Array[Any]
  modes: (list) ->
    @listPrims.modes(list)

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  nOf: (count, agentSetOrList) ->
    if count < 0
      @validator.error('n-of', 'First input to _ can_t be negative.', "N-OF")

    if checks.isList(agentSetOrList)
      if (agentSetOrList.length < count)
        @validator.error('n-of', 'Requested _ random items from a list of length _.', count, agentSetOrList.length)

      @listPrims.nOfList(count, agentSetOrList)

    else # agentset
      if (agentSetOrList.size() < count)
        @validator.error('n-of', 'Requested _ random agents from a set of only _ agents.', count, agentSetOrList.size())

      @listPrims.nOfAgentSet(count, agentSetOrList)

  # (AbstractAgentSet | Array[Any]) => Agent | Any
  oneOf: (agentSetOrList) ->
    if checks.isList(agentSetOrList)
      if agentSetOrList.length is 0
        @validator.error('one-of', '_ got an empty _ as input.', "ONE-OF", types.List.niceName())
      @listPrims.oneOf(agentSetOrList)
    else # agentset
      agentSetOrList.randomAgent()

  # (Any, Array[Any] | String) => Number
  position: (item, listOrString) ->
    if checks.isList(listOrString)
      @listPrims.position(item, listOrString)
    else # string
      @stringPrims.position(item, listOrString)

  reduce: (f, list) ->
    if list.length is 0
      @validator.error('reduce', 'The list argument to reduce must not be empty.')

    @listPrims.reduce(f, list)

  # (Any | String, Array[Any] | String) => Array[Any] | String
  remove: (item, listOrString) ->
    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REMOVE", item, types.String)

      @stringPrims.remove(item, listOrString)
    else # list
      @listPrims.remove(item, listOrString)

  # (Array[Any]) => Array[Any]
  removeDuplicates: (list) ->
    @listPrims.removeDuplicates(list)

  # (Number, Array[Any] | String) => Array[Any] | String
  removeItem: (index, listOrString) ->
    @indexBoundsChecks('remove-item', index, listOrString)

    if checks.isString(listOrString)
      @stringPrims.removeItem(index, listOrString)
    else # list
      @listPrims.removeItem(index, listOrString)

  # (Number, Array[Any] | String, Any | String) => Array[Any] | String
  replaceItem: (index, listOrString, item) ->
    @indexBoundsChecks('replace-item', index, listOrString)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REPLACE-ITEM", item, types.String)

      @stringPrims.replaceItem(index, listOrString, item)
    else # list
      @listPrims.replaceItem(index, listOrString, item)

  # (Array[Any] | String) => Array[Any] | String
  reverse: (listOrString) ->
    if checks.isString(listOrString)
      @stringPrims.reverse(listOrString)
    else # list
      @listPrims.reverse(listOrString)

  # (Array[Any]) => Array[Any]
  shuffle: (list) ->
    @listPrims.shuffle(list)

  # (Array[Any] | AbstractAgentSet) => Array[Any]
  sort: (agentSetOrList) ->
    if checks.isList(agentSetOrList)
      @listPrims.sort(agentSetOrList)
    else # agentset
      agentSetOrList.sort()

  # ((Any, Any) => Boolean, Array[Any] | AbstractAgentSet) => Array[Any]
  sortBy: (f, agentSetOrList) ->
    checkedF = (a, b) =>
      result = f(a, b)
      @validator.commonValueChecks.boolean("SORT-BY", result)

    if checks.isList(agentSetOrList)
      @listPrims.sortByList(checkedF, agentSetOrList)
    else # agentset
      @listPrims.sortByAgentSet(checkedF, agentSetOrList)

  # Array[Any] => Number
  standardDeviation: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('standard-deviation', 'Can_t find the _ of a list without at least two numbers: __', "standard deviation", @dumper(values), "")

    @validator.checkNumber('standard-deviation', @listPrims.standardDeviation(nums))

  # (Array[Any], Number, Number) => Array[Any]
  sublist: (list, startIndex, endIndex) ->
    if startIndex < 0
      @validator.error('sublist', '_ is less than zero.', startIndex)
    if endIndex > list.length
      @validator.error('sublist', '_ is greater than the length of the input list (_).', endIndex, list.length)
    if endIndex < startIndex
      @validator.error('sublist', '_ is less than _.', endIndex, startIndex)

    @listPrims.sublist(list, startIndex, endIndex)

  # (String, Number, Number) => String
  substring: (text, startIndex, endIndex) ->
    @stringPrims.substring(text, startIndex, endIndex)

  # Array[Any] => Number
  sum: (values) ->
    nums = values.filter(checks.isNumber)
    @validator.checkNumber('sum', @listPrims.sum(nums))

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  upToNOf: (count, agentSetOrList) ->
    if count < 0
      @validator.error('up-to-n-of', 'First input to _ can_t be negative.', "UP-TO-N-OF")

    if checks.isList(agentSetOrList)
      @listPrims.upToNOfList(count, agentSetOrList)

    else # agentset
      @listPrims.upToNOfAgentSet(count, agentSetOrList)

  # Array[Any] => Number
  variance: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('variance', 'Can_t find the _ of a list without at least two numbers: __', "variance", @dumper(values), ".")

    @validator.checkNumber('variance', @listPrims.variance(nums))

module.exports = ListChecks
