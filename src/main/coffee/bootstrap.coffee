###
  `Workspace` is needed to do anything.  If you want the core of Tortoise, do `require('engine/workspace')`.
  If you want the peripheral stuff (i.e. because you're a compiler or test infrastructure),
  the other things you might want ought to get initialized by RequireJS here. --JAB (5/7/14)
###
require(['engine/workspace', 'integration/agentmodel', 'integration/denuller', 'integration/notimplemented'
       , 'integration/printer', 'engine/dump', 'engine/prims', 'engine/call', 'engine/tasks']
      , ( Workspace,          AgentModel,               Denuller,               notImplemented
       ,  Printer,               Dump,          Prims,          Call,          Tasks) ->
)
