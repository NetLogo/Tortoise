# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

    # (String, Boolean*, Any*) => Unit
    showDialog = (name, minimized) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.ShowDialog(name, minimized)
      return

    # (String) => Unit
    minimizeDialog = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Dialog", Action: "Minimize", Target: name })
      return

    {
      name: "tutorial"
    , prims: {
        "SHOW-DIALOG": showDialog
      , "MINIMIZE-DIALOG": minimizeDialog
      }
    }
}
