# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  init: (workspace) ->

    # () => String
    exportModel = ->
      workspace.importExportPrims.exportNlogoRaw()

    # () => String
    exportOutput = ->
      workspace.importExportPrims.exportOutputRaw()

    # (String) => String
    exportPlot = (plotName) ->
      workspace.importExportPrims.exportPlotRaw(plotName)

    # () => String
    exportView = ->
      workspace.importExportPrims.exportViewRaw()

    # () => String
    exportWorld = ->
      workspace.importExportPrims.exportWorldRaw()

    {
      name: "export-the"
    , prims: {
         "MODEL": exportModel
      , "OUTPUT": exportOutput
      ,   "PLOT": exportPlot
      ,   "VIEW": exportView
      ,  "WORLD": exportWorld
      }
    }

}
