# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class VariableSpec
  # (String) => VariableSpec[T]
  constructor: (@name) ->

class ExtraVariableSpec extends VariableSpec

class ImmutableVariableSpec extends VariableSpec
  # (String, () => T) => ImmutableVariableSpec[T]
  constructor: (name, @get) ->
    super(name)

class MutableVariableSpec extends VariableSpec
  #(String, () => T, (T) => Unit) => MutableVariableSpec[T]
  constructor: (name, @get, set, setIfValid) ->
    super(name)
    @set        = set
    @setIfValid = if setIfValid? then setIfValid else set

module.exports = {
  ExtraVariableSpec
  ImmutableVariableSpec
  MutableVariableSpec
  VariableSpec
}
