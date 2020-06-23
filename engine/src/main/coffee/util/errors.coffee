# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ StopInterrupt } = require('util/exception')

# This file exists to contain errors that would otherwise
# be added to the compiler-generated code, just to reduce
# compiled code size a bit and to centralize the checks.
# -Jeremy B June 2020

# (AgentSet | Agent | Nobody) => AgentSet | Agent
askNobodyCheck = (agents) ->
  if (agents is Nobody)
    throw new Error("ASK expected input to be an agent or agentset but got NOBODY instead.")

  agents

# () => Unit
missingReport = () ->
  throw new Error("Reached end of reporter procedure without REPORT being called.")

# (Exception) => Unit
stopInReportCheck = (e) ->
  if (e instanceof StopInterrupt)
    throw new Error("STOP is not allowed inside TO-REPORT.")

  throw e

# (Exception) => Exception
stopInCommandCheck = (e) ->
  if (not (e instanceof StopInterrupt))
    throw e

  return e

# (Boolean) => Unit
reportInContextCheck = (reporterContext) ->
  if (not reporterContext)
    throw new Error("REPORT can only be used inside TO-REPORT.")

  return

# (Number, Number) => Unit
procedureArgumentsCheck = (neededArgs, givenArgs) ->
  if (givenArgs < neededArgs)
    plural = if (neededArgs is 1) then "" else "s"
    throw new Error("anonymous procedure expected #{neededArgs} input#{plural}, but only got #{givenArgs}")

  return

# (String) => Unit
imperfectImport = (primName) ->
  throw new Error("Unfortunately, no perfect equivalent to `#{primName}` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.")

module.exports = {
  askNobodyCheck,
  missingReport,
  stopInReportCheck,
  stopInCommandCheck,
  reportInContextCheck,
  procedureArgumentsCheck,
  imperfectImport
}
