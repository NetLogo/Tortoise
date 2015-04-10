# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                = require('lodash')
AbstractAgentSet = require('./abstractagentset')
ColorModel       = require('./colormodel')
linkCompare      = require('./structure/linkcompare')
VariableManager  = require('./structure/variablemanager')
TurtleSet        = require('./turtleset')
NLType           = require('./typechecker')

{ EQUALS: EQ, GREATER_THAN: GT, LESS_THAN: LT, } = require('tortoise/util/comparator')

{ AgentException, DeathInterrupt: Death } = require('tortoise/util/exception')

module.exports =
  class Link

    # type RegLinkStampFunc = (Number, Number, Number, Number, Number, Number, Number, RGB, String, Number) => Unit

    _breed:            undefined # Breed
    _updateVarsByName: undefined # (String*) => Unit
    _varManager:       undefined # VariableManager

    # The type signatures here can be found to the right of the parameters. --JAB (4/21/15)
    constructor: (@id, @isDirected, @end1, @end2, @world, genUpdate, @_registerDeath, @_registerRemoval        # Number, Boolean, Turtle, Turtle, World, (Updatable) => (String*) => Unit, (Number) => Unit, (Link) => Unit
                , @_registerLinkStamp, getLinksByBreedName, breed = @world.breedManager.links(), @_color = 5   # RegLinkStampFunc, (String) => LinkSet, Breed, Number
                , @_isHidden = false, @_label = "", @_labelcolor = 9.9, @_shape = "default", @_thickness = 0   # Boolean, String, Number, String, Number
                , @tiemode = "none") ->                                                                        # String
      @_updateVarsByName = genUpdate(this)

      varNames     = @_varNamesForBreed(breed)
      @_varManager = @_genVarManager(varNames, getLinksByBreedName)

      @_setBreed(breed)
      @end1.linkManager.add(this)
      @end2.linkManager.add(this)
      @updateEndRelatedVars()
      @_updateVarsByName("directed?")

    # () => String
    getBreedName: ->
      @_breed.name

    # Tragically needed by `LinkCompare` for compliance with NetLogo's insane means of sorting links --JAB (9/6/14)
    # () => Number
    getBreedOrdinal: ->
      @_breed.ordinal

    # (String) => Any
    getVariable: (varName) ->
      @_varManager[varName]

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_varManager[varName] = value
      return

    # () => Nothing
    die: ->
      @_breed.remove(this)
      if not @isDead()
        @end1.linkManager.remove(this)
        @end2.linkManager.remove(this)
        @_registerRemoval(this)
        @_seppuku()
        @id = -1
      throw new Death("Call only from inside an askAgent block")

    # () => Unit
    stamp: ->

      { xcor: e1x, ycor: e1y } = @end1
      { xcor: e2x, ycor: e2y } = @end2

      stampHeading =
        try @world.topology.towards(e1x, e1y, e2x, e2y)
        catch error
          if error instanceof AgentException
            0
          else
            throw error

      color = ColorModel.colorToRGB(@_color)
      midX  = @getMidpointX()
      midY  = @getMidpointY()

      @_registerLinkStamp(e1x, e1y, e2x, e2y, midX, midY, stampHeading, color, @_shape, @thickness)

    # () => TurtleSet
    bothEnds: ->
      new TurtleSet([@end1, @end2])

    # () => Turtle
    otherEnd: ->
      if @end1 is @world.selfManager.myself() then @end2 else @end1

    # () => Unit
    tie: ->
      @_setTieMode("fixed")
      return

    # () => Unit
    untie: ->
      @_setTieMode("none")
      return

    # () => Unit
    updateEndRelatedVars: ->
      @_updateVarsByName("heading", "size", "midpointx", "midpointy")
      return

    # () => String
    toString: ->
      if not @isDead()
        "(#{@_breed.singular} #{@end1.id} #{@end2.id})"
      else
        "nobody"

    # () => Number
    getHeading: ->
      try @world.topology.towards(@end1.xcor, @end1.ycor, @end2.xcor, @end2.ycor)
      catch error
        if error instanceof AgentException
          throw new Error("there is no heading of a link whose endpoints are in the same position")
        else
          throw error

    # () => Number
    getMidpointX: ->
      @world.topology.midpointx(@end1.xcor, @end2.xcor)

    # () => Number
    getMidpointY: ->
      @world.topology.midpointy(@end1.ycor, @end2.ycor)

    # () => Number
    getSize: ->
      @world.topology.distanceXY(@end1.xcor, @end1.ycor, @end2.xcor, @end2.ycor)

    # () => Boolean
    isDead: ->
      @id is -1

    # (() => Any) => Unit
    ask: (f) ->
      @world.selfManager.askAgent(f)(this)
      if @world.selfManager.self().isDead?()
        throw new Death
      return

    # [Result] @ (() => Result) => Result
    projectionBy: (f) ->
      if not @isDead()
        @world.selfManager.askAgent(f)(this)
      else
        throw new Error("That #{@_breed.singular} is dead.")

    # (Any) => { toInt: Number }
    compare: (x) ->
      switch linkCompare(this, x)
        when -1 then LT
        when  0 then EQ
        when  1 then GT
        else throw new Error("Comparison should only yield an integer within the interval [-1,1]")

    # () => Array[String]
    varNames: ->
      @_varManager.names()

    # (Breed) => Array[String]
    _varNamesForBreed: (breed) ->
      linksBreed = @world.breedManager.links()
      if breed is linksBreed or not breed?
        linksBreed.varNames
      else
        linksBreed.varNames.concat(breed.varNames)

    # () => Unit
    _seppuku: ->
      @_registerDeath(@id)
      return

    # (Array[String], (String) => LinkSet) => VariableManager
    _genVarManager: (extraVarNames, getLinksByBreedName) ->
      varBundles = [
        { name: 'breed',       get: (=> getLinksByBreedName(@_breed.name)), set: ((x) => @_setBreed(x))      },
        { name: 'color',       get: (=> @_color),                           set: ((x) => @_setColor(x))      },
        { name: 'end1',        get: (=> @end1),                             set: ((x) => @_setEnd1(x))       },
        { name: 'end2',        get: (=> @end2),                             set: ((x) => @_setEnd2(x))       },
        { name: 'hidden?',     get: (=> @_isHidden),                        set: ((x) => @_setIsHidden(x))   },
        { name: 'label',       get: (=> @_label),                           set: ((x) => @_setLabel(x))      },
        { name: 'label-color', get: (=> @_labelcolor),                      set: ((x) => @_setLabelColor(x)) },
        { name: 'shape',       get: (=> @_shape),                           set: ((x) => @_setShape(x))      },
        { name: 'thickness',   get: (=> @_thickness),                       set: ((x) => @_setThickness(x))  },
        { name: 'tie-mode',    get: (=> @tiemode),                          set: ((x) => @_setTieMode(x))    }
      ]

      new VariableManager(extraVarNames, varBundles)

    # (String) => Unit
    _genVarUpdate: (varName) ->
      @_updateVarsByName(varName)
      return

    # (AbstractAgentSet|Breed|String) => Unit
    _setBreed: (breed) ->

      type = NLType(breed)

      trueBreed =
        if type.isString()
          @world.breedManager.get(breed)
        else if type.isAgentSet()
          if breed.getBreedName?
            @world.breedManager.get(breed.getBreedName())
          else
            throw new Error("You can't set BREED to a non-breed agentset.")
        else
          breed

      if @_breed isnt trueBreed
        trueBreed.add(this)
        @_breed?.remove(this)

        newNames = @_varNamesForBreed(trueBreed)
        oldNames = @_varNamesForBreed(@_breed)

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
      @tiemode = mode
      @_genVarUpdate("tie-mode")
      return
