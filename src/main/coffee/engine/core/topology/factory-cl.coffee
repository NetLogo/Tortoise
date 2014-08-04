goog.provide('engine.core.topology.factory')

goog.require('engine.core.topology.box')
goog.require('engine.core.topology.horizcylinder')
goog.require('engine.core.topology.torus')
goog.require('engine.core.topology.vertcylinder')

# (Boolean, Boolean, Number, Number, Number, Number
engine.core.topology.factory = topologyFactory = (wrapsInX, wrapsInY, minX, maxX, minY, maxY, getPatchesFunc, getPatchAtFunc) ->
  TopoClass =
    if wrapsInX and wrapsInY
      Torus
    else if wrapsInX
      VertCylinder
    else if wrapsInY
      HorizCylinder
    else
      Box
  new TopoClass(minX, maxX, minY, maxY, getPatchesFunc, getPatchAtFunc)

