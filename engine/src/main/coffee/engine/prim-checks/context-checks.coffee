# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AgentKinds = require('engine/core/agentkinds')

# Desktop names the agent kinds separately from the messages that mention them, so we do too.  -Jeremy B August 2026
kindNameKeys = new Map([
  [AgentKinds.Observer, 'the observer']
, [AgentKinds.Turtle,   'a turtle'    ]
, [AgentKinds.Patch,    'a patch'     ]
, [AgentKinds.Link,     'a link'      ]
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

  # (Int, Int, String, Int, Int) => Unit
  _raise: (mask, selfBit, primName, sourceStart, sourceEnd) ->
    actual  = @kindName(selfBit)
    allowed = AgentKinds.splitMask(mask)
    # Desktop only names what the code *can* be run by when there's exactly one candidate, so `neighbors` in an
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
