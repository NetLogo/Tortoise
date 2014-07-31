# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
  `Workspace` is needed to do anything.  If you want the core of Tortoise, do `require$0`.
  If you want the peripheral stuff (i.e. because you're a compiler or test infrastructure),
  the other things you might want ought to get initialized by RequireJS here. --JAB (5/7/14)
###

goog.provide('bootstrap')

goog.require('agentmodel')
goog.require('engine/workspace')
goog.require('engine/prim/prims')
goog.require('engine/prim/tasks')
goog.require('nashorn/denuller')
goog.require('shim/printer')
goog.require('util/call')
goog.require('util/notimplemented')
