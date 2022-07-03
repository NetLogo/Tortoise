# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
{ checks } = require('engine/core/typechecker')
StrictMath = require('shim/strictmath')
NLMath     = require('util/nlmath')

{ exceptionFactory: exceptions } = require('util/exception')

{ maybe, None, isSomething } = require('brazierjs/maybe')
{ clone                    } = require('brazierjs/object')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')
{ TopologyInterrupt }                          = require('util/interrupts')

# (Number) => Boolean
setXcorIfValid = (newX) ->
  not isSomething(setXcor.call(this, newX))

# (Number, IDSet) => Maybe[TopologyInterrupt]
setXcor = (newX, seenTurtlesSet = {}) ->

  originPatch = @getPatchHere()
  oldX        = @xcor
  xcor        = @world.topology.wrapX(newX)

  if xcor is TopologyInterrupt
    maybe(TopologyInterrupt)
  else

    @xcor = xcor
    @_updateVarsByName("xcor")
    @_drawSetLine(oldX, @ycor, newX, @ycor)

    if originPatch isnt @getPatchHere()
      originPatch.untrackTurtle(this)
      @getPatchHere().trackTurtle(this)

    @linkManager._refresh()

    dx = newX - oldX
    f  = (seenTurtles) => (turtle) => setXcor.call(turtle, turtle.xcor + dx, seenTurtles)
    @_withEachTiedTurtle(f, seenTurtlesSet)

    None

# (Number) => Boolean
setYcorIfValid = (newY) ->
  not isSomething(setYcor.call(this, newY))

# (Number, IDSet) => Maybe[TopologyInterrupt]
setYcor = (newY, seenTurtlesSet = {}) ->

  originPatch = @getPatchHere()
  oldY        = @ycor
  ycor        = @world.topology.wrapY(newY)

  if ycor is TopologyInterrupt
    maybe(TopologyInterrupt)
  else
    @ycor = ycor
    @_updateVarsByName("ycor")
    @_drawSetLine(@xcor, oldY, @xcor, newY)

    if originPatch isnt @getPatchHere()
      originPatch.untrackTurtle(this)
      @getPatchHere().trackTurtle(this)

    @linkManager._refresh()

    dy = newY - oldY
    f  = (seenTurtles) => (turtle) => setYcor.call(turtle, turtle.ycor + dy, seenTurtles)
    @_withEachTiedTurtle(f, seenTurtlesSet)

    None

# (String) => Unit
setBreedShape = (shape) ->
  @_breedShape = shape.toLowerCase()
  if not @_givenShape?
    @_genVarUpdate("shape")
  return

# (AbstractAgentSet|Breed|String) => Unit
setBreed = (breed) ->

  trueBreed =
    if checks.isString(breed)
      @world.breedManager.get(breed)
    else if checks.isAgentSet(breed)
      specialName = breed.getSpecialName()
      if specialName? and not @world.breedManager.get(specialName).isLinky()
        @world.breedManager.get(specialName)
      else
        throw exceptions.runtime("You can't set BREED to a non-breed agentset.", "set")
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

  @_refreshName()

  if not @world.breedManager.turtles().contains(this)
    @world.breedManager.turtles().add(this)

  return

# (Number) => Unit
setColor = (color) ->
  @_color = ColorModel.wrapColor(color)
  @_genVarUpdate("color")
  return

# (Number, IDSet) => Unit
setHeading = (heading, seenTurtlesSet = {}) ->

  oldHeading = @_heading
  @_heading  = NLMath.normalizeHeading(heading)
  @_genVarUpdate("heading")

  dh = NLMath.subtractHeadings(@_heading, oldHeading)
  _handleTiesForHeadingChange.call(this, seenTurtlesSet, dh)

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

# I have so many apologies for this code, but, hey,
# it wasn't my idea to embed ties into NetLogo. --JAB (10/26/15)
#
# (IDSet, Number) => Unit
_handleTiesForHeadingChange = (seenTurtlesSet, dh) ->

  [x, y] = @getCoords()

  turtleModePairs =
    @linkManager.myOutLinks("LINKS").toArray().map(
      ({ end1, end2, tiemode }) =>
        [(if end1 is this then end2 else end1), tiemode]
    )

  seenTurtlesSet[@id] = true
  filteredPairs = turtleModePairs.filter(
    ([{ id }, mode]) ->
      result = not seenTurtlesSet[id]? and mode isnt "none"
      seenTurtlesSet[id] = true
      result
  )

  filteredPairs.forEach(
    ([turtle, mode]) =>

      r = @distance(turtle)
      if r isnt 0
        theta  = @towards(turtle) + dh
        newX   = x + r * NLMath.squash(NLMath.sin(theta))
        newY   = y + r * NLMath.squash(NLMath.cos(theta))
        result = turtle.setXY(newX, newY, clone(seenTurtlesSet))

      if mode is "fixed" and result isnt TopologyInterrupt
        turtle.right(dh, clone(seenTurtlesSet))

  )

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
, new MutableVariableSpec('xcor',        (-> @xcor),                            setXcor,                          setXcorIfValid)
, new MutableVariableSpec('ycor',        (-> @ycor),                            setYcor,                          setYcorIfValid)
]

module.exports = {
  Setters
  VariableSpecs
}
