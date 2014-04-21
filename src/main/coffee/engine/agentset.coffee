# Some things are in AgentSet, others in Prims.  The distinction seems
# arbitrary/confusing.  May we should put *everything* in Prims, and
# Agents can be private.  Prims could/would/should be the
# compiler/runtime interface.  Dunno what's best.
#@# End this fence-riding nonsense ASAP
#@# Should be unified with `Agents`
define(['engine/agentkind', 'engine/agents', 'engine/breed', 'engine/exception', 'engine/iterator', 'engine/nobody'
      , 'integration/random', 'engine/shufflerator']
     , ( AgentKind,          Agents,          Breed,          Exception,          Iterator,          Nobody
      ,  Random,               Shufflerator) ->

  class AgentSet

    count: (x) -> x.items.length
    any: (x) -> x.items.length > 0
    all: (x, f) ->
      for a in x.items #@# Lodash
        if(!@askAgent(a, f))
          return false
      true
    _self: 0 #@# Lame
    _myself: 0 #@# Lame, only used by a tiny subset of this class
    reset: ->
      @_self = 0
      @_myself = 0
    self: -> @_self
    myself: -> if @_myself != 0 then @_myself else throw new Exception.NetLogoException("There is no agent for MYSELF to refer to.") #@# I wouldn't be surprised if this is entirely avoidable
    askAgent: (a, f) -> #@# Varnames
      oldMyself = @_myself #@# All of this contextual swapping can be handled more clearly
      oldAgent = @_self
      @_myself = @_self
      @_self = a
      try
        res = f() #@# FP
      catch error
        throw error if!(error instanceof Exception.DeathInterrupt or error instanceof Exception.StopInterrupt)
      @_self = oldAgent
      @_myself = oldMyself
      res
    ask: (agentsOrAgent, shuffle, f) ->
      if(agentsOrAgent.items) #@# FP
        agents = agentsOrAgent.items
      else
        agents = [agentsOrAgent]
      iter =
        if (shuffle) #@# Fix yo' varnames, son!
          new Shufflerator(agents)
        else
          new Iterator(agents)
      while (iter.hasNext()) #@# Srsly?  Is this Java 1.4?
        a = iter.next()
        @askAgent(a, f)
      # If an asker indirectly commits suicide, the exception should propagate.  FD 11/1/2013
      if(@_self.id && @_self.id == -1) #@# Improve
        throw new Exception.DeathInterrupt
      return
    # can't call it `with`, that's taken in JavaScript. so is `filter` - ST 2/19/14
    #@# Above comment seems bogus.  Since when can you not do something in JavaScript?
    agentFilter: (agents, f) -> new Agents(a for a in agents.items when @askAgent(a, f), agents.breed, agents.kind)
    # min/MaxOneOf are copy/pasted from each other.  hard to say whether
    # DRY-ing them would be worth the possible performance impact. - ST 3/17/14
    #@# I concur; generalize this!
    maxOneOf: (agents, f) ->
     winningValue = -Number.MAX_VALUE
     winners = []
     for a in agents.items #@# I'm not sure how, but surely this can be Lodash-ified
       result = @askAgent(a, f)
       if result >= winningValue
         if result > winningValue
           winningValue = result
           winners = []
         winners.push(a)
     if winners.length == 0 #@# Nice try
       Nobody
     else
       winners[Random.nextInt(winners.length)]
    minOneOf: (agents, f) ->
     winningValue = Number.MAX_VALUE
     winners = []
     for a in agents.items
       result = @askAgent(a, f)
       if result <= winningValue
         if result < winningValue
           winningValue = result
           winners = []
         winners.push(a)
     if winners.length == 0
       Nobody
     else
       winners[Random.nextInt(winners.length)]
    of: (agentsOrAgent, f) -> #@# This is nonsense; same with `ask`.  If you're giving me something, _you_ get it into the right type first, not me!
      isagentset = agentsOrAgent.items #@# Existential check!  Come on!
      if(isagentset)
        agents = agentsOrAgent.items
      else
        agents = [agentsOrAgent]
      result = []
      iter = new Shufflerator(agents)
      while (iter.hasNext()) #@# FP.  Also, move out of the 1990s.
        a = iter.next()
        result.push(@askAgent(a, f))
      if isagentset
        result
      else
        result[0]
    oneOf: (agentsOrList) ->
      isagentset = agentsOrList.items #@# Stop this nonsense
      if(isagentset)
        l = agentsOrList.items
      else
        l = agentsOrList
      if l.length == 0 then Nobody else l[Random.nextInt(l.length)] #@# Sadness continues
    nOf: (resultSize, agentsOrList) ->
      items = agentsOrList.items #@# Existential
      if(!items)
        throw new Error("n-of not implemented on lists yet")
      new Agents( #@# Oh, FFS
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
      , agentsOrList.breed, agentsOrList.kind)
    turtlesOn: (agentsOrAgent) ->
      if(agentsOrAgent.items) #@# FP
        agents = agentsOrAgent.items
      else
        agents = [agentsOrAgent]
      turtles = [].concat (agent.turtlesHere().items for agent in agents)... #@# I don't know what's going on here, so it's probably wrong
      new Agents(turtles, Breed.Companion.get("TURTLES"), AgentKind.Turtle)
    die: -> @_self.die()
    connectedLinks: (directed, isSource) -> @_self.connectedLinks(directed, isSource)
    linkNeighbors: (directed, isSource) -> @_self.linkNeighbors(directed, isSource)
    isLinkNeighbor: (directed, isSource) ->
      t = @_self #@# Why bother...?
      ((other) -> t.isLinkNeighbor(directed, isSource, other))
    findLinkViaNeighbor: (directed, isSource) ->
      t = @_self #@# Why bother...?
      ((other) -> t.findLinkViaNeighbor(directed, isSource, other))
    getTurtleVariable: (n)    -> @_self.getTurtleVariable(n)
    setTurtleVariable: (n, v) -> @_self.setTurtleVariable(n, v)
    getLinkVariable: (n)    -> @_self.getLinkVariable(n)
    setLinkVariable: (n, v) -> @_self.setLinkVariable(n, v)
    getBreedVariable: (n)    -> @_self.getBreedVariable(n)
    setBreedVariable: (n, v) -> @_self.setBreedVariable(n, v)
    setBreed: (agentSet) -> @_self.setBreed(agentSet.breed)
    getPatchVariable:  (n)    -> @_self.getPatchVariable(n)
    setPatchVariable:  (n, v) -> @_self.setPatchVariable(n, v)
    other: (agentSet) ->
      self = @_self
      filteredAgents = (agentSet.items.filter((o) -> o != self)) #@# Unnecessary parens everywhere!
      new Agents(filteredAgents, agentSet.breed, agentSet.kind)
    shuffle: (agents) ->
      result = []
      iter = new Shufflerator(agents.items)
      while (iter.hasNext()) #@# 1990 rears its ugly head again
        result.push(iter.next())
      new Agents(result, agents.breed, agents.kind)

)
