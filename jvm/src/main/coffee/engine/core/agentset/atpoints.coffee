# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Eventually, all of the error-checking crap should move to the "middle layer" of the engine,
# and then this awful dependency on `Dumper` can go away.  --JAB (1/7/16)
Dumper = require('../../dump')
Nobody = require('../nobody')
NLType = require('../typechecker')

{ filter, flatMap, map, unique } = require('brazierjs/array')
{ pipeline }                     = require('brazierjs/function')

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
  pipeline(map(f), filter((x) -> x isnt Nobody))(points)

# (() => Agent, (Number, Number) => Patch) => (Array[Any]) => AbstractAgentSet[T]
module.exports =
  (getSelf, getPatchAt) -> (points) ->

    filterContaining = filter((x) => @contains(x))

    breedName = @getSpecialName()

    patchAt = genPatchGrabber(getSelf(), getPatchAt)
    patches = getPatchesAtPoints(patchAt, points)

    newAgents =
      if NLType(this).isPatchSet()
        if breedName is "patches"
          patches
        else
          filterContaining(patches)
      else if NLType(this).isTurtleSet()
        turtlesOnPatches = pipeline(flatMap((p) -> p.turtlesHere().toArray()), unique)(patches)
        if breedName is "turtles"
          turtlesOnPatches
        else if breedName? # Breed set
          upperBreedName = breedName.toUpperCase()
          filter((x) -> upperBreedName is x.getBreedName())(turtlesOnPatches)
        else
          filterContaining(turtlesOnPatches)
      else
        []

    copyThatFloppy = (x) => @copyWithNewAgents.call(this, x)

    pipeline(unique, copyThatFloppy)(newAgents)
