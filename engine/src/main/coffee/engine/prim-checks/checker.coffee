# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ListChecks = require('./list-checks')
MathChecks = require('./math-checks')

class Checker

  constructor: (@_i18nBundle, listPrims, randomPrims) ->
    @list = new ListChecks(@_i18nBundle, listPrims)
    @math = new MathChecks(@_i18nBundle, randomPrims)

module.exports = Checker
