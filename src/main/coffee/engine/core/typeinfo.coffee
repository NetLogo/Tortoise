# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_                 = require('lodash')
ArgumentTypeError = require('./argumenttypeerror')
NLType            = require('./typechecker')

# Generally, the argument to the constructor is expected to be the result of
# `typeof <that for which you want to create a type>` --JAB (3/13/15)
class OutsideType

  # (String) => OutsideType
  constructor: (@_x) ->

  # (Any) => Boolean
  isTheTypeOf: (x) ->
    typeof(@_x) is @toString()

  # () => String
  toString: ->
    @_x

Type = {
  AgentSetType:      { isTheTypeOf: ((x) -> NLType(x).isAgentSet()    ), toString: -> "agentset"                },
  AgentType:         { isTheTypeOf: ((x) -> NLType(x).isAgent()       ), toString: -> "agent"                   },
  BooleanBlockType:  { isTheTypeOf: ((x) -> false                     ), toString: -> "TRUE/FALSE block"        },
  BooleanType:       { isTheTypeOf: ((x) -> NLType(x).isBoolean()     ), toString: -> "TRUE/FALSE"              },
  CommandBlockType:  { isTheTypeOf: ((x) -> false                     ), toString: -> "command block"           },
  CommandTaskType:   { isTheTypeOf: ((x) -> NLType(x).isCommandTask() ), toString: -> "command task"            },
  LinkSetType:       { isTheTypeOf: ((x) -> NLType(x).isLinkSet()     ), toString: -> "link agentset"           },
  LinkType:          { isTheTypeOf: ((x) -> NLType(x).isLink()        ), toString: -> "link"                    },
  ListType:          { isTheTypeOf: ((x) -> NLType(x).isList()        ), toString: -> "list"                    },
  NobodyType:        { isTheTypeOf: ((x) -> NLType(x).isNobody()      ), toString: -> "NOBODY"                  },
  NumberBlockType:   { isTheTypeOf: ((x) -> false                     ), toString: -> "number block"            },
  NumberType:        { isTheTypeOf: ((x) -> NLType(x).isNumber()      ), toString: -> "number"                  },
  OtherBlockType:    { isTheTypeOf: ((x) -> false                     ), toString: -> "different kind of block" },
  PatchSetType:      { isTheTypeOf: ((x) -> NLType(x).isPatchSet()    ), toString: -> "patch agentset"          },
  PatchType:         { isTheTypeOf: ((x) -> NLType(x).isPatch()       ), toString: -> "patch"                   },
  ReferenceType:     { isTheTypeOf: ((x) -> false                     ), toString: -> "variable"                },
  ReporterBlockType: { isTheTypeOf: ((x) -> false                     ), toString: -> "reporter block"          },
  ReporterTaskType:  { isTheTypeOf: ((x) -> NLType(x).isReporterTask()), toString: -> "reporter task"           },
  StringType:        { isTheTypeOf: ((x) -> NLType(x).isString()      ), toString: -> "string"                  },
  TurtleSetType:     { isTheTypeOf: ((x) -> NLType(x).isTurtleSet()   ), toString: -> "turtle agentset"         },
  TurtleType:        { isTheTypeOf: ((x) -> NLType(x).isTurtle()      ), toString: -> "turtle"                  },
  WildcardType:      { isTheTypeOf: ((x) -> true                      ), toString: -> "anything"                },
  OutsideType
}

Types = {

  # (String) => String
  prefixedSingularFor: (x) ->
    prefix =
      switch x
        when "NOBODY", "anything" then ""
        else
          switch x[0].toUpperCase()
            when "A", "E", "I", "O", "U" then "an "
            else                              "a "
    "#{prefix}#{x}"

  # (Any) => TypeSet
  typeOf: (x) ->
    type = NLType(x)
    nlType =
      if not x?
        new OutsideType("null")
      else if type.isNumber()
        Type.NumberType
      else if type.isBoolean()
        Type.BooleanType
      else if type.isString()
        Type.StringType
      else if type.isList()
        Type.ListType
      else if type.isAgentSet()
        Type.AgentSetType
      else if type.isNobody()
        Type.NobodyType
      else if type.isTurtle()
        Type.TurtleType
      else if type.isPatch()
        Type.PatchType
      else if type.isLink()
        Type.LinkType
      else if type.isReporterTask()
        Type.ReporterTaskType
      else if type.isCommandTask()
        Type.CommandTaskType
      else
        new Type.OtherType(typeof x)
    new TypeSet([nlType])

  # (String, TypeSet, Any) => Unit
  throwIfNotCompatible: (primName, typeSet, target) ->
    if not _(typeSet.toList()).any((x) -> x.isTheTypeOf(target))
      throw new ArgumentTypeError(primName.toUpperCase(), typeSet, target)
    return

}

# This is to be used as a type union (i.e. type disjunction, "OR"), and not a product type
# (i.e. tuple) or compound type (i.e. mixin) --JAB (3/13/15)
class TypeSet

  # (Array[Type], Boolean, Boolean) => TypeSet
  constructor: (@_types, @isOptional = false, @isRepeatable = false) ->

  # () => Array[Type]
  toList: ->
    @_types

  # () => String
  toString: ->
    if not _(@_types).isEmpty()
      [head, tail...] = @_types.map((x) -> x.toString())
      core   = _(tail).foldl(((acc, x) -> "#{acc} or #{x}"), head)
      suffix = if @isOptional then " (optional)" else ""
      "#{core}#{suffix}"
    else
      "(none)"

module.exports = {
  Type,
  Types,
  TypeSet
}
