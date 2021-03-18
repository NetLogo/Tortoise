# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class NetLogoException
  constructor: (@message) ->

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

# Used by extensions to represent typical runtime errors. -Jeremy B March 2021
class ExtensionException extends NetLogoException
  constructor: (message) ->
    super("Extension exception: #{message}")

# Meant to represent truly exceptional, unexpected circumstances internal to the engine.
# Possibly caused by malformed state or by bugs.  -Jeremy B March 2021
class InternalException extends NetLogoException
  constructor: (message) ->
    super(message)

# Represents typical, expected runtime errors in the engine, like dividing by zero
# or using `ask` on nobody, etc.  -Jeremy B March 2021
class RuntimeException extends NetLogoException
  constructor: (message) ->
    super(message)

class ExceptionFactory
  constructor: () ->

  extension: (message) ->
    new ExtensionException(message)

  halt: () ->
    new HaltInterrupt()

  internal: (message) ->
    new InternalException(message)

  runtime: (message) ->
    new RuntimeException(message)

factory = new ExceptionFactory()

module.exports = {
  exceptionFactory: factory
  ExtensionException
  HaltInterrupt
  InternalException
  RuntimeException
}
