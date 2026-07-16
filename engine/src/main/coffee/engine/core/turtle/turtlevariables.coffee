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

# (Number|RGB|RGBA) => Maybe[String]
validateColor = (color) ->

  hasBadLength    = (xs) -> xs.length isnt 3 and xs.length isnt 4
  isBadCompNumber = (x) -> not (0 <= x <= 255)
  isBadCompType   = (x) -> not checks.isNumber(x)

  if checks.isList(color) and (hasBadLength(color) or color.some(isBadCompType))
    maybe("Invalid RGB format")
  else if checks.isList(color) and (color.some(isBadCompNumber))
    maybe("Invalid RGB number")
  else if not checks.isList(color) and not checks.isNumber(color)
    # Without this, a non-number reached `wrapColor` and came back `NaN` (`"0,255,0" % 140`), which stored fine and
    # then broke the view: `netlogoColorToRGB` indexes its cache by the number, and `cache[NaN]` is `undefined`.
    # Patches have always checked this; turtles and links did not.  -Jeremy B July 2026
    maybe("Invalid color type")
  else
    None

# Built-in variables are typed in NetLogo even though user variables aren't, and desktop rejects the wrong type
# (`Agent.wrongTypeForVariable`).  Without these a bad value was simply stored -- `set size "x"` left a NaN size, and
# `set shape 5` leaked a raw "shape.toLowerCase is not a function" at the user.  -Jeremy B July 2026

# (Any) => Maybe[String]
validateNumber = (value) ->
  if checks.isNumber(value) then None else maybe("Invalid number type")

# (Any) => Maybe[String]
validateString = (value) ->
  if checks.isString(value) then None else maybe("Invalid string type")

# (Any) => Maybe[String]
validateBoolean = (value) ->
  if checks.isBoolean(value) then None else maybe("Invalid boolean type")

# (Number, IDSet) => Maybe[TopologyInterrupt]
setXcor = (newX, seenTurtlesSet = {}) ->

  numberMaybe = validateNumber(newX)
  return numberMaybe if isSomething(numberMaybe)

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

  numberMaybe = validateNumber(newY)
  return numberMaybe if isSomething(numberMaybe)

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

  # A name that isn't a breed resolves to `undefined`, and a value that isn't a breed at all (a number, say) has no
  # `add` -- both used to reach `trueBreed.add(this)` below and leak a raw "trueBreed.add is not a function" at the
  # user.  -Jeremy B July 2026
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

  errorMaybe = validateColor(color)

  if not isSomething(errorMaybe)
    @_color = ColorModel.wrapColor(color)
    @_genVarUpdate("color")

  errorMaybe

# (Number, IDSet) => Maybe[String]
setHeading = (heading, seenTurtlesSet = {}) ->

  errorMaybe = validateNumber(heading)
  return errorMaybe if isSomething(errorMaybe)

  oldHeading = @_heading
  @_heading  = NLMath.normalizeHeading(heading)
  @_genVarUpdate("heading")

  dh = NLMath.subtractHeadings(@_heading, oldHeading)
  _handleTiesForHeadingChange.call(this, seenTurtlesSet, dh)

  None

# (Boolean) => Maybe[String]
setIsHidden = (isHidden) ->

  errorMaybe = validateBoolean(isHidden)

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

  errorMaybe = validateColor(color)

  if not isSomething(errorMaybe)
    @_labelcolor = ColorModel.wrapColor(color)
    @_genVarUpdate("label-color")

  errorMaybe

# Only the type is checked: desktop also rejects a name that isn't a currently defined shape, but the shape list
# lives in the view rather than the engine, so there's nothing here to check it against.  -Jeremy B July 2026
# (String) => Maybe[String]
setShape = (shape) ->

  errorMaybe = validateString(shape)

  if not isSomething(errorMaybe)
    @_givenShape = shape.toLowerCase()
    @_genVarUpdate("shape")

  errorMaybe

# (Number) => Maybe[String]
setSize = (size) ->

  errorMaybe = validateNumber(size)

  if not isSomething(errorMaybe)
    @_size = size
    @_genVarUpdate("size")

  errorMaybe

# (String) => Maybe[String]
setPenMode = (mode) ->

  errorMaybe = validateString(mode)

  if not isSomething(errorMaybe)
    @penManager.setPenMode(mode)

  errorMaybe

# (Number) => Maybe[String]
setPenSize = (size) ->

  errorMaybe = validateNumber(size)

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
