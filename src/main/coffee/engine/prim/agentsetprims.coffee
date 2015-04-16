# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                 = require('lodash')
ArgumentTypeError = require('../core/argumenttypeerror')
Link              = require('../core/link')
LinkSet           = require('../core/linkset')
NLType            = require('../core/typechecker')
Nobody            = require('../core/nobody')
Patch             = require('../core/patch')
PatchSet          = require('../core/patchset')
Turtle            = require('../core/turtle')
TurtleSet         = require('../core/turtleset')

{ Type: { AgentSetType, AgentType }, TypeSet } = require('../core/typeinfo')

module.exports =
  class AgentSetPrims

    # (Hasher) => AgentSetPrims
    constructor: (@_hasher) ->

    # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
    linkSet: (inputs...) ->
      @_createAgentSet(inputs, Link, LinkSet)

    # [T] @ (Agent|AgentSet, () => T)
    of: (target, f) ->
      if target.projectionBy?
        target.projectionBy(f)
      else
        throw new ArgumentTypeError("OF", new TypeSet([AgentSetType, AgentType]), target)

    # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
    patchSet: (inputs...) ->
      @_createAgentSet(inputs, Patch, PatchSet)

    # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
    turtleSet: (inputs...) ->
      @_createAgentSet(inputs, Turtle, TurtleSet)

    # [T <: Agent, U <: AbstractAgentSet[T], V <: (Array[T]|T|AbstractAgentSet[T])] @ (Array[V], T.Class, U.Class) => U
    _createAgentSet: (inputs, tClass, outClass) ->
      flattened = _(inputs).flattenDeep().value()
      if _(flattened).isEmpty()
        new outClass([])
      else if flattened.length is 1
        head = flattened[0]
        if head instanceof outClass
          head
        else if head instanceof tClass
          new outClass([head])
        else
          new outClass([])
      else
        result  = []
        hashSet = {}

        hashIt = @_hasher

        addT =
          (p) ->
            hash = hashIt(p)
            if not hashSet.hasOwnProperty(hash)
              result.push(p)
              hashSet[hash] = true
            return

        buildFromAgentSet = (agentSet) -> agentSet.forEach(addT)

        buildItems =
          (inputs) =>
            for input in inputs
              if NLType(input).isList()
                buildItems(input)
              else if input instanceof tClass
                addT(input)
              else if input isnt Nobody
                buildFromAgentSet(input)

        buildItems(flattened)
        new outClass(result)
