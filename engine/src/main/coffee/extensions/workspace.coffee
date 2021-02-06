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
      else
        workspace.printPrims.print("Control Play")
      return

    # () => Unit
    pause = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Pause" })
      else
        workspace.printPrims.print("Control Pause")
      return

    # () => Unit
    show = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Show", Value: name })
      else
        workspace.printPrims.print("Layout Show")
      return

    # () => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Hide", Value: name })
      else
        workspace.printPrims.print("Layout Hide")
      return

    # (Number) => Unit
    setSpeed = (speed) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "SetSpeed", Value: speed })
      else
        workspace.printPrims.print("Control SetSpeed")
      return

    # () => Unit
    recompile = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Recompile" })
      else
        workspace.printPrims.print("Recompile Code")
      return

    # () => Unit
    recompileNT = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Recompile-NT" })
      else
        workspace.printPrims.print("Recompile NetTango")
      return

    # () => Unit
    clearCommands = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "CommandCenter", Action: "Clear" })
      else
        workspace.printPrims.print("Clear Command Center")
      return

    # (String) => Unit
    executeCommand = (Command) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "CommandCenter", Action: "Execute", Value: Command })
      else
        workspace.printPrims.print("Execute a command: " + Command)
      return

    {
      name: "workspace"
    , prims: {
                "PLAY": play
      ,        "PAUSE": pause
      ,         "SHOW": show
      ,         "HIDE": hide
      ,    "SET-SPEED": setSpeed
    ,"EXECUTE-COMMAND": executeCommand
     ,"CLEAR-COMMANDS": clearCommands
      ,    "RECOMPILE": recompile
      , "RECOMPILE-NT": recompileNT
      }
    }
}
