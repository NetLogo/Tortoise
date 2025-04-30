# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Did I *need* to create two dozen different classes for all of this stuff?  No, of course not.
# *However*, I wanted to document/codify somewhere what the types of these different structures
# are, and this, to me, seemed to be the most effective way of doing that.  So, please, pardon
# the noise.  I'm merely trying to help. --JAB (12/10/17)

module.exports.BreedNamePair =
  class
    # (String, String)
    constructor: (@singular, @plural) ->

class ExportedColor

module.exports.ExportedColor = ExportedColor

module.exports.ExportedRGB =
  class extends ExportedColor
    # (Number, Number, Number)
    constructor: (r, g, b) ->
      super()
      @r = r
      @g = g
      @b = b

module.exports.ExportedRGBA =
  class extends ExportedColor
    # (Number, Number, Number, Number)
    constructor: (r, g, b, a = 255) ->
      super()
      @r = r
      @g = g
      @b = b
      @a = a

module.exports.ExportedColorNum =
  class extends ExportedColor
    # (Number)
    constructor: (value) ->
      super()
      @value = value

module.exports.ExportedGlobals =
  class
    # ( String, Number, Number, Number, Number, Number
    # , String, AgentReference, Number, Object[Any])
    constructor: ( @linkDirectedness, @maxPxcor, @maxPycor, @minPxcor, @minPycor, @nextWhoNumber
                 , @perspective, @subject, @ticks, @codeGlobals) ->

module.exports.ExportedCommandLambda =
  class
    # (String)
    constructor: (@source) ->

module.exports.ExportedReporterLambda =
  class
    # (String)
    constructor: (@source) ->

module.exports.ExportedPoint =
  class
    # (Number, Number, Boolean, Number)
    constructor: (@x, @y, @isPenDown, @color) ->

module.exports.ExportedPen =
  class
    # (Number, Number, Boolean, String, String, Array[ExportedPoint], Number)
    constructor: (@color, @interval, @isPenDown, @mode, @name, @points, @x) ->

module.exports.ExportedPlot =
  class
    # ( String, Boolean, Boolean, Boolean, String, Array[ExportedPen]
    # , Number, Number, Number, Number)
    constructor: ( @currentPenNameOrNull, @isAutoPlotX, @isAutoPlotY, @isLegendOpen, @name, @pens
                 , @xMax, @xMin, @yMax, @yMin) ->

module.exports.ExportedPlotManager =
  class
    # (String, Array[ExportedPlot])
    constructor: (@currentPlotNameOrNull, @plots) ->

module.exports.BreedReference =
  class
    # (String)
    constructor: (@breedName) ->

class AgentReference
  # (String)
  constructor: (@referenceType) ->

module.exports.AgentReference = AgentReference

module.exports.LinkReference =
  class extends AgentReference
    # (BreedNamePair, Number, Number)
    constructor: (@breed, @id1, @id2) ->
      super("link")

module.exports.PatchReference =
  class extends AgentReference
    # (Number, Number)
    constructor: (@pxcor, @pycor) ->
      super("patch")

module.exports.TurtleReference =
  class extends AgentReference
    # (BreedNamePair, Number)
    constructor: (@breed, @id) ->
      super("turtle")

module.exports.NobodyReference = new AgentReference("nobody")

class ExportedAgent
  # (String)
  constructor: (@agentType) ->

module.exports.ExportedAgent = ExportedAgent

module.exports.ExportedLink =
  class extends ExportedAgent
    # ( TurtleReference, TurtleReference, ExportedColor, String, ExportedColor, Boolean
    # , BreedReference, Number, String, String, Object[Any])
    constructor: ( @end1, @end2, @color, @label, @labelColor, @isHidden
                 , @breed, @thickness, @shape, @tieMode, @breedsOwns) ->
      super("link")

module.exports.ExportedPatch =
  class extends ExportedAgent
    # (Number, Number, ExportedColor, String, ExportedColor, Object[Any])
    constructor: (@pxcor, @pycor, @pcolor, @plabel, @plabelColor, @patchesOwns) ->
      super("patch")

module.exports.ExportedTurtle =
  class extends ExportedAgent
    # ( Number, ExportedColor, Number, Number, Number, String, String, ExportedColor, BreedReference
    # , Boolean, Number, Number, String, Object[Any])
    constructor: ( @who, @color, @heading, @xcor, @ycor, @shape, @label, @labelColor, @breed
                 , @isHidden, @size, @penSize, @penMode, @breedsOwns) ->
      super("turtle")

class ExportedAgentSet
  # (String)
  constructor: (@agentSetType) ->

module.exports.ExportedAgentSet = ExportedAgentSet

module.exports.ExportedLinkSet =
  class extends ExportedAgentSet
    # (Array[LinkReference])
    constructor: (@references) ->
      super("linkset")

module.exports.ExportedPatchSet =
  class extends ExportedAgentSet
    # (Array[PatchReference])
    constructor: (@references) ->
      super("patchset")

module.exports.ExportedTurtleSet =
  class extends ExportedAgentSet
    # (Array[TurtleReference])
    constructor: (@references) ->
      super("turtleset")

class ExportedExtension
  # (String)
  constructor: (@extensionName) ->

module.exports.ExportedExtension = ExportedExtension

module.exports.ExportedSimpleExtension =
  class extends ExportedExtension
    # (String, Array[ExportedExtensionObject])
    constructor: (extensionName, @objects) ->
      super(extensionName)

module.exports.ExportedExtensionObject =
  class
    # (String, String, Any)
    constructor: (@extensionName, @subType, @data) ->

module.exports.Metadata =
  class
    # (String, String, Date)
    constructor: (@version, @filename, @date) ->

module.exports.ExportWorldData =
  class
    # ( Metadata, String, ExportedGlobals, Array[ExportedPatch], Array[ExportedTurtle]
    # , Array[ExportedLink], Maybe[(Number, String)], String, ExportedPlotManager, Array[ExportedExtension])
    constructor: ( @metadata, @randomState, @globals, @patches, @turtles
                 , @links, @drawingDataMaybe, @output, @plotManager, @extensions) ->

module.exports.ExportPlotData =
  class
    # (Metadata, Object[Any], ExportedPlot)
    constructor: (@metadata, @miniGlobals, @plot) ->

module.exports.ExportAllPlotsData =
  class
    # (Metadata, Object[Any], Array[Plot])
    constructor: (@metadata, @miniGlobals, @plots) ->
