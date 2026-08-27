# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel           = require('engine/core/colormodel')
{ checks, validate } = require('engine/core/typechecker')
StrictMath           = require('shim/strictmath')
NLMath               = require('util/nlmath')

{ exceptionFactory: exceptions } = require('util/exception')

{ maybe, None, isSomething } = require('brazierjs/maybe')
{ clone                    } = require('brazierjs/object')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')
{ TopologyInterrupt }                          = require('util/interrupts')

# (Number, IDSet) => Maybe[TopologyInterrupt]
setXcor = (newX, seenTurtlesSet = {}) ->

  numberMaybe = validate.number(newX)
  if isSomething(numberMaybe)
    return numberMaybe

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

# (Number, IDSet) => Maybe[TopologyInterrupt]
setYcor = (newY, seenTurtlesSet = {}) ->

  numberMaybe = validate.number(newY)
  if isSomething(numberMaybe)
    return numberMaybe

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
      # A set with a special name isn't necessarily a breed -- `patches` names itself but has no breed at all.
      specialName = breed.getSpecialName()
      namedBreed  = if specialName? then @world.breedManager.get(specialName) else undefined
      if namedBreed? and not namedBreed.isLinky()
        namedBreed
      else
        throw exceptions.runtime("You can't set BREED to a non-breed agentset.", "set")
    else
      breed

  if not trueBreed?.add?
    throw exceptions.runtime("You can't set BREED to a non-breed agentset.", "set")

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

# (Number|RGB|RGBA) => Maybe[String]
setColor = (color) ->

  errorMaybe = validate.color(color)

  if not isSomething(errorMaybe)
    @_color = ColorModel.wrapColor(color)
    @_genVarUpdate("color")

  errorMaybe

# (Number, IDSet) => Maybe[String]
setHeading = (heading, seenTurtlesSet = {}) ->

  errorMaybe = validate.number(heading)
  if isSomething(errorMaybe)
    return errorMaybe

  oldHeading = @_heading
  @_heading  = NLMath.normalizeHeading(heading)
  @_genVarUpdate("heading")

  dh = NLMath.subtractHeadings(@_heading, oldHeading)
  _handleTiesForHeadingChange.call(this, seenTurtlesSet, dh)

  None

# (Boolean) => Maybe[String]
setIsHidden = (isHidden) ->

  errorMaybe = validate.boolean(isHidden)

  if not isSomething(errorMaybe)
    @_hidden = isHidden
    @_genVarUpdate("hidden?")

  errorMaybe

# (String) => Unit
setLabel = (label) ->
  @_label = label
  @_genVarUpdate("label")
  return

# (Number|RGB|RGBA) => Maybe[String]
setLabelColor = (color) ->

  errorMaybe = validate.color(color)

  if not isSomething(errorMaybe)
    @_labelcolor = ColorModel.wrapColor(color)
    @_genVarUpdate("label-color")

  errorMaybe

# (String) => Maybe[String]
setShape = (shape) ->

  errorMaybe = validate.string(shape)

  if not isSomething(errorMaybe)
    @_givenShape = shape.toLowerCase()
    @_genVarUpdate("shape")

  errorMaybe

# (Number) => Maybe[String]
setSize = (size) ->

  errorMaybe = validate.number(size)

  if not isSomething(errorMaybe)
    @_size = size
    @_genVarUpdate("size")

  errorMaybe

# (String) => Maybe[String]
setPenMode = (mode) ->

  errorMaybe = validate.string(mode)

  if not isSomething(errorMaybe)
    @penManager.setPenMode(mode)

  errorMaybe

# (Number) => Maybe[String]
setPenSize = (size) ->

  errorMaybe = validate.number(size)

  if not isSomething(errorMaybe)
    @penManager.setSize(size)

  errorMaybe

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
, new MutableVariableSpec('pen-mode',    (-> @penManager.getMode().toString()), setPenMode)
, new MutableVariableSpec('pen-size',    (-> @penManager.getSize()),            setPenSize)
, new MutableVariableSpec('shape',       (-> @_getShape()),                     setShape)
, new MutableVariableSpec('size',        (-> @_size),                           setSize)
, new MutableVariableSpec('xcor',        (-> @xcor),                            setXcor)
, new MutableVariableSpec('ycor',        (-> @ycor),                            setYcor)
]

module.exports = {
  Setters
  VariableSpecs
}
