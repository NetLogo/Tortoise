# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ validateNumber, validateType } = require('./common-checks')
{ types }                        = require('engine/core/typechecker')

class ListChecks

  constructor: (@_i18nBundle, dumper, @listPrims) ->
    @validateNumber = validateNumber(@_i18nBundle)
    validate        = validateType(@_i18nBundle, dumper)
    @validateLput   = validate("LPUT", types.List)

  # (T, Array[T]) => Array[T]
  lput: (item, list) ->
    @listPrims.lput(item, @validateLput(list))

  # Array[Any] => Number
  median: (vals) ->
    @validateNumber(@listPrims.median(vals))

  # Array[Any] => Number
  standardDeviation: (vals) ->
    @validateNumber(@listPrims.standardDeviation(vals))

module.exports = ListChecks
