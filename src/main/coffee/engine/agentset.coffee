define(['engine/abstractagents', 'engine/exception', 'engine/iterator', 'engine/nobody', 'integration/random']
     , ( AbstractAgents,          Exception,          Iterator,          Nobody,          Random) ->

  class AgentSet

    _self:   undefined #@# Lame
    _myself: undefined #@# Lame, only used by a tiny subset of this class

    constructor: ->
      @_self   = 0
      @_myself = 0

    all: (xs, f) -> xs.every((agent) => @askAgent(agent, f))
    self: => @_self
    myself: -> if @_myself isnt 0 then @_myself else throw new Exception.NetLogoException("There is no agent for MYSELF to refer to.") #@# I wouldn't be surprised if this is entirely avoidable
    askAgent: (agent, f) ->
      oldMyself = @_myself #@# All of this contextual swapping can be handled more clearly
      oldAgent = @_self
      @_myself = @_self
      @_self = agent
      try
        res = f() #@# FP
      catch error
        throw error if not (error instanceof Exception.DeathInterrupt or error instanceof Exception.StopInterrupt)
      @_self = oldAgent
      @_myself = oldMyself
      res
    # can't call it `with`, that's taken in JavaScript. so is `filter` - ST 2/19/14
    #@# Above comment seems bogus.  Since when can you not do something in JavaScript?
    agentFilter: (agents, f) ->
      agents.filter((agent) => @askAgent(agent, f))
    # min/MaxOneOf are copy/pasted from each other.  hard to say whether
    # DRY-ing them would be worth the possible performance impact. - ST 3/17/14
    #@# I concur; generalize this!
    maxOneOf: (agents, f) ->
      winningValue = -Number.MAX_VALUE
      winners = []
      for agent in agents.toArray() #@# Hurr, `reduce`, hurr
        result = @askAgent(agent, f)
        if result >= winningValue
          if result > winningValue
            winningValue = result
            winners = []
          winners.push(agent)
      if winners.length is 0
        Nobody
      else
        winners[Random.nextInt(winners.length)]
    minOneOf: (agents, f) ->
      winningValue = Number.MAX_VALUE
      winners = []
      for agent in agents.toArray()
        result = @askAgent(agent, f)
        if result <= winningValue
          if result < winningValue
            winningValue = result
            winners = []
          winners.push(agent)
      if winners.length is 0
        Nobody
      else
        winners[Random.nextInt(winners.length)]

)
