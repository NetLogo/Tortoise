# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath                            = require('util/nlmath')
TaskPrims                         = require('../prim/tasks')
{ isRepeatable, removeRepeatable } = require('./syntax')

class TaskChecks

  constructor: (@validator) ->

  # (Int, Int, Function, String, Boolean, Boolean) => Function
  checked: (sourceStart, sourceEnd, fn, body, isReporter, isVariadic) ->
    primName = if isReporter then "runresult" else "run"

    # we cannot bind the task function itself since that'll change the arguments, too.
    validator  = @validator

    checkedTask = () ->
      needed = fn.length
      given  = arguments.length
      if given < needed
        validator.error(primName, sourceStart, sourceEnd, 'anonymous procedure expected _ input_, but only got _', needed, given)
      fn(arguments...)

    checkedTask.minArgCount = fn.length
    checkedTask.isReporter  = isReporter
    checkedTask.isVariadic  = isVariadic
    checkedTask.nlogoBody   = body
    checkedTask

  # (String, Int, Int, Array[Int], Array[Any])
  checkVarArgs: (primName, sourceStart, sourceEnd, expectedTypes, args...) ->
    # assume if no args given, then there is only one expected type, and it is variadic
    # other checks will catch the length mismatch if not.  -Jeremy B June 2022
    if args.length isnt 0
      varStartIndex = expectedTypes.findIndex(isRepeatable)
      varEndIndex   = args.length - (expectedTypes.length - varStartIndex)

      preVarArgs  = args.slice(0            , varStartIndex)
      varArgs     = args.slice(varStartIndex, varEndIndex + 1)
      postVarArgs = args.slice(varEndIndex + 1)
      varType     = removeRepeatable(expectedTypes[varStartIndex])

      preVarArgs.forEach( (arg, i) => @validator.checkArg(primName, sourceStart, sourceEnd, expectedTypes[i], arg) )
      varArgs.forEach( (arg, i) => @validator.checkArg(primName, sourceStart, sourceEnd, varType, arg) )
      postVarArgs.forEach( (arg, i) => @validator.checkArg(primName, sourceStart, sourceEnd, expectedTypes[i + varEndIndex], arg) )

    args

  # (Int, Int, Array[T]*, (T) => Unit) => Unit
  forEach: (sourceStart, sourceEnd) ->
    args  = Array.from(arguments)
    lists = args.slice(2, args.length - 1)
    fn    = args[args.length - 1]
    @areListsSameLength('foreach', sourceStart, sourceEnd, lists)
    Tasks.forEach(fn, lists)

  map: (sourceStart, sourceEnd, fn, lists...) ->
    @areListsSameLength('map', sourceStart, sourceEnd, lists)
    Tasks.map(fn, lists)

  # (Int, Int, Number, (Int) => T) => Array[T]
  nValues: (sourceStart, sourceEnd, n, fn) ->
    if n < 0
      @validator.error("n-values", sourceStart, sourceEnd, "_ cannot take a negative number.", "N-VALUES")

    Tasks.nValues(NLMath.floor(n), fn)

  areListsSameLength: (primName, sourceStart, sourceEnd, lists) ->
    head = lists[0]
    if not lists.every( (l) -> l.length is head.length )
      @validator.error(primName, sourceStart, sourceEnd, "All the list arguments to _ must be the same length.", primName.toUpperCase())


module.exports = TaskChecks
