# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  init: (workspace) ->

    # (String, String) => Unit
    file = (fileName, content) ->
      workspace.importExportPrims.exportFile(content)(fileName)
      return

    {
      name: "send-to"
    , prims: {
        "FILE": file
      }
    }
}
