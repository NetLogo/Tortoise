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
        if name of tortugaSession.Tutorial.Dialogs
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Dialog", Action: "Minimize", Target: name }
          )
        else
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Error", Message: "Dialog #{name} is not defined in the tutorial" }
          )
      else
        workspace.printPrims.print("Make dialog #{name} minimized")
      return

    # (String) => Unit
    hideDialog = (name) ->
      if tortugaSession = getTortugaSession()
        if name of tortugaSession.Tutorial.Dialogs
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Dialog", Action: "Hide", Target: name }
          )
        else
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Error", Message: "Dialog #{name} is not defined in the tutorial" }
          )
      else
        workspace.printPrims.print("Hide the active dialog #{name}")
      return

    # (String) => Unit
    backDialog = (name) ->
      if tortugaSession = getTortugaSession()
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Dialog", Action: "Back" }
          )
      else
        workspace.printPrims.print("Hide the active dialog #{name} and show the first minimized dialog")
      return

    # (Boolean) => Unit
    submitInput = (share) ->
      if tortugaSession = getTortugaSession()
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Dialog", Action: "Submit-Input", Share: share }
          )
      else if share
        workspace.printPrims.print("Submit the user input and share it with other users")
      else
        workspace.printPrims.print("Submit the user input and keep it locally")
      return

    #(String) => Wildcard
    get = (variable) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.GetVariable(variable)
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

    # (String) -> Unit
    activate = (sectionName) ->
      if tortugaSession = getTortugaSession()
        if sectionName of tortugaSession.Tutorial.Sections
          section = tortugaSession.Tutorial.Sections[sectionName]
          tortugaSession.ActivateSection(section)
        else
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Error", Message: "Section #{sectionName} is not defined in the tutorial" }
          )
      else
        workspace.printPrims.print("Activate section #{sectionName}")
      return

    # (String) -> Unit
    deactivate = (sectionName) ->
      if tortugaSession = getTortugaSession()
        if sectionName of tortugaSession.Tutorial.Sections
          section = tortugaSession.Tutorial.Sections[sectionName]
          tortugaSession.DeactivateSection(section)
        else
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Error", Message: "Section #{sectionName} is not defined in the tutorial" }
          )
      else
        workspace.printPrims.print("Deactivate section #{sectionName}")
      return
      
    # (String) -> Unit
    go = (sectionName) ->
      if tortugaSession = getTortugaSession()
        if sectionName of tortugaSession.Tutorial.Sections
          section = tortugaSession.Tutorial.Sections[sectionName]
          tortugaSession.GoSection(section)
        else
          tortugaSession.MessageQueue.Enqueue(
            { Type: "Error", Message: "Section #{sectionName} is not defined in the tutorial" }
          )
      else
        workspace.printPrims.print("Go to section #{sectionName}")
      return

    # () -> Unit
    forward = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.ForwardSection()
      else
        workspace.printPrims.print("Visit the next available section")
      return
    
    # () -> Unit
    back = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.BackSection()
      else
        workspace.printPrims.print("Visit the last available section")
      return

    {
      name: "tutorial"
    , prims: {
            "SHOW-DIALOG": showDialog
      , "MINIMIZE-DIALOG": minimizeDialog
      ,     "HIDE-DIALOG": hideDialog
      ,     "BACK-DIALOG": backDialog
      ,    "SUBMIT-INPUT": submitInput
      ,             "GET": get
      ,             "SET": set
      ,              "GO": go
      ,        "ACTIVATE": activate
      ,      "DEACTIVATE": deactivate
      ,         "FORWARD": forward
      ,            "BACK": back
      }
    }
}
