# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

getTortugaSession = () =>
  if window?.TortugaSession?
    return window.TortugaSession.Instance
  else
    return null

module.exports = {
  init: (workspace) =>

    # (Number) => Unit
    activate = (id) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "Activate", Value: name })
      else
        workspace.printPrims.print("Activate NetTango workspace #{id}")
      return

    # (Number) => Unit
    show = (id) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "Show", Value: name })
      else
        workspace.printPrims.print("Show NetTango workspace #{id}")
      return

    # (Number) => Unit
    hide = (id) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "Hide", Value: name })
      else
        workspace.printPrims.print("Hide NetTango workspace #{id}")
      return

    # (String|List) => Unit
    showBlocks = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "ShowBlocks", Value: tags })
      else
        workspace.printPrims.print("Show NetTango blocks #{tags}")
      return
      
    # (String|List) => Unit
    showBlocksExcept = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "ShowBlocksExcept", Value: tags })
      else
        workspace.printPrims.print("Show NetTango blocks except #{tags}")
      return
      
    # (String|List) => Unit
    hideBlocks = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "HideBlocks", Value: tags })
      else
        workspace.printPrims.print("Hide NetTango blocks #{tags}")
      return
      
    # (String|List) => Unit
    hideBlocksExcept = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "HideBlocksExcept", Value: tags })
      else
        workspace.printPrims.print("Hide NetTango blocks except #{tags}")
      return
      
    # (String|List) => Unit
    highlightBlocks = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "HighlightBlocks", Value: tags })
      else
        workspace.printPrims.print("Highlight NetTango blocks #{tags}")
      return
      
    # (String|List) => Unit
    highlightBlocksExcept = (tags) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "HighlightBlocksExcept", Value: tags })
      else
        workspace.printPrims.print("Highlight NetTango blocks except #{tags}")
      return

    # () => Unit
    recompile = () ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "Recompile" })
      else
        workspace.printPrims.print("Recompile NetTango blocks")
      return
      
    # (String) => Unit
    switchProgram = (id) ->
      if tortugaSession = getTortugaSession()
        tortugaSession.MessageQueue.Enqueue({ Type: "NetTango", Action: "Switch", Value: id })
      else
        workspace.printPrims.print("Switch to NetTango program #{id}")
      return

    {
      name: "nettango"
    , prims: {
                  "ACTIVATE": activate
      ,                    "SHOW": show
      ,                    "HIDE": hide
      ,             "SHOW-BLOCKS": showBlocks
      ,      "SHOW-BLOCKS-EXCEPT": showBlocksExcept
      ,             "HIDE-BLOCKS": hideBlocks
      ,      "HIDE-BLOCKS-EXCEPT": hideBlocksExcept
      ,        "HIGHLIGHT-BLOCKS": highlightBlocks
      , "HIGHLIGHT-BLOCKS-EXCEPT": highlightBlocksExcept
      ,          "SWITCH-PROGRAM": switchProgram
      }
    }
}
