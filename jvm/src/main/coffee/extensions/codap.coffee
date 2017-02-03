# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

IFramePhone = require('iframe-phone')

phone = undefined

module.exports =
  {
    name: "codap"
  , prims: {
      INIT: (handler) ->

        phone =
          if window?.parent? and window.parent isnt window
            new IFramePhone.IframePhoneRpcEndpoint(handler, "data-interactive", window.parent)
          else
            (console?.log ? print)("CODAP Extension: Not in a frame; calls will have no effect.")
            { call: (x) -> (console?.log ? print)("CODAP Extension: Not in a frame; doing nothing; received:", x) }

        phone.call({
          action:   "update"
        , resource: "interactiveFrame"
        , values: {
            preventDataContextReorg: false
          , title: "NetLogo Web"
          }
        })

        return

    , CALL: (argObj) ->
        phone.call(argObj)
        return
    }
  }
