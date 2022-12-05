# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ MersenneTwisterFast } = require('./engine-scala')

###
On the JVM, we use Headless' MersenneTwisterFast.
In the browser, we use a ScalaJS implementation of it.
We can't the ScalaJS implementation in both environments,
because MTF relies on bit-shifting, and JVM integers have
a different number of bits than JS integers, leading to
different results.
###

getRandomSeedInt = () ->
  global.crypto.getRandomValues(new Int32Array(1))[0]

newMersenneTwister = () ->
  new MersenneTwisterFast(getRandomSeedInt())

module.exports = {
  newMersenneTwister
  getRandomSeedInt
}
