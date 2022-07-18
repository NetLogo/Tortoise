# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, getTypeOf, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims, @stringPrims) ->

  # (String, Int, Int, Number, Array[Any] | String) => Unit
  indexBoundsChecks: (prim, sourceStart, sourceEnd, index, listOrString, inclusive = true) ->
    if index < 0
      @validator.error(prim, sourceStart, sourceEnd, '_ isn_t greater than or equal to zero.', index)
    if index > listOrString.length or (inclusive and index is listOrString.length)
      @validator.error(prim, sourceStart, sourceEnd, 'Can_t find element _ of the _ _, which is only of length _.', index, getTypeOf(listOrString).niceName(), @dumper(listOrString), listOrString.length)
    return

  # (String, Array | String) => Unit
  checkNotEmpty: (prim, sourceStart, sourceEnd, listOrString) ->
    if listOrString.length is 0
      argType  = getTypeOf(listOrString)
      primName = if argType is types.String then prim else prim.toUpperCase()
      @validator.error(prim, sourceStart, sourceEnd, '_ got an empty _ as input.', primName, argType.niceName())

  # (String, Int, Int, Array | String) => Array | String
  butFirst: (prim, sourceStart, sourceEnd, listOrString) ->
    @checkNotEmpty(prim, sourceStart, sourceEnd, listOrString)
    @listPrims.butFirst(listOrString)

  # (String, Int, Int, Array | String) => Array | String
  butLast: (prim, sourceStart, sourceEnd, listOrString) ->
    @checkNotEmpty(prim, sourceStart, sourceEnd, listOrString)
    @listPrims.butLast(listOrString)

  # (Array[Any] | String) => Boolean
  empty: (listOrString) ->
    @listPrims.empty(listOrString)

  # (Int, Int, (T) => Boolean, Array[T]) => Array[T]
  filter: (sourceStart, sourceEnd, f, list) ->
    checkedF = (item) =>
      result = f(item)
      @validator.commonValueChecks.boolean("FILTER", sourceStart, sourceEnd, result)

    @listPrims.filter(checkedF, list)

  # (Int, Int, Array[Any] | String) => Any | String
  first: (sourceStart, sourceEnd, listOrString) ->
    if listOrString.length is 0
      @validator.error('first', sourceStart, sourceEnd, 'List is empty.')

    @listPrims.first(listOrString)

  # (Any, Array[Any]) => Array[Any]
  fput: (item, list) ->
    @listPrims.fput(item, list)

  # (Int, Int, Number, Array[Any] | String, Any) => Array[Any] | String
  insertItem: (sourceStart, sourceEnd, index, listOrString, item) ->
    @indexBoundsChecks('insert-item', sourceStart, sourceEnd, index, listOrString, inclusive = false)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("INSERT-ITEM", sourceStart, sourceEnd, item, types.String)

      @stringPrims.insertItem(index, listOrString, item)
    else
      @listPrims.insertItem(index, listOrString, item)

  # (Int, Int, Number, Array[Any] | String) => Any | String
  item: (sourceStart, sourceEnd, index, listOrString) ->
    @indexBoundsChecks('item', sourceStart, sourceEnd, index, listOrString)

    @listPrims.item(index, listOrString)

  # (Int, Int, Array[Any] | String) => Any | String
  last: (sourceStart, sourceEnd, listOrString) ->
    if listOrString.length is 0
      @validator.error('last', sourceStart, sourceEnd, 'List is empty.')

    @listPrims.last(listOrString)

  # (Array[Any] | String) => Number
  length: (listOrString) ->
    @listPrims.length(listOrString)

  # (Any, Array[Any]) => Array[Any]
  lput: (item, list) ->
    @listPrims.lput(item, list)

  # (Int, Int, Array[Any]) => Number
  max: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('max', sourceStart, sourceEnd, 'Can_t find the _ of a list with no numbers: __', "maximum", @dumper(values), "")

    @listPrims.max(nums)

  # (Int, Int, Array[Any]) => Number
  mean: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('mean', sourceStart, sourceEnd, 'Can_t find the _ of a list with no numbers: __', "mean", @dumper(values), ".")

    @listPrims.mean(nums)

  # (Int, Int, Array[Any]) => Number
  median: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('median', sourceStart, sourceEnd, 'Can_t find the _ of a list with no numbers: __', "median", @dumper(values), ".")

    @validator.checkNumber('median', sourceStart, sourceEnd, @listPrims.median(nums))

  # (Any, Array[Any] | AbstractAgentSet | String) => Boolean
  member: (item, items) ->
    if checks.isList(items)
      @listPrims.member(item, items)
    else if checks.isString(items)
      @stringPrims.member(item, items)
    else # agentset
      items.exists((a) -> item is a)

  # (Int, Int, Array[Any]) => Number
  min: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)

    if nums.length < 1
      @validator.error('min', sourceStart, sourceEnd, 'Can_t find the _ of a list with no numbers: __', "minimum", @dumper(values), "")

    @validator.checkNumber('min', sourceStart, sourceEnd, @listPrims.min(nums))

  # (Array[Any]) => Array[Any]
  modes: (list) ->
    @listPrims.modes(list)

  # (Int, Int, Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  nOf: (sourceStart, sourceEnd, count, agentSetOrList) ->
    if count < 0
      @validator.error('n-of', sourceStart, sourceEnd, 'First input to _ can_t be negative.', "N-OF")

    if checks.isList(agentSetOrList)
      if (agentSetOrList.length < count)
        @validator.error('n-of', sourceStart, sourceEnd, 'Requested _ random items from a list of length _.', count, agentSetOrList.length)

      @listPrims.nOfList(count, agentSetOrList)

    else # agentset
      if (agentSetOrList.size() < count)
        @validator.error('n-of', sourceStart, sourceEnd, 'Requested _ random agents from a set of only _ agents.', count, agentSetOrList.size())

      @listPrims.nOfAgentSet(count, agentSetOrList)

  # (Int, Int, AbstractAgentSet | Array[Any]) => Agent | Any
  oneOf: (sourceStart, sourceEnd, agentSetOrList) ->
    if checks.isList(agentSetOrList)
      if agentSetOrList.length is 0
        @validator.error('one-of', sourceStart, sourceEnd, '_ got an empty _ as input.', "ONE-OF", types.List.niceName())
      @listPrims.oneOf(agentSetOrList)
    else # agentset
      agentSetOrList.randomAgent()

  # (Any, Array[Any] | String) => Number
  position: (item, listOrString) ->
    if checks.isList(listOrString)
      @listPrims.position(item, listOrString)
    else # string
      @stringPrims.position(item, listOrString)

  # (Int, Int, (T, U) => U, Array[T]) => U
  reduce: (sourceStart, sourceEnd, f, list) ->
    if list.length is 0
      @validator.error('reduce', sourceStart, sourceEnd, 'The list argument to reduce must not be empty.')

    @listPrims.reduce(f, list)

  # (Int, Int, Number...) => Array[Number]
  rangeVariadic: (sourceStart, sourceEnd, args...) ->
    if args.length > 3
      @validator.error('range', sourceStart, sourceEnd, 'range expects at most three arguments')

    switch args.length
      when 1 then @listPrims.rangeUnary(args[0])
      when 2 then @listPrims.rangeBinary(args[0], args[1])
      else        @rangeTernary(args[0], args[1], args[2])

  # (Int, Int, Number, Number, Number) => Array[Number]
  rangeTernary: (sourceStart, sourceEnd, lowerBound, upperBound, stepSize) ->
    if stepSize is 0
      @validator.error('range', sourceStart, sourceEnd, 'The step-size for range must be non-zero.')

    @listPrims.range(lowerBound, upperBound, stepSize)

  # (Int, Int, Any | String, Array[Any] | String) => Array[Any] | String
  remove: (sourceStart, sourceEnd, item, listOrString) ->
    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REMOVE", sourceStart, sourceEnd, item, types.String)

      @stringPrims.remove(item, listOrString)
    else # list
      @listPrims.remove(item, listOrString)

  # (Array[Any]) => Array[Any]
  removeDuplicates: (list) ->
    @listPrims.removeDuplicates(list)

  # (Int, Int, Number, Array[Any] | String) => Array[Any] | String
  removeItem: (sourceStart, sourceEnd, index, listOrString) ->
    @indexBoundsChecks('remove-item', sourceStart, sourceEnd, index, listOrString)

    if checks.isString(listOrString)
      @stringPrims.removeItem(index, listOrString)
    else # list
      @listPrims.removeItem(index, listOrString)

  # (Int, Int, Number, Array[Any] | String, Any | String) => Array[Any] | String
  replaceItem: (sourceStart, sourceEnd, index, listOrString, item) ->
    @indexBoundsChecks('replace-item', sourceStart, sourceEnd, index, listOrString)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REPLACE-ITEM", sourceStart, sourceEnd, item, types.String)

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

  # (Int, Int, (Any, Any) => Boolean, Array[Any] | AbstractAgentSet) => Array[Any]
  sortBy: (sourceStart, sourceEnd, f, agentSetOrList) ->
    checkedF = (a, b) =>
      result = f(a, b)
      @validator.commonValueChecks.boolean("SORT-BY", sourceStart, sourceEnd, result)

    if checks.isList(agentSetOrList)
      @listPrims.sortByList(checkedF, agentSetOrList)
    else # agentset
      @listPrims.sortByAgentSet(checkedF, agentSetOrList)

  # (Int, Int, Array[Any]) => Number
  standardDeviation: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('standard-deviation', sourceStart, sourceEnd, 'Can_t find the _ of a list without at least two numbers: __', "standard deviation", @dumper(values), "")

    @validator.checkNumber('standard-deviation', sourceStart, sourceEnd, @listPrims.standardDeviation(nums))

  # (Int, rray[Any], Number, Number) => Array[Any]
  sublist: (sourceStart, sourceEnd, list, startIndex, endIndex) ->
    if startIndex < 0
      @validator.error('sublist', sourceStart, sourceEnd, '_ is less than zero.', startIndex)
    if endIndex > list.length
      @validator.error('sublist', sourceStart, sourceEnd, '_ is greater than the length of the input list (_).', endIndex, list.length)
    if endIndex < startIndex
      @validator.error('sublist', sourceStart, sourceEnd, '_ is less than _.', endIndex, startIndex)

    @listPrims.sublist(list, startIndex, endIndex)

  # (String, Number, Number) => String
  substring: (text, startIndex, endIndex) ->
    @stringPrims.substring(text, startIndex, endIndex)

  # (Int, Int, Array[Any]) => Number
  sum: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    @validator.checkNumber('sum', sourceStart, sourceEnd, @listPrims.sum(nums))

  # (Int, Int, Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  upToNOf: (sourceStart, sourceEnd, count, agentSetOrList) ->
    if count < 0
      @validator.error('up-to-n-of', sourceStart, sourceEnd, 'First input to _ can_t be negative.', "UP-TO-N-OF")

    if checks.isList(agentSetOrList)
      @listPrims.upToNOfList(count, agentSetOrList)

    else # agentset
      @listPrims.upToNOfAgentSet(count, agentSetOrList)

  # (Int, Int, Array[Any]) => Number
  variance: (sourceStart, sourceEnd, values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('variance', sourceStart, sourceEnd, 'Can_t find the _ of a list without at least two numbers: __', "variance", @dumper(values), ".")

    @validator.checkNumber('variance', sourceStart, sourceEnd, @listPrims.variance(nums))

module.exports = ListChecks
