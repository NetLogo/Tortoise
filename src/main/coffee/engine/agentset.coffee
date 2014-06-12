define(['engine/exception'], (Exception) ->

  class AgentSet

    _self:   undefined #@# Lame
    _myself: undefined #@# Lame, only used by a tiny subset of this class

    constructor: ->
      @_self   = 0
      @_myself = 0

    self: => @_self
    myself: -> if @_myself isnt 0 then @_myself else throw new Exception.NetLogoException("There is no agent for MYSELF to refer to.") #@# I wouldn't be surprised if this is entirely avoidable
    askAgent: (f) => (agent) =>
      oldMyself = @_myself #@# All of this contextual swapping can be handled more clearly; couldn't `f` just take `self` and `myself` as arguments?
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

)
