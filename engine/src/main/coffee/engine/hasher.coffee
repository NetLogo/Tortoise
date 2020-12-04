# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AbstractAgentSet = require('./core/abstractagentset')
Link             = require('./core/link')
Turtle           = require('./core/turtle')
{ checks }       = require('./core/typechecker')

{ foldl } = require('brazierjs/array')

# Function given a name for the sake of recursion --JAB (7/31/14)
# (Any) => String
Hasher =
  (x) ->
    if checks.isTurtle(x) or checks.isLink(x)
      "#{x.constructor.name} | #{x.id}"
    else if checks.isNobody(x)
      "nobody: -1"
    else if checks.isList(x)
      f = (acc, x) -> "31 *" + acc + (if x? then Hasher(x) else "0")
      (foldl(f)(1)(x)).toString()
    else if checks.isAgentSet(x)
      "#{x.toString()} | #{Hasher(x.sort())}"
    else
      x.toString()

module.exports = Hasher
