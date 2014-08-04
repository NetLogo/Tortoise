# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.colormodel')

goog.require('shim.lodash')
goog.require('shim.random')

  # Purposely declared outside of the object so `BaseColors` can statically reference `ColorMax` --JAB (6/26/14)
  ColorMax   = 140
  BaseColors = _(0).range(ColorMax / 10).map((n) -> (n * 10) + 5).value()

  {

    COLOR_MAX:   ColorMax   # Number
    BASE_COLORS: BaseColors # Array[Number]

    # (Number) => Number
    nthColor: (n) ->
      index = n % BaseColors.length
      BaseColors[index]

    # () => Number
    randomColor: ->
      index = Random.nextInt(BaseColors.length)
      BaseColors[index]

    # (Number) => Number
    wrapColor: (color) ->
      if _(color).isArray()
        color
      else
        modColor = color % ColorMax
        if modColor >= 0
          modColor
        else
          ColorMax + modColor

  }

