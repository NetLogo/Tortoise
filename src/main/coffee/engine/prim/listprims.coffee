# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                 = require('lodash')
Dump              = require('../dump')
AbstractAgentSet  = require('../core/abstractagentset')
ArgumentTypeError = require('../core/argumenttypeerror')
Link              = require('../core/link')
Nobody            = require('../core/nobody')
Patch             = require('../core/patch')
Turtle            = require('../core/turtle')
NLType            = require('../core/typechecker')
StrictMath        = require('tortoise/shim/strictmath')
Comparator        = require('tortoise/util/comparator')
Exception         = require('tortoise/util/exception')
NLMath            = require('tortoise/util/nlmath')

{ Type: { ListType, StringType }, TypeSet } = require('../core/typeinfo')

# For most of this stuff, Lodashing it is no good, since Lodash doesn't handle strings correctly.  Could use Underscore.string... --JAB (5/5/14)
module.exports =
  class ListPrims

    # (Hasher, (Any, Any) => Boolean, (Number) => Number) => ListPrims
    constructor: (@_hasher, @_equality, @_nextInt) ->

    # [Item, Container <: (Array[Item]|String|AbstractAgentSet[Item])] @ (Item, Container) => Boolean
    member: (x, xs) ->
      type = NLType(xs)
      if type.isList()
        _(xs).some((y) => @_equality(x, y))
      else if type.isString()
        xs.indexOf(x) isnt -1
      else # agentset
        xs.exists((a) -> x is a)

    # [Item] @ (Number, ListOrSet[Item]) => ListOrSet[Item]
    nOf: (n, agentsOrList) ->
      type = NLType(agentsOrList)
      if type.isList()
        @_nOfArray(n, agentsOrList)
      else if type.isAgentSet()
        items    = agentsOrList.iterator().toArray()
        newItems = @_nOfArray(n, items)
        agentsOrList.copyWithNewAgents(newItems)
      else
        throw new Error("N-OF expected input to be a list or agentset but got #{Dump(agentsOrList)} instead.")

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
          _(xs).findIndex((y) => @_equality(x, y))
        else
          xs.indexOf(x)

      if index isnt -1
        index
      else
        false

    # [Item, Container <: (Array[Item]|String)] @ (Item, Container) => Container
    remove: (x, xs) ->
      type = NLType(xs)
      if type.isList()
        _(xs).filter((y) => not @_equality(x, y)).value()
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
              if not _(values).some((y) => @_equality(x, y))
                accArr.push(x)
                values.push(x)
            else
              accArr.push(x)
              accSet[hash] = [x]
            [accArr, accSet]
        [out, []] = xs.reduce(f, [[], {}])
        out

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
