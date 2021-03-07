# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise


# There are three basic entry points here:

# 1. The `nlTypes.checks.*` functions, that check if a value is of a given type.  These are appropriate to use
#    for primitives like `is-turtle?` and other operations like equality checks or import/export.
# 2. There are type instances in the `nlTypes.types.*`, which can be used to compose the types that a primitive
#    accepts as arguments at runtime.
# 3. The `nlTypes.getTypeOf()` function, which returns a definite type for a value.  This is really only useful
#    when you need to spit out a runtime type mismatch error message for a value and you want to describe the
#    value's type accurately.  It'll be slow since it runs checks until it determines the value's type for
#    certain.

# -Jeremy B December 2020

getTypeOf = (x) ->
  switch
    when isNumber(x)  then types.Number
    when isList(x)    then types.List
    when isString(x)  then types.String
    when isBoolean(x) then types.Boolean

    when isTurtle(x) then types.Turtle
    when isPatch(x)  then types.Patch
    when isLink(x)   then types.Link

    when isPatchSet(x)  then types.PatchSet
    when isTurtleSet(x) then types.TurtleSet
    when isLinkSet(x)   then types.LinkSet
    when isAgentSet(x)  then types.AgentSet

    when isNobody(x) then types.Nobody

    when isCommandLambda(x)  then types.CommandLambda
    when isReporterLambda(x) then types.ReporterLambda

    else types.WildcardType

# We have to do something wonky to deal with the cyclic dependencies here --JAB (3/2/15)
# As an example, `turtlevariables.coffee` depends on this file and also `turtle.coffee`, which this file
# depends on.  So when we call `require()` the `turtle.coffee` is read and it calls `require()` on
# `turtlevariables.coffee` so when it calls `require()` for us again, it gets an empty object back.
# So we have to "back-fill" our export to get around that. -Jeremy B December 2020

types  = {}
checks = {}

class NLType
  isOfType: unimplemented
  niceName: unimplemented

module.exports = { types, checks, getTypeOf, NLType }

AbstractAgentSet = require('./abstractagentset')
Link             = require('./link')
LinkSet          = require('./linkset')
Patch            = require('./patch')
PatchSet         = require('./patchset')
Turtle           = require('./turtle')
TurtleSet        = require('./turtleset')

isFunction       = (x) -> typeof(x) is "function"
isCommandLambda  = (x) -> isFunction(x) and not x.isReporter
isReporterLambda = (x) -> isFunction(x) and x.isReporter

# Micro-benchmarks showed this to be mildly faster than `typeof(x) is "boolean"`.
# This is used in tight loops with `filter` and `sort`, so even a 2.5% increase is
# worth it.  -Jeremy B December 2020
isBoolean = (x) -> x is true or x is false
isList    = (x) -> Array.isArray(x)
isNumber  = (x) -> typeof(x) is "number"
isString  = (x) -> typeof(x) is "string"
isNobody  = (x) -> x is Nobody

isTurtle = (x) -> x instanceof Turtle
isPatch  = (x) -> x instanceof Patch
isLink   = (x) -> x instanceof Link
isAgent  = (x) -> isTurtle(x) or isPatch(x) or isLink(x)

isBreed = (breedName, x) ->
  (isTurtle(x) or isLink(x)) and not x.isDead() and x.isBreed(breedName)

isDirectedLink   = (x) -> isLink(x) and x.isDirected
isUndirectedLink = (x) -> isLink(x) and not x.isDirected

isAgentSet  = (x) -> x instanceof AbstractAgentSet
isTurtleSet = (x) -> x instanceof TurtleSet
isPatchSet  = (x) -> x instanceof PatchSet
isLinkSet   = (x) -> x instanceof LinkSet

isBreedSet = (breedName, x) ->
  isAgentSet(x) and x.getSpecialName()? and x.getSpecialName() is breedName

isValidTurtle         = (x) -> isTurtle(x) and not x.isDead()
isValidLink           = (x) -> isLink(x) and not x.isDead()
isValidAgent          = (x) -> isValidTurtle(x) or isPatch(x) or isValidLink(x)
isValidDirectedLink   = (x) -> isValidLink(x) and x.isDirected
isValidUndirectedLink = (x) -> isValidLink(x) and not x.isDirected

unimplemented = () ->
  throw new Error("Unimplemented abstract method!")

class CommandLambdaType extends NLType
  isOfType: isCommandLambda
  niceName: ->
    "anonymous command"

class ReporterLambdaType extends NLType
  isOfType: isReporterLambda
  niceName: ->
    "anonymous reporter"

class BooleanType extends NLType
  isOfType: isBoolean
  niceName: ->
    "TRUE/FALSE"

class ListType extends NLType
  isOfType: isList
  niceName: ->
    "list"

class NumberType extends NLType
  isOfType: isNumber
  niceName: ->
    "number"

class StringType extends NLType
  isOfType: isString
  niceName: ->
    "string"

class NobodyType extends NLType
  isOfType: isNobody
  niceName: ->
    "nobody"

class AgentType extends NLType
  isOfType: isAgent
  niceName: ->
    "agent"

class TurtleType extends AgentType
  isOfType: isTurtle
  niceName: ->
    "turtle"

class PatchType extends AgentType
  isOfType: isPatch
  niceName: ->
    "patch"

class LinkType extends AgentType
  isOfType: isLink
  niceName: ->
    "link"

class AgentSetType extends NLType
  isOfType: isAgentSet
  niceName: ->
    "agentset"

class TurtleSetType extends AgentSetType
  isOfType: isTurtleSet
  niceName: ->
    "turtle agentset"

class PatchSetType extends AgentSetType
  isOfType: isPatchSet
  niceName: ->
    "patch agentset"

class LinkSetType extends AgentSetType
  isOfType: isLinkSet
  niceName: ->
    "link agentset"

class WildcardType extends NLType
  isOfType: () -> true
  niceName: ->
    "anything"

Object.assign(checks, {
  isAgent
  isAgentSet
  isBoolean
  isBreed
  isBreedSet
  isCommandLambda
  isDirectedLink
  isLink
  isLinkSet
  isList
  isNobody
  isNumber
  isPatch
  isPatchSet
  isReporterLambda
  isString
  isTurtle
  isTurtleSet
  isUndirectedLink
  isValidAgent
  isValidDirectedLink
  isValidLink
  isValidTurtle
  isValidUndirectedLink
})

Object.assign(types, {

  Boolean: new BooleanType()
  List:    new ListType()
  Number:  new NumberType()
  String:  new StringType()
  Nobody:  new NobodyType()

  CommandLambda:  new CommandLambdaType()
  ReporterLambda: new ReporterLambdaType()

  Agent:  new AgentType()
  Turtle: new TurtleType()
  Patch:  new PatchType()
  Link:   new LinkType()

  AgentSet:  new AgentSetType()
  TurtleSet: new TurtleSetType()
  PatchSet:  new PatchSetType()
  LinkSet:   new LinkSetType()

  Wildcard: new WildcardType()
})
