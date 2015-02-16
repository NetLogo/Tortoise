# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Option, None } = require('./option')
Unit             = require('./unit')
Util             = require('./util')
Checker          = require('./_typechecker')

class SuperArray

  # [T] @ (Array[T]) => SuperArray[T]
  constructor: (@_value) ->
    if not Checker.isArray(@_value)
      throw new Error("Needed an array, but was given this thing: #{@_value}")

  # ((T) => Boolean) => Boolean
  all: (f) ->
    for x in @_value
      if not f(x)
        return false
    true

  # (T) => Boolean
  contains: (x) ->
    for y in @_value
      if x is y
        return true
    false

  # [U <: Hashable] @ ((T) => U) => Object[U, Number]
  countBy: (f) ->
    @foldl({})(
      (acc, x) ->
        key = f(x)
        acc[key] = if acc[key]? then acc[key] + 1 else 0
        acc
    )

  # Requires a type `T` where unique data yields unique `toString` values (`Hashable`)
  # (Array[T]) => SuperArray[T]
  difference: (ys) ->
    sys        = new SuperArray(ys)
    cache      =    @foldl({}   )((acc, x) -> acc[x] = true;  acc)
    finalCache = sys.foldl(cache)((acc, y) -> acc[y] = false; acc)
    @filter((x) -> finalCache[x] is true)

  # () => SuperArray[T]
  distinct: ->
    @distinctBy(Util.identity)

  # [U <: Hashable] @ ((T) => U)) => SuperArray[T]
  distinctBy: (f) ->
    [filteredArr, _] = @foldl([[], {}])(
      (acc, x) ->
        y = f(x)
        [res, cache] = acc
        if cache[y] isnt true
          cache[y] = true
          res.push(x)
        acc
    )
    new SuperArray(filteredArr)

  # (Number, Number) => SuperArray[T]
  dropSomeAt: (numToDrop, index) ->
    holder = @_value[..]
    holder.splice(index, numToDrop)
    new SuperArray(holder)

  # ((T) => Boolean) => Boolean
  exists: (f) ->
    @findMaybe(f) isnt None

  # ((T) => Boolean) => SuperArray[T]
  filter: (f) ->
    new SuperArray(x for x in @_value when f(x))

  # ((T) => Boolean) => Option[T]
  findMaybe: (f) ->
    for x in @_value
      if f(x)
        return Option(x)
    None

  # ((T) => Boolean) => Option[Number]
  findIndexMaybe: (f) ->
    for x, i in @_value
      if f(x)
        return Option(i)
    None

  # () => SuperArray[T]
  flatten: ->
    new SuperArray([].concat(@_value...))

  # () => SuperArray[T]
  flattenDeep: ->
    helper = (arr, i = 0, acc = []) ->
      if i is arr.length
        acc
      else if Checker.isArray(arr[i])
        helper(arr, i + 1, acc.concat(helper(arr[i])))
      else
        acc.push(arr[i])
        helper(arr, i + 1, acc)
    new SuperArray(helper(@_value))

  # [U] @ (U) => ((U, T) => U) => U
  foldl: (z) -> (f) =>
    @_value.reduce(f, z)

  # ((T) => U) => Unit
  forEach: (f) ->
    @_value.forEach(f)
    Unit

  # () => T
  head: ->
    if @isEmpty()
      throw new Error("Cannot take head of empty array")
    @_value[0]

  # () => SuperArray[T]
  init: ->
    if @isEmpty()
      throw new Error("Cannot take init of empty array")
    @_value[1..]

  # (T, Number) => SuperArray[T]
  insertOneAt: (item, index) ->
    holder = @_value[..]
    holder.splice(index, 0, item)
    new SuperArray(holder)

  # () => Boolean
  isEmpty: ->
    @size() is 0

  # () => T
  last: ->
    if @isEmpty()
      throw new Error("Cannot take last from empty array")
    @_value[@_value.length - 1]

  # ((T) => U) => SuperArray[U]
  map: (f) ->
    new SuperArray(@_value.map(f))

  # ((T) => Number) => Option[T]
  maxMaybeBy: (f) ->
    [bestItem, bestValue] = [undefined, -Infinity]

    for x in @_value
      v = f(x)
      if v > bestValue
        bestItem  = x
        bestValue = v

    if bestItem?
      Option(bestItem)
    else
      None

  # (String, String, String) => String
  mkString: (pre, sep, post) ->
    temp = @_value.join(sep)
    pre + temp + post

  # () => Number
  size: ->
    @_value.length

  # Assumes that our `@_value` is a sorted array
  # (T, (T) => Comparable[U]) => Number
  sortedIndexForOneBy: (x, f) ->
    h = f(x)
    for y, i in @_value
      if h <= f(y)
        return i
    @_value.length

  # () => SuperArray[T]
  tail: ->
    if @isEmpty()
      throw new Error("Cannot take tail of empty array")
    new SuperArray(@_value[0])

  # () => Array[T]
  value: ->
    @_value

  # (Array[U]) => Object[T, U]
  zipToObject: (ys) ->
    maxIndex = Math.min(@_value.length, ys.length)
    acc      = {}
    i        = 0

    while (i < maxIndex)
      acc[@_value[i]] = ys[i]
      i++

    acc

  # [U >: T] @ (Array[U]*) => SuperArray[Array[U]]
  zip: (yss...) ->
    zip(@_value, yss...)

# `x` is inclusive; `y` is exclusive
# (Number, Number) => SuperArray[Number]
fromInterval = (x, y) ->
  new SuperArray([x...y])

# (Array[Array[T]]) => SuperArray[Array[T]]
zip = (xss...) ->
  res =
    if xss.length is 0
      []
    else
      for i in [0...xss[0].length]
        xss.map((list) -> list[i])
  new SuperArray(res)

module.exports = {
  SuperArray: (x) -> new SuperArray(x),
  fromInterval,
  zip
}
