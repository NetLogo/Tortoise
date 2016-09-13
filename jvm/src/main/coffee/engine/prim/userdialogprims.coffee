# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ HaltInterrupt } = require('util/exception')

module.exports.Config =
  class UserDialogConfig
    # ((String) => Unit, (String) => Boolean, (String) => Boolean, (String) => String) => UserDialogConfig
    constructor: (@notify = (->), @confirm = (-> true)
                , @yesOrNo = (-> true), @input = (-> "dummy implementation")) ->

module.exports.Prims =
  class UserDialogPrims
    # (UserDialogConfig) => UserDialogPrims
    constructor: ({ confirm: @_confirm, input: @_input, yesOrNo: @_yesOrNo }) ->

    # (String) => Unit
    confirm: (msg) ->
      if not @_confirm(msg)
        throw new HaltInterrupt

    # (String) => String
    input: (msg) ->
      @_input(msg) ? throw new HaltInterrupt

    # (String) => Boolean
    yesOrNo: (msg) ->
      @_yesOrNo(msg) ? throw new HaltInterrupt
