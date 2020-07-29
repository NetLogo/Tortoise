# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {
  init: (workspace) ->

    showDialog = (name, minimized) ->
      return

    minimizeDialog = (name) ->
      return

    {
      name: "tutorial"
    , prims: {
        "SHOW-DIALOG": showDialog
      , "MINIMIZE-DIALOG": minimizeDialog
      }
    }
}
