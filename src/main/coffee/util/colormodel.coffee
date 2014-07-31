# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['shim/lodash', 'shim/random'], (_, Random) ->

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

    # (Number, Number) => Boolean
    areRelatedByShade: (color1, color2) ->
      @_colorIntegral(color1) is @_colorIntegral(color2)

    # (Number, Number, Number, Number) => Number
    scaleColor: (color, number, min, max) -> #@# I don't know WTF this is, so it has to be wrong
      color = @_colorIntegral(color) * 10
      perc = 0.0
      if min > max
        if number < max
          perc = 1.0
        else if number > min
          perc = 0.0
        else
          tempval = min - number
          tempmax = min - max
          perc = tempval / tempmax
      else
        if number > max
          perc = 1.0
        else if number < min
          perc = 0.0
        else
          tempval = number - min
          tempmax = max - min
          perc = tempval / tempmax
      perc *= 10
      if perc >= 9.9999
        perc = 9.9999
      if perc < 0
        perc = 0
      color + perc

    # (Number) => Number
    _colorIntegral: (color) ->
      Math.floor(color / 10)

  }

)
