# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Something } = require('brazier/maybe')

{ checks }                       = require('../core/typechecker')
{ exceptionFactory: exceptions } = require('util/exception')

AgentSetChecks  = require('./agentset-checks')
ColorChecks     = require('./color-checks')
LinkChecks      = require('./link-checks')
ListChecks      = require('./list-checks')
MathChecks      = require('./math-checks')
PatchChecks     = require('./patch-checks')
ProcedureChecks = require('./procedure-checks')
TaskChecks      = require('./task-checks')
TurtleChecks    = require('./turtle-checks')
Validator       = require('./validator')

class Checker

  constructor: ( i18nBundle, dumper, miscPrims, listPrims, randomPrims, stringPrims
               , procedurePrims, selfPrims, world) ->

    getSelf = world.selfManager.self

    @validator = new Validator(i18nBundle, dumper)
    @agentset  = new AgentSetChecks(@validator, dumper, miscPrims, getSelf)
    @color     = new ColorChecks(@validator)
    @list      = new ListChecks(@validator, dumper, listPrims, stringPrims)
    @math      = new MathChecks(@validator, randomPrims)
    @procedure = new ProcedureChecks(@validator, procedurePrims)
    @turtle    = new TurtleChecks( @validator, getSelf, world.turtleManager
                                 , world.breedManager)
    @patch     = new PatchChecks(@validator, getSelf)
    @link      = new LinkChecks(@validator, getSelf, selfPrims)
    @task      = new TaskChecks(@validator)

    @turtleOrLink = {
      getVariable: (sourceStart, sourceEnd, name) =>
        bundle = if checks.isTurtle(getSelf()) then @turtle else @link
        bundle.getVariable(sourceStart, sourceEnd, name)

      setVariable: (sourceStart, sourceEnd, name, value) =>
        bundle = if checks.isTurtle(getSelf()) then @turtle else @link
        bundle.setVariable(sourceStart, sourceEnd, name, value)
    }

  # (Int, Int, String) => Unit
  errorPrim: (sourceStart, sourceEnd, message) ->
    throw exceptions.runtime(message, "error", Something(sourceStart), Something(sourceEnd))

  # (String, Int, Int) => Unit
  imperfectImport: (primName, sourceStart, sourceEnd) ->
    @validator.error(primName, sourceStart, sourceEnd, 'Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.', primName)

module.exports = Checker
