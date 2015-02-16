# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Iterator = require('./iterator')

{ SuperArray } = require('super/superarray')

# If you want at the items, use `toArray`!  NO ONE BUT `toArray` SHOULD TOUCH `_items`! --JAB (7/21/14)
module.exports =
  class Seq

    # [T] @ (Array[T]) => Seq[T]
    constructor: (@_items) ->

    # () => Number
    size: ->
      @toArray().length

    # () => Number
    length: ->
      @size()

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Boolean
    nonEmpty: ->
      @size() isnt 0

    # (T) => Boolean
    contains: (item) ->
      SuperArray(@toArray()).contains(item)

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      SuperArray(@toArray()).exists(pred)

    # ((T) => Boolean) => Boolean
    every: (pred) ->
      SuperArray(@toArray()).all(pred)

    # ((T) => Boolean) => Seq[T]
    filter: (pred) ->
      @_generateFrom(SuperArray(@toArray()).filter(pred).value(), this)

    # ((T) => Boolean) => T
    find: (pred) ->
      SuperArray(@toArray()).findMaybe(pred).getOrElse(-> undefined)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      SuperArray(@toArray()).forEach(f)
      return

    # [U] @ ((U, T) => U, U) => U
    foldl: (f, initial) ->
      SuperArray(@toArray()).foldl(initial)(f)

    # () => Iterator
    iterator: ->
      new Iterator(@_items)

    # () => Array[T]
    toArray: ->
      @_items[..]

    # () => String
    toString: ->
      "Seq(#{@toArray().toString()})"

    # (Array[T], Seq[T]) => Seq[T]
    _generateFrom: (newItems, oldSeq) ->
      new Seq(newItems)
