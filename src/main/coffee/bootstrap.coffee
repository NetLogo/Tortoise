# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
  `Workspace` is needed to do anything.  If you want the core of Tortoise, do `require('engine/workspace')`.
  If you want the peripheral stuff (i.e. because you're a compiler or test infrastructure),
  the other things you might want ought to get initialized by RequireJS here. --JAB (5/7/14)
###
require(['agentmodel', 'engine/workspace', 'engine/prim/prims', 'engine/prim/tasks', 'nashorn/denuller', 'shim/printer'
       , 'util/call', 'util/dump', 'util/notimplemented']
      , ( AgentModel,   Workspace,          Prims,               Tasks,               Denuller,           Printer
       ,  Call,        Dump,        notImplemented) ->
)
