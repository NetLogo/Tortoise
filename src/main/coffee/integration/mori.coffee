## (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

##
## stuff in this file papers over differences between Nashorn and
## other JS implementations such as Node and the ones in browsers.
##
## on Nashorn, the goal is precisely bit-for-bit identical results
## as JVM NetLogo.  elsewhere, "close enough" is close enough
##
define(->
  if mori?
    mori
  else
    require('../../mori.js')
)
