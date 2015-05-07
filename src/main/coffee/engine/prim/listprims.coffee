# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
Nobody = require('../core/nobody')

module.exports =
  class ListPrims

    # (Hasher, (Any, Any) => Boolean, (Number) => Number) => ListPrims
    constructor: (@_hasher, @_equality, @_nextInt) ->

    # [T, U] @ (T, Array[U]) => Boolean
    member_t_list: (x, xs) ->
      _(xs).some((y) => @_equality(x, y))

    # [T <: Agent, U <: AbstractAgentSet[T]] @ (Number, U) => U
    nOf_number_agentset: (n, agents) ->
      items    = agents.iterator().toArray()
      newItems = @_nOfArray(n, items)
      agents.copyWithNewAgents(newItems)

    # [T] @ (Number, Array[T]) => Array[T]
    nOf_number_list: (n, agentsOrList) ->
      @_nOfArray(n, agentsOrList)

    # [T] @ (AbstractAgentSet[T]) => T
    oneOf_agentset: (agents) ->
      arr = agents.iterator().toArray()
      if arr.length is 0
        Nobody
      else
        arr[@_nextInt(arr.length)]

    # [T] @ (Array[T]) => T
    oneOf_list: (xs) ->
      if xs.length is 0
        Nobody
      else
        xs[@_nextInt(xs.length)]

    # [T, U] @ (T, Array[U]) => Number|Boolean
    position_t_list: (x, xs) ->
      index = _(xs).findIndex((y) => @_equality(x, y))
      if index isnt -1 then index else false

    # [T, U] @ (T, Array[U]) => Array[U]
    remove_t_list: (x, xs) ->
      _(xs).filter((y) => not @_equality(x, y)).value()

    # [T] @ (Array[T]) => Array[T]
    removeDuplicates_list: (xs) ->
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
