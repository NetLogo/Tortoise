# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {
  init: (workspace) =>

    # (String, Boolean*, Any*) => Unit
    showDialog = (name, minimized) ->
      if window?.TortugaSession?
        window.TortugaSession.Instance.showDialog(name, minimized)
      else
        throw new Error("Show Dialog #{name}, minimized: #{minimized}")
      return

    # (String) => Unit
    minimizeDialog = (name) ->
      if window?.TortugaSession?
        window.TortugaSession.Instance.RecordDialog(name, "Minimize")
      else
        throw new Error("Minimize Dialog #{name}")
      return

    {
      name: "tutorial"
    , prims: {
        "SHOW-DIALOG": showDialog
      , "MINIMIZE-DIALOG": minimizeDialog
      }
    }
}
