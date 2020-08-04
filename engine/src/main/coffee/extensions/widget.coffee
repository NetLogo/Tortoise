# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

    # (String, Boolean*, Any*) => Unit
    show = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Widget", Action: "Show", Value: name })
      else
        workspace.printPrims.print("Show widget #{name}")
      return

    # (String) => Unit
    hide = (name) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "Widget", Action: "Hide", Value: name })
      else
        workspace.printPrims.print("Hide widget #{name}")
      return

    showGroup = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "WidgetGroup", Action: "Show" })
      else
        workspace.printPrims.print("Hide widget group")
      return

    # (String) => Unit
    hideGroup = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "WidgetGroup", Action: "Hide" })
      else
        workspace.printPrims.print("Hide widget group")
      return

    {
      name: "tutorial"
    , prims: {
              "SHOW": show
      ,       "HIDE": hide
      , "SHOW-GROUP": showGroup
      , "HIDE-GROUP": hideGroup
      }
    }
}
