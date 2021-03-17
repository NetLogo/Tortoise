# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

module.exports = {
  HaltInterrupt
  NetLogoException
}
