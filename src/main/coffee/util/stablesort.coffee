# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fromInterval } = require('super/superarray')

# [T] @ (Array[T]) => ((T, T) => Int) => Array[T]
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
    fromInterval(0, arr.length).zip(arr).value().sort(sortFunc).map((pair) -> pair[1])
