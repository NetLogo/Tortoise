# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, getTypeOf, types } = require('engine/core/typechecker')

class ListChecks

  constructor: (@validator, @dumper, @listPrims, @stringPrims) ->

  # (Number, Array[Any] | String) => Unit
  indexBoundsChecks: (index, listOrString, inclusive = true) ->
    if index < 0
      @validator.error('_ isn_t greater than or equal to zero.', index)
    if index > listOrString.length or (inclusive and index is listOrString.length)
      @validator.error('Can_t find element _ of the _ _, which is only of length _.', index, getTypeOf(listOrString).niceName(), @dumper(listOrString), listOrString.length)
    return

  # (String) => (Array | String) => Array | String
  butFirst: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    if listOrString.length is 0
      argType  = getTypeOf(listOrString)
      primName = if argType is types.String then prim else prim.toUpperCase()
      @validator.error('_ got an empty _ as input.', primName, argType.niceName())

    @listPrims.butFirst(listOrString)

  # (String) => (Array | String) => Array | String
  butLast: (prim) -> (listOrString) =>
    @validator.commonArgChecks.stringOrList(prim, arguments)
    if listOrString.length is 0
      argType  = getTypeOf(listOrString)
      primName = if argType is types.String then prim else prim.toUpperCase()
      @validator.error('_ got an empty _ as input.', primName, argType.niceName())

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
    if listOrString.length is 0
      @validator.error('List is empty.')

    @listPrims.first(listOrString)

  # (Number, Array[Any] | String, Any) => Array[Any] | String
  insertItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("INSERT-ITEM", arguments)
    @indexBoundsChecks(index, listOrString, inclusive = false)

    if checks.isString(listOrString)
      @validator.checkTypeError("INSERT-ITEM", not checks.isString(item), item, types.String)
      @stringPrims.insertItem(index, listOrString, item)
    else
      @listPrims.insertItem(index, listOrString, item)

  # (Number, Array[Any] | String) => Any | String
  item: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("ITEM", arguments)
    @indexBoundsChecks(index, listOrString)

    @listPrims.item(index, listOrString)

  # (Array[Any] | String) => Any | String
  last: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LAST", arguments)
    if listOrString.length is 0
      @validator.error('List is empty.')

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
  max: (values) ->
    @validator.commonArgChecks.list("MAX", arguments)
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "maximum", @dumper(values), "")

    @listPrims.max(nums)

  # Array[Any] => Number
  mean: (values) ->
    @validator.commonArgChecks.list("MEAN", arguments)
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "mean", @dumper(values), ".")

    @listPrims.mean(nums)

  # Array[Any] => Number
  median: (values) ->
    @validator.commonArgChecks.list("MEDIAN", arguments)
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "median", @dumper(values), ".")

    @validator.checkNumber(@listPrims.median(nums))

  # (Any, Array[Any] | AbstractAgentSet | String) => Boolean
  member: (item, items) ->
    @validator.commonArgChecks.wildcard_stringOrListOrAgentSet("MEMBER?", arguments)
    if checks.isList(items)
      @listPrims.member(item, items)
    else if checks.isString(items)
      @stringPrims.member(item, items)
    else # agentset
      items.exists((a) -> item is a)

  # (Array[Any]) => Number
  min: (values) ->
    @validator.commonArgChecks.list("MIN", arguments)
    nums = values.filter(checks.isNumber)

    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "minimum", @dumper(values), "")

    @validator.checkNumber(@listPrims.min(nums))

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  nOf: (count, agentSetOrList) ->
    @validator.commonArgChecks.number_agentSetOrList("N-OF", arguments)
    if checks.isList(agentSetOrList)
      if (agentSetOrList.length < count)
        @validator.error('Requested _ random items from a list of length _.', count, agentSetOrList.length)
      @listPrims.nOfList(count, agentSetOrList)
    else # agentset
      if (agentSetOrList.size() < count)
        @validator.error('Requested _ random agents from a set of only _ agents.', count, agentSetOrList.size())
      @listPrims.nOfAgentSet(count, agentSetOrList)

  # (AbstractAgentSet | Array[Any]) => Agent | Any
  oneOf: (agentSetOrList) ->
    @validator.commonArgChecks.agentSetOrList("ONE-OF", arguments)
    if checks.isList(agentSetOrList)
      if agentSetOrList.length is 0
        @validator.error('_ got an empty _ as input.', "ONE-OF", types.List.niceName())
      @listPrims.oneOf(agentSetOrList)
    else # agentset
      agentSetOrList.randomAgent()

  # (Any, Array[Any] | String) => Number
  position: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("POSITION", arguments)
    if checks.isList(listOrString)
      @listPrims.position(item, listOrString)
    else # string
      @stringPrims.position(item, listOrString)

  reduce: (f, list) ->
    @validator.commonArgChecks.reporter_list("REDUCE", arguments)
    if list.length is 0
      @validator.error('The list argument to reduce must not be empty.')

    @listPrims.reduce(f, list)

  # (Any | String, Array[Any] | String) => Array[Any] | String
  remove: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("REMOVE", arguments)

    if checks.isString(listOrString)
      @validator.checkTypeError("REMOVE", not checks.isString(item), item, types.String)
      @stringPrims.remove(item, listOrString)
    else # list
      @listPrims.remove(item, listOrString)

  # (Number, Array[Any] | String) => Array[Any] | String
  removeItem: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("REMOVE-ITEM", arguments)
    @indexBoundsChecks(index, listOrString)

    if checks.isString(listOrString)
      @stringPrims.removeItem(index, listOrString)
    else # list
      @listPrims.removeItem(index, listOrString)

  # (Number, Array[Any] | String, Any | String) => Array[Any] | String
  replaceItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("REPLACE-ITEM", arguments)
    @indexBoundsChecks(index, listOrString)

    if checks.isString(listOrString)
      @validator.checkTypeError("REPLACE-ITEM", not checks.isString(item), item, types.String)
      @stringPrims.replaceItem(index, listOrString, item)
    else # list
      @listPrims.replaceItem(index, listOrString, item)

  # (Array[Any] | String) => Array[Any] | String
  reverse: (listOrString) ->
    @validator.commonArgChecks.stringOrList("REVERSE", arguments)
    if checks.isString(listOrString)
      @stringPrims.reverse(listOrString)
    else # list
      @listPrims.reverse(listOrString)

  # (Array[Any] | AbstractAgentSet) => Array[Any]
  sort: (agentSetOrList) ->
    @validator.commonArgChecks.agentSetOrList("SORT", arguments)
    if checks.isList(agentSetOrList)
      @listPrims.sort(agentSetOrList)
    else # agentset
      agentSetOrList.sort()

  # ((Any, Any) => Boolean, Array[Any] | AbstractAgentSet) => Array[Any]
  sortBy: (f, agentSetOrList) ->
    @validator.commonArgChecks.reporter_agentSetOrList("SORT-BY", arguments)

    fTypeCheck = @validator.checkValueType("SORT-BY", types.Boolean)
    checkedF = (a, b) ->
      result = f(a, b)
      fTypeCheck(result)

    if checks.isList(agentSetOrList)
      @listPrims.sortByList(checkedF, agentSetOrList)
    else # agentset
      @listPrims.sortByAgentSet(checkedF, agentSetOrList)

  # Array[Any] => Number
  standardDeviation: (values) ->
    @validator.commonArgChecks.list("STANDARD-DEVIATION", arguments)

    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('Can_t find the _ of a list without at least two numbers: __', "standard deviation", @dumper(values), "")

    @validator.checkNumber(@listPrims.standardDeviation(nums))

  # (Array[Any], Number, Number) => Array[Any]
  sublist: (list, startIndex, endIndex) ->
    @validator.commonArgChecks.list_number_number("SUBLIST", arguments)
    if startIndex < 0
      @validator.error('_ is less than zero.', startIndex)
    if endIndex > list.length
      @validator.error('_ is greater than the length of the input list (_).', endIndex, list.length)
    if endIndex < startIndex
      @validator.error('_ is less than _.', endIndex, startIndex)

    @listPrims.sublist(list, startIndex, endIndex)

  # (String, Number, Number) => String
  substring: (text, startIndex, endIndex) ->
    @validator.commonArgChecks.string_number_number("SUBSTRING", arguments)
    @stringPrims.substring(text, startIndex, endIndex)

  # Array[Any] => Number
  sum: (values) ->
    @validator.commonArgChecks.list("SUM", arguments)
    nums = values.filter(checks.isNumber)
    @listPrims.sum(nums)

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  upToNOf: (count, agentsOrList) ->
    @validator.commonArgChecks.number_agentSetOrList("N-OF", arguments)
    if checks.isList(agentSetOrList)
      @listPrims.upToNOfList(count, agentSetOrList)
    else # agentset
      @listPrims.upToNOfAgentSet(count, agentSetOrList)

  # Array[Any] => Number
  variance: (values) ->
    @validator.commonArgChecks.list("VARIANCE", arguments)

    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('Can_t find the _ of a list without at least two numbers: __', "variance", @dumper(values), ".")

    @validator.checkNumber(@listPrims.variance(nums))

module.exports = ListChecks
