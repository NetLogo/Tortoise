# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                = require('lodash')
AbstractAgentSet = require('./core/abstractagentset')
Link             = require('./core/link')
Nobody           = require('./core/nobody')
Turtle           = require('./core/turtle')
NLType           = require('./core/typechecker')

# Function given a name for the sake of recursion --JAB (7/31/14)
# (Any) => String
Hasher =
  (x) ->
    type = NLType(x)
    if type.isTurtle() or type.isLink()
      "#{x.constructor.name} | #{x.id}"
    else if x is Nobody
      "nobody: -1"
    else if type.isList()
      f = (acc, x) -> "31 *" + acc + (if x? then Hasher(x) else "0")
      _(x).foldl(f, 1).toString()
    else if type.isAgentSet()
      "#{x.toString()} | #{Hasher(x.toArray())}"
    else
      x.toString()

module.exports = Hasher
