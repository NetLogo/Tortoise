{ types, NLType } = require('engine/core/typechecker')

class UnknownType extends NLType
  isOfType: (x) -> throw new Error("should we be checking this?")
  niceName:     -> "unknown type we can't do anything with"

unknown = new UnknownType()

syntaxToTypes = new Map()
syntaxToTypes.set(      1, types.Number)
syntaxToTypes.set(      2, types.Boolean)
syntaxToTypes.set(      4, types.String)
syntaxToTypes.set(      8, types.List)
syntaxToTypes.set(     16, types.TurtleSet)
syntaxToTypes.set(     32, types.PatchSet)
syntaxToTypes.set(     64, types.LinkSet)
syntaxToTypes.set(    128, types.Nobody)
syntaxToTypes.set(    256, types.Turtle)
syntaxToTypes.set(    512, types.Patch)
syntaxToTypes.set(   1024, types.Link)
syntaxToTypes.set(   2048, types.CommandLambda)
syntaxToTypes.set(   4096, types.ReporterLambda)
syntaxToTypes.set(   8192, unknown)
syntaxToTypes.set(  16384, unknown)
syntaxToTypes.set(  32768, unknown)
syntaxToTypes.set(  65536, unknown)
syntaxToTypes.set( 131072, unknown)
syntaxToTypes.set( 262144, unknown)
syntaxToTypes.set( 524288, unknown)
syntaxToTypes.set(1048576, unknown)
syntaxToTypes.set(2097152, unknown)

getTypesFromSyntax = (syntax) ->
  types = []
  getTypesRec = (syntax, check) ->
    hasType = (syntax & check) isnt 0
    if hasType
      types.push(syntaxToTypes.get(check))

    if check is 1
      types
    else
      getTypesRec(syntax, check / 2)

  getTypesRec(syntax, 2097152)

module.exports = {
  getTypesFromSyntax
}
