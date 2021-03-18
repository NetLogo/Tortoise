# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ fold, maybe, None } = require('brazierjs/maybe')

class NetLogoException
  constructor: (@message, @stackTrace = "") ->

class HaltInterrupt extends NetLogoException
  constructor: ->
    super("model halted by user")

# Used by extensions to represent typical runtime errors. -Jeremy B March 2021
class ExtensionException extends NetLogoException
  constructor: (message, stackTrace) ->
    super("Extension exception: #{message}", stackTrace)

# Meant to represent truly exceptional, unexpected circumstances internal to the engine.
# Possibly caused by malformed state or by bugs.  -Jeremy B March 2021
class InternalException extends NetLogoException
  constructor: (message, stackTrace) ->
    super(message, stackTrace)

# Represents typical, expected runtime errors in the engine, like dividing by zero
# or using `ask` on nobody, etc.  -Jeremy B March 2021
class RuntimeException extends NetLogoException
  constructor: (message, stackTrace) ->
    super(message, stackTrace)

class ExceptionFactory
  # Having `procedurePrims` be unset and then letting the `ExceptionFactory`
  # instance essentially be a singleton means this is static/global, mutable state.
  # It's not my favorite way to handle this, but there are too many places where
  # exceptions are needed in the engine that are also essentially static
  # (`ColorModel` and the import/export code as examples) and I don't want to
  # refactor everything just to have this value available at runtime.
  # -Jeremy B March 2021
  @procedurePrims = None

  # (ProcedurePrims) => Unit
  setProcecurePrims: (procedurePrims) ->
    @procedurePrims = maybe(procedurePrims)

  # (String) => String
  makeStackTrace: (primitive = "") ->
    start = "error while running #{if primitive is "" then "a primitive" else primitive.toUpperCase()}"
    stack = fold( -> [] )( (procs) -> procs.stack().trace() )(@procedurePrims)
    if stack isnt "" then "#{start}\n#{stack}" else start

  # (String) => ExtensionException
  extension: (message) ->
    new ExtensionException(message, @makeStackTrace())

  # () => HaltInterrupt
  halt: () ->
    new HaltInterrupt()

  # (String) => InternalException
  internal: (message) ->
    new InternalException(message, @makeStackTrace())

  # (String, String) => RuntimeException
  runtime: (message, primitive) ->
    new RuntimeException(message, @makeStackTrace(primitive))

factory = new ExceptionFactory()

module.exports = {
  exceptionFactory: factory
  ExtensionException
  HaltInterrupt
  InternalException
  RuntimeException
}
