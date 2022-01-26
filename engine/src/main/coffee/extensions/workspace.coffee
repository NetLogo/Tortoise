# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>
    # () => Unit
    clearAll = () -> unbindAll()

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

    # () => String
    getPlatform = () ->
      if window?.TortugaSession?
        window.TortugaSession.Platform
      else
        "web"
        
    # (String, List | Map) -> Unit
    trigger = (name, data) ->
      if tortugaSession = getTortugaSession()
        if Array.IsArray(data) or data instanceof Map
          event = tortugaSession.EventRegistry.BuildEvent(11, null, name, data)
          tortugaSession.EventRegistry.HandleEvent(event)
        else
          throw new Error("Data has to be a list of key-value pairs, or a map")
      else
        workspace.printPrims.print("Trigger event #{type} #{name} with data #{workspace.dump(data, true)}")
      return

    # (Number | String, String, Bool, String | Function) -> Unit
    bind = (type, name, repeated, callback) ->
      if tortugaSession = getTortugaSession()
        if typeof(callback) is 'string' or typeof(callback) is 'function'
          handler = tortugaSession.EventRegistry.BuildHandler(type, null, name, repeated, callback)
          if handler is null
            throw new Error("Failed to build an event handler based on the input")
          tortugaSession.EventRegistry.UnregisterHandlers(handler.Category, null, name, true)
          tortugaSession.EventRegistry.RegisterHandler(handler)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Bind event #{type} #{name} with callback #{callback}, repeated = #{repeated}")
      return

    # (Number | String, String) -> Unit
    unbind = (type, name) ->
      if tortugaSession = getTortugaSession()
        category = tortugaSession.EventRegistry.ReifyCategory(type)
        if category?
          tortugaSession.EventRegistry.UnregisterHandlers(category, null, name, true)
        else
          throw new Error("The category input is invalid")
      else
        workspace.printPrims.print("Unbind event #{type} #{name}")
      return

    # () -> Unit
    unbindAll = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.EventRegistry.UnregisterUserHandlers()
      else
        workspace.printPrims.print("Unbind all event handlers")
      return

    # () => Unit
    clearCommands = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Print", Action: "Clear" })
      else
        workspace.printPrims.print("Clear Command Center")
      return

    # (String) => Unit
    executeCommand = (Command) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Print", Action: "Execute", Value: Command })
      else
        workspace.printPrims.print("Execute a command: " + Command)
      return

    {
      name: "workspace"
    , clearAll: clearAll
    , prims: {
                "PLAY": play
      ,        "PAUSE": pause
      ,         "SHOW": show
      ,         "HIDE": hide
      ,    "SET-SPEED": setSpeed
      , "GET-PLATFORM": getPlatform
    ,"EXECUTE-COMMAND": executeCommand
     ,"CLEAR-COMMANDS": clearCommands
      ,    "RECOMPILE": recompile
      ,      "TRIGGER": trigger
      ,         "BIND": bind
      ,       "UNBIND": unbind
      ,   "UNBIND-ALL": unbindAll
      }
    }
}
