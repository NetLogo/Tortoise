# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

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
        throw exceptions.halt()

    # (String) => String
    input: (msg) ->
      @_input(msg) ? throw exceptions.halt()

    # (String) => Boolean
    yesOrNo: (msg) ->
      @_yesOrNo(msg) ? throw exceptions.halt()
