# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../typechecker')

{ filter, flatMap, map, unique } = require('brazierjs/array')
{ pipeline }                     = require('brazierjs/function')

# In this file: `this.type` is `AbstractAgentSet[T]`

# (SelfType, (Number, Number) => Patch) => (Number, Number) => Patch
genPatchGrabber = (self, worldPatchAt) ->
  if self is 0
    worldPatchAt
  else if checks.isTurtle(self) or checks.isPatch(self)
    self.patchAt
  else
    (-> Nobody)

# ((Any) => String, (Number, Number) => Patch, Array[(Number, Number)]) => Array[Patch]
getPatchesAtPoints = (dump, patchAt, points) ->
  f =
    (point) ->
      if checks.isList(point) and point.length is 2 and checks.isNumber(point[0]) and checks.isNumber(point[1])
        patchAt(point...)
      else
        throw new Error("Invalid list of points: #{dump(points)}")
  pipeline(map(f), filter((x) -> x isnt Nobody))(points)

# ((Any) => String, () => Agent, (Number, Number) => Patch) => (Array[Any]) => AbstractAgentSet[T]
module.exports =
  (dump, getSelf, getPatchAt) -> (points) ->

    filterContaining = filter((x) => @contains(x))

    breedName = @getSpecialName()

    patchAt = genPatchGrabber(getSelf(), getPatchAt)
    patches = getPatchesAtPoints(dump, patchAt, points)

    newAgents =
      if checks.isPatchSet(this)
        if breedName is "patches"
          patches
        else
          filterContaining(patches)
      else if checks.isTurtleSet(this)
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
