# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ zip }        = require('brazierjs/array')
{ rangeUntil } = require('brazierjs/number')

# [T] @ (Array[(T, U)]) => ((U, T) => Int) => Array[T]
module.exports =
  (arr) -> (f) ->
    sortFunc =
      (x, y) ->
        result = f(x[1], y[1])
        if result isnt 0
          result
        else if x[0] < y[0]
          -1
        else
          1

    pairs = zip(rangeUntil(0)(arr.length))(arr)
    pairs.sort(sortFunc).map((pair) -> pair[1])
