# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                = require('lodash')
AbstractAgentSet = require('./core/abstractagentset')
Link             = require('./core/link')
Nobody           = require('./core/nobody')
Turtle           = require('./core/turtle')
Type             = require('util/typechecker')

# Function given a name for the sake of recursion --JAB (7/31/14)
# (Any) => String
Hasher =
  (x) ->
    if x instanceof Turtle or x instanceof Link
      x.id
    else if x is Nobody
      -1
    else if Type(x).isArray()
      f = (acc, x) -> 31 * acc + (if x? then Hasher(x) else 0)
      _(x).foldl(f, 1)
    else if x instanceof AbstractAgentSet
      Hasher(x.toArray())
    else
      x.toString()

module.exports = Hasher
