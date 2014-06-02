define(['engine/builtins', 'engine/colormodel', 'engine/comparator', 'engine/exception', 'engine/turtleset']
     , ( Builtins,          ColorModel,          Comparator,          Exception,          TurtleSet) ->

  class Link

    _vars: undefined # Array[Any]

    xcor: -> #@# WHAT?! x2
    ycor: ->

    # (Number, Boolean, Turtle, Turtle, World, Breed, Number, Boolean, String, Number, String, Number, String) => Link
    constructor: (@id, @directed, @end1, @end2, @world, @breed = @world.breedManager.links(), @_color = 5
                , @_isHidden = false, @_label = "", @_labelcolor = 9.9, @_shape = "default", @_thickness = 0
                , @_tiemode = "none") ->
      @breed.add(this)
      @end1._links.push(this)
      @end2._links.push(this)
      @updateEndRelatedVars()
      @_vars = (x for x in @world.linksOwn.vars)

    # (Number) => Any
    getLinkVariable: (n) ->
      if n < Builtins.linkBuiltins.length
        varName = Builtins.linkBuiltins[n]
        switch varName
          when "end1"
            @end1
          when "end2"
            @end2
          when "thickness"
            @_thickness
          when "tiemode"
            @_tiemode
          else
            throw new Exception.NetLogoException("Invalid link varname: #{varName}")
      else
        @_vars[n - Builtins.linkBuiltins.length]

    # (Number, Any) => Unit
    setLinkVariable: (n, value) ->
      if n < Builtins.linkBuiltins.length
        varName = Builtins.linkBuiltins[n]
        switch varName
          when "end1"
            @end1 = value
          when "end2"
            @end2 = value
          when "thickness"
            @_thickness = value
          when "tiemode"
            @_tiemode = value
          else
            throw new Exception.NetLogoException("Invalid link varname: #{varName}")
        @world.updater.updated(this)(varName)
      else
        @_vars[n - Builtins.linkBuiltins.length] = value
      return

    # (Number) => Any
    getTurtleVariable: (n) ->
      if n < Builtins.turtleBuiltins.length
        varName = Builtins.turtleBuiltins[n]
        switch varName
          when "breed"
            @breed
          when "color"
            @_color
          when "hidden"
            @_isHidden
          when "label"
            @_label
          when "labelcolor"
            @_labelcolor
          when "shape"
            @_shape
          else
            throw new Exception.NetLogoException("Invalid link varname: #{varName}")
      else
        @_vars[n - Builtins.turtleBuiltins.length]

    # (Number, Any) => Unit
    setTurtleVariable: (n, value) ->
      if n < Builtins.turtleBuiltins.length
        varName = Builtins.turtleBuiltins[n]
        switch varName
          when "breed"
            @breed = value
          when "color"
            @_color = ColorModel.wrapColor(value)
          when "hidden"
            @_isHidden = value
          when "label"
            @_label = value
          when "labelcolor"
            @_labelcolor = value
          when "shape"
            @_shape = value
          else
            throw new Exception.NetLogoException("Invalid link varname: #{varName}")
        @world.updater.updated(this)(varName)
      else
        @_vars[n - Builtins.turtleBuiltins.length] = value
      return

    die: ->
      @breed.remove(this)
      if @id isnt -1
        @end1._removeLink(this)
        @end2._removeLink(this)
        @world.removeLink(@id)
        @seppuku()
        @id = -1
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")

    bothEnds: -> new TurtleSet([@end1, @end2])
    otherEnd: -> if @end1 is AgentSet.myself() then @end2 else @end1

    # () => Unit
    updateEndRelatedVars: ->
      @world.updater.updated(this)("heading", "size", "midpointx", "midpointy")
      return

    # () => String
    toString: ->
      "(#{@breed.singular} #{@end1.id} #{@end2.id})"

    # () => Number
    getHeading: ->
      @world.topology().towards(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())

    # () => Number
    getMidpointX: ->
      @world.topology().midpointx(@end1.xcor(), @end2.xcor())

    # () => Number
    getMidpointY: ->
      @world.topology().midpointy(@end1.ycor(), @end2.ycor())

    # () => Number
    getSize: ->
      @world.topology().distanceXY(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())

    compare: (x) -> #@# Unify with `Links.compare`
      switch @world.linkCompare(this, x)
        when -1 then Comparator.LESS_THAN
        when  0 then Comparator.EQUALS
        when  1 then Comparator.GREATER_THAN
        else throw new Exception.NetLogoException("Comparison should only yield an integer within the interval [-1,1]")

    seppuku: ->
      @world.updater.update("links", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

)
