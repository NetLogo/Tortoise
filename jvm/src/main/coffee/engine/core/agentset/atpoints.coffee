# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Eventually, all of the error-checking crap should move to the "middle layer" of the engine,
# and then this awful dependency on `Dumper` can go away.  --JAB (1/7/16)
_      = require('lodash')
Dumper = require('../../dump')
Nobody = require('../nobody')
NLType = require('../typechecker')

# In this file: `this.type` is `AbstractAgentSet[T]`

# (SelfType, (Number, Number) => Patch) => (Number, Number) => Patch
genPatchGrabber = (self, worldPatchAt) ->
  if self is 0
    worldPatchAt
  else if NLType(self).isTurtle() or NLType(self).isPatch()
    self.patchAt
  else
    (-> Nobody)

# ((Number, Number) => Patch, Array[(Number, Number)]) => Array[Patch]
getPatchesAtPoints = (patchAt, points) ->
  f =
    (point) ->
      if NLType(point).isList() and point.length is 2 and NLType(point[0]).isNumber() and NLType(point[1]).isNumber()
        patchAt(point...)
      else
        throw new Error("Invalid list of points: #{Dumper(points)}")
  _(points).map(f).reject((x) -> x is Nobody).value()

# (Array[Any]) => AbstractAgentSet[T]
module.exports =
  (points) ->

    contains = (x) => @contains(x)

    breedName = @getSpecialName()

    patchAt = genPatchGrabber(@_lazyGetSelfManager().self(), window.world.getPatchAt) # NO!
    patches = getPatchesAtPoints(patchAt, points)

    newAgents =
      if NLType(this).isPatchSet()
        if breedName is "patches"
          _(patches)
        else
          _(patches).filter(contains)
      else if NLType(this).isTurtleSet()
        turtlesOnPatches = _(patches).map((p) -> p.turtlesHere().toArray()).flatten().uniq()
        if breedName is "turtles"
          turtlesOnPatches
        else if breedName? # Breed set
          upperBreedName = breedName.toUpperCase()
          turtlesOnPatches.filter((x) -> upperBreedName is x.getBreedName())
        else
          turtlesOnPatches.filter(contains)
      else
        []

    @copyWithNewAgents(newAgents.uniq().value())
