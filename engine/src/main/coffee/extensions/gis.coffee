# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

# (String) => (() => Unit)
notImplemented = (name) ->
  -> throw exceptions.extension("gis:#{name} is not yet implemented")

# (String, String) => (() => Unit)
notSupportedOnWeb = (name, replacement) ->
  -> throw exceptions.extension("gis:#{name} is not supported by NetLogo Web. Use gis:#{replacement} instead.")

# Dumps match desktop's `{{gis:TypeName <contents>}}` format, which the generic
# SingleObjectExtensionPorter cannot produce; export-world support is not implemented.
class GISPorter
  extensionName: "gis"

  # (Any) => Boolean
  canHandle: (x) -> x?.gisType?

  # (Any) => String
  dump: (x) -> "{{gis:#{x.gisType} #{x.dumpContents()}}}"

  exportObject: -> throw exceptions.extension("Exporting gis objects is not supported by NetLogo Web")
  export:       -> throw exceptions.extension("Exporting gis objects is not supported by NetLogo Web")
  formatObject: -> throw exceptions.extension("Exporting gis objects is not supported by NetLogo Web")
  format:       -> throw exceptions.extension("Exporting gis objects is not supported by NetLogo Web")
  readObject:   -> throw exceptions.extension("Importing gis objects is not supported by NetLogo Web")
  readObjects:  -> throw exceptions.extension("Importing gis objects is not supported by NetLogo Web")

module.exports = {

  porter: new GISPorter()

  # (Workspace) => Extension
  init: (workspace) ->

    core       = require('extensions/gis-core')(workspace)
    projection = require('extensions/gis-projection')({ core, workspace })
    vector     = require('extensions/gis-vector')({ core, workspace })
    raster     = require('extensions/gis-raster')({ core, workspace })
    io         = require('extensions/gis-io')({ core, projection, vector, raster, workspace })
    agents     = require('extensions/gis-agents')({ core, vector, raster, workspace })
    draw       = require('extensions/gis-draw')({ core, raster, workspace })

    {
      name: "gis"
    , prims: {
        "SET-TRANSFORMATION":                   core.prims["SET-TRANSFORMATION"]
      , "SET-TRANSFORMATION-DS":                core.prims["SET-TRANSFORMATION-DS"]
      , "SET-WORLD-ENVELOPE":                   core.prims["SET-WORLD-ENVELOPE"]
      , "SET-WORLD-ENVELOPE-DS":                core.prims["SET-WORLD-ENVELOPE-DS"]
      , "WORLD-ENVELOPE":                       core.prims["WORLD-ENVELOPE"]
      , "ENVELOPE-OF":                          core.prims["ENVELOPE-OF"]
      , "ENVELOPE-UNION-OF":                    core.prims["ENVELOPE-UNION-OF"]
      , "LOAD-COORDINATE-SYSTEM":               notSupportedOnWeb("load-coordinate-system", "set-coordinate-system")
      , "SET-COORDINATE-SYSTEM":                projection.prims["SET-COORDINATE-SYSTEM"]
      , "PROJECT-LAT-LON":                      projection.prims["PROJECT-LAT-LON"]
      , "PROJECT-LAT-LON-FROM-ELLIPSOID":       projection.prims["PROJECT-LAT-LON-FROM-ELLIPSOID"]
      , "LOAD-DATASET":                         notSupportedOnWeb("load-dataset", "load-dataset-from-string")
      , "LOAD-DATASET-FROM-STRING":             io.prims["LOAD-DATASET-FROM-STRING"]
      , "STORE-DATASET":                        notSupportedOnWeb("store-dataset", "store-dataset-to-string")
      , "STORE-DATASET-TO-STRING":              io.prims["STORE-DATASET-TO-STRING"]
      , "STORE-DATASET-TO-STRINGS":             io.prims["STORE-DATASET-TO-STRINGS"]
      , "TYPE-OF":                              vector.prims["TYPE-OF"]
      , "PATCH-DATASET":                        agents.prims["PATCH-DATASET"]
      , "TURTLE-DATASET":                       agents.prims["TURTLE-DATASET"]
      , "LINK-DATASET":                         agents.prims["LINK-DATASET"]
      , "CREATE-TURTLES-FROM-POINTS":           agents.prims["CREATE-TURTLES-FROM-POINTS"]
      , "CREATE-TURTLES-FROM-POINTS-MANUAL":    agents.prims["CREATE-TURTLES-FROM-POINTS-MANUAL"]
      , "CREATE-TURTLES-INSIDE-POLYGON":        agents.prims["CREATE-TURTLES-INSIDE-POLYGON"]
      , "CREATE-TURTLES-INSIDE-POLYGON-MANUAL": agents.prims["CREATE-TURTLES-INSIDE-POLYGON-MANUAL"]
      , "SHAPE-TYPE-OF":                        vector.prims["SHAPE-TYPE-OF"]
      , "PROPERTY-NAMES":                       vector.prims["PROPERTY-NAMES"]
      , "FEATURE-LIST-OF":                      vector.prims["FEATURE-LIST-OF"]
      , "VERTEX-LISTS-OF":                      vector.prims["VERTEX-LISTS-OF"]
      , "CENTROID-OF":                          vector.prims["CENTROID-OF"]
      , "RANDOM-POINT-INSIDE":                  vector.prims["RANDOM-POINT-INSIDE"]
      , "LOCATION-OF":                          vector.prims["LOCATION-OF"]
      , "PROPERTY-VALUE":                       vector.prims["PROPERTY-VALUE"]
      , "SET-PROPERTY-VALUE":                   vector.prims["SET-PROPERTY-VALUE"]
      , "FIND-FEATURES":                        vector.prims["FIND-FEATURES"]
      , "FIND-ONE-FEATURE":                     vector.prims["FIND-ONE-FEATURE"]
      , "FIND-LESS-THAN":                       vector.prims["FIND-LESS-THAN"]
      , "FIND-GREATER-THAN":                    vector.prims["FIND-GREATER-THAN"]
      , "FIND-RANGE":                           vector.prims["FIND-RANGE"]
      , "PROPERTY-MINIMUM":                     vector.prims["PROPERTY-MINIMUM"]
      , "PROPERTY-MAXIMUM":                     vector.prims["PROPERTY-MAXIMUM"]
      , "APPLY-COVERAGE":                       agents.prims["APPLY-COVERAGE"]
      , "APPLY-COVERAGES":                      agents.prims["APPLY-COVERAGES"]
      , "COVERAGE-MINIMUM-THRESHOLD":           core.prims["COVERAGE-MINIMUM-THRESHOLD"]
      , "SET-COVERAGE-MINIMUM-THRESHOLD":       core.prims["SET-COVERAGE-MINIMUM-THRESHOLD"]
      , "COVERAGE-MAXIMUM-THRESHOLD":           core.prims["COVERAGE-MAXIMUM-THRESHOLD"]
      , "SET-COVERAGE-MAXIMUM-THRESHOLD":       core.prims["SET-COVERAGE-MAXIMUM-THRESHOLD"]
      , "INTERSECTS?":                          vector.prims["INTERSECTS?"]
      , "CONTAINS?":                            vector.prims["CONTAINS?"]
      , "CONTAINED-BY?":                        vector.prims["CONTAINED-BY?"]
      , "HAVE-RELATIONSHIP?":                   vector.prims["HAVE-RELATIONSHIP?"]
      , "RELATIONSHIP-OF":                      vector.prims["RELATIONSHIP-OF"]
      , "INTERSECTING":                         vector.prims["INTERSECTING"]
      , "WIDTH-OF":                             raster.prims["WIDTH-OF"]
      , "HEIGHT-OF":                            raster.prims["HEIGHT-OF"]
      , "RASTER-VALUE":                         raster.prims["RASTER-VALUE"]
      , "SET-RASTER-VALUE":                     raster.prims["SET-RASTER-VALUE"]
      , "MINIMUM-OF":                           raster.prims["MINIMUM-OF"]
      , "MAXIMUM-OF":                           raster.prims["MAXIMUM-OF"]
      , "SAMPLING-METHOD-OF":                   raster.prims["SAMPLING-METHOD-OF"]
      , "SET-SAMPLING-METHOD":                  raster.prims["SET-SAMPLING-METHOD"]
      , "RASTER-SAMPLE":                        raster.prims["RASTER-SAMPLE"]
      , "RASTER-WORLD-ENVELOPE":                raster.prims["RASTER-WORLD-ENVELOPE"]
      , "CREATE-RASTER":                        raster.prims["CREATE-RASTER"]
      , "RESAMPLE":                             raster.prims["RESAMPLE"]
      , "CONVOLVE":                             raster.prims["CONVOLVE"]
      , "APPLY-RASTER":                         agents.prims["APPLY-RASTER"]
      , "DRAWING-COLOR":                        core.prims["DRAWING-COLOR"]
      , "SET-DRAWING-COLOR":                    core.prims["SET-DRAWING-COLOR"]
      , "DRAW":                                 draw.prims["DRAW"]
      , "FILL":                                 draw.prims["FILL"]
      , "PAINT":                                draw.prims["PAINT"]
      , "IMPORT-WMS-DRAWING":                   notImplemented("import-wms-drawing")
      }
    }

}
