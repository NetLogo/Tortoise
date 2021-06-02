# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise


DeathInterrupt    = Object.freeze({ _debugInfo: "THE-DEATH-INTERRUPT" })
StopInterrupt     = Object.freeze({ _debugInfo: "THE-STOP-INTERRUPT" })
TopologyInterrupt = Object.freeze({ _debugInfo: "THE-TOPOLOGY-INTERRUPT" })
TowardsInterrupt  = Object.freeze({ _debugInfo: "THE-TOWARDS-INTERRUPT" })

interrupts = [DeathInterrupt, StopInterrupt, TopologyInterrupt, TowardsInterrupt]

# (Any, Any) => Any
ifInterrupt = (value, defaultValue) ->
  if interrupts.includes(value)
    defaultValue
  else
    value

module.exports = {
  ifInterrupt,
  DeathInterrupt,
  StopInterrupt,
  TopologyInterrupt,
  TowardsInterrupt
}
