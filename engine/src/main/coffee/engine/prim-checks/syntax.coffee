{ types, NLType } = require('engine/core/typechecker')

class UnknownType extends NLType
  isOfType: (x) -> throw new Error("should we be checking this?")
  niceName:     -> "unknown type we can't do anything with"

unknown = new UnknownType()

syntaxToTypes = [
    [      1, types.Number]
  , [      2, types.Boolean]
  , [      4, types.String]
  , [      8, types.List]
  , [     16, types.TurtleSet]
  , [     32, types.PatchSet]
  , [     64, types.LinkSet]
  , [    112, types.AgentSet]
  , [    128, types.Nobody]
  , [    256, types.Turtle]
  , [    512, types.Patch]
  , [   1024, types.Link]
  , [   1792, types.Agent]
  , [   2048, types.CommandLambda]
  , [   4096, types.ReporterLambda]
  , [   8191, types.Wildcard]
  , [   8192, unknown]
  , [  16384, unknown]
  , [  32768, unknown]
  , [  65536, unknown]
  , [ 131072, unknown]
  , [ 262144, unknown]
  , [ 524288, unknown]
  , [1048576, unknown]
  , [2097152, unknown]
].reverse() # The reverse is important so we check syntax values from largest to smallest. -Jeremy B February 2021

getTypesFromSyntax = (syntax) ->
  syntaxToTypes.filter( ([check, type]) ->
    hasType = (syntax >= check) and (syntax & check) isnt 0
    if hasType
      syntax = syntax - check
    hasType
  ).map( ([_, type]) -> type ).reverse()

module.exports = {
  getTypesFromSyntax
}
