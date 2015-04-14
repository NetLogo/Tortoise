# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Nobody = require('./nobody')
Dump   = require('../dump')
{ Types: { typeOf, prefixedSingularFor } } = require('./typeinfo')

module.exports =
  class ArgumentTypeError extends Error

    message: undefined # String

    # (String, TypeSet, Any) => ArgumentTypeError
    constructor: (instructionName, wantedType, badValue) ->
      ender =
        if badValue is Nobody
          " but got NOBODY instead."
        else if badValue?
          " but got the #{typeOf(badValue).toString()} #{Dump(badValue, true)} instead."
        else
          "."
      wantedThingStr = prefixedSingularFor(wantedType.toString())
      @message = "#{instructionName.toUpperCase()} expected input to be #{wantedThingStr}#{ender}"
