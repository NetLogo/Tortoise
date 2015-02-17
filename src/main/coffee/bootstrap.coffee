# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
  `Workspace` is needed to do anything.  If you want the core of Tortoise, do `require('engine/workspace')`.
  If you want the peripheral stuff (i.e. because you're a compiler or test infrastructure),
  the other things you might want ought to get initialized by RequireJS here. --JAB (5/7/14)
###

require('./agentmodel')
require('./engine/workspace')
require('./engine/prim/prims')
require('./engine/prim/tasks')
require('./shim/printer')
require('./util/call')
require('./util/notimplemented')

module.exports = ->
