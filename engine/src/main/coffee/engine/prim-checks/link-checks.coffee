# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ TowardsInterrupt } = require('util/interrupts')

class LinkChecks

  constructor: (@validator, @selfPrims) ->

  linkHeading: () ->
    heading = @selfPrims.linkHeading()
    if heading is TowardsInterrupt
      @validator.error('there is no heading of a link whose endpoints are in the same position')
    heading

module.exports = LinkChecks
