# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('engine/core/typechecker')

class ControlChecks

  constructor: (@validator) ->

  multiAssignHasEnoughArgs: (sourceStart, sourceEnd, vars, argos) ->
    if !Array.isArray(argos)
      @validator.error('LET', sourceStart, sourceEnd, "The list of values for _ must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", 'LET', vars.length, 0, @validator.dumper(argos))

    if argos.length < vars.length
      @validator.error('LET', sourceStart, sourceEnd, "The list of values for _ must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", 'LET', vars.length, argos.length, @validator.dumper(argos))

    varsSoFars = vars.map( (v, i) =>
      a = argos[i]

      if (v is 0)
        [a]
      else
        @multiAssignHasEnoughArgs(sourceStart, sourceEnd, v, a)

    )
    argos

  # (Array[SetVarArray], Array[Any]) => Array[Any]
  linearizeAndValidateArgs: (sourceStart, sourceEnd, vars, argos) ->
    if !Array.isArray(argos)
      @validator.error('SET', sourceStart, sourceEnd, "The list of values for _ must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", 'SET', vars.length, 0, @validator.dumper(argos))

    if argos.length < vars.length
      @validator.error('SET', sourceStart, sourceEnd, "The list of values for _ must be at least as long as the list of names.  We need _ value(s) but only got _ from the list _.", 'SET', vars.length, argos.length, @validator.dumper(argos))

    varsSoFars = vars.map( (v, i) =>
      a = argos[i]

      if (v is 0)
        [a]
      else
        @linearizeAndValidateArgs(sourceStart, sourceEnd, v, a)

    )
    varsSoFars.flat()


module.exports = ControlChecks
