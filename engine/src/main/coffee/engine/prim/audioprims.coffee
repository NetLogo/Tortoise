# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports.Config =
  class AudioConfig
    # (() => ())
    constructor: (@peekBeep = (->)) ->

module.exports.Prims =
  class AudioPrims
    # (AudioConfig) => AudioPrims
    constructor: ({ peekBeep: @beep }) ->
