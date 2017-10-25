# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ImportExportConfig
    # (String -> Unit, Unit -> Unit) -> ImportExportConfig
    constructor: (@exportOutput = (->), @exportView = (->)) ->

module.exports.Prims =
  class ImportExportPrims
    # ImportExportConfig -> ImportExportPrims
    constructor: ({ @exportOutput, @exportView }) ->
