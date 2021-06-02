# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ types, NLType } = require('engine/core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

class UnknownType extends NLType
  isOfType: (x) -> throw exceptions.internal("should we be checking this?")
  niceName:     -> "unknown type we can't do anything with"

unknown = new UnknownType()

# The third item in these arrays is the "error message order" as copied
# from `TypeNames.scala` in desktop.  I'm sure there is a better way to
# handle this.  -Jeremy B February 2021
syntaxToTypes = [
    [      1, types.Number, 5]
  , [      2, types.Boolean, 6]
  , [      4, types.String, 7]
  , [      8, types.List, 8]
  , [     16, types.TurtleSet, 10]
  , [     32, types.PatchSet, 11]
  , [     64, types.LinkSet, 12]
  , [    112, types.AgentSet, 9]
  , [    128, types.Nobody, 18]
  , [    256, types.Turtle, 13]
  , [    512, types.Patch, 14]
  , [   1024, types.Link, 15]
  , [   1792, types.Agent, 4]
  , [   2048, types.CommandLambda, 17]
  , [   4096, types.ReporterLambda, 16]
  , [   8191, types.Wildcard, 3]
  , [   8192, unknown, 99]
  , [  16384, unknown, 99]
  , [  32768, unknown, 99]
  , [  65536, unknown, 99]
  , [ 131072, unknown, 99]
  , [ 262144, unknown, 99]
  , [ 524288, unknown, 99]
  , [1048576, unknown, 99]
  , [2097152, unknown, 99]
].reverse() # The reverse is important so we check syntax values from largest to smallest. -Jeremy B February 2021

# (Int) => Array[NLType]
getTypesFromSyntax = (syntax) ->
  syntaxToTypes.filter( ([check, type, _]) ->
    hasType = (syntax >= check) and (syntax & check) isnt 0
    if hasType
      syntax = syntax - check
    hasType
  ).sort( (a, b) -> a[2] - b[2] ).map( ([_1, type, _2]) -> type )

module.exports = {
  getTypesFromSyntax
}
