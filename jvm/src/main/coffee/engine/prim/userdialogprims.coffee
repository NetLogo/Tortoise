# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ HaltInterrupt } = require('util/exception')

module.exports.Config =
  class UserDialogConfig
    # ((String) => Unit, (String) => Boolean) => UserDialogConfig
    constructor: (@notify = (->), @confirm = (-> true)) ->

module.exports.Prims =
  class UserDialogPrims
    # (UserDialogConfig) => UserDialogPrims
    constructor: ({ confirm: @_confirm }) ->

    # (String) => Unit
    confirm: (msg) ->
      if not @_confirm(msg)
        throw new HaltInterrupt
