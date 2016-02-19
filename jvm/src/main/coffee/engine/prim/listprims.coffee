# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Dump             = require('../dump')
AbstractAgentSet = require('../core/abstractagentset')
Link             = require('../core/link')
Nobody           = require('../core/nobody')
Patch            = require('../core/patch')
Turtle           = require('../core/turtle')
NLType           = require('../core/typechecker')
StrictMath       = require('shim/strictmath')
Comparator       = require('util/comparator')
Exception        = require('util/exception')
NLMath           = require('util/nlmath')
stableSort       = require('util/stablesort')

{ all, exists, filter, find, findIndex, foldl, head, isEmpty, length: arrayLength, last, sortBy, tail } = require('brazierjs/array')
{ id, pipeline }                                                                                        = require('brazierjs/function')

# For most of this stuff, Lodashing it is no good, since Lodash doesn't handle strings correctly.  Could use Underscore.string... --JAB (5/5/14)
module.exports =
  class ListPrims

    # type ListOrSet[T] = AbstractAgentSet|Array[T]

    # (Hasher, (Any, Any) => Boolean, (Number) => Number) => ListPrims
    constructor: (@_hasher, @_equality, @_nextInt) ->

    # [T] @ (Array[T]|String) => Array[T]|String
    butFirst: (xs) ->
      tail(xs)

    # [T] @ (Array[T]|String) => Array[T]|String
    butLast: (xs) ->
      xs[0...xs.length - 1]

    # [T] @ (String|Array[T]) => Boolean
    empty: (xs) ->
      isEmpty(xs)

    # [Item] @ (Array[Item]) => Item
    first: (xs) ->
      head(xs)

    # [Item] @ (Item, Array[Item]) => Array[Item]
    fput: (x, xs) ->
      [x].concat(xs)

    # [Item] @ (Number, Array[Item]) => Item
    item: (n, xs) ->
      xs[n]

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

    # (Array[Number]) => Number
    max: (xs) ->
      Math.max(xs...)

    # (Array[Number]) => Number
    mean: (xs) ->
      @sum(xs) / xs.length

    # (Array[Number]) => Number
    median: (xs) ->
      nums   = pipeline(filter((x) -> NLType(x).isNumber()), sortBy(id))(xs)
      length = nums.length

      if length isnt 0
        middleIndex = StrictMath.floor(length / 2)
        middleNum   = nums[middleIndex]
        if length % 2 is 1
          middleNum
        else
          subMiddleNum = nums[middleIndex - 1]
          NLMath.validateNumber((middleNum + subMiddleNum) / 2)
      else
        throw new Error("Can't find the median of a list with no numbers: #{Dump(xs)}.")

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Boolean
    member: (x, xs) ->
      type = NLType(xs)
      if type.isList()
        exists((y) => @_equality(x, y))(xs)
      else if type.isString()
        xs.indexOf(x) isnt -1
      else # agentset
        xs.exists((a) -> x is a)

    # (Array[Number]) => Number
    min: (xs) ->
      Math.min(xs...)

    # [T] @ (Array[T]) => Array[T]
    modes: (items) ->

      genItemCountPairs =
        (xs) =>
          pairs = []
          for x in xs
            pair = find(([item, c]) => @_equality(item, x))(pairs)
            if pair?
              pair[1] += 1
            else
              pairs.push([x, 1])
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

    # [T] @ (Number, AbstractAgentSet[T]) => AbstractAgentSet[T]
    nOf_number_agentset: (n, agents) ->
      items    = agentsOrList.iterator().toArray()
      newItems = @_nOfArray(n, items)
      agentsOrList.copyWithNewAgents(newItems)

    # [T] @ (Number, Array[T]) => Array[T]
    nOf_number_list: (n, xs) ->
      @_nOfArray(n, xs)

    # [Item] @ (ListOrSet[Item]) => Item
    oneOf: (agentsOrList) ->
      type = NLType(agentsOrList)

      arr =
        if type.isAgentSet()
          agentsOrList.iterator().toArray()
        else
          agentsOrList

      if arr.length is 0
        Nobody
      else
        arr[@_nextInt(arr.length)]

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Number|Boolean
    position: (x, xs) ->
      type = NLType(xs)

      index =
        if type.isList()
          findIndex((y) => @_equality(x, y))(xs) ? -1
        else
          xs.indexOf(x)

      if index isnt -1
        index
      else
        false

    # [T] @ (Task[T, T, T]), Array[T]) => T
    reduce: (task, xs) ->
      if xs.length isnt 1
        xs.reduce(task)
      else
        xs

    # [Item, Container <: (Array[Item]|String)] @ (Item, Container) => Container
    remove: (x, xs) ->
      type = NLType(xs)
      if type.isList()
        filter((y) => not @_equality(x, y))(xs)
      else
        xs.replace(new RegExp(x, "g"), "")

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

    # [T] @ (Number, Array[T]) => Array[T]
    removeItem_number_list: (n, xs) ->
      temp = xs[..]
      temp.splice(n, 1) # Cryptic, but effective --JAB (5/26/14)
      temp

    # [T] @ (Number, String) => String
    removeItem_number_string: (n, str) ->
      pre  = str.slice(0, n)
      post = str.slice(n + 1)
      pre + post

    # [Item, Container <: (Array[Item]|String)] @ (Number, Container, Item) => Container
    replaceItem: (n, xs, x) ->
      type = NLType(xs)
      if type.isList()
        temp = xs[..]
        temp.splice(n, 1, x)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + x + post

    # [T] @ (Array[T]|String) => Array[T]|String
    reverse: (xs) ->
      type = NLType(xs)
      if type.isList()
        xs[..].reverse()
      else if type.isString()
        xs.split("").reverse().join("")
      else
        throw new Error("can only reverse lists and strings")

    # [T] @ (Array[Array[T]|T]) => Array[T]
    sentence: (xs...) ->
      f =
        (acc, x) ->
          if NLType(x).isList()
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

    # [T] @ (ListOrSet[T]) => ListOrSet[T]
    sort: (xs) ->
      type = NLType(xs)
      if type.isList()

        # data SortableType =
        Number = {}
        String = {}
        Agent  = {}
        None   = {}

        f =
          (acc, x) ->

            xType =
              if NLType(x).isNumber()
                Number
              else if NLType(x).isString()
                String
              else if ((x instanceof Turtle) or (x instanceof Patch) or (x instanceof Link)) and (x.id isnt -1)
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

      else if type.isAgentSet()
        xs.sort()
      else
        throw new Error("can only sort lists and agentsets")

    # ((T, T) => Boolean, ListOrSet[T]) => Array[T]
    sortBy: (task, xs) ->
      type = NLType(xs)
      arr  =
        if type.isList()
          xs
        else if type.isAgentSet()
          xs.shufflerator().toArray()
        else
          throw new Error("can only sort lists and agentsets")

      taskIsTrue =
        (a, b) ->
          value = task(a, b)
          if value is true or value is false
            value
          else
            throw new Error("SORT-BY expected input to be a TRUE/FALSE but got #{value} instead.")

      f =
        (x, y) ->
          if taskIsTrue(x, y)
            -1
          else if taskIsTrue(y, x)
            1
          else
            0

      stableSort(arr)(f)

    # (Array[Any]) => Number
    standardDeviation: (xs) ->
      nums = xs.filter((x) -> NLType(x).isNumber())
      if nums.length > 1
        mean       = @sum(xs) / xs.length
        squareDiff = foldl((acc, x) -> acc + StrictMath.pow(x - mean, 2))(0)(xs)
        stdDev     = StrictMath.sqrt(squareDiff / (nums.length - 1))
        NLMath.validateNumber(stdDev)
      else
        throw new Error("Can't find the standard deviation of a list without at least two numbers: #{Dump(xs)}")

    # [T] @ (Array[T], Number, Number) => Array[T]
    sublist: (xs, n1, n2) ->
      xs.slice(n1, n2)

    # (String, Number, Number) => String
    substring: (xs, n1, n2) ->
      xs.substr(n1, n2 - n1)

    # (Array[Number]) => Number
    sum: (xs) ->
      xs.reduce(((a, b) -> a + b), 0)

    # (Array[Number]) => Number
    variance: (numbers) ->
      sum  = numbers.foldl(((acc, x) -> acc + x), 0)
      mean = sum / count
      squareOfDifference = numbers.reduce(((acc, x) -> acc + StrictMath.pow(x - mean, 2)), 0)
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
          i = 0
          j = 0
          result = []
          while j < n
            if @_nextInt(items.length - i) < n - j
              result.push(items[i])
              j += 1
            i += 1
          result
