define(['integration/lodash'], (_) -> {
  COLOR_MAX: 140
  baseColors: ->
    for i in [0..13]
      i * 10 + 5
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
