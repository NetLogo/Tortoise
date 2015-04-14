# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_      = require('lodash')
NLType = require('./typechecker')

# Generally, the argument to the constructor is expected to be the result of
# `typeof <that for which you want to create a type>` --JAB (3/13/15)
class OutsideType

  # (String) => OutsideType
  constructor: (@_x) ->

  # () => String
  toString: ->
    @_x

Type = {
  AgentSetType:      { toString: -> "agentset" },
  AgentType:         { toString: -> "agent" },
  BooleanBlockType:  { toString: -> "TRUE/FALSE block" },
  BooleanType:       { toString: -> "TRUE/FALSE" },
  CommandBlockType:  { toString: -> "command block" },
  CommandTaskType:   { toString: -> "command task" },
  LinkSetType:       { toString: -> "link agentset" },
  LinkType:          { toString: -> "link" },
  ListType:          { toString: -> "list" },
  NobodyType:        { toString: -> "NOBODY" },
  NumberBlockType:   { toString: -> "number block" },
  NumberType:        { toString: -> "number" },
  OtherBlockType:    { toString: -> "different kind of block" },
  PatchSetType:      { toString: -> "patch agentset" },
  PatchType:         { toString: -> "patch" },
  ReferenceType:     { toString: -> "variable" },
  ReporterBlockType: { toString: -> "reporter block" },
  ReporterTaskType:  { toString: -> "reporter task" },
  StringType:        { toString: -> "string" },
  TurtleSetType:     { toString: -> "turtle agentset" },
  TurtleType:        { toString: -> "turtle" },
  WildcardType:      { toString: -> "anything" },
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
