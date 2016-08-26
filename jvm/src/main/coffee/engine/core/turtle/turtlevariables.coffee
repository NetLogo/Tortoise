# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

ColorModel = require('engine/core/colormodel')
NLType     = require('../typechecker')
StrictMath = require('shim/strictmath')
NLMath     = require('util/nlmath')

{ clone } = require('brazierjs/object')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')
{ ignoring, TopologyInterrupt }                = require('util/exception')

###
 "Jason, this is craziness!", you say.  "Not quite," I say.  It _is_ kind of lame, but changing turtle members
 needs to be controlled, so that all changes cause updates to be triggered.  And since the `VariableManager` needs
 to know how to set all of the variables, we may as well declare the code for that in a place where it can be
 easily reused. --JAB (6/2/14, 8/28/15)
###

# In this file: `this.type` is `Turtle`

ignorantly = ignoring(TopologyInterrupt)

# (Number, IDSet) => Unit
setXcor = (newX, seenTurtlesSet = {}) ->

  originPatch = @getPatchHere()
  oldX        = @xcor
  @xcor       = @world.topology.wrapX(newX)
  @_updateVarsByName("xcor")
  @_drawLine(oldX, @ycor, newX, @ycor)

  if originPatch isnt @getPatchHere()
    originPatch.untrackTurtle(this)
    @getPatchHere().trackTurtle(this)

  @linkManager._refresh()

  dx = newX - oldX
  f  = (seenTurtles) => (turtle) => ignorantly(() => setXcor.call(turtle, turtle.xcor + dx, seenTurtles))
  @_withEachTiedTurtle(f, seenTurtlesSet)

  return

# (Number, IDSet) => Unit
setYcor = (newY, seenTurtlesSet = {}) ->

  originPatch = @getPatchHere()
  oldY        = @ycor
  @ycor       = @world.topology.wrapY(newY)
  @_updateVarsByName("ycor")
  @_drawLine(@xcor, oldY, @xcor, newY)

  if originPatch isnt @getPatchHere()
    originPatch.untrackTurtle(this)
    @getPatchHere().trackTurtle(this)

  @linkManager._refresh()

  dy = newY - oldY
  f  = (seenTurtles) => (turtle) => ignorantly(() => setYcor.call(turtle, turtle.ycor + dy, seenTurtles))
  @_withEachTiedTurtle(f, seenTurtlesSet)

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

  @_refreshName()

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

  turtleModePairs = @linkManager.tieLinks().map(({ end1, end2, tiemode }) => [(if end1 is this then end2 else end1), tiemode])

  seenTurtlesSet[@id] = true
  filteredPairs = turtleModePairs.filter(
    ([{ id }, mode]) ->
      result = not seenTurtlesSet[id]? and mode isnt "none"
      seenTurtlesSet[id] = true
      result
  )

  filteredPairs.forEach(
    ([turtle, mode]) =>

      wentBoom =
        try
          r = @distance(turtle)
          if r isnt 0
            theta = @towards(turtle) + dh
            newX  = x + r * NLMath.squash(NLMath.sin(theta))
            newY  = y + r * NLMath.squash(NLMath.cos(theta))
            turtle.setXY(newX, newY, clone(seenTurtlesSet))
          false
        catch ex
          if ex instanceof TopologyInterrupt
            true
          else
            throw ex

      if mode is "fixed" and not wentBoom
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
, new MutableVariableSpec('xcor',        (-> @xcor),                            setXcor)
, new MutableVariableSpec('ycor',        (-> @ycor),                            setYcor)
]

module.exports = {
  Setters
  VariableSpecs
}
