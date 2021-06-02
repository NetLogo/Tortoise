# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class Procedure
  # (String, SourceLocation, () => Any)
  constructor: (@name, start, end, @call) ->
    @location = Object.freeze({ start, end })
    return

class Reporter extends Procedure

class Command extends Procedure

module.exports = { Command, Reporter }
