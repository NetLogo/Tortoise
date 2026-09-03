# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AgentKinds = require('engine/core/agentkinds')

# Desktop names the agent kinds apart from the messages that mention them, so we do too.  -Jeremy B August 2026
kindNameKeys = new Map([
  [AgentKinds.Observer, 'agent kind: the observer']
, [AgentKinds.Turtle,   'agent kind: a turtle'    ]
, [AgentKinds.Patch,    'agent kind: a patch'     ]
, [AgentKinds.Link,     'agent kind: a link'      ]
])

class ContextChecks

  # (Validator, I18nBundle, SelfManager)
  constructor: (@validator, @bundle, @selfManager) ->

  # (Int, String, Int, Int) => Unit
  assertKind: (mask, primName, sourceStart, sourceEnd) ->
    selfBit = @selfManager.selfBit()
    if (mask & selfBit) is 0
      @_raise(mask, selfBit, primName, sourceStart, sourceEnd)
    return

  # (Int, AgentSet|Agent|Any, String, Int, Int) => AgentSet|Agent|Any
  assertAgentSetKind: (mask, agents, primName, sourceStart, sourceEnd) ->
    # Anything that isn't an agent or agentset is somebody else's error to report.
    if agents?.agentBit? and (mask & agents.agentBit) is 0
      @_raise(mask, agents.agentBit, primName, sourceStart, sourceEnd)
    agents

  # (AgentSet|Agent|Any, Int, Int) => AgentSet|Agent|Any
  assertAskAllowed: (agents, sourceStart, sourceEnd) ->
    if @selfManager.selfBit() isnt AgentKinds.Observer and agents?.getSpecialName?
      switch agents.getSpecialName()
        when "turtles"
          @validator.error('ask', sourceStart, sourceEnd, 'Only the observer can ASK the set of all turtles.')
        when "patches"
          @validator.error('ask', sourceStart, sourceEnd, 'Only the observer can ASK the set of all patches.')
    agents

  # (Int, Int, String, Int, Int) => Unit
  _raise: (mask, selfBit, primName, sourceStart, sourceEnd) ->
    actual  = @kindName(selfBit)
    allowed = AgentKinds.splitMask(mask)
    # Desktop only names what the code *can* be run by when there's exactly one candidate.  So `neighbors` in an
    # observer context says just "this code can't be run by the observer".  -Jeremy B August 2026
    if allowed.length is 1
      @validator.error( primName, sourceStart, sourceEnd, 'this code can_t be run by _, only by _'
                      , actual, @kindName(allowed[0]))
    else
      @validator.error(primName, sourceStart, sourceEnd, 'this code can_t be run by _', actual)
    return

  # (Int) => String
  kindName: (bit) ->
    @bundle.get(kindNameKeys.get(bit))

module.exports = ContextChecks
