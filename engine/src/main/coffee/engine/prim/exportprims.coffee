# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ExportConfig
    # (String -> Unit, Unit -> Unit) -> ExportConfig
    constructor: (@exportOutput = (->), @exportView = (->)) ->

module.exports.Prims =
  class ExportPrims
    # ExportConfig -> ExportPrims
    constructor: ({ @exportOutput, @exportView }) ->
