# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Validator      = require('./validator')
AgentSetChecks = require('./agentset-checks')
ListChecks     = require('./list-checks')
MathChecks     = require('./math-checks')

class Checker

  constructor: (i18nBundle, dumper, listPrims, randomPrims, stringPrims, getSelf) ->
    validator = new Validator(i18nBundle, dumper)
    @agentset = new AgentSetChecks(validator, dumper, getSelf)
    @list     = new ListChecks(validator, dumper, listPrims, stringPrims)
    @math     = new MathChecks(validator, randomPrims)

module.exports = Checker
