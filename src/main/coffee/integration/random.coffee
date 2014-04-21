# on Nashorn, we provide this via MersenneTwisterFast.  in the browser,
# we delegate to Math.random(), for speed.  we could swap in a JS
# implementation of the Mersenne Twister (code for it is googlable),
# but I fear (though have not measured) the performance impact
define(->
  if Random?
    Random
  else
    obj = {} #@# Just declare the object literal...
    obj.nextInt = (limit) -> Math.floor(Math.random() * limit)
    obj.nextLong = obj.nextInt
    obj.nextDouble = -> Math.random()
    obj.setSeed = (seed) -> return # No-op!
    obj
)
