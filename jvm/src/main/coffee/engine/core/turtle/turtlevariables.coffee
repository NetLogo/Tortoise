# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
NLType     = require('../typechecker')
StrictMath = require('shim/strictmath')
NLMath     = require('util/nlmath')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

###
 "Jason, this is craziness!", you say.  "Not quite," I say.  It _is_ kind of lame, but changing turtle members
 needs to be controlled, so that all changes cause updates to be triggered.  And since the `VariableManager` needs
 to know how to set all of the variables, we may as well declare the code for that in a place where it can be
 easily reused. --JAB (6/2/14, 8/28/15)
###

# (Number, Turtle) => Unit
setXcor = (newX, tiedCaller = undefined) ->

  originPatch = @getPatchHere()
  oldX        = @xcor
  @xcor       = @world.topology.wrapX(newX)
  @_updateVarsByName("xcor")
  @_drawLine(oldX, @ycor, newX, @ycor)

  if originPatch isnt @getPatchHere()
    originPatch.untrackTurtle(this)
    @getPatchHere().trackTurtle(this)

  @linkManager._refresh()

  dx = @xcor - oldX
  @_tiedTurtles().forEach(
    (turtle) =>
      if turtle isnt tiedCaller
        setXcor.call(turtle, turtle.xcor + dx, this)
      return
  )

  return

# (Number, Turtle) => Unit
setYcor = (newY, tiedCaller = undefined) ->

  originPatch = @getPatchHere()
  oldY        = @ycor
  @ycor       = @world.topology.wrapY(newY)
  @_updateVarsByName("ycor")
  @_drawLine(@xcor, oldY, @xcor, newY)

  if originPatch isnt @getPatchHere()
    originPatch.untrackTurtle(this)
    @getPatchHere().trackTurtle(this)

  @linkManager._refresh()

  dy = @ycor - oldY
  @_tiedTurtles().forEach(
    (turtle) =>
      if turtle isnt tiedCaller
        setYcor.call(turtle, turtle.ycor + dy, this)
      return
  )

  return

# (String) => Unit
setBreedShape = (shape) ->
  @_breedShape = shape.toLowerCase()
  if not @_givenShape?
    @_genVarUpdate("shape")
  return

# (AbstractAgentSet|Breed|String) => Unit
setBreed = (breed) ->

  type = NLType(breed)

  trueBreed =
    if type.isString()
      @world.breedManager.get(breed)
    else if type.isAgentSet()
      specialName = breed.getSpecialName()
      if specialName?
        @world.breedManager.get(specialName)
      else
        throw new Error("You can't set BREED to a non-breed agentset.")
    else
      breed

  if @_breed? and @_breed isnt trueBreed
    @_givenShape = undefined

  if @_breed isnt trueBreed
    trueBreed.add(this)
    @_breed?.remove(this)

    newNames = @_varNamesForBreed(trueBreed)
    oldNames = @_varNamesForBreed(@_breed)
    @_varManager.refineBy(oldNames, newNames)

  @_breed = trueBreed
  @_genVarUpdate("breed")

  setBreedShape.call(this, trueBreed.getShape())

  if trueBreed isnt @world.breedManager.turtles()
    @world.breedManager.turtles().add(this)

  return

# (Number) => Unit
setColor = (color) ->
  @_color = ColorModel.wrapColor(color)
  @_genVarUpdate("color")
  return

# (Number, Turtle) => Unit
setHeading = (heading, tiedCaller = undefined) ->

  oldHeading = @_heading
  @_heading  = NLMath.normalizeHeading(heading)
  @_genVarUpdate("heading")

  dh      = @_heading - oldHeading
  [x, y]  = @getCoords()

  @_fixedTiedTurtles().forEach(
    (turtle) =>
      if turtle isnt tiedCaller
        turtle.right(dh, this)
      return
  )

  @_tiedTurtles().forEach(
    (turtle) =>
      if turtle isnt tiedCaller
        r        = @distance(turtle)
        [tx, ty] = turtle.getCoords()
        theta    = StrictMath.toDegrees(StrictMath.atan2(ty - y, x - tx)) - 90 + dh
        newX     = x + r * NLMath.squash(NLMath.sin(theta))
        newY     = y + r * NLMath.squash(NLMath.cos(theta))
        turtle.setXY(newX, newY, this)
      return
  )

  return

# (Boolean) => Unit
setIsHidden = (isHidden) ->
  @_hidden = isHidden
  @_genVarUpdate("hidden?")
  return

# (String) => Unit
setLabel = (label) ->
  @_label = label
  @_genVarUpdate("label")
  return

# (Number) => Unit
setLabelColor = (color) ->
  @_labelcolor = ColorModel.wrapColor(color)
  @_genVarUpdate("label-color")
  return

# (String) => Unit
setShape = (shape) ->
  @_givenShape = shape.toLowerCase()
  @_genVarUpdate("shape")
  return

# (Number) => Unit
setSize = (size) ->
  @_size = size
  @_genVarUpdate("size")
  return

Setters = {
  setXcor
  setYcor
  setBreed
  setColor
  setHeading
  setIsHidden
  setLabel
  setLabelColor
  setShape
  setSize
}

getBreed = (-> @world.turtleManager.turtlesOfBreed(@_breed.name))

VariableSpecs = [
  new ImmutableVariableSpec('who', -> @id)
, new MutableVariableSpec('breed',       getBreed,                              setBreed)
, new MutableVariableSpec('color',       (-> @_color),                          setColor)
, new MutableVariableSpec('heading',     (-> @_heading),                        setHeading)
, new MutableVariableSpec('hidden?',     (-> @_hidden),                         setIsHidden)
, new MutableVariableSpec('label',       (-> @_label),                          setLabel)
, new MutableVariableSpec('label-color', (-> @_labelcolor),                     setLabelColor)
, new MutableVariableSpec('pen-mode',    (-> @penManager.getMode().toString()), ((x) -> @penManager.setPenMode(x)))
, new MutableVariableSpec('pen-size',    (-> @penManager.getSize()),            ((x) -> @penManager.setSize(x)))
, new MutableVariableSpec('shape',       (-> @_getShape()),                     setShape)
, new MutableVariableSpec('size',        (-> @_size),                           setSize)
, new MutableVariableSpec('xcor',        (-> @xcor),                            setXcor)
, new MutableVariableSpec('ycor',        (-> @ycor),                            setYcor)
]

module.exports = {
  Setters
  VariableSpecs
}
