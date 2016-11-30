# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Iterator = require('./iterator')

{ all, contains, exists, filter, find, forEach, foldl } = require('brazierjs/array')
{ id, pipeline                                        } = require('brazierjs/function')
{ fold                                                } = require('brazierjs/maybe')

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
      contains(item)(@toArray())

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      exists(pred)(@toArray())

    # ((T) => Boolean) => Boolean
    every: (pred) ->
      all(pred)(@toArray())

    # ((T) => Boolean) => Seq[T]
    filter: (pred) ->
      @_generateFrom(filter(pred)(@toArray()))

    # ((T) => Boolean) => T
    find: (pred) ->
      pipeline(find(pred), fold(-> undefined)(id))(@toArray())

    # ((T) => Unit) => Unit
    forEach: (f) ->
      forEach(f)(@toArray())
      return

    # [U] @ ((U, T) => U, U) => U
    foldl: (f, initial) ->
      foldl(f)(initial)(@toArray())

    # () => Iterator
    iterator: ->
      new Iterator(@_items)

    # () => Array[T]
    toArray: ->
      @_items[..]

    # () => String
    toString: ->
      "Seq(#{@toArray().toString()})"

    # (Array[T]) => Seq[T]
    _generateFrom: (newItems) ->
      new Seq(newItems)
