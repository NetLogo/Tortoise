# `Workspace` is needed to do anything, everything listed isn't depended upon (transitively or otherwise) by the workspace
require(['engine/workspace', 'integration/agentmodel', 'integration/denuller', 'integration/notimplemented'
       , 'integration/printer', 'engine/dump', 'engine/prims']
      , ( Workspace,          AgentModel,               Denuller,               notImplemented
       ,  println,               Dump,          Prims) ->
)
