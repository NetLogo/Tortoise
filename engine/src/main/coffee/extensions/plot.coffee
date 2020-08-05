# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

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

    # (String) => Unit
    deactivate = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "Deactivate", Target: name }
        )
      else
        workspace.printPrims.print("Deactivate the plot #{name}")
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

    # (String) => Unit
    getTitle = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Plot", Action: "GetTitle", Target: name }
        )
      else
        workspace.printPrims.print("Get plot #{name}'s title")
      return

    {
      name: "plot"
    , prims: {
               "SHOW": show
               "HIDE": hide
      ,    "ACTIVATE": activate
      ,  "DEACTIVATE": deactivate
      ,        "MOVE": move
      ,   "SET-TITLE": setTitle
      ,   "GET-TITLE": getTitle
      }
    }
}
