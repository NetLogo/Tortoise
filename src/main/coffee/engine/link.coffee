define(['engine/agentkind', 'engine/agents', 'engine/builtins', 'engine/breed', 'engine/colormodel'
      , 'engine/comparator', 'engine/exception']
     , ( AgentKind,          Agents,          Builtins,          Breed,          ColorModel
      ,  Comparator,          Exception) ->

  class Link
    vars: []
    color: 5
    label: ""
    labelcolor: 9.9
    hidden: false
    shape: "default"
    thickness: 0
    tiemode: "none"
    xcor: -> #@# WHAT?! x2
    ycor: ->
    constructor: (@id, @directed, @end1, @end2, @world) ->
      @breed = Breed.Companion.get("LINKS")
      @breed.add(@)
      @end1._links.push(this)
      @end2._links.push(this)
      @updateEndRelatedVars()
      @vars = (x for x in @world.linksOwn.vars)
    getLinkVariable: (n) ->
      if (n < Builtins.linkBuiltins.length)
        this[Builtins.linkBuiltins[n]]
      else
        @vars[n - Builtins.linkBuiltins.length]
    setLinkVariable: (n, v) ->
      if (n < Builtins.linkBuiltins.length)
        newV =
          if Builtins.linkBuiltins[n] is "lcolor"
            ColorModel.wrapColor(v)
          else
            v
        this[Builtins.linkBuiltins[n]] = newV
        @world.updater.updated(this, Builtins.linkBuiltins[n])
      else
        @vars[n - Builtins.linkBuiltins.length] = v
    die: ->
      @breed.remove(@)
      if (@id != -1)
        @end1._removeLink(this)
        @end2._removeLink(this)
        @world.removeLink(@id)
        @seppuku()
        @id = -1
      throw new Exception.DeathInterrupt("Call only from inside an askAgent block")
    getTurtleVariable: (n) -> this[Builtins.turtleBuiltins[n]]
    setTurtleVariable: (n, v) ->
      newV =
        if Builtins.turtleBuiltins[n] is "color"
          ColorModel.wrapColor(v)
        else
          v
      this[Builtins.turtleBuiltins[n]] = newV
      @world.updater.updated(this, Builtins.turtleBuiltins[n])
    bothEnds: -> new Agents([@end1, @end2], Breed.Companion.get("TURTLES"), AgentKind.Turtle)
    otherEnd: -> if @end1 == AgentSet.myself() then @end2 else @end1
    updateEndRelatedVars: ->
      @heading = @world.topology().towards(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
      @size = @world.topology().distanceXY(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
      @midpointx = @world.topology().midpointx(@end1.xcor(), @end2.xcor())
      @midpointy = @world.topology().midpointy(@end1.ycor(), @end2.ycor())
      @world.updater.updated(this, Builtins.linkExtras...)
    toString: -> "(" + @breed.singular + " " + @end1.id + " " + @end2.id + ")" #@# Interpolate

    compare: (x) -> #@# Unify with `Links.compare`
      switch LinkCompanion.compare(this, x)
        when -1 then Comparator.LESS_THAN
        when  0 then Comparator.EQUALS
        when  1 then Comparator.GREATER_THAN
        else throw new Exception("Boom") #@# Bad

    seppuku: ->
      @world.updater.update("links", @id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!

  LinkCompanion =
    compare: (a, b) -> #@# Heinous
      if (a == b)
        0
      else if a.id is -1 and b.id is -1
        0
      else if(a.end1.id < b.end1.id)
        -1
      else if(a.end1.id > b.end1.id)
        1
      else if(a.end2.id < b.end2.id)
        -1
      else if(a.end2.id > b.end2.id)
        1
      else if(a.breed == b.breed)
        0
      else if(a.breed == Breed.Companion.get("LINKS"))
        -1
      else if(b.breed == Breed.Companion.get("LINKS"))
        1
      else
        throw new Error("We have yet to implement link breed comparison") #@# Bad error class

  # Cyclic dep --JAB (4/16/14)
  {
    Class     : Link
    Companion : LinkCompanion
  }

)
