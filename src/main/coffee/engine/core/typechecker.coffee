# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./abstractagentset')
LinkSet          = require('./linkset')
Nobody           = require('./nobody')
Patch            = require('./patch')
PatchSet         = require('./patchset')
TurtleSet        = require('./turtleset')
JSType           = require('tortoise/util/typechecker')

class NLType
  constructor: (@_x)      -> # (Any) => NLType
  isAgent:                -> @isTurtle() or @isPatch() or @isLink()
  isAgentSet:             -> @_x instanceof AbstractAgentSet
  isCommandTask:          -> JSType(@_x).isFunction() and not @_x.isReporter
  isDirectedLink:         -> @isLink() and @_x.isDirected
  isBreed:    (breedName) -> not @_x.isDead?() and @_x.isBreed?(breedName) is true
  isBreedSet: (breedName) -> @isAgentSet() and @_x.getBreedName? and @_x.getBreedName() is breedName
  isLinkSet:              -> @_x instanceof LinkSet
  isList:                 -> JSType(@_x).isArray()
  isNobody:               -> @_x is Nobody
  isNumber:               -> JSType(@_x).isNumber()
  isPatch:                -> @_x instanceof Patch
  isPatchSet:             -> @_x instanceof PatchSet
  isReporterTask:         -> JSType(@_x).isFunction() and @_x.isReporter
  isString:               -> JSType(@_x).isString()
  isTurtleSet:            -> @_x instanceof TurtleSet
  isUndirectedLink:       -> @isLink() and not @_x.isDirected

  isValidAgent:          -> @isValidTurtle() or @isPatch() or @isValidLink()
  isValidDirectedLink:   -> @isDirectedLink()   and not @_x.isDead()
  isValidLink:           -> @isLink()           and not @_x.isDead()
  isValidTurtle:         -> @isTurtle()         and not @_x.isDead()
  isValidUndirectedLink: -> @isUndirectedLink() and not @_x.isDead()

module.exports = (x) -> new NLType(x)

# We have to do something wonky to deal with the cyclic dependency here --JAB (3/2/15)
Link   = require('./link')
Turtle = require('./turtle')

NLType.prototype.isLink   = -> @_x instanceof Link
NLType.prototype.isTurtle = -> @_x instanceof Turtle
