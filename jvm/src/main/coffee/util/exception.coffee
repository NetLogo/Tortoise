# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class AgentException extends Error

class DeathInterrupt    extends NetLogoException
class ReportInterrupt   extends NetLogoException
class StopInterrupt     extends NetLogoException
class TopologyInterrupt extends NetLogoException

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

# [T] @ (Prototype) => (() => T) => T
ignoring = (exceptionType) -> (f) ->
  try f()
  catch ex
    if not (ex instanceof exceptionType)
      throw ex

module.exports = {
  AgentException
  DeathInterrupt
  HaltInterrupt
  ignoring
  NetLogoException
  ReportInterrupt
  StopInterrupt
  TopologyInterrupt
}
