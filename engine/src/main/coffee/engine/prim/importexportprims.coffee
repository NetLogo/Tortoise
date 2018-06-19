# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ImportExportConfig
    constructor: ( @exportAllPlots = (-> ->) # (String) => (() => String) => Unit
                 , @exportFile     = (-> ->) # (String) => (String) => Unit
                 , @exportOutput   = (->)    # (String) => Unit
                 , @exportPlot     = (-> ->) # (String) => (String) => Unit
                 , @exportView     = (->)    # (String) => Unit
                 , @exportWorld    = (-> ->) # (String) => (() => String) => Unit
                 , @importDrawing  = (-> ->) # (String) => (() => Unit) => Unit
                 , @importWorld    = (-> ->) # (String) => ((String) => Unit) => Unit
                 ) ->

module.exports.Prims =
  class ImportExportPrims
    # (ImportExportConfig, () => String, () => String, (String) => String, (String) => Unit, (String) => Unit) => ImportExportPrims
    constructor: ({ exportAllPlots, exportFile, @exportOutput, exportPlot, @exportView, exportWorld, importDrawing, importWorld }
                  , trueExportWorld, trueExportAllPlots, trueExportPlot, trueImportDrawing, trueImportWorld) ->
      @exportWorld    = (filename)       -> exportFile(trueExportWorld()   )(filename)
      @exportAllPlots = (filename)       -> exportFile(trueExportAllPlots())(filename)
      @exportPlot     = (plot, filename) -> exportFile(trueExportPlot(plot))(filename)
      @importDrawing  = (filename)       -> importDrawing(trueImportDrawing)(filename)
      @importWorld    = (filename)       -> importWorld(trueImportWorld    )(filename)
