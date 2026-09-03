# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ maybe, None, isSomething } = require('brazierjs/maybe')

ColorModel           = require('engine/core/colormodel')
{ checks, validate } = require('engine/core/typechecker')

{ ImmutableVariableSpec, MutableVariableSpec } = require('../structure/variablespec')

{ exceptionFactory: exceptions } = require('util/exception')

# (String) => Maybe[String]
setShape = (shape) ->

  errorMaybe = validate.string(shape)

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
      # A set with a special name isn't necessarily a breed.  `patches` names itself but has no breed at all.
      specialName = breed.getSpecialName()
      namedBreed  = if specialName? then @world.breedManager.get(specialName) else undefined
      if namedBreed?.isLinky()
        namedBreed
      else
        throw exceptions.runtime("You can't set BREED to a non-link-breed agentset.", "set")
    else
      breed

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

  errorMaybe = validate.color(color)

  if not isSomething(errorMaybe)
    @_color = ColorModel.wrapColor(color)
    @_genVarUpdate("color")

  errorMaybe

# (Turtle) => Maybe[String]
setEnd1 = (turtle) ->
  maybe("Cannot change endpoints")

# (Turtle) => Maybe[String]
setEnd2 = (turtle) ->
  maybe("Cannot change endpoints")

# (Boolean) => Maybe[String]
setIsHidden = (isHidden) ->

  errorMaybe = validate.boolean(isHidden)

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

  errorMaybe = validate.color(color)

  if not isSomething(errorMaybe)
    @_labelcolor = ColorModel.wrapColor(color)
    @_genVarUpdate("label-color")

  errorMaybe

# (Number) => Maybe[String]
setThickness = (thickness) ->

  errorMaybe = validate.number(thickness)

  if not isSomething(errorMaybe)
    @_thickness = thickness
    @_genVarUpdate("thickness")

  errorMaybe

# (String) => Maybe[String]
setTieMode = (mode) ->

  errorMaybe = validate.string(mode)

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
