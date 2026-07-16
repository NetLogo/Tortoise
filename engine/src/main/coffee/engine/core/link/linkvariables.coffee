# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ maybe, None, isSomething } = require('brazierjs/maybe')

ColorModel = require('engine/core/colormodel')
{ checks } = require('engine/core/typechecker')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

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
    # See the matching note in `turtlevariables.coffee`: a non-number became `NaN` here and crashed the view.
    maybe("Invalid color type")
  else
    None

# See the matching note in `turtlevariables.coffee`.  -Jeremy B July 2026

# (Any) => Maybe[String]
validateNumber = (value) ->
  if checks.isNumber(value) then None else maybe("Invalid number type")

# (Any) => Maybe[String]
validateString = (value) ->
  if checks.isString(value) then None else maybe("Invalid string type")

# (Any) => Maybe[String]
validateBoolean = (value) ->
  if checks.isBoolean(value) then None else maybe("Invalid boolean type")

# Only the type is checked; see the matching note in `turtlevariables.coffee` about the shape list living in the view.
# (String) => Maybe[String]
setShape = (shape) ->

  errorMaybe = validateString(shape)

  if not isSomething(errorMaybe)
    @_shape = shape.toLowerCase()
    @_genVarUpdate("shape")

  errorMaybe

# (AbstractAgentSet|Breed|String) => Unit
setBreed = (breed) ->

  trueBreed =
    if checks.isString(breed)
      @world.breedManager.get(breed)
    else if checks.isAgentSet(breed)
      specialName = breed.getSpecialName()
      if specialName? and @world.breedManager.get(specialName).isLinky()
        @world.breedManager.get(specialName)
      else
        throw exceptions.runtime("You can't set BREED to a non-link-breed agentset.", "set")
    else
      breed

  # See the matching guard in `turtlevariables.coffee`: without it a non-breed reached `trueBreed.add(this)` below.
  if not trueBreed?.add?
    throw exceptions.runtime("You can't set BREED to a non-link-breed agentset.", "set")

  @world.linkManager.trackBreedChange(this, trueBreed, @_breed?.name ? "")

  if @_breed isnt trueBreed
    trueBreed.add(this)
    @_breed?.remove(this)

    newNames = @_varNamesForBreed(trueBreed)
    oldNames = @_varNamesForBreed(@_breed)
    @_varManager.refineBy(oldNames, newNames)

  @_breed = trueBreed
  @_genVarUpdate("breed")

  setShape.call(this, trueBreed.getShape())

  @_refreshName()

  if not @world.breedManager.links().contains(this)
    @world.breedManager.links().add(this)

  return

# (Number|RGB|RGBA) => Maybe[String]
setColor = (color) ->

  errorMaybe = validateColor(color)

  if not isSomething(errorMaybe)
    @_color = ColorModel.wrapColor(color)
    @_genVarUpdate("color")

  errorMaybe

# A link's endpoints are fixed once it's created, as they are on desktop ("you can't change a link's endpoints" --
# `Link.java`).  Assigning them left the link pointing at whatever it was given: a turtle from a file's `end1` column
# would be a string, and the view then looked the turtle up by it and drew `undefined`.  Nothing in the engine sets
# these -- a link's ends are assigned directly at construction.  -Jeremy B July 2026
# (Turtle) => Maybe[String]
setEnd1 = (turtle) ->
  maybe("Cannot change endpoints")

# (Turtle) => Maybe[String]
setEnd2 = (turtle) ->
  maybe("Cannot change endpoints")

# (Boolean) => Maybe[String]
setIsHidden = (isHidden) ->

  errorMaybe = validateBoolean(isHidden)

  if not isSomething(errorMaybe)
    @_isHidden = isHidden
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

# (Number) => Maybe[String]
setThickness = (thickness) ->

  errorMaybe = validateNumber(thickness)

  if not isSomething(errorMaybe)
    @_thickness = thickness
    @_genVarUpdate("thickness")

  errorMaybe

# (String) => Maybe[String]
setTieMode = (mode) ->

  errorMaybe = validateString(mode)

  if not isSomething(errorMaybe)
    @tiemode = mode
    @_genVarUpdate("tie-mode")

  errorMaybe

Setters = {
  setBreed
  setColor
  setEnd1
  setEnd2
  setIsHidden
  setLabel
  setLabelColor
  setShape
  setThickness
  setTieMode
}

VariableSpecs = [
  new MutableVariableSpec('breed',       (-> @_getLinksByBreedName(@_breed.name)), setBreed)
, new MutableVariableSpec('color',       (-> @_color),                             setColor)
, new MutableVariableSpec('end1',        (-> @end1),                               setEnd1)
, new MutableVariableSpec('end2',        (-> @end2),                               setEnd2)
, new MutableVariableSpec('hidden?',     (-> @_isHidden),                          setIsHidden)
, new MutableVariableSpec('label',       (-> @_label),                             setLabel)
, new MutableVariableSpec('label-color', (-> @_labelcolor),                        setLabelColor)
, new MutableVariableSpec('shape',       (-> @_shape),                             setShape)
, new MutableVariableSpec('thickness',   (-> @_thickness),                         setThickness)
, new MutableVariableSpec('tie-mode',    (-> @tiemode),                            setTieMode)
]

module.exports = {
  Setters
  VariableSpecs
}
