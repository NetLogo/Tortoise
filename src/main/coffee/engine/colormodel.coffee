define(['integration/lodash'], (_) -> {

  # Number
  COLOR_MAX: 140

  # () => Array[Number]
  baseColors: ->
    _(0).range(@COLOR_MAX / 10).map((n) -> (n * 10) + 5).value()

  # (Number) => Number
  wrapColor: (color) ->
    if _(color).isArray()
      color
    else
      modColor = color % @COLOR_MAX
      if modColor >= 0
        modColor
      else
        @COLOR_MAX + modColor

})
