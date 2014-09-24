# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_          = require('lodash')
Nobody     = require('../nobody')
Turtle     = require('../turtle')
TurtleSet  = require('../turtleset')
Builtins   = require('../structure/builtins')
IDManager  = require('./idmanager')
Random     = require('tortoise/shim/random')
ColorModel = require('tortoise/util/colormodel')
Exception  = require('tortoise/util/exception')

module.exports =
  class TurtleManager

    _idManager:   undefined # IDManager
    _turtles:     undefined # Array[Turtle]
    _turtlesById: undefined # Object[Number, Turtle]

    # (World, Updater, BreedManager) => TurtleManager
    constructor: (@_world, @_breedManager, @_updater) ->
      @_idManager   = new IDManager
      @_turtles     = []
      @_turtlesById = {}

    # () => Unit
    clearTurtles: ->
      @turtles().forEach((turtle) ->
        try
          turtle.die()
        catch error
          throw error if not (error instanceof Exception.DeathInterrupt)
        return
      )
      @_idManager.reset()
      return

    # (Number, String) => TurtleSet
    createOrderedTurtles: (n, breedName) ->
      turtles = _(0).range(n).map(
        (num) =>
          color   = ColorModel.nthColor(num)
          heading = (360 * num) / n
          @_createTurtle(color, heading, 0, 0, @_breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, breedName)

    # (Number, String, Number, Number) => TurtleSet
    createTurtles: (n, breedName, xcor = 0, ycor = 0) ->
      turtles = _(0).range(n).map(=>
        color   = ColorModel.randomColor()
        heading = Random.nextInt(360)
        @_createTurtle(color, heading, xcor, ycor, @_breedManager.get(breedName))
      ).value()
      new TurtleSet(turtles, breedName)

    # (Number) => Agent
    getTurtle: (id) ->
      @_turtlesById[id] or Nobody

    # (String, Number) => Agent
    getTurtleOfBreed: (breedName, id) ->
      turtle = @getTurtle(id)
      if turtle.getBreedName().toUpperCase() is breedName.toUpperCase()
        turtle
      else
        Nobody

    # () => TurtleSet
    turtles: ->
      new TurtleSet(@_turtles, "TURTLES", "turtles")

    # (String) => TurtleSet
    turtlesOfBreed: (breedName) =>
      breed = @_breedManager.get(breedName)
      new TurtleSet(breed.members, breedName, breedName)

    # () => Unit
    _clearTurtlesSuspended: ->
      @_idManager.suspendDuring(() => @clearTurtles())
      return

    # (Number, Number, Number, Number, Breed, String, Number, Boolean, Number, PenManager) => Turtle
    _createTurtle: (color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager) =>
      id     = @_idManager.next()
      turtle = new Turtle(@_world, id, @_updater.updated, @_updater.registerDeadTurtle, @_createTurtle, @_removeTurtle, color, heading, xcor, ycor, breed, label, lcolor, isHidden, size, penManager)
      @_updater.updated(turtle)(Builtins.turtleBuiltins...)
      @_turtles.push(turtle)
      @_turtlesById[id] = turtle
      turtle

    # (Number) => Unit
    _removeTurtle: (id) =>
      turtle = @_turtlesById[id]
      @_turtles.splice(@_turtles.indexOf(turtle), 1)
      delete @_turtlesById[id]
      return
