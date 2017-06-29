# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class ImportConfig
    # (String -> Unit) -> ImportConfig
    constructor: (@importDrawing = (->)) ->

module.exports.Prims =
  class ImportPrims
    # ImportConfig -> ImportPrims
    constructor: ({ @importDrawing }) ->
