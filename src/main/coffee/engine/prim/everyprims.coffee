# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =

  class EveryPrims

    # type Self = Agent|Number

    _everyMap: undefined # Object[String, Timer]

    # (Dumper) => EveryPrims
    constructor: (@_dumper) ->
      @_everyMap = {}

    # (String, Self, Number) => Boolean
    isThrottleTimeElapsed: (commandID, agent, timeLimit) ->
      entry = @_everyMap[@_genEveryKey(commandID, agent)]
      (not entry?) or entry.elapsed() >= timeLimit

    # (String, Self) => Unit
    resetThrottleTimerFor: (commandID, agent) ->
      @_everyMap[@_genEveryKey(commandID, agent)] = new Timer()

    # (String, Self) => String
    _genEveryKey: (commandID, agent) ->
      agentID =
        if agent is 0
          "observer"
        else
          @_dumper(agent)
      "#{commandID}__#{agentID}"
