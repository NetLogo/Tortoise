# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

LinkSet   = require('../linkset')
PatchSet  = require('../patchset')
TurtleSet = require('../turtleset')

{ Perspective: { perspectiveFromString } } = require('../observer')

{ BreedReference
, ExportedColorNum
, ExportedCommandLambda
, ExportedLinkSet
, ExportedPatchSet
, ExportedRGB
, ExportedRGBA
, ExportedReporterLambda
, ExportedTurtleSet
, LinkReference
, NobodyReference
, PatchReference
, TurtleReference
} = require('serialize/exportstructures')

{ fold } = require('brazier/maybe')

extensionsHandler = (extensionPorters) ->
  extensionReferences = new Map()
  inProgressMarker    = Object.freeze({ type: "reify-in-progress" })

  {
    canHandle: (x) ->
      applicablePorters = extensionPorters.filter( (p) -> p.canHandle(x) )
      if applicablePorters.length > 1
        throw new Error("Multiple extensions claim to know how to handle this object type: #{JSON.stringify(x)}")
      (applicablePorters.length is 1)

    reify: (x, helper) ->
      if not extensionReferences.has(x)
        porter = extensionPorters.filter( (p) -> p.canHandle(x) )[0]
        extensionReferences.set(x, inProgressMarker)
        extensionObject = porter.importState(x, helper)
        extensionReferences.set(x, extensionObject)
        extensionObject

      else
        extensionObject = extensionReferences.get(x)
        if extensionObject is inProgressMarker
          throw new Error("Circular references within extension objects are not supported.")
        extensionObject
  }

# ( (Number) => Agent
# , (Number, Number) => Agent
# , (Number, Number, String) => Agent
# , () => PatchSet
# , () => Breed
# , World
# ) => (Any) => Any
reifyExported = (getTurtle, getPatch, getLink, getAllPatches, getBreed, world, extensionPorters) ->

  extensions = extensionsHandler(extensionPorters)

  helper = (x) ->
    type = NLType(x)
    if type.isList()
      x.map(helper)
    else if type.isBoolean() or type.isNumber() or type.isString()
      x
    else if x is NobodyReference
      Nobody
    else if x instanceof BreedReference
      switch x.breedName
        when "PATCHES" then getAllPatches()
        else                getBreed(x.breedName)
    else if x instanceof LinkReference
      getLink(x.id1, x.id2, x.breed.plural)
    else if x instanceof PatchReference
      getPatch(x.pxcor, x.pycor)
    else if x instanceof TurtleReference
      getTurtle(x.id)
    else if x instanceof ExportedLinkSet
      links = x.references.map(({ id1, id2, breed: { plural } }) -> getLink(id1, id2, plural))
      new LinkSet(links, world)
    else if x instanceof ExportedPatchSet
      patches = x.references.map(({ pxcor, pycor }) -> getPatch(pxcor, pycor))
      new PatchSet(patches, world)
    else if x instanceof ExportedTurtleSet
      turtles = x.references.map(({ id }) -> getTurtle(id))
      new TurtleSet(turtles, world)
    else if x instanceof ExportedCommandLambda
      fn = (-> throw new Error("Importing and then running lambdas is not supported!"))
      fn.isReporter = false
      fn.nlogoBody  = x.source
      fn
    else if x instanceof ExportedReporterLambda
      fn = (-> throw new Error("Importing and then running lambdas is not supported!"))
      fn.isReporter = true
      fn.nlogoBody  = x.source
      fn
    else if extensions.canHandle(x)
      extensions.reify(x, helper)
    else
      throw new Error("Unknown item for reification: #{JSON.stringify(x)}")

# (WorldState) => Unit
module.exports.importWorld = (
    {
      globals: {
        linkDirectedness: directedLinks
      , maxPxcor
      , maxPycor
      , minPxcor
      , minPycor
      , nextWhoNumber
      , perspective
      , subject
      , ticks
      , codeGlobals
      }
    , links
    , patches
    , plotManager
    , randomState
    , turtles
    , patchSize
    , drawingDataMaybe
    , output
    }
  , extensionPorters
  ) ->

    reify =
      reifyExported(
        @turtleManager.getTurtle.bind(@turtleManager)
      , @getPatchAt.bind(this)
      , @linkManager.getLink.bind(@linkManager)
      , @patches.bind(this)
      , @breedManager.get.bind(@breedManager)
      , this
      , @extensionPorters
      )

    @clearAll()

    if directedLinks is "DIRECTED"
      @_setUnbreededLinksDirected()
    else
      @_setUnbreededLinksUndirected()

    @_resizeHelper(minPxcor, maxPxcor, minPycor, maxPycor, @topology._wrapInX, @topology._wrapInY)

    extractColor = (color) ->
      if color instanceof ExportedColorNum
        color.value
      else if color instanceof ExportedRGB
        [color.r, color.g, color.b]
      else if color instanceof ExportedRGBA
        [color.r, color.g, color.b, color.a]
      else
        throw new Error("Unknown color: #{JSON.stringify(color)}")

    patchFinishFs =
      patches.map(
        ({ pxcor, pycor, pcolor, plabel, plabelColor, patchesOwns }) =>
          patch = @patchAtCoords(pxcor, pycor)
          patch.setVariable('pcolor'      , extractColor(pcolor     ))
          patch.setVariable('plabel-color', extractColor(plabelColor))
          (->
            patch.setVariable('plabel', reify(plabel))
            for varName, value of patchesOwns when varName in patch.varNames()
              patch.setVariable(varName, reify(value))
          )
      )

    turtleFinishFs =
      turtles.map(
        ({ who, color, heading, xcor, ycor, shape, label, labelColor, breed: { breedName }, isHidden, size, penSize, penMode, breedsOwns }) =>

          realBreed = @breedManager.get(breedName) ? @breedManager.turtles()
          args      = [who, extractColor(color), heading, xcor, ycor, realBreed, "", extractColor(labelColor), isHidden, size, shape]
          newTurtle = @turtleManager._createTurtle(args...)
          newTurtle.penManager.setPenMode(penMode)
          newTurtle.penManager.setSize(penSize)

          (->
            newTurtle.setVariable('label', reify(label))
            for varName, value of breedsOwns when varName in newTurtle.varNames()
              newTurtle.setVariable(varName, reify(value))
          )

      )

    @turtleManager._idManager.setCount(nextWhoNumber)

    linkFinishFs =
      links.map(
        ({ breed: { breedName }, end1, end2, color, isHidden, label, labelColor, shape, thickness, tieMode, breedsOwns }) =>

          realEnd1  = @turtleManager.getTurtleOfBreed(end1.breed.plural, end1.id)
          realEnd2  = @turtleManager.getTurtleOfBreed(end2.breed.plural, end2.id)
          realBreed = @breedManager.get(breedName) ? @breedManager.links()

          newLink = @linkManager._createLink(realBreed.isDirected(), realEnd1, realEnd2, realBreed.name)
          newLink.setVariable(      'color', extractColor(color))
          newLink.setVariable(    'hidden?', isHidden)
          newLink.setVariable('label-color', extractColor(labelColor))
          newLink.setVariable(      'shape', shape)
          newLink.setVariable(  'thickness', thickness)
          newLink.setVariable(   'tie-mode', tieMode)

          (->
            newLink.setVariable('label', reify(label))
            for varName, value of breedsOwns when varName in newLink.varNames()
              newLink.setVariable(varName, reify(value))
          )

      )

    # Reification time!  This might seem a bit unintuitive, but, e.g. labels can be agents, link ends
    # are agents, and `*-owns` vars can be agents.  So we need to import all the agents before we can
    # finish importing them.  I'm calling this "second pass" stage the "reification stage", which is
    # when we revisit the things that we couldn't safely import earlier. --JAB (12/14/17)

    [].concat(patchFinishFs, turtleFinishFs, linkFinishFs).forEach((f) -> f())

    for varName, value of codeGlobals when varName in @observer.varNames()
      @observer.setGlobal(varName, reify(value))

    trueSubject = reify(subject)
    if trueSubject isnt Nobody
      @observer.setPerspective(perspectiveFromString(perspective), trueSubject)

    # Reification done. --JAB (12/14/17)

    @_plotManager.importState(plotManager)
    @ticker.importTicks(ticks)
    @rng.importState(randomState)

    fold(->)(
      ([patchSize, drawing]) =>
        @setPatchSize(patchSize)
        @importDrawing(drawing)
    )(drawingDataMaybe)

    if output?
      @_setOutput(output)

    return
