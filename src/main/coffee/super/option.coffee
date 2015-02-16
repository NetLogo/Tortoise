# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

Unit = require('./unit')

class Option

  # type T (the type that is maybe (or maybe not) wrapped inside of the `Option`)

  # [U >: T] @ (() => U) => U
  getOrElse: (x) ->
    if @isEmpty() then x() else @get()

  # [U] @ ((T) => U) => Option[U]
  map: (f) ->
    if @isEmpty() then None else new Some(f(@get()))

  # [U] @ ((T) => Option[U]) => Option[U]
  flatMap: (f) ->
    if @isEmpty() then None else f(@get())

  # (T) => Boolean
  filter: (f) ->
    if @isEmpty() or f(@get()) then this else None

  # (T) -> Boolean
  filterNot: (f) ->
    if @isEmpty() or not f(@get()) then this else None

  # (T) -> Boolean
  exists: (f) ->
    not @isEmpty() and f(@get())

  # ((T) -> Unit) -> Unit
  foreach: (f) ->
    if not @isEmpty()
      f(@get())
    Unit

  # [U] @ ((T) -> U) -> Option[U]
  collect: (f) ->
    if not @isEmpty()
      result = f(@get())
      if result?
        new Some(result)
      else
        None
    else
      None

  # [U >: T] @ (() => Option[U]) => Option[U]
  orElse: (optFunc) ->
    if @isEmpty() then optFunc() else this

  # () => Array[T]
  toArray: ->
    if @isEmpty() then [] else [@get()]

class Some extends Option

  # (T) => Some[T]
  constructor: (@_value) ->
    super

  # () => T
  get: ->
    @_value

  # () => Boolean
  isEmpty: ->
    false

class NoneClass extends Option

  # () => NoneClass
  constructor: ->
    super

  # () => T
  get: ->
    throw new Error("None.get")

  # () => Boolean
  isEmpty: ->
    true

None        = new NoneClass # There can be only one! --JAB (2/14/15)
OptionApply = (value) -> if value? then new Some(value) else None

module.exports = {
  None:        None,
  Option:      OptionApply,
  OptionClass: Option,
  Some:        Some
}
