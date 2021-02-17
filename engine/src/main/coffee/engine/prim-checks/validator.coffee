# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

StrictMath                   = require('shim/strictmath')
formatFloat                  = require('util/formatfloat')
{ checks, getTypeOf, types } = require('engine/core/typechecker')

class Validator

  constructor: (@bundle, @dumper) ->
    # These arrays of types and the common checks below are pre-computed so that all prims
    # can share them without making loads of extra array instances and extra functions.
    # -Jeremy B December
    agentSetOrList         = [types.AgentSet, types.List]
    boolean                = [types.Boolean]
    list                   = [types.List]
    number                 = [types.Number]
    reporter               = [types.ReporterLambda]
    string                 = [types.String]
    stringOrList           = [types.String, types.List]
    stringOrListOrAgentSet = [types.String, types.List, types.AgentSet]
    wildcard               = [types.Wildcard]

    @commonArgChecks = {
      agentSetOrList:                  @makeArgTypeCheck(agentSetOrList)
      list:                            @makeArgTypeCheck(list)
      list_number_number:              @makeArgTypeCheck(list, number, number)
      number:                          @makeArgTypeCheck(number)
      number_agentSetOrList:           @makeArgTypeCheck(number, agentSetOrList)
      number_number:                   @makeArgTypeCheck(number, number)
      number_stringOrList:             @makeArgTypeCheck(number, stringOrList)
      number_stringOrList_wildcard:    @makeArgTypeCheck(number, stringOrList, wildcard)
      reporter_agentSetOrList:         @makeArgTypeCheck(reporter, agentSetOrList)
      reporter_list:                   @makeArgTypeCheck(reporter, list)
      stringOrList:                    @makeArgTypeCheck(stringOrList)
      string_number_number:            @makeArgTypeCheck(string, number, number)
      wildcard_list:                   @makeArgTypeCheck(wildcard, list)
      wildcard_stringOrList:           @makeArgTypeCheck(wildcard, stringOrList)
      wildcard_stringOrListOrAgentSet: @makeArgTypeCheck(wildcard, stringOrListOrAgentSet)
    }

    @commonValueChecks = {
      boolean: @makeValueTypeCheck(boolean...)
    }

  # (Boolean, String, Array[Any]) => Unit
  error: (messageKey, messageValues...) ->
    message = @bundle.get(messageKey, messageValues.map( (val) -> if typeof(val) is "function" then val() else val )...)
    throw new Error(message)

  # (Number) => Number
  checkLong: (value) ->
    if value > 9007199254740992 or value < -9007199254740992
      @error('_ is too large to be represented exactly as an integer in NetLogo', formatFloat(value))
    value

  # (Number) => Number
  checkNumber: (result) ->
    if Number.isNaN(result)
      @error('math operation produced a non-number')
    if result is Infinity
      @error('math operation produced a number too large for NetLogo')

    result

  # (Array[NLType]) => String
  listTypeNames: (types) ->
    names    = types.map( (type) -> type.niceName() )
    nameList = names.join(" or ")
    if ['A', 'E', 'I', 'O', 'U'].includes(nameList.charAt(0).toUpperCase())
      "an #{nameList}"
    else
      "a #{nameList}"

  # (String, Any, Array[NLType]) => String
  typeError: (prim, value, expectedTypes) ->
    valueType = getTypeOf(value)
    valueText = if valueType is types.Nobody
      "nobody"
    else if valueType is types.Wildcard
      "any value"
    else
      "the #{valueType.niceName()} #{@dumper(value)}"

    expectedText = @listTypeNames(expectedTypes)

    @bundle.get("_ expected input to be _ but got _ instead.", prim, expectedText, valueText)

  # (String, Any, Array[NLType]) => Unit
  throwTypeError: (prim, value, expectedTypes...) ->
    throw new Error(@typeError(prim, value, expectedTypes))
    return

  # (Array[Array[NLType]]) => (String, Array[Any]) => Unit
  makeArgTypeCheck: (argTypes...) -> (prim, args) =>
    # We could use `zip()` or `foreach()` or whatever here, but I don't want to use anything that would
    # generate extra closures as this code will get called a whole lot.  So we'll leave it ugly but
    # hopefully "optimized" -Jeremy B December 2020
    for i in [0...args.length]
      @checkValueTypes(prim, argTypes[i], args[i])

    return

  # (Array[NLType]) => (String, Any) => Any
  makeValueTypeCheck: (types...) -> (prim, value) =>
    @checkValueTypes(prim, types, value)

  # (String, Array[NLType], Any) => Any
  checkValueTypes: (prim, types, value) ->
    # And we could use `some()` here, but that also could generate transient closure objects. -Jeremy B December 2020
    match = false
    for j in [0...types.length]
      if types[j].isOfType(value)
        match = true

    if not match
      @throwTypeError(prim, value, types...)

    value

module.exports = Validator
