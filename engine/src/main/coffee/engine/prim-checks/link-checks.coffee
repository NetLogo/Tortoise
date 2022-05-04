# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ TowardsInterrupt } = require('util/interrupts')

class LinkChecks

  # (Validator, () => Number|Agent, SelfPrims)
  constructor: (@validator, @getSelf, @selfPrims) ->

  linkHeading: () ->
    heading = @selfPrims.linkHeading()
    if heading is TowardsInterrupt
      @validator.error('link-heading', 'there is no heading of a link whose endpoints are in the same position')
    heading

  # (String, Any) => Unit
  setVariable: (name, value) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error('set', msgKey, link.getBreedName(), upperName)
    else
      link.setVariable(name, value)

    return

  # (String) => Any
  getVariable: (name) ->
    link = @getSelf()
    if not link.hasVariable(name)
      msgKey    = "_ breed does not own variable _"
      upperName = name.toUpperCase()
      @validator.error(upperName, msgKey, link.getBreedName(), upperName)
    else
      link.getVariable(name)

module.exports = LinkChecks
