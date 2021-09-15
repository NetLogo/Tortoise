# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getSensor = () =>
  if window?.Sensors?
    return window.Sensors.Instance
  else
    return null

module.exports = {
  init: (workspace) =>
    # () => Unit
    clearAll = () -> clear()

    # () => Unit
    clear = () ->
      if sensor = getSensor()
        sensor.Clear()
      else
        workspace.printPrims.print("Clear all gesture and sensor bindings.")
      return

    # (String, Any*) => Unit
    bindGesture = (name, callback) ->
      if sensor = getSensor()
        if typeof(callback) is 'string' or typeof(callback) is 'function'
          sensor.BindGesture(name, callback)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Bind gesture #{name} with a callback")
      return

    # (String) => Unit
    unbindGesture = (name) ->
      if sensor = getSensor()
        sensor.UnbindGesture(name)
      else
        workspace.printPrims.print("Unbind gesture #{name}")
      return

    # (String) => Unit
    open = (name) ->
      if sensor = getSensor()
        sensor.Open(name)
      else
        workspace.printPrims.print("Open sensor #{name}")
      return

    # (String) => Unit
    close = (name) ->
      if sensor = getSensor()
        sensor.Close(name)
      else
        workspace.printPrims.print("Close sensor #{name}")
      return

    # (String, Any*) => Unit
    onChange = (name, callback) ->
      if sensor = getSensor()
        if typeof(callback) is 'string' or typeof(callback) is 'function'
          sensor.OnChange(name, callback)
        else
          throw new Error("Callback should be the name of a procedure, or an anonymous procedure")
      else
        workspace.printPrims.print("Bind callback to sensor #{name}")
      return

    #(String) => Number
    readNumber = (name) ->
      if sensor = getSensor()
        sensor.ReadNumber(name)
      else
        0

    #(String, Boolean) => List
    readVector = (name) ->
      if sensor = getSensor()
        sensor.ReadVector(name)
      else
        [0, 0, 0]

    # () -> Boolean
    isAvailable = (name) ->
      if sensor = getSensor()
        sensor.IsAvailable(name)
      else
        false

    # (Boolean) -> Unit
    setWarning = (status) ->
      if sensor = getSensor()
        sensor.SetWarning(status)
      else
        workspace.printPrims.print("Set sensor warning prompt to #{status}")
      return

    {
      name: "sensor"
    , clearAll: clearAll
    , prims: {
                  "CLEAR": clear
      ,    "BIND-GESTURE": bindGesture
      ,  "UNBIND-GESTURE": unbindGesture
      ,            "OPEN": open
      ,           "CLOSE": close
      ,       "ON-CHANGE": onChange
      ,     "READ-NUMBER": readNumber
      ,     "READ-VECTOR": readVector
      ,   "IS-AVAILABLE?": isAvailable
      ,     "SET-WARNING": setWarning
      }
    }
}
