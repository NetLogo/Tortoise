# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Validator       = require('./validator')
AgentSetChecks  = require('./agentset-checks')
ListChecks      = require('./list-checks')
MathChecks      = require('./math-checks')
ProcedureChecks = require('./procedure-checks')
TurtleChecks    = require('./turtle-checks')
LinkChecks      = require('./link-checks')

class Checker

  constructor: (i18nBundle, dumper, miscPrims, listPrims, randomPrims, stringPrims, procedurePrims, selfPrims, getSelf) ->
    @validator = new Validator(i18nBundle, dumper)
    @agentset  = new AgentSetChecks(@validator, dumper, miscPrims, getSelf)
    @list      = new ListChecks(@validator, dumper, listPrims, stringPrims)
    @math      = new MathChecks(@validator, randomPrims)
    @procedure = new ProcedureChecks(@validator, procedurePrims)
    @turtle    = new TurtleChecks(@validator, getSelf)
    @link      = new LinkChecks(@validator, getSelf, selfPrims)

  # (String) => Unit
  imperfectImport: (primName) ->
    @validator.error(primName, 'Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.', primName)

module.exports = Checker
