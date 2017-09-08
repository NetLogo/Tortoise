# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

readFromString = (str) ->
  try Converter.nlStrToJS(str)
  catch ex
    throw new Error(ex.message)

scalaJSEvalCommand = (str) ->
  throw new Error("`run` is not yet implemented for strings")

scalaJSEvalReporter = (str) ->
  throw new Error("`run-result` is not yet implemented for strings")

module.exports.Config =
  class EvalConfig
    # ((String) => Unit, (String) => Any, (String) => Any) => EvalConfig
    constructor: (@runCommand     = scalaJSEvalCommand
                , @runReporter    = scalaJSEvalReporter
                , @readFromString = readFromString) ->
