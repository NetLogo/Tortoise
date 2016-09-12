# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ExportConfig
    # (String -> Unit) -> ExportConfig
    constructor: (@exportOutput = (->)) ->

module.exports.Prims =
  class ExportPrims
    # ExportConfig -> ExportPrims
    constructor: ({ @exportOutput }) ->
