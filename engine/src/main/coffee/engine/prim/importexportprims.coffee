# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ImportExportConfig
    constructor: ( @exportAllPlots = (-> ->) # (() => String)     => (String) => Unit
                 , @exportFile     = (-> ->) # (String)           => (String) => Unit
                 , @exportOutput   = (->)    #                       (String) => Unit
                 , @exportPlot     = (-> ->) # (String)           => (String) => Unit
                 , @exportView     = (->)    #                       (String) => Unit
                 , @exportWorld    = (-> ->) # (() => String)     => (String) => Unit
                 , @importDrawing  = (-> ->) # (String) => ((String) => Unit) => Unit
                 , @importFile     = (-> ->) # (String) => ((String) => Unit) => Unit
                 , @getViewBase64  = (-> "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/AD/6KKKAP//Z") # () => String
                 ) ->

module.exports.Prims =
  class ImportExportPrims
    # (ImportExportConfig, () => String, () => String, (String) => String, (String) => Unit, (Boolean) => (String) => Unit, (String) => Unit) => ImportExportPrims
    constructor: ({ exportAllPlots, exportFile, @exportOutput, exportPlot, @exportView, exportWorld, importDrawing, importFile }
                  , @exportWorldRaw, @exportAllPlotsRaw, @exportPlotRaw, @importDrawingRaw, @importPColorsRaw, @importWorldRaw) ->
      @exportWorld      = (filename)       -> exportFile(@exportWorldRaw()   )(filename)
      @exportAllPlots   = (filename)       -> exportFile(@exportAllPlotsRaw())(filename)
      @exportPlot       = (plot, filename) -> exportFile(@exportPlotRaw(plot))(filename)
      @importDrawing    = (filename)       -> importDrawing(filename)(@importDrawingRaw)
      @importPColors    = (filename)       -> importFile(filename)(@importPColorsRaw(true) )
      @importPColorsRGB = (filename)       -> importFile(filename)(@importPColorsRaw(false))
      @importWorld      = (filename)       -> importFile(filename)(@importWorldRaw)
