define(['engine/builtins', 'engine/colormodel', 'engine/comparator', 'engine/exception', 'engine/turtleset']
     , ( Builtins,          ColorModel,          Comparator,          Exception,          TurtleSet) ->

  class Link

    breed:      undefined
    color:      undefined
    hidden:     undefined
    labelcolor: undefined
    label:      undefined
    shape:      undefined
    thickness:  undefined
    tiemode:    undefined
    vars:       undefined

    xcor: -> #@# WHAT?! x2
    ycor: ->
    constructor: (@id, @directed, @end1, @end2, @world) ->
      @breed      = @world.breedManager.links()
      @color      = 5
      @hidden     = false
      @label      = ""
      @labelcolor = 9.9
      @shape      = "default"
      @thickness  = 0
      @tiemode    = "none"

      @breed.add(this)
      @end1._links.push(this)
      @end2._links.push(this)
      @updateEndRelatedVars()
      @vars = (x for x in @world.linksOwn.vars)

    getLinkVariable: (n) ->
      if n < Builtins.linkBuiltins.length
        this[Builtins.linkBuiltins[n]]
      else
        @vars[n - Builtins.linkBuiltins.length]
    setLinkVariable: (n, value) ->
      if n < Builtins.linkBuiltins.length
        newValue =
          if Builtins.linkBuiltins[n] is "lcolor"
            ColorModel.wrapColor(value)
          else
            value
        this[Builtins.linkBuiltins[n]] = newValue
        @world.updater.updated(this, Builtins.linkBuiltins[n])
      else
        @vars[n - Builtins.linkBuiltins.length] = value
    die: ->
      @breed.remove(this)
      if @id isnt -1
        @end1._removeLink(this)
        @end2._removeLink(this)
        @world.removeLink(@id)
        @seppuku()
        @id = -1
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")
    getTurtleVariable: (n) -> this[Builtins.turtleBuiltins[n]]
    setTurtleVariable: (n, value) ->
      newValue =
        if Builtins.turtleBuiltins[n] is "color"
          ColorModel.wrapColor(value)
        else
          value
      this[Builtins.turtleBuiltins[n]] = newValue
      @world.updater.updated(this, Builtins.turtleBuiltins[n])
    bothEnds: -> new TurtleSet([@end1, @end2])
    otherEnd: -> if @end1 is AgentSet.myself() then @end2 else @end1
    updateEndRelatedVars: ->
      @heading = @world.topology().towards(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
      @size = @world.topology().distanceXY(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
      @midpointx = @world.topology().midpointx(@end1.xcor(), @end2.xcor())
      @midpointy = @world.topology().midpointy(@end1.ycor(), @end2.ycor())
      @world.updater.updated(this, Builtins.linkExtras...)
    toString: -> "(#{@breed.singular} #{@end1.id} #{@end2.id})"

    compare: (x) -> #@# Unify with `Links.compare`
      switch @world.linkCompare(this, x)
        when -1 then Comparator.LESS_THAN
        when  0 then Comparator.EQUALS
        when  1 then Comparator.GREATER_THAN
        else throw new Exception.NetLogoException("Comparison should only yield an integer within the interval [-1,1]")

    seppuku: ->
      @world.updater.update("links", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

)
