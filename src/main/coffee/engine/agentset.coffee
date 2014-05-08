###
Some things are in AgentSet, others in Prims.  The distinction seems
arbitrary/confusing.  May we should put *everything* in Prims, and
Agents can be private.  Prims could/would/should be the
compiler/runtime interface.  Dunno what's best. --ST
###
#@# End this fence-riding nonsense ASAP; I think it makes sense to have one of these that depends on the workspace/world (for the few prims that directly do), and then one that doesn't
#@# Should be unified with `AbstractAgents`
define(['engine/abstractagents', 'engine/exception', 'engine/iterator', 'engine/nobody', 'integration/random'
      , 'engine/shufflerator', 'integration/lodash']
     , ( AbstractAgents,          Exception,          Iterator,          Nobody,          Random
      ,  Shufflerator,          _) ->

  class AgentSet

    count: (xs) -> xs.size()
    any: (xs) -> xs.nonEmpty()
    all: (xs, f) -> xs.every((agent) => @askAgent(agent, f))
    _self: 0 #@# Lame
    _myself: 0 #@# Lame, only used by a tiny subset of this class
    reset: ->
      @_self = 0
      @_myself = 0
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
    ask: (agentsOrAgent, shuffle, f) ->
      agents =
        if agentsOrAgent instanceof AbstractAgents
          agentsOrAgent.toArray()
        else
          [agentsOrAgent]
      iter =
        if shuffle #@# Fix yo' varnames, son!
          new Shufflerator(agents)
        else
          new Iterator(agents)
      while iter.hasNext() #@# Srsly?  Is this Java 1.4?
        agent = iter.next()
        @askAgent(agent, f)
      # If an asker indirectly commits suicide, the exception should propagate.  FD 11/1/2013
      if @_self.id is -1
        throw new Exception.DeathInterrupt
      return
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
    of: (agentsOrAgent, f) -> #@# This is nonsense; same with `ask`.  If you're giving me something, _you_ get it into the right type first, not me!
      agents =
        if agentsOrAgent instanceof AbstractAgents
          agentsOrAgent.toArray()
        else
          [agentsOrAgent]
      result = []
      iter = new Shufflerator(agents)
      while iter.hasNext() #@# FP.  Also, move out of the 1990s.
        agent = iter.next()
        result.push(@askAgent(agent, f))
      if agentsOrAgent instanceof AbstractAgents #@# Awful to be doing this twice here...
        result
      else
        result[0]
    oneOf: (agentsOrList) ->
      arr =
        if agentsOrList instanceof AbstractAgents #@# Stop this nonsense.  This code gives me such anxiety...
          agentsOrList.toArray()
        else
          agentsOrList
      if arr.length is 0
        Nobody
      else
        arr[Random.nextInt(arr.length)]
    nOf: (resultSize, agentsOrList) ->
      if not (agentsOrList instanceof AbstractAgents) #@# How does this even make sense?
        throw new Exception.NetLogoException("n-of not implemented on lists yet")
      items = agentsOrList.toArray()
      agentsOrList.replaceAgents( #@# Oh, FFS
        switch resultSize
          when 0
            []
          when 1
            [items[Random.nextInt(items.length)]]
          when 2
            index1 = Random.nextInt(items.length)
            index2 = Random.nextInt(items.length - 1)
            [index1, index2] = #@# Why, why, why?
              if index2 >= index1
                [index1, index2 + 1]
              else
                [index2, index1]
            [items[index1], items[index2]]
          else
            i = 0
            j = 0
            result = []
            while j < resultSize #@# Lodash it!  And why not just use the general case?
              if Random.nextInt(items.length - i) < resultSize - j
                result.push(items[i])
                j += 1
              i += 1
            result
      )
    die: -> @_self.die()
    connectedLinks: (directed, isSource) -> @_self.connectedLinks(directed, isSource)
    linkNeighbors: (directed, isSource) -> @_self.linkNeighbors(directed, isSource)
    isLinkNeighbor: (directed, isSource) ->
      ((other) => @_self.isLinkNeighbor(directed, isSource, other))
    findLinkViaNeighbor: (directed, isSource) ->
      ((other) => @_self.findLinkViaNeighbor(directed, isSource, other))
    getTurtleVariable: (n)    -> @_self.getTurtleVariable(n)
    setTurtleVariable: (n, value) -> @_self.setTurtleVariable(n, value)
    getLinkVariable: (n)    -> @_self.getLinkVariable(n)
    setLinkVariable: (n, value) -> @_self.setLinkVariable(n, value)
    getBreedVariable: (n)    -> @_self.getBreedVariable(n)
    setBreedVariable: (n, value) -> @_self.setBreedVariable(n, value)
    setBreed: (agentSet) -> @_self.setBreed(agentSet.getBreedName())
    getPatchVariable:  (n)    -> @_self.getPatchVariable(n)
    setPatchVariable:  (n, value) -> @_self.setPatchVariable(n, value)
    other: (agentSet) ->
      agentSet.filter((agent) => agent isnt @_self)
    shuffle: (agents) ->
      result = []
      iter = new Shufflerator(agents.toArray())
      while iter.hasNext() #@# 1990 rears its ugly head again
        result.push(iter.next())
      agents.replaceAgents(result)
)
