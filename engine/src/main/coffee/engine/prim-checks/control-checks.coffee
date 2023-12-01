# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('engine/core/typechecker')

class ControlChecks

  constructor: (@validator) ->

  multiLetHasEnoughArgs: (prim, sourceStart, sourceEnd, varCount, argsList) ->
    if argsList.length < varCount
      @validator.error(prim, sourceStart, sourceEnd, "The list of values for _ must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", prim, varCount, argsList.length, @validator.dumper(argsList))
    argsList

module.exports = ControlChecks
