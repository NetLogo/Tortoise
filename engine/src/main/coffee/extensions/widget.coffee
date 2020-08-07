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
          { Type: "Widget", Action: "Show", Target: name }
        )
      else
        workspace.printPrims.print("Show widget #{name}")
      return

     # (String) => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Widget", Action: "Hide", Target: name }
        )
      else
        workspace.printPrims.print("Hide widget #{name}")
      return

    # (String, Number) => Unit
    move = (name, index) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Widget", Action: "Move", Target: name, Value: index }
        )
      else
        workspace.printPrims.print("Move the widget #{name} to the place #{index} in its group")
      return

    # (String, String) => Unit
    setTitle = (name, title) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Widget", Action: "SetTitle", Target: name, Value: title }
        )
      else
        workspace.printPrims.print("Set widget #{name} with title #{title}")
      return

    # (String, String) => Unit
    setGroup = (widgetName, groupName) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Widget", Action: "SetGroup", Target: widgetName, Value: groupName }
        )
      else
        workspace.printPrims.print("Put widget #{widgetName} into group #{groupName}")
      return

    # (String) => Unit
    showGroup = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "WidgetGroup", Action: "Show", Target: name }
        )
      else
        workspace.printPrims.print("Show group #{name}")
      return

    # (String) => Unit
    hideGroup = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "WidgetGroup", Action: "Hide", Target: name }
        )
      else
        workspace.printPrims.print("Hide group #{name}")
      return

    # (String, String) => Unit
    renameGroup = (name, title) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "WidgetGroup", Action: "Rename", Target: name, Value: title }
        )
      else
        workspace.printPrims.print("Rename group #{name} with title #{title}")
      return

    # (String, Number) => Unit
    moveGroup = (name, index) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "WidgetGroup", Action: "Move", Target: name, Value: index }
        )
      else
        workspace.printPrims.print("Move group #{name} to the place #{index} in the panel")
      return

    {
      name: "widget"
    , prims: {
                   "SHOW": show
                   "HIDE": hide
      ,            "MOVE": move
      ,       "SET-TITLE": setTitle
      ,       "SET-GROUP": setGroup
      ,      "SHOW-GROUP": showGroup
      ,      "HIDE-GROUP": hideGroup
      ,      "MOVE-GROUP": moveGroup
      ,    "RENAME-GROUP": renameGroup
      }
    }
}
