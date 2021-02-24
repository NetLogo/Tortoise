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

  checkNotEmpty: (prim, listOrString) ->
    if listOrString.length is 0
      argType  = getTypeOf(listOrString)
      primName = if argType is types.String then prim else prim.toUpperCase()
      @validator.error('_ got an empty _ as input.', primName, argType.niceName())

  # (String, Array | String) => Array | String
  butFirst: (prim, listOrString) ->
    @validator.commonArgChecks.stringOrList(prim, arguments)
    @butFirst_unchecked(prim, listOrString)

  butFirst_unchecked: (prim, listOrString) ->
    @checkNotEmpty(prim, listOrString)
    @listPrims.butFirst(listOrString)

  # (String) => (Array | String) => Array | String
  butLast: (prim, listOrString) ->
    @validator.commonArgChecks.stringOrList(prim, [listOrString])
    @butLast_unchecked(prim, listOrString)

  butLast_unchecked: (prim, listOrString) ->
    @checkNotEmpty(prim, listOrString)
    @listPrims.butLast(listOrString)

  # (Array[Any] | String) => Boolean
  empty: (listOrString) ->
    @validator.commonArgChecks.stringOrList("EMPTY", arguments)
    @empty_unchecked(listOrString)

  empty_unchecked: (listOrString) ->
    @listPrims.empty(listOrString)

  # ((T) => Boolean, Array[T]) => Array[T]
  filter: (f, list) ->
    @validator.commonArgChecks.reporter_list("FILTER", arguments)
    @filter_unchecked(f, list)

  filter_unchecked: (f, list) ->
    checkedF = (item) =>
      result = f(item)
      @validator.commonValueChecks.boolean("FILTER", result)

    @listPrims.filter(checkedF, list)

  # (Array[Any] | String) => Any | String
  first: (listOrString) ->
    @validator.commonArgChecks.stringOrList("FIRST", arguments)
    @first_unchecked(listOrString)

  first_unchecked: (listOrString) ->
    if listOrString.length is 0
      @validator.error('List is empty.')

    @listPrims.first(listOrString)

  # (Any, Array[Any]) => Array[Any]
  fput: (item, list) ->
    @validator.commonArgChecks.wildcard_list("FPUT", arguments)
    @fput_unchecked(item, list)

  fput_unchecked: (item, list) ->
    @listPrims.fput(item, list)

  # (Number, Array[Any] | String, Any) => Array[Any] | String
  insertItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("INSERT-ITEM", arguments)
    @insertItem_unchecked(index, listOrString, item)

  insertItem_unchecked: (index, listOrString, item) ->
    @indexBoundsChecks(index, listOrString, inclusive = false)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("INSERT-ITEM", item, types.String)

      @stringPrims.insertItem(index, listOrString, item)
    else
      @listPrims.insertItem(index, listOrString, item)

  # (Number, Array[Any] | String) => Any | String
  item: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("ITEM", arguments)
    @item_unchecked(index, listOrString)

  item_unchecked: (index, listOrString) ->
    @indexBoundsChecks(index, listOrString)

    @listPrims.item(index, listOrString)

  # (Array[Any] | String) => Any | String
  last: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LAST", arguments)
    @last_unchecked(listOrString)

  last_unchecked: (listOrString) ->
    if listOrString.length is 0
      @validator.error('List is empty.')

    @listPrims.last(listOrString)

  # (Array[Any] | String) => Number
  length: (listOrString) ->
    @validator.commonArgChecks.stringOrList("LENGTH", arguments)
    @length_unchecked(listOrString)

  length_unchecked: (listOrString) ->
    @listPrims.length(listOrString)

  # (Any, Array[Any]) => Array[Any]
  lput: (item, list) ->
    @validator.commonArgChecks.wildcard_list("LPUT", arguments)
    @lput_unchecked(item, list)

  lput_unchecked: (item, list) ->
    @listPrims.lput(item, list)

  # Array[Any] => Number
  max: (values) ->
    @validator.commonArgChecks.list("MAX", arguments)
    @max_unchecked(values)

  max_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "maximum", @dumper(values), "")

    @listPrims.max(nums)

  # Array[Any] => Number
  mean: (values) ->
    @validator.commonArgChecks.list("MEAN", arguments)
    @mean_unchecked(values)

  mean_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "mean", @dumper(values), ".")

    @listPrims.mean(nums)

  # Array[Any] => Number
  median: (values) ->
    @validator.commonArgChecks.list("MEDIAN", arguments)
    @median_unchecked(values)

  median_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "median", @dumper(values), ".")

    @validator.checkNumber(@listPrims.median(nums))

  # (Any, Array[Any] | AbstractAgentSet | String) => Boolean
  member: (item, items) ->
    @validator.commonArgChecks.wildcard_stringOrListOrAgentSet("MEMBER?", arguments)
    @member_unchecked(item, items)

  member_unchecked: (item, items) ->
    if checks.isList(items)
      @listPrims.member(item, items)
    else if checks.isString(items)
      @stringPrims.member(item, items)
    else # agentset
      items.exists((a) -> item is a)

  # (Array[Any]) => Number
  min: (values) ->
    @validator.commonArgChecks.list("MIN", arguments)
    @min_unchecked(values)

  min_unchecked: (values) ->
    nums = values.filter(checks.isNumber)

    if nums.length < 1
      @validator.error('Can_t find the _ of a list with no numbers: __', "minimum", @dumper(values), "")

    @validator.checkNumber(@listPrims.min(nums))

  # (Array[Any]) => Array[Any]
  modes: (list) ->
    @validator.commonArgChecks.list("MODES", arguments)
    @modes_unchecked(list)

  modes_unchecked: (list) ->
    @listPrims.modes(list)

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  nOf: (count, agentSetOrList) ->
    @validator.commonArgChecks.number_agentSetOrList("N-OF", arguments)
    @nOf_unchecked(count, agentSetOrList)

  nOf_unchecked: (count, agentSetOrList) ->
    if count < 0
      @validator.error('First input to _ can_t be negative.', "N-OF")

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
    @oneOf_unchecked(agentSetOrList)

  oneOf_unchecked: (agentSetOrList) ->
    if checks.isList(agentSetOrList)
      if agentSetOrList.length is 0
        @validator.error('_ got an empty _ as input.', "ONE-OF", types.List.niceName())
      @listPrims.oneOf(agentSetOrList)
    else # agentset
      agentSetOrList.randomAgent()

  # (Any, Array[Any] | String) => Number
  position: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("POSITION", arguments)
    @position_unchecked(item, listOrString)

  position_unchecked: (item, listOrString) ->
    if checks.isList(listOrString)
      @listPrims.position(item, listOrString)
    else # string
      @stringPrims.position(item, listOrString)

  reduce: (f, list) ->
    @validator.commonArgChecks.reporter_list("REDUCE", arguments)
    @reduce_unchecked(f, list)

  reduce_unchecked: (f, list) ->
    if list.length is 0
      @validator.error('The list argument to reduce must not be empty.')

    @listPrims.reduce(f, list)

  # (Any | String, Array[Any] | String) => Array[Any] | String
  remove: (item, listOrString) ->
    @validator.commonArgChecks.wildcard_stringOrList("REMOVE", arguments)
    @remove_unchecked(item, listOrString)

  remove_unchecked: (item, listOrString) ->
    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REMOVE", item, types.String)

      @stringPrims.remove(item, listOrString)
    else # list
      @listPrims.remove(item, listOrString)

  # (Array[Any]) => Array[Any]
  removeDuplicates: (list) ->
    @validator.commonArgChecks.list("REMOVE-DUPLICATES", arguments)
    @removeDuplicates_unchecked(list)

  removeDuplicates_unchecked: (list) ->
    @listPrims.removeDuplicates(list)

  # (Number, Array[Any] | String) => Array[Any] | String
  removeItem: (index, listOrString) ->
    @validator.commonArgChecks.number_stringOrList("REMOVE-ITEM", arguments)
    @removeItem_unchecked(index, listOrString)

  removeItem_unchecked: (index, listOrString) ->
    @indexBoundsChecks(index, listOrString)

    if checks.isString(listOrString)
      @stringPrims.removeItem(index, listOrString)
    else # list
      @listPrims.removeItem(index, listOrString)

  # (Number, Array[Any] | String, Any | String) => Array[Any] | String
  replaceItem: (index, listOrString, item) ->
    @validator.commonArgChecks.number_stringOrList_wildcard("REPLACE-ITEM", arguments)
    @replaceItem_unchecked(index, listOrString, item)

  replaceItem_unchecked: (index, listOrString, item) ->
    @indexBoundsChecks(index, listOrString)

    if checks.isString(listOrString)
      if not checks.isString(item)
        @validator.throwTypeError("REPLACE-ITEM", item, types.String)

      @stringPrims.replaceItem(index, listOrString, item)
    else # list
      @listPrims.replaceItem(index, listOrString, item)

  # (Array[Any] | String) => Array[Any] | String
  reverse: (listOrString) ->
    @validator.commonArgChecks.stringOrList("REVERSE", arguments)
    @reverse_unchecked(listOrString)

  reverse_unchecked: (listOrString) ->
    if checks.isString(listOrString)
      @stringPrims.reverse(listOrString)
    else # list
      @listPrims.reverse(listOrString)

  # (Array[Any]) => Array[Any]
  shuffle: (list) ->
    @validator.commonArgChecks.list("SHUFFLE", arguments)
    @shuffle_unchecked(list)

  shuffle_unchecked: (list) ->
    @listPrims.shuffle(list)

  # (Array[Any] | AbstractAgentSet) => Array[Any]
  sort: (agentSetOrList) ->
    @validator.commonArgChecks.agentSetOrList("SORT", arguments)
    @sort_unchecked(agentSetOrList)

  sort_unchecked: (agentSetOrList) ->
    if checks.isList(agentSetOrList)
      @listPrims.sort(agentSetOrList)
    else # agentset
      agentSetOrList.sort()

  # ((Any, Any) => Boolean, Array[Any] | AbstractAgentSet) => Array[Any]
  sortBy: (f, agentSetOrList) ->
    @validator.commonArgChecks.reporter_agentSetOrList("SORT-BY", arguments)
    @sortBy_unchecked(f, agentSetOrList)

  sortBy_unchecked: (f, agentSetOrList) ->
    checkedF = (a, b) =>
      result = f(a, b)
      @validator.commonValueChecks.boolean("SORT-BY", result)

    if checks.isList(agentSetOrList)
      @listPrims.sortByList(checkedF, agentSetOrList)
    else # agentset
      @listPrims.sortByAgentSet(checkedF, agentSetOrList)

  # Array[Any] => Number
  standardDeviation: (values) ->
    @validator.commonArgChecks.list("STANDARD-DEVIATION", arguments)
    @standardDeviation_unchecked(values)

  standardDeviation_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('Can_t find the _ of a list without at least two numbers: __', "standard deviation", @dumper(values), "")

    @validator.checkNumber(@listPrims.standardDeviation(nums))

  # (Array[Any], Number, Number) => Array[Any]
  sublist: (list, startIndex, endIndex) ->
    @validator.commonArgChecks.list_number_number("SUBLIST", arguments)
    @sublist_unchecked(list, startIndex, endIndex)

  sublist_unchecked: (list, startIndex, endIndex) ->
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
    @sublist_unchecked(text, startIndex, endIndex)

  substring_unchecked: (text, startIndex, endIndex) ->
    @stringPrims.substring(text, startIndex, endIndex)

  # Array[Any] => Number
  sum: (values) ->
    @validator.commonArgChecks.list("SUM", arguments)
    @sum_unchecked(values)

  sum_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    @validator.checkNumber(@listPrims.sum(nums))

  # (Number, Array[Any] | AbstractAgentSet) => Array[Any] | AbstractAgentSet
  upToNOf: (count, agentSetOrList) ->
    @validator.commonArgChecks.number_agentSetOrList("N-OF", arguments)
    @upToNOf_unchecked(count, agentSetOrList)

  upToNOf_unchecked: (count, agentSetOrList) ->
    if count < 0
      @validator.error('First input to _ can_t be negative.', "UP-TO-N-OF")

    if checks.isList(agentSetOrList)
      @listPrims.upToNOfList(count, agentSetOrList)

    else # agentset
      @listPrims.upToNOfAgentSet(count, agentSetOrList)

  # Array[Any] => Number
  variance: (values) ->
    @validator.commonArgChecks.list("VARIANCE", arguments)
    @variance_unchecked(values)

  variance_unchecked: (values) ->
    nums = values.filter(checks.isNumber)
    if nums.length < 2
      @validator.error('Can_t find the _ of a list without at least two numbers: __', "variance", @dumper(values), ".")

    @validator.checkNumber(@listPrims.variance(nums))

module.exports = ListChecks
