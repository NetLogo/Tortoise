# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>
    # () -> Unit
    clearAll = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.EventRegistry.UnregisterUserHandlers()
      return

    # (String) => Unit
    show = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "Show", Target: name }
        )
      else
        workspace.printPrims.print("Show and activate the plot #{name}")
      return

    # (String) => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "Hide", Target: name }
        )
      else
        workspace.printPrims.print("Hide and deactivate the plot #{name}")
      return

    # (String) => Unit
    activate = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "Activate", Target: name }
        )
      else
        workspace.printPrims.print("Activate the plot #{name}")
      return

    # (String, Number) => Unit
    move = (name, index) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "Move", Target: name, Value: index }
        )
      else
        workspace.printPrims.print("Move the plot #{name} to the place #{index} in its group")
      return

    # (String, String) => Unit
    setTitle = (name, title) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "SetTitle", Target: name, Value: title }
        )
      else
        workspace.printPrims.print("Set plot #{name} with title #{title}")
      return

    # (Number, String, Bool, String | Function) -> Unit
    bind = (source, name, repeated, callback) ->
      if tortugaSession = getTortugaSession()
        if typeof(callback) is 'string' or typeof(callback) is 'function'
          handler = tortugaSession.EventRegistry.BuildHandler(3, source, name, repeated, callback)
          tortugaSession.EventRegistry.UnregisterHandlers(3, source, name, true)
          tortugaSession.EventRegistry.RegisterHandler(handler)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Bind widget event #{source} #{name} with callback #{callback}, repeated = #{repeated}")
      return

    # (Number, String) -> Unit
    unbind = (source, name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.EventRegistry.UnregisterHandlers(3, source, name, true)
      else
        workspace.printPrims.print("Unbind widget event #{source} #{name}")
      return

    {
      name: "plot"
    , clearAll: clearAll
    , prims: {
               "SHOW": show
               "HIDE": hide
      ,    "ACTIVATE": activate
      ,        "MOVE": move
      ,   "SET-TITLE": setTitle
      ,        "BIND": bind
      ,      "UNBIND": unbind
      }
    }
}
