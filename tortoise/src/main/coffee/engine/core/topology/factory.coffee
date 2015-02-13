# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Box           = require('./box')
HorizCylinder = require('./horizcylinder')
Torus         = require('./torus')
VertCylinder  = require('./vertcylinder')

# (Boolean, Boolean, Number, Number, Number, Number, () => PatchSet, (Number, Number) => Patch, () => Number) => Topology
module.exports =
    (wrapsInX, wrapsInY, minX, maxX, minY, maxY, getPatchesFunc, getPatchAtFunc, nextDouble) ->
      TopoClass =
        if wrapsInX and wrapsInY
          Torus
        else if wrapsInX
          VertCylinder
        else if wrapsInY
          HorizCylinder
        else
          Box
      new TopoClass(minX, maxX, minY, maxY, getPatchesFunc, getPatchAtFunc, nextDouble)
