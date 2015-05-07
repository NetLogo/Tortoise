# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_          = require('lodash')
TurtleSet  = require('../core/turtleset')
NLMath     = require('tortoise/util/nlmath')
stableSort = require('tortoise/util/stablesort')

{ GREATER_THAN: GT, LESS_THAN: LT, } = require('tortoise/util/comparator')


# (String, Array[Patch]) => TurtleSet
breedOn = (breedName, patches) ->
  turtles = _(patches).map((p) -> p.breedHereArray(breedName)).flatten().value()
  new TurtleSet(turtles, breedName)

# [T, U >: T] @ (Number, Array[T]. U) => Array[U]
replaceItemInList = (index, xs, newItem) ->
  copy = xs[..]
  copy.splice(index, 1, newItem)
  copy

# (Number, String, String) => String
replaceItemInString = (index, xs, newItem) ->
  pre  = xs.substr(0, index)
  post = xs.substr(index + newItem.length)
  "#{pre}#{newItem}#{post}"

# (Array[Number]) => Number
sumList = (xs) ->
  xs.foldl(((acc, x) -> acc + x), 0)

# (Array[Number]) => Number
variance = (nums) ->
  count = nums.length
  mean  = sumList(nums) / count
  squareOfDifference = _(nums).foldl(((acc, x) -> acc + StrictMath.pow(x - mean, 2)), 0)
  squareOfDifference / (count - 1)

module.exports = {

  # () => Nothing
  boom: ->
    throw new Error("boom!")

  # (String, Patch) => TurtleSet
  breedOn_string_patch: (breedName, p) ->
    breedOn(breedName, [p])

  # (String, PatchSet) => TurtleSet
  breedOn_string_patchset: (breedName, ps) ->
    breedOn(breedName, ps.toArray())

  # (String, Turtle) => TurtleSet
  breedOn_string_turtle: (breedName, t) ->
    breedOn(breedName, [t.askIfNotDead(-> t.getPatchHere())])

  # (String, TurtleSet) => TurtleSet
  breedOn_string_turtleset: (breedName, ts) ->
    breedOn(breedName, _(ts.iterator().toArray()).map((t) -> t.getPatchHere()).value())

  # [T] @ (Array[T]) => Array[T]
  butFirst_list: (xs) ->
    xs[1..]

  # (String) => String
  butFirst_string: (str) ->
    str[1..]

  # [T] @ (Array[T]) => Array[T]
  butLast_list: (xs) ->
    xs[0...xs.length - 1]

  # (String) => String
  butLast_string: (str) ->
    str[0...str.length - 1]

  # [T] @ (Array[T]) => Boolean
  empty_list: (xs) ->
    xs.length is 0

  # (String) => Boolean
  empty_string: (str) ->
    str.length is 0

  # [T] @ (Array[T]) => T
  first_list: (xs) ->
    xs[0]

  # (String) => String
  first_string: (str) ->
    str[0]

  # [T] @ (T, Array[T]) => Array[T]
  fput_t_list: (x, xs) ->
    [x].concat(xs)

  # [T <: { compare }] @ (T, T) => Boolean
  gt_comparable_comparable: (a, b) ->
    a.compare(b) is GT

  # (Number, Number) => Boolean
  gt_number_number: (n1, n2) ->
    n1 < n2

  # (String, String) => Boolean
  gt_string_string: (s1, s2) ->
    s1 < s2

  # [T] @ (Number, Array[T]) => T
  item_number_list: (i, xs) ->
    xs[i]

  # (Number, String) => String
  item_number_string: (i, xs) ->
    xs[i]

  # [T] @ (Array[T]) => T
  last_list: (xs) ->
    xs[xs.length - 1]

  # (String) => String
  last_string: (str) ->
    str[str.length - 1]

  # [T] @ (Array[T]) => Number
  length_list: (xs) ->
    xs.length

  # (String) => Number
  length_string: (str) ->
    str.length

  # [T] @ (T*) => Array[T]
  list_ts: (xs...) ->
    xs

  # [T] @ (T, Array[T]) => Array[T]
  lput_t_list: (x, xs) ->
    result = xs[..]
    result.push(x)
    result

  # [T <: { compare }] @ (T, T) => Boolean
  lt_comparable_comparable: (a, b) ->
    a.compare(b) is LT

  # (Number, Number) => Boolean
  lt_number_number: (n1, n2) ->
    n1 < n2

  # (String, String) => Boolean
  lt_string_string: (s1, s2) ->
    s1 < s2

  # (Array[Number]) => Number
  max_list: (xs) ->
    Math.max(xs...)

  # (Array[Number]) => Number
  mean_list: (xs) ->
    sumList(xs) / xs.length

  # (Array[Number]) => Number
  median_numberList: (nums) ->
    sortedNums  = _(nums).sortBy().value()
    length      = sortedNums.length
    middleIndex = StrictMath.floor(length / 2)
    middleNum   = sortedNums[middleIndex]

    if length % 2 is 1
      middleNum
    else
      subMiddleNum = sortedNums[middleIndex - 1]
      (middleNum + subMiddleNum) / 2

# [T <: Agent] @ (T, AbstractAgentSet[_]) => Boolean
  member_agent_agentset: (agent, agents) ->
    agents.exists((a) -> agent is a)

  # (String, String) => Boolean
  member_string_string: (x, str) ->
    str.indexOf(x) isnt -1

  # (Array[Number]) => Number
  min_list: (xs) ->
    Math.min(xs...)

  # (String, String) => Number|Boolean
  position_string_string: (x, str) ->
    index = str.indexOf(x)
    if index isnt -1 then index else false

  # (String, String) => String
  remove_string_string: (x, str) ->
    str.replace(new RegExp(x, "g"), "")

  # [T] @ (Number, Array[T]) => Array[T]
  removeItem_number_list: (i, xs) ->
    temp = xs[..]
    temp.splice(i, 1) # Cryptic, but effective --JAB (5/26/14)
    temp

  # (Number, String) => String
  removeItem_number_string: (i, str) ->
    pre  = str.slice(0, i)
    post = str.slice(i + 1)
    pre + post

  # (Number, String, String) => String
  replaceItem_number_string_string: (i, str, newItem) ->
    replaceItemInString(i, str, newItem)

  # [T, U >: T] @ (Number, Array[T], U) => Array[U]
  replaceItem_number_list_t: (i, xs, newItem) ->
    replaceItemInList(i, xs, newItem)

  # [T] @ (Array[T]) => Array[T]
  reverse_list: (xs) ->
    xs[..].reverse()

  # (String) => String
  reverse_string: (str) ->
    str.split("").reverse().join("")

  # [T] @ (Array[Array[T]|T]) => Array[T]
  sentence_listsOrTs: (xs...) ->
    f =
      (acc, x) ->
        if NLType(x).isList()
          acc.concat(x)
        else
          acc.push(x)
          acc
    _(xs).foldl(f, [])

  # (Array[Agent]) => Array[Agent]
  sort_agentList: (agents) ->
    stableSort(agents)((x, y) -> x.compare(y).toInt)

  # [T] @ (AbstractAgentSet[T]) => Array[T]
  sort_agentset: (agents) ->
    agents.sort()

  # (Array[Number]) => Array[Number]
  sort_numberList: (nums) ->
    nums.sort((x, y) -> Comparator.numericCompare(x, y).toInt)

  # (Array[String]) => Array[String]
  sort_stringList: (strs) ->
    strs.sort()

  # (Array[Number]) => Number
  standardDeviation_numberList: (nums) ->
    StrictMath.sqrt(variance(nums))

  # [T] @ (Array[T], Number, Number) => Array[T]
  sublist_list_number_number: (xs, n1, n2) ->
    xs.slice(n1, n2)

  # (String, Number, Number) => String
  substring_string_number_number: (str, n1, n2) ->
    str.substr(n1, n2 - n1)

  # (Array[Number]) => Number
  sum_list: (xs) ->
    sumList(xs)

  # (Patch) => TurtleSet
  turtlesOn_patch: (p) ->
    p.turtlesHere()

  # (PatchSet) => TurtleSet
  turtlesOn_patchset: (ps) ->
    turtles = _(ps.iterator().toArray()).map((agent) -> agent.turtlesHere().toArray()).flatten().value()
    new TurtleSet(turtles)

  # (Turtle) => TurtleSet
  turtlesOn_turtle: (t) ->
    t.turtlesHere()

  # (TurtleSet) => TurtleSet
  turtlesOn_turtleset: (ts) ->
    turtles = _(ts.iterator().toArray()).map((agent) -> agent.turtlesHere().toArray()).flatten().value()
    new TurtleSet(turtles)

  # (Array[Number]) => Number
  variance_numberList: (nums) ->
    variance(nums)

}
