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
    toast = (text) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Toast", Message: text }
        )
      else
        workspace.printPrims.print("Show toast #{text}")
      return

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

    # (Number, String, Bool, String | Function) -> Unit
    bind = (source, name, repeated, callback) ->
      if tortugaSession = getTortugaSession()
        if typeof(callback) is 'string' or typeof(callback) is 'function'
          handler = tortugaSession.EventRegistry.BuildHandler(2, source, name, repeated, callback)
          tortugaSession.EventRegistry.UnregisterHandlers(2, source, name, true)
          tortugaSession.EventRegistry.RegisterHandler(handler)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Bind widget event #{source} #{name} with callback #{callback}, repeated = #{repeated}")
      return

    # (Number, String) -> Unit
    unbind = (source, name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.EventRegistry.UnregisterHandlers(2, source, name, true)
      else
        workspace.printPrims.print("Unbind widget event #{source} #{name}")
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
      
    # () => Unit
    showJoystick = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Joystick", Action: "Show" }
        )
      else
        workspace.printPrims.print("Show the virtual joystick. ")
      return

    # () => Unit
    hideJoystick = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Joystick", Action: "Hide" }
        )
      else
        workspace.printPrims.print("Hide the virtual joystick. ")
      return
      
    # (string, string, string, string) => Unit
    bindJoystick = (W, A, S, D) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Joystick", Action: "Bind", Target: [ W, A, S, D ] }
        )
      else
        workspace.printPrims.print("Bind the virtual joystick to #{W}, #{A}, #{S}, #{D}. ")
      return
      
    # () => Number
    joystickX = () ->
      if mouse = MousePrims
        return mouse.getJoystickX()
      else
        return 0
        
    # () => Number
    joystickY = () ->
      if mouse = MousePrims
        return mouse.getJoystickY()
      else
        return 0

    {
      name: "widget"
    , clearAll: clearAll
    , prims: {
                  "TOAST": toast
      ,            "SHOW": show
      ,            "HIDE": hide
      ,            "MOVE": move
      ,            "BIND": bind
      ,          "UNBIND": unbind
      ,       "SET-TITLE": setTitle
      ,       "SET-GROUP": setGroup
      ,      "SHOW-GROUP": showGroup
      ,      "HIDE-GROUP": hideGroup
      ,      "MOVE-GROUP": moveGroup
      ,    "RENAME-GROUP": renameGroup
      ,   "SHOW-JOYSTICK": showJoystick
      ,   "HIDE-JOYSTICK": hideJoystick
      ,   "BIND-JOYSTICK": bindJoystick
      ,      "JOYSTICK-X": joystickX
      ,      "JOYSTICK-Y": joystickY
      }
    }
}
