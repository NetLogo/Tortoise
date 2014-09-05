# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                = require('lodash')
AbstractAgentSet = require('../core/abstractagentset')
Link             = require('../core/link')
Nobody           = require('../core/nobody')
Patch            = require('../core/patch')
Turtle           = require('../core/turtle')
StrictMath       = require('tortoise/shim/strictmath')
Comparator       = require('tortoise/util/comparator')
Exception        = require('tortoise/util/exception')
stableSort       = require('tortoise/util/stablesort')
Type             = require('tortoise/util/typechecker')

# For most of this stuff, Lodashing it is no good, since Lodash doesn't handle strings correctly.  Could use Underscore.string... --JAB (5/5/14)
module.exports =
  class ListPrims

    # (Hasher, (Any, Any) => Boolean) => ListPrims
    constructor: (@_hasher, @_equality) ->

    # [T] @ (Array[T]|String) => Array[T]|String
    butFirst: (xs) ->
      xs[1..]

    # [T] @ (Array[T]|String) => Array[T]|String
    butLast: (xs) ->
      xs[0...xs.length - 1]

    # [T] @ (String|Array[T]) => Boolean
    empty: (xs) ->
      xs.length is 0

    # [Item] @ (Array[Item]) => Item
    first: (xs) ->
      xs[0]

    # [Item] @ (Item, Array[Item]) => Array[Item]
    fput: (x, xs) ->
      [x].concat(xs)

    # [Item] @ (Number, Array[Item]) => Item
    item: (n, xs) ->
      xs[n]

    # [Item] @ (Array[Item]) => Item
    last: (xs) ->
      xs[xs.length - 1]

    # [T] @ (Array[T]) => Number
    length: (xs) ->
      xs.length

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

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Boolean
    member: (x, xs) ->
      if Type(xs).isArray()
        _(xs).some((y) => @_equality(x, y))
      else if Type(x).isString()
        xs.indexOf(x) isnt -1
      else # agentset
        xs.exists((a) -> x is a)

    # (Array[Number]) => Number
    min: (xs) ->
      Math.min(xs...)

    # [Item] @ (Number, ListOrSet[Item]) => ListOrSet[Item]
    nOf: (n, agentsOrList) ->
      if agentsOrList instanceof AbstractAgentSet
        items    = agentsOrList.iterator().toArray()
        newItems = @_nOfArray(n, items)
        agentsOrList.copyWithNewAgents(newItems)
      else
        throw new Error("n-of not implemented on lists yet")

    # [Item] @ (ListOrSet[Item]) => Item
    oneOf: (agentsOrList) ->
      arr =
        if agentsOrList instanceof AbstractAgentSet
          agentsOrList.iterator().toArray()
        else
          agentsOrList
      if arr.length is 0
        Nobody
      else
        arr[Random.nextInt(arr.length)]

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Number|Boolean
    position: (x, xs) ->
      index =
        if Type(xs).isArray()
          _(xs).findIndex((y) => @_equality(x, y))
        else
          xs.indexOf(x)

      if index isnt -1
        index
      else
        false

    # [T] @ (Array[T]) => Array[T]
    removeDuplicates: (xs) -> if xs.length < 2
        xs
      else
        f =
          ([accArr, accSet], x) =>
            hash   = @_hasher(x)
            values = accSet[hash]
            if values?
              if not _(values).some((y) => @_equality(x, y))
                accArr.push(x)
                values.push(x)
            else
              accArr.push(x)
              accSet[hash] = [x]
            [accArr, accSet]
        [out, []] = xs.reduce(f, [[], {}])
        out

    # [T] @ (Array[T]|String) => Array[T]|String
    reverse: (xs) ->
      if Type(xs).isArray()
        xs[..].reverse()
      else if typeof(xs) is "string"
        xs.split("").reverse().join("")
      else
        throw new Error("can only reverse lists and strings")

    # [Item, Container <: (Array[Item]|String)] @ (Item, Container) => Container
    remove: (x, xs) ->
      if Type(xs).isArray()
        _(xs).filter((y) => not @_equality(x, y)).value()
      else
        xs.replace(new RegExp(x, "g"), "") # Replace all occurences of `x` --JAB (5/26/14)

    # [Item, Container <: (Array[Item]|String)] @ (Number, Container) => Container
    removeItem: (n, xs) ->
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1) # Cryptic, but effective --JAB (5/26/14)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + post

    # [Item, Container <: (Array[Item]|String)] @ (Number, Container, Item) => Container
    replaceItem: (n, xs, x) ->
      if Type(xs).isArray()
        temp = xs[..]
        temp.splice(n, 1, x)
        temp
      else
        pre  = xs.slice(0, n)
        post = xs.slice(n + 1)
        pre + x + post

    # [T] @ (Array[Array[T]|T]) => Array[T]
    sentence: (xs...) ->
      f =
        (acc, x) ->
          if Type(x).isArray()
            acc.concat(x)
          else
            acc.push(x)
            acc
      _(xs).foldl(f, [])

    # [T] @ (ListOrSet[T]) => ListOrSet[T]
    sort: (xs) ->
      if Type(xs).isArray()
        forAll       = (f) -> _.all(xs, f)
        agentClasses = [Turtle, Patch, Link]
        if _(xs).isEmpty()
          xs
        else if forAll((x) -> Type(x).isNumber())
          xs[..].sort((x, y) -> Comparator.numericCompare(x, y).toInt)
        else if forAll((x) -> Type(x).isString())
          xs[..].sort()
        else if _(agentClasses).some((agentClass) -> forAll((x) -> x instanceof agentClass))
          stableSort(xs[..])((x, y) -> x.compare(y).toInt)
        else
          throw new Error("We don't know how to sort your kind here!")
      else if xs instanceof AbstractAgentSet
        xs.sort()
      else
        throw new Error("can only sort lists and agentsets")

    # [T] @ (Array[T], Number, Number) => Array[T]
    sublist: (xs, n1, n2) ->
      xs.slice(n1, n2)

    # (String, Number, Number) => String
    substring: (xs, n1, n2) ->
      xs.substr(n1, n2 - n1)

    # (Array[Number]) => Number
    sum: (xs) ->
      xs.reduce(((a, b) -> a + b), 0)

    # [T] @ (Array[T]) => Number
    variance: (xs) ->
      numbers = _(xs).filter((x) -> Type(x).isNumber())
      count   = numbers.size()

      if count < 2
        throw new Error("Can't find the variance of a list without at least two numbers")

      sum  = numbers.foldl(((acc, x) -> acc + x), 0)
      mean = sum / count
      squareOfDifference = numbers.foldl(((acc, x) -> acc + StrictMath.pow(x - mean, 2)), 0)
      squareOfDifference / (count - 1)

    # Prodding at this code is like poking a beehive with a stick... --JAB (7/30/14)
    # [Item] @ (Number, Array[Item]) => Array[Item]
    _nOfArray: (n, items) ->
      switch n
        when 0
          []
        when 1
          [items[Random.nextInt(items.length)]]
        when 2
          index1 = Random.nextInt(items.length)
          index2 = Random.nextInt(items.length - 1)
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
            if Random.nextInt(items.length - i) < n - j
              result.push(items[i])
              j += 1
            i += 1
          result
