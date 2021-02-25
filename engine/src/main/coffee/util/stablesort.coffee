# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ zip }        = require('brazierjs/array')
{ rangeUntil } = require('brazierjs/number')

# [T] @ (Array[(T, U)]) => ((U, T) => Int) => Array[T]
module.exports =
  (arr) -> (f) ->
    sortFunc =
      (x, y) ->
        # The JS `Array.sort()` implementation flips the arguments relative to what you'd expect: if you're array is [0 2 4] the first two arguments
        # to your `f` will be (2, 0).  That's not a big deal for results, but it is a big deal for getting error messages to be identical to desktop by
        # argument position.  So we flip the result back the other way with `-1 * result`.
        # -Jeremy B February 2021
        result = f(y[1], x[1])
        if result isnt 0
          -1 * result
        else if x[0] < y[0]
          -1
        else
          1

    pairs = zip(rangeUntil(0)(arr.length))(arr)
    pairs.sort(sortFunc).map((pair) -> pair[1])
