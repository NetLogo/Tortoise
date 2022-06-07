# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ types, NLType } = require('engine/core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

REPEATABLE_TYPE = 262144

class UnknownType extends NLType
  constructor: (@typeName) ->
    super()

  isOfType: (x) -> throw exceptions.internal("We encountered a '#{@typeName}' type, but we don't know how to handle checking that.")
  niceName:     -> "#{@typeName} type (should not be used)"

unknown = (name) -> new UnknownType(name)

# The third item in these arrays is the "error message order" as copied
# from `TypeNames.scala` in desktop.  I'm sure there is a better way to
# handle this.  -Jeremy B February 2021
syntaxToTypes = [
    [               1, types.Number,          5]
  , [               2, types.Boolean,         6]
  , [               4, types.String,          7]
  , [               8, types.List,            8]
  , [              16, types.TurtleSet,      10]
  , [              32, types.PatchSet,       11]
  , [              64, types.LinkSet,        12]
  , [             112, types.AgentSet,        9]
  , [             128, types.Nobody,         18]
  , [             256, types.Turtle,         13]
  , [            1024, types.Link,           15]
  , [            1792, types.Agent,           4]
  , [            2048, types.CommandLambda,  17]
  , [            4096, types.ReporterLambda, 16]
  , [            8191, types.Wildcard,        3]
  , [            8192, unknown('reference'),     99]
  , [           16384, unknown('command block'), 99]
  , [           32768, unknown('boolean block'), 99]
  , [           65536, unknown('number block'),  99]
  , [          131072, unknown('other block'),   99]
  , [ REPEATABLE_TYPE, unknown('repeatable'),    99]
  , [          524288, unknown('optional'),      99]
  , [         1048576, unknown('code block'),    99]
  , [         2097152, unknown('symbol'),        99]
].reverse() # The reverse is important so we check syntax values from largest to smallest. -Jeremy B February 2021

hasType = (type, check) ->
  (check >= type) and (type & check) isnt 0

# (Int) => Array[NLType]
getTypesFromSyntax = (syntax) ->
  syntaxToTypes.filter( ([check, type, _]) ->
    has = hasType(check, syntax)
    if has
      syntax = syntax - check
    has
  ).sort( (a, b) -> a[2] - b[2] ).map( ([_1, type, _2]) -> type )

removeRepeatable = (syntax) ->
  syntax - (syntax & REPEATABLE_TYPE)

isRepeatable = (check) -> hasType(REPEATABLE_TYPE, check)

module.exports = {
  getTypesFromSyntax
, removeRepeatable
, isRepeatable
}
