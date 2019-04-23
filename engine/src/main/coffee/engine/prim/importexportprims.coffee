# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ map }        = require('brazier/array')
{ pipeline }   = require('brazier/function')
{ rangeUntil } = require('brazier/number')

module.exports.Config =
  class ImportExportConfig
    constructor: ( @exportFile    = (-> ->) # (String) => (String) => Unit
                 , @exportBlob    = (-> ->) # (Blob) => (String) => Unit
                 , @getNlogo      = (-> "") # () => String
                 , @getOutput     = (-> "") # () => String
                 , @getViewBase64 = (-> "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD/AD/6KKKAP//Z") # () => String
                 , @getViewBlob   = (->) # ((Blob) => Unit) => Unit
                 , @importFile    = (-> ->) # (String) => ((String) => Unit) => Unit
                 ) ->

module.exports.Prims =
  class ImportExportPrims
    # (ImportExportConfig, () => String, () => String, (String) => String, (String) => Unit, (Boolean) => (String) => Unit, (String) => Unit) => ImportExportPrims
    constructor: ({ exportFile: @exportFile, exportBlob: @exportBlob, getNlogo: @exportNlogoRaw, getOutput: @exportOutputRaw, getViewBase64: @exportViewRaw, getViewBlob: @exportViewBlob, importFile }
                  , @exportWorldRaw, @exportAllPlotsRaw, @exportPlotRaw, @importDrawingRaw, @importPColorsRaw, @importWorldRaw) ->
      @exportAllPlots   = (filename)       => @exportFile(@exportAllPlotsRaw())(filename)
      @exportOutput     = (filename)       => @exportFile(@exportOutputRaw()  )(filename)
      @exportPlot       = (plot, filename) => @exportFile(@exportPlotRaw(plot))(filename)
      @exportView       = (filename)       => @exportViewBlob((blob) => @exportBlob(blob)(filename))
      @exportWorld      = (filename)       => @exportFile(@exportWorldRaw()   )(filename)
      @importDrawing    = (filename)       => importFile(filename)(@importDrawingRaw)
      @importPColors    = (filename)       => importFile(filename)(@importPColorsRaw(true) )
      @importPColorsRGB = (filename)       => importFile(filename)(@importPColorsRaw(false))
      @importWorld      = (filename)       => importFile(filename)(@importWorldRaw)
