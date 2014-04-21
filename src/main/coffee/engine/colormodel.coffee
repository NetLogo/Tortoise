define(-> {
  COLOR_MAX: 140
  baseColors: ->
    for i in [0..13]
      i * 10 + 5
  wrapColor: (c) ->
    if typeIsArray(c)
      c
    else
      modColor = c % @COLOR_MAX
      if modColor >= 0
        modColor
      else
        @COLOR_MAX + modColor
})
