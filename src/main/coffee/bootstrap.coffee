# `Workspace` is needed to do anything, everything listed isn't depended upon (transitively or otherwise) by the workspace
require(['engine/workspace', 'integration/agentmodel', 'integration/denuller', 'integration/notimplemented'
       , 'integration/printer', 'integration/typeisarray', 'engine/dump', 'engine/prims']
      , ( Workspace,          AgentModel,               Denuller,               notImplemented
       ,  println,               typeIsArray,               Dump,          Prims) ->
)
