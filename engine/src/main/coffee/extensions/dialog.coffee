# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

{ item }               = require('brazierjs/array')
{ flip, id, pipeline } = require('brazierjs/function')
{ fold }               = require('brazierjs/maybe')

halt = -> throw exceptions.halt()

module.exports = {

  init: (workspace) ->

    # (String, (String) => Unit) => Unit
    userInput = (message, callback) ->
      prim((config) -> config.getText(message))(callback)
      return

    # (String, () => Unit) => Unit
    userMessage = (message, callback) ->
      prim((config) -> config.showMessage(message))(callback)
      return

    # (String, Array[Any], () => Unit) => Unit
    userOneOf = (message, choices, callback) ->
      fullCallback = pipeline(flip(item)(choices), fold(-> throw exceptions.internal("Bad choice index"))(id), callback)
      if choices.length isnt 0
        prim((config) -> config.getChoice(message, choices.map((x) -> workspace.dump(x))))(fullCallback)
      else
        throw exceptions.extension("List is empty.")
      return

    # (String, (Boolean) => Unit) => Unit
    userYesOrNo = (message, callback) ->
      prim((config) -> config.getYesOrNo(message))(callback)
      return

    _noDialogIsOpen = true

    # [T] @ (DialogConfig => (Maybe[T] => Unit) => Unit) => (T => Unit) => Unit
    prim = (withConfig) -> (callback) ->
      if _noDialogIsOpen
        _noDialogIsOpen = false
        withConfig(workspace.asyncDialogConfig)(
          (resultMaybe) ->
            _noDialogIsOpen = true
            fold(halt)(callback)(resultMaybe)
        )
      return

    {
      name: "dialog"
    , prims: {
             "USER-INPUT": userInput
      ,    "USER-MESSAGE": userMessage
      ,     "USER-ONE-OF": userOneOf
      , "USER-YES-OR-NO?": userYesOrNo
      }
    }

}
