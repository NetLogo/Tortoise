# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

    # Because `isOptional` only support `CommandBlockType`.
    # We use `isRepeatable` here and accept Any type and any number of argument as inputs.
    # We would ignore useless arguments and check type inside function.
    # -- XZ(08/2020)
    # (String, Boolean*, Any*) => Unit
    showDialog = (name, minimized) ->
      if tortugaSession = getTortugaSession()
        if typeof(minimized) is 'boolean'
          tortugaSession.ShowDialog(name, minimized)
        else
          tortugaSession.ShowDialog(name, false)
      else
        workspace.printPrims.print("Show dialog #{name} in #{if minimized then "minimized" else "full"} status")
      return

    # (String) => Unit
    minimizeDialog = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Dialog", Action: "Minimize", Target: name }
        )
      else
        workspace.printPrims.print("Make dialog #{name} minimized")
      return

    # (String) => Unit
    hideDialog = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue(
          { Type: "Dialog", Action: "Hide", Target: name }
        )
      else
        workspace.printPrims.print("Hide the active dialog #{name}")
      return

    #(String) => Wildcard
    get = (variable) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.GetVariable(variable, value)
      else
        workspace.printPrims.print("Get the tutorial variable #{variable}")
        return

    #(String, Boolean) => Unit
    set = (variable, value) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.SetVariable(variable, value)
      else
        workspace.printPrims.print("Set the tutorial variable #{variable} with value #{value}")
      return

    {
      name: "tutorial"
    , prims: {
            "SHOW-DIALOG": showDialog
      , "MINIMIZE-DIALOG": minimizeDialog
      ,     "HIDE-DIALOG": hideDialog
      ,             "GET": get
      ,             "SET": set
      }
    }
}
