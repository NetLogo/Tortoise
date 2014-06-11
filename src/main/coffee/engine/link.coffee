define(['integration/lodash', 'engine/abstractagents', 'engine/builtins', 'engine/colormodel', 'engine/comparator'
      , 'engine/exception', 'engine/turtleset', 'engine/variablemanager']
     , ( _,                    AbstractAgents,          Builtins,          ColorModel,          Comparator
      ,  Exception,          TurtleSet,          VariableManager) ->

  class Link

    _breed:      undefined # Breed
    _varManager: undefined # VariableManager

    xcor: -> #@# WHAT?! x2
    ycor: ->

    # (Number, Boolean, Turtle, Turtle, World, Breed, Number, Boolean, String, Number, String, Number, String) => Link
    constructor: (@id, @directed, @end1, @end2, @world, breed = @world.breedManager.links(), @_color = 5
                , @_isHidden = false, @_label = "", @_labelcolor = 9.9, @_shape = "default", @_thickness = 0
                , @_tiemode = "none") ->
      @_varManager = @_genVarManager(@world.linksOwnNames)
      @_setBreed(breed)
      @end1._links.push(this)
      @end2._links.push(this)
      @updateEndRelatedVars()

    # () => String
    getBreedName: ->
      @_breed.name

    # (String) => Any
    getVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    die: ->
      @_breed.remove(this)
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
      "(#{@_breed.singular} #{@end1.id} #{@end2.id})"

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

    # Array[String] => VariableManager
    _genVarManager: (extraVarNames) ->
      varBundles = [
        { name: 'breed',       get: (=> @world.linksOfBreed(@_breed.name)), set: ((x) => @_setBreed(x))      },
        { name: 'color',       get: (=> @_color),                           set: ((x) => @_setColor(x))      },
        { name: 'end1',        get: (=> @end1),                             set: ((x) => @_setEnd1(x))       },
        { name: 'end2',        get: (=> @end2),                             set: ((x) => @_setEnd2(x))       },
        { name: 'hidden?',     get: (=> @_isHidden),                        set: ((x) => @_setIsHidden(x))   },
        { name: 'label',       get: (=> @_label),                           set: ((x) => @_setLabel(x))      },
        { name: 'label-color', get: (=> @_labelcolor),                      set: ((x) => @_setLabelColor(x)) },
        { name: 'shape',       get: (=> @_shape),                           set: ((x) => @_setShape(x))      },
        { name: 'thickness',   get: (=> @_thickness),                       set: ((x) => @_setThickness(x))  },
        { name: 'tie-mode',    get: (=> @_tiemode),                         set: ((x) => @_setTieMode(x))    }
      ]

      new VariableManager(extraVarNames, varBundles)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @world.updater.updated(this)(varName)
      return

    # (Breed) => Unit
    _setBreed: (breed) ->

      trueBreed =
        if _(breed).isString()
          @world.breedManager.get(breed)
        else if breed instanceof AbstractAgents
          @world.breedManager.get(breed.getBreedName())
        else
          breed

      if @_breed isnt trueBreed
        trueBreed.add(this)

        newNames = trueBreed.varNames
        oldNames =
          if @_breed?
            @_breed.remove(this)
            @_breed.varNames
          else
            []

        obsoletedNames = _(oldNames).difference(newNames).value()
        freshNames     = _(newNames).difference(oldNames).value()

        @_varManager.refineBy(obsoletedNames)(freshNames)

      @_breed = trueBreed
      @_genVarUpdate("breed")

      @_setShape(trueBreed.getShape())

      if trueBreed isnt @world.breedManager.links()
        @world.breedManager.links().add(this)

      return


    # (Number) => Unit
    _setColor: (color) ->
      @_color = ColorModel.wrapColor(color)
      @_genVarUpdate("color")
      return

    # (Turtle) => Unit
    _setEnd1: (turtle) ->
      @end1 = turtle
      @_genVarUpdate("end1")
      return

    # (Turtle) => Unit
    _setEnd2: (turtle) ->
      @end2 = turtle
      @_genVarUpdate("end2")
      return

    # (Boolean) => Unit
    _setIsHidden: (isHidden) ->
      @_isHidden = isHidden
      @_genVarUpdate("hidden?")
      return

    # (String) => Unit
    _setLabel: (label) ->
      @_label = label
      @_genVarUpdate("label")
      return

    # (Number) => Unit
    _setLabelColor: (color) ->
      @_labelcolor = ColorModel.wrapColor(color)
      @_genVarUpdate("label-color")
      return

    # (String) => Unit
    _setShape: (shape) ->
      @_shape = shape.toLowerCase()
      @_genVarUpdate("shape")
      return

    # (Number) => Unit
    _setThickness: (thickness) ->
      @_thickness = thickness
      @_genVarUpdate("thickness")
      return

    # (String) => Unit
    _setTieMode: (mode) ->
      @_tiemode = mode
      @_genVarUpdate("tie-mode")
      return

)
