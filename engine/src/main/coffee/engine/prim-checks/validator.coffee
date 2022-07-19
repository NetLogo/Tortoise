# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ maybe } = require('brazier/maybe')

StrictMath                       = require('shim/strictmath')
formatFloat                      = require('util/formatfloat')
{ checks, getTypeOf, types }     = require('engine/core/typechecker')
{ getTypesFromSyntax }           = require('engine/prim-checks/syntax')
{ exceptionFactory: exceptions } = require('util/exception')

class Validator

  # Map[Int, Array[NLType]]
  _cachedRuntimeTypes: null

  constructor: (@bundle, @dumper) ->
    @_cachedRuntimeTypes = new Map()
    # These arrays of types and the common checks below are pre-computed so that all prims
    # can share them without making loads of extra array instances and extra functions.
    # -Jeremy B December 2020
    # Most of these have gone away in favor of the compiler-based arg type checks.
    # -Jeremy B February 2021
    agentSet = [types.AgentSet]
    boolean  = [types.Boolean]

    @commonArgChecks = {
      agentSet: @makeArgTypeCheck(agentSet)
      boolean:  @makeArgTypeCheck(boolean)
    }

    @commonValueChecks = {
      boolean: @makeValueTypeCheck(boolean...)
    }

  # (String, Int | null, Int | null, String, Array[Any]) => Unit
  error: (prim, sourceStart, sourceEnd, messageKey, messageValues...) ->
    message = @bundle.get(messageKey, messageValues.map( (val) -> if typeof(val) is "function" then val() else val )...)
    throw exceptions.runtime(message, prim, maybe(sourceStart), maybe(sourceEnd))

  # (String, Int, Int, Number) => Number
  checkLong: (prim, sourceStart, sourceEnd, value) ->
    if value > 9007199254740992 or value < -9007199254740992
      @error(prim, sourceStart, sourceEnd, '_ is too large to be represented exactly as an integer in NetLogo', formatFloat(value))
    value

  # (String, Int, Int, Number) => Number
  checkNumber: (prim, sourceStart, sourceEnd, result) ->
    if Number.isNaN(result)
      @error(prim, sourceStart, sourceEnd, 'math operation produced a non-number')
    if result is Infinity
      @raiseInfinityError(prim)
    result

  # (String, Int, Int) => Unit
  raiseInfinityError: (prim, sourceStart, sourceEnd) ->
    @error(prim, sourceStart, sourceEnd, 'math operation produced a number too large for NetLogo')

  # (String) => String
  addIndefiniteArticle: (text) ->
    if ['A', 'E', 'I', 'O', 'U'].includes(text.charAt(0).toUpperCase())
      "an #{text}"
    else
      "a #{text}"

  # (Array[NLType]) => String
  listTypeNames: (typesToName) ->
    names    = typesToName.map( (type) -> type.niceName() )
    nameList = names.join(" or ")
    @addIndefiniteArticle(nameList)

  # (Any) => String
  valueToString: (value) ->
    valueType = getTypeOf(value)
    if valueType is types.Nobody
      "NOBODY"
    else if valueType is types.Wildcard
      "any value"
    else
      "the #{valueType.niceName()} #{@dumper(value)}"

  # (String, Any, Array[NLType]) => String
  typeError: (prim, value, expectedTypes) ->
    valueText = @valueToString(value)
    expectedText = @listTypeNames(expectedTypes)
    @bundle.get("_ expected input to be _ but got _ instead.", prim.toUpperCase(), expectedText, valueText)

  # (String, Int, Int, Any, Array[NLType]) => Unit
  throwTypeError: (prim, sourceStart, SourceEnd, value, expectedTypes...) ->
    throw exceptions.runtime(@typeError(prim, value, expectedTypes), prim, maybe(sourceStart), maybe(SourceEnd))
    return

  # (Array[Array[NLType]]) => (String, Array[Any]) => Unit
  makeArgTypeCheck: (argTypes...) ->
    (prim, sourceStart, sourceEnd, args) =>
      # We could use `zip()` or `foreach()` or whatever here, but I don't want to use anything that would
      # generate extra closures as this code will get called a whole lot.  So we'll leave it ugly but
      # hopefully "optimized" -Jeremy B December 2020
      for i in [0...argTypes.length]
        @checkValueTypes(prim, sourceStart, sourceEnd, argTypes[i], args[i])

      return

  # (Array[NLType]) => (String, Any) => Any
  makeValueTypeCheck: (allowedTypes...) -> (prim, sourceStart, sourceEnd, value) =>
    @checkValueTypes(prim, sourceStart, sourceEnd, allowedTypes, value)

  # (String, Int, Int, Array[NLType], Any) => Any
  checkValueTypes: (prim, sourceStart, sourceEnd, allowedTypes, value) ->
    # And we could use `some()` here, but that also could generate transient closure objects. -Jeremy B December 2020
    match = false
    for j in [0...allowedTypes.length]
      if allowedTypes[j].isOfType(value)
        match = true
        break

    if not match
      @throwTypeError(prim, sourceStart, sourceEnd, value, allowedTypes...)

    value

  # (Int) => Array[NLType]
  syntaxTypeToRuntimeTypes: (syntax) ->
    if @_cachedRuntimeTypes.has(syntax)
      @_cachedRuntimeTypes.get(syntax)
    else
      allowedTypes = getTypesFromSyntax(syntax)
      @_cachedRuntimeTypes.set(syntax, allowedTypes)
      allowedTypes

  # (String, Int, Int, Int, Any) => Any
  checkArg: (prim, sourceStart, sourceEnd, syntax, argValue) ->
    allowedTypes = @syntaxTypeToRuntimeTypes(syntax)
    @checkValueTypes(prim, sourceStart, sourceEnd, allowedTypes, argValue)

module.exports = Validator
