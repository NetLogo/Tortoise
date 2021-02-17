# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('../core/abstractagentset')
Link             = require('../core/link')
Patch            = require('../core/patch')
Turtle           = require('../core/turtle')
{ checks }       = require('../core/typechecker')
StrictMath       = require('shim/strictmath')
Comparator       = require('util/comparator')
Exception        = require('util/exception')
NLMath           = require('util/nlmath')
stableSort       = require('util/stablesort')

{ all, exists, filter, find, findIndex, foldl, isEmpty, length: arrayLength, last, sortBy, tail } = require('brazierjs/array')
{ id, pipeline }                                                                                  = require('brazierjs/function')
{ fold         }                                                                                  = require('brazierjs/maybe')

module.exports =
  class ListPrims

    # type ListOrSet[T] = AbstractAgentSet|Array[T]

    # (() => String, Hasher, (Any, Any) => Boolean, (Number) => Number) => ListPrims
    constructor: (@_dump, @_hasher, @_equality, @_nextInt) ->

    # [T] @ (Array[T]|String) => Array[T]|String
    butFirst: (xs) ->
      tail(xs)

    # [T] @ (Array[T]|String) => Array[T]|String
    butLast: (xs) ->
      xs[0...xs.length - 1]

    # [T] @ (String|Array[T]) => Boolean
    empty: (xs) ->
      isEmpty(xs)

    filter: (f, xs) ->
      xs.filter(f)

    # [Item] @ (Array[Item]) => Item
    first: (xs) ->
      xs[0]

    # [Item] @ (Item, Array[Item]) => Array[Item]
    fput: (x, xs) ->
      [x].concat(xs)

    # [Item] @ (Number, Array[Item], Item) => Array[Item]
    insertItem: (n, xs, x) ->
      clone = xs[..]
      clone.splice(n, 0, x)
      clone

    # [Item] @ (Number, Array[Item]) => Item
    item: (n, xs) ->
      xs[NLMath.floor(n)]

    # [Item] @ (Array[Item]) => Item
    last: (xs) ->
      last(xs)

    # [T] @ (Array[T]) => Number
    length: (xs) ->
      arrayLength(xs)

    # [T] @ (T*) => Array[T]
    list: (xs...) ->
      xs

    # [Item] @ (Item, Array[Item]) => Array[Item]
    lput: (x, xs) ->
      result = xs[..]
      result.push(x)
      result

    # (Array[Any]) => Number
    max: (xs) ->
      Math.max(xs...)

    # (Array[Any]) => Number
    mean: (xs) ->
      sum = xs.reduce(((a, b) -> a + b), 0)
      sum / xs.length

    # (Array[Any]) => Number
    median: (xs) ->
      nums   = sortBy(id)(xs)
      length = nums.length
      middleIndex = StrictMath.floor(length / 2)
      middleNum   = nums[middleIndex]
      if length % 2 is 1
        middleNum
      else
        subMiddleNum = nums[middleIndex - 1]
        (middleNum + subMiddleNum) / 2

    # (Array[Item], Item) => Boolean
    member: (x, xs) ->
      exists((y) => @_equality(x, y))(xs)

    # (Array[Any]) => Number
    min: (xs) ->
      Math.min(xs...)

    # [T] @ (Array[T]) => Array[T]
    modes: (items) ->

      genItemCountPairs =
        (xs) =>
          pairs = []
          for x in xs
            pushNewPair    =        -> pairs.push([x, 1])
            incrementCount = (pair) -> pair[1] += 1
            pairMaybe      = find(([item, c]) => @_equality(item, x))(pairs)
            fold(pushNewPair)(incrementCount)(pairMaybe)
          pairs

      calculateModes =
        (xsToCounts) ->
          f =
            ([bests, bestCount], [item, count]) ->
              if count > bestCount
                [[item], count]
              else if count < bestCount
                [bests, bestCount]
              else
                [bests.concat([item]), bestCount]
          foldl(f)([[], 0])(xsToCounts)

      [result, []] = calculateModes(genItemCountPairs(items))
      result

    # (Number, AbstractAgentSet) => AbstractAgentSet
    nOfAgentSet: (n, agentSet) ->
      items    = agentSet.iterator().toArray()
      newItems = @_nOfArray(n, items)
      agentSet.copyWithNewAgents(newItems)

    # (Number, Array[Any]) => Array[Any]
    nOfList: (n, list) ->
      if n is list.length
        list
      else
        @_nOfArray(n, list)

    # (Number, AbstractAgentSet) => AbstractAgentSet
    upToNOfAgentSet: (n, agentSet) ->
      if n >= agentSet.size()
        agentSet
      else
        items    = agentSet.iterator().toArray()
        newItems = @_nOfArray(n, items)
        agentSet.copyWithNewAgents(newItems)

    # (Number, Array[Any]) => Array[Any]
    upToNOfList: (n, list) ->
      if n >= list.length
        list
      else
        @_nOfArray(n, list)

    # [Item] @ (ListOrSet[Item]) => Item
    oneOf: (list) ->
      list[@_nextInt(list.length)]

    # (Any, Array[Any]) => Number | Boolean
    position: (x, xs) ->
      index = pipeline(findIndex((y) => @_equality(x, y)), fold(-> -1)(id))(xs)
      if index isnt -1
        index
      else
        false

    reduce: (f, xs) ->
      xs.reduce(f)

    # (Any, Array[Any]) => Array[Any]
    remove: (x, xs) ->
      filter((y) => not @_equality(x, y))(xs)

    # [T] @ (Array[T]) => Array[T]
    removeDuplicates: (xs) ->
      if xs.length < 2
        xs
      else
        f =
          ([accArr, accSet], x) =>
            hash   = @_hasher(x)
            values = accSet[hash]
            if values?
              if not exists((y) => @_equality(x, y))(values)
                accArr.push(x)
                values.push(x)
            else
              accArr.push(x)
              accSet[hash] = [x]
            [accArr, accSet]
        [out, []] = xs.reduce(f, [[], {}])
        out

    # (Number, Array[Any]) => Array[Any]
    removeItem: (n, xs) ->
      temp = xs[..]
      temp.splice(n, 1) # Cryptic, but effective --JAB (5/26/14)
      temp

    # (Number, Array[Any], Any) => Array[Any]
    replaceItem: (n, xs, x) ->
      temp = xs[..]
      temp.splice(n, 1, x)
      temp

    # (Array[Any]) => Array[Any]
    reverse: (xs) ->
      xs[..].reverse()

    # [T] @ (Array[Array[T]|T]) => Array[T]
    sentence: (xs...) ->
      f =
        (acc, x) ->
          if checks.isList(x)
            acc.concat(x)
          else
            acc.push(x)
            acc
      foldl(f)([])(xs)

    # [T] @ (Array[T]) => Array[T]
    shuffle: (xs) ->

      swap =
        (arr, i, j) ->
          tmp    = arr[i]
          arr[i] = arr[j]
          arr[j] = tmp

      out = xs[..]
      i   = out.length

      while i > 1
        swap(out, i - 1, @_nextInt(i))
        i--

      out

    # (Array[Any]) => Array[Any]
    sort: (xs) ->
      # data SortableType =
      Number = {}
      String = {}
      Agent  = {}
      None   = {}

      f =
        (acc, x) ->

          xType =
            if checks.isNumber(x)
              Number
            else if checks.isString(x)
              String
            else if checks.isAgent(x) and (x.id isnt -1)
              Agent
            else
              None

          [type, arr] = acc

          switch xType
            when Number # Numbers trump all
              switch type
                when Number then [Number, arr.concat([x])]
                else             [Number, [x]]
            when String # Strings trump agents
              switch type
                when String      then [String, arr.concat([x])]
                when Agent, None then [String, [x]]
                else                  acc
            when Agent
              switch type
                when Agent then [Agent, arr.concat([x])]
                when None  then [Agent, [x]]
                else            acc
            else acc

      [filteredType, filteredItems] = foldl(f)([None, []])(xs)

      switch filteredType
        when None   then filteredItems
        when Number then filteredItems.sort((x, y) -> Comparator.numericCompare(x, y).toInt)
        when String then filteredItems.sort()
        when Agent  then stableSort(filteredItems)((x, y) -> x.compare(y).toInt)
        else             throw new Error("We don't know how to sort your kind here!")

    # ((Agent, Agent) => Boolean, AbstractAgentSet) => Array[Agent]
    sortByAgentSet: (task, agentSet) ->
      @sortByList(task, agentSet.shufflerator().toArray())

    # ((T, T) => Boolean, Array[T]) => Array[T]
    sortByList: (task, xs) ->
      f =
        (x, y) ->
          xy = task(x, y)
          yx = task(y, x)
          if xy is yx
            0
          else if xy
            -1
          else
            1

      stableSort(xs)(f)

    # (Array[Any]) => Number
    standardDeviation: (xs) ->
      mean       = @sum(xs) / xs.length
      squareDiff = foldl((acc, x) -> acc + StrictMath.pow(x - mean, 2))(0)(xs)
      stdDev     = StrictMath.sqrt(squareDiff / (xs.length - 1))
      stdDev

    # [T] @ (Array[T], Number, Number) => Array[T]
    sublist: (xs, n1, n2) ->
      xs.slice(n1, n2)

    # (Array[Any]) => Number
    sum: (xs) ->
      xs.reduce(((a, b) -> a + b), 0)

    # [T] @ (Array[T]) => Number
    variance: (xs) ->
      count = xs.length
      sum  = xs.reduce(((acc, x) -> acc + x), 0)
      mean = sum / count
      squareOfDifference = xs.reduce(((acc, x) -> acc + StrictMath.pow(x - mean, 2)), 0)
      squareOfDifference / (count - 1)

    # Prodding at this code is like poking a beehive with a stick... --JAB (7/30/14)
    # [Item] @ (Number, Array[Item]) => Array[Item]
    _nOfArray: (n, items) ->
      switch n
        when 0
          []
        when 1
          [items[@_nextInt(items.length)]]
        when 2
          index1 = @_nextInt(items.length)
          index2 = @_nextInt(items.length - 1)
          [newIndex1, newIndex2] =
          if index2 >= index1
            [index1, index2 + 1]
          else
            [index2, index1]
          [items[newIndex1], items[newIndex2]]
        else
          n = NLMath.floor(n)
          i = 0
          j = 0
          result = []
          while j < n
            if @_nextInt(items.length - i) < n - j
              result.push(items[i])
              j += 1
            i += 1
          result
