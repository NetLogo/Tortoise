# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
on Nashorn, we provide this via MersenneTwisterFast.  in the browser,
we delegate to Math.random(), for speed.  we could swap in a JS
implementation of the Mersenne Twister (code for it is googlable),
but I fear (though have not measured) the performance impact --ST
###
goog.provide('shim.random')

shim.random =if Random?
  Random
else
  {
    nextInt:    (limit) -> Math.floor(Math.random() * limit)
    nextLong:   (limit) -> @nextInt(limit)
    nextDouble:         -> Math.random()
    setSeed:    (seed)  -> return # No-op!
  }

