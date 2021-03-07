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
        workspace.printPrims.print("Resume the simulation")
      return

    # () => Unit
    pause = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Pause" })
      else
        workspace.printPrims.print("Pause the simulation")
      return

    # (String) => Unit
    show = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Show", Value: name })
      else
        workspace.printPrims.print("Show UI component #{name}")
      return

    # (String) => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Layout", Action: "Hide", Value: name })
      else
        workspace.printPrims.print("Hide UI component #{name}")
      return

    # (Number) => Unit
    setSpeed = (speed) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "SetSpeed", Value: speed })
      else
        workspace.printPrims.print("Set speed to #{speed}")
      return

    # () => Unit
    recompile = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Control", Action: "Recompile" })
      else
        workspace.printPrims.print("Recompile NetLogo code")
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
      }
    }
}
