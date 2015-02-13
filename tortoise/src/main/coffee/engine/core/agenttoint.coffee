# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('./typechecker')

module.exports =
  (agent) ->
    type = NLType(agent)
    if type.isTurtle()
      1
    else if type.isPatch()
      2
    else if type.isLink()
      3
    else
      0
