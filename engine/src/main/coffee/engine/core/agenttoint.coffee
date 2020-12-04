# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('./typechecker')

module.exports =
  (agent) ->
    if checks.isTurtle(agent)
      1
    else if checks.isPatch(agent)
      2
    else if checks.isLink(agent)
      3
    else
      0
