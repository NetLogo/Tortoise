# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class AgentException extends NetLogoException

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

module.exports = {
  AgentException
  HaltInterrupt
  NetLogoException
}
