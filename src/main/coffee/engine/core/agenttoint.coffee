# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Link   = require('./link')
Patch  = require('./patch')
Turtle = require('./turtle')

module.exports =
  (agent) ->
    if agent instanceof Turtle
      1
    else if agent instanceof Patch
      2
    else if agent instanceof Link
      3
    else
      0
