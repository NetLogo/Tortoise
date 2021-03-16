# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Validator       = require('./validator')
AgentSetChecks  = require('./agentset-checks')
ListChecks      = require('./list-checks')
MathChecks      = require('./math-checks')
ProcedureChecks = require('./procedure-checks')

class Checker

  constructor: (i18nBundle, dumper, miscPrims, listPrims, randomPrims, stringPrims, procedurePrims, getSelf) ->
    @validator = new Validator(i18nBundle, dumper)
    @agentset  = new AgentSetChecks(@validator, dumper, miscPrims, getSelf)
    @list      = new ListChecks(@validator, dumper, listPrims, stringPrims)
    @math      = new MathChecks(@validator, randomPrims)
    @procedure = new ProcedureChecks(@validator, procedurePrims)

  # (String) => Unit
  imperfectImport: (primName) ->
    @validator.error('Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.', primName)

module.exports = Checker
