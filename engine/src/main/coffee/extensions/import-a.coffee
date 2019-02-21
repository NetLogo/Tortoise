# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  init: (workspace) ->

    # (String) => Unit
    importDrawing = (base64) ->
      workspace.importExportPrims.importDrawingRaw(base64)

    # (String) => Unit
    importPColors = (base64) ->
      workspace.importExportPrims.importPColorsRaw(true)(base64)

    # (String) => Unit
    importPColorsRGB = (base64) ->
      workspace.importExportPrims.importPColorsRaw(false)(base64)

    # (String) => Unit
    importWorld = (text) ->
      workspace.importExportPrims.importWorldRaw(text)

    {
      name: "import-a"
    , prims: {
            "DRAWING": importDrawing
      ,     "PCOLORS": importPColors
      , "PCOLORS-RGB": importPColorsRGB
      ,       "WORLD": importWorld
      }
    }

}
