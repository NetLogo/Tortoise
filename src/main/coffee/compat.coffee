## (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

##
## stuff in this file papers over differences between Nashorn and
## other JS implementations such as Node and the ones in browsers.
##
## on Nashorn, the goal is precisely bit-for-bit identical results
## as JVM NetLogo.  elsewhere, "close enough" is close enough
##

# Nashorn calls it "print", V8 and browsers have "console.log".
# get it somehow!
unless println?
  if console? # V8
    println = console.log
  else if print? # SpiderMonkey
    println = print
  unless println? # Nashorn
    println = java.lang.System.out.println

# surprisingly difficult to ask if something is an array or not
typeIsArray = (value) ->
  value and
  typeof value is 'object' and
  value instanceof Array and
  typeof value.length is 'number' and
  typeof value.splice is 'function' and
  not ( value.propertyIsEnumerable 'length' )

unless mori? # For Node/V8, where Mori needs to be loaded by the module system --JAB (4/1/14)
  mori = require('./target/classes/js/mori.js')

# on Nashorn, we provide this via MersenneTwisterFast.  in the browser,
# we delegate to Math.random(), for speed.  we could swap in a JS
# implementation of the Mersenne Twister (code for it is googlable),
# but I fear (though have not measured) the performance impact
unless Random?
  Random = {}
  Random.nextInt = (limit) -> Math.floor(Math.random() * limit)
  Random.nextLong = Random.nextInt
  Random.nextDouble = -> Math.random()
  Random.setSeed = (seed) -> return # No-op!

# For divergences between Nashorn and browsers, clone and extend!
Cloner =
  clone: (obj) ->
    return obj if obj is null or typeof (obj) isnt "object"
    temp = new obj.constructor()
    for key in Object.getOwnPropertyNames(obj)
      temp[key] = @clone(obj[key])
    temp

# on Nashorn, we use the JVM StrictMath stuff so results are identical
# with regular NetLogo. in browser, be satisfied with "close enough"
unless StrictMath?
  StrictMath = Cloner.clone(Math)
  # For functions that are not "close enough," or that don't exist in the browser, manually define them here!
  StrictMath.toRadians = (degrees) -> degrees * Math.PI / 180
  StrictMath.toDegrees = (radians) -> radians * 180 / Math.PI

# used to work around Nashorn bug where JSON.parse on objects with
# integer keys sometimes invents nonexistent entries with null values;
# see http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
Denuller =
  denull: (x) ->
    if typeIsArray(x)
      @denull(y) for y in x
    else if x is null
      x
    else if typeof(x) is "object"
      result = {}
      for key, value of x
        if isNaN(key) or value != null
          result[key] = @denull(value)
      result
    else
      x
