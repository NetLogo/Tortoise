# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

    # () => Unit
    play = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Play" })
      return

    # () => Unit
    pause = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Pause" })
      return
      
    # () => Unit
    show = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Show", Value: name })
      return

    # () => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Hide", Value: name })
      return

    # (Number) => Unit
    setSpeed = (speed) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "SetSpeed", Value: speed })
      return
      
    # () => Unit
    recompile = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Recompile" })
      return

    # () => Unit
    recompileNT = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Recompile-NT" })
      return

    {
      name: "workspace"
    , prims: {
        "PLAY": play
      , "PAUSE": pause
      , "SHOW": show
      , "HIDE": hide
      , "SET-SPEED": setSpeed
      , "RECOMPILE": recompile
      , "RECOMPILE-NT": recompileNT
      }
    }
}
