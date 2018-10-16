# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NLType
  constructor: (@_x) -> # (Any) => NLType

module.exports = (x) -> new NLType(x)

# We have to do something wonky to deal with the cyclic dependencies here --JAB (3/2/15)
AbstractAgentSet = require('./abstractagentset')
Link             = require('./link')
LinkSet          = require('./linkset')
Patch            = require('./patch')
PatchSet         = require('./patchset')
Turtle           = require('./turtle')
TurtleSet        = require('./turtleset')
JSType           = require('util/typechecker')

NLType.prototype.isAgent          =             -> @isTurtle() or @isPatch() or @isLink()
NLType.prototype.isAgentSet       =             -> @_x instanceof AbstractAgentSet
NLType.prototype.isBoolean        =             -> JSType(@_x).isBoolean()
NLType.prototype.isBreed          = (breedName) -> not @_x.isDead?() and @_x.isBreed?(breedName) is true
NLType.prototype.isBreedSet       = (breedName) -> @isAgentSet() and @_x.getSpecialName()? and @_x.getSpecialName() is breedName
NLType.prototype.isCommandLambda  =             -> JSType(@_x).isFunction() and not @_x.isReporter
NLType.prototype.isDirectedLink   =             -> @isLink() and @_x.isDirected
NLType.prototype.isLinkSet        =             -> @_x instanceof LinkSet
NLType.prototype.isLink           =             -> @_x instanceof Link
NLType.prototype.isList           =             -> JSType(@_x).isArray()
NLType.prototype.isNobody         =             -> @_x is Nobody
NLType.prototype.isNumber         =             -> JSType(@_x).isNumber()
NLType.prototype.isPatchSet       =             -> @_x instanceof PatchSet
NLType.prototype.isPatch          =             -> @_x instanceof Patch
NLType.prototype.isReporterLambda =             -> JSType(@_x).isFunction() and @_x.isReporter
NLType.prototype.isString         =             -> JSType(@_x).isString()
NLType.prototype.isTurtleSet      =             -> @_x instanceof TurtleSet
NLType.prototype.isTurtle         =             -> @_x instanceof Turtle
NLType.prototype.isUndirectedLink =             -> @isLink() and not @_x.isDirected

NLType.prototype.isValidAgent          = -> @isValidTurtle() or @isPatch() or @isValidLink()
NLType.prototype.isValidDirectedLink   = -> @isDirectedLink()   and not @_x.isDead()
NLType.prototype.isValidLink           = -> @isLink()           and not @_x.isDead()
NLType.prototype.isValidTurtle         = -> @isTurtle()         and not @_x.isDead()
NLType.prototype.isValidUndirectedLink = -> @isUndirectedLink() and not @_x.isDead()

NLType.prototype.niceName =
  () ->
    if      @isAgentSet()       then "agentset"
    else if @isBoolean()        then "TRUE/FALSE"
    else if @isBreed()          then "breed"
    else if @isCommandLambda()  then "anonymous command"
    else if @isLink()           then "link"
    else if @isList()           then "list"
    else if @isNobody()         then "nobody"
    else if @isNumber()         then "number"
    else if @isPatch()          then "patch"
    else if @isReporterLambda() then "anonymous reporter"
    else if @isTurtle()         then "turtle"
    else                             "unknown value"
