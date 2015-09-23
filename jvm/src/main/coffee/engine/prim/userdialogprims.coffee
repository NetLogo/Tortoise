# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class UserDialogConfig
    # ((String) => Unit) => UserDialogConfig
    constructor: (@notify = (->)) ->

module.exports.Prims =
  class UserDialogPrims
    # (UserDialogConfig) => UserDialogPrims
    constructor: ({}) ->
