define(['engine/core/topology/box', 'engine/core/topology/horizcylinder', 'engine/core/topology/torus'
      , 'engine/core/topology/vertcylinder']
    ,  ( Box,                        HorizCylinder,                        Torus
      ,  VertCylinder) ->

    # (Boolean, Boolean, Number, Number, Number, Number, () => PatchSet, (Number, Number) => Patch) => Topology
    (wrapsInX, wrapsInY, minX, maxX, minY, maxY, getPatchesFunc, getPatchAtFunc) ->
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

)
