# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('engine/core/typechecker')

class ControlChecks

  constructor: (@validator) ->

  multiLetHasEnoughArgs: (sourceStart, sourceEnd, varCount, argsList) ->
    if argsList.length < varCount
      @validator.error("let", sourceStart, sourceEnd, "The list of values for LET must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", varCount, argsList.length, @validator.dumper(argsList))
    argsList

module.exports = ControlChecks
