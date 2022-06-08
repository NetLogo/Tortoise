# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLMath                            = require('util/nlmath')
TaskPrims                         = require('../prim/tasks')
{ isRepeatable, removeRepeatable } = require('./syntax')

class TaskChecks

  constructor: (@validator) ->

  # (Function, String, Boolean, Boolean) => Function
  checked: (fn, body, isReporter, isVariadic) ->
    primName = if isReporter then "runresult" else "run"

    # we cannot bind the task function itself since that'll change the arguments, too.
    validator  = @validator

    checkedTask = () ->
      needed = fn.length
      given  = arguments.length
      if given < needed
        validator.error(primName, 'anonymous procedure expected _ input_, but only got _', needed, given)
      fn(arguments...)

    checkedTask.minArgCount = fn.length
    checkedTask.isReporter  = isReporter
    checkedTask.isVariadic  = isVariadic
    checkedTask.nlogoBody   = body
    checkedTask

  checkVarArgs: (primName, expectedTypes, args...) ->
    # assume if no args given, then there is only one expected type, and it is variadic;
    # other checks will catch the length mismatch if not.  -Jeremy B June 2022
    if args.length isnt 0
      varStartIndex = expectedTypes.findIndex(isRepeatable)
      varEndIndex   = args.length - (expectedTypes.length - varStartIndex)

      preVarArgs  = args.slice(0            , varStartIndex)
      varArgs     = args.slice(varStartIndex, varEndIndex + 1)
      postVarArgs = args.slice(varEndIndex + 1)
      varType     = removeRepeatable(expectedTypes[varStartIndex])

      preVarArgs.forEach( (arg, i) => @validator.checkArg(primName, expectedTypes[i], arg) )
      varArgs.forEach( (arg, i) => @validator.checkArg(primName, varType, arg) )
      postVarArgs.forEach( (arg, i) => @validator.checkArg(primName, expectedTypes[i + varEndIndex], arg) )

    args

  forEach: () ->
    args  = Array.from(arguments)
    lists = args.slice(0, args.length - 1)
    fn    = args[args.length - 1]
    @areListsSameLength('foreach', lists)
    Tasks.forEach(fn, lists)

  map: (fn, lists...) ->
    @areListsSameLength('map', lists)
    Tasks.map(fn, lists)

  nValues: (n, fn) ->
    if n < 0
      @validator.error("n-values", "_ cannot take a negative number.", "N-VALUES")

    Tasks.nValues(NLMath.floor(n), fn)

  areListsSameLength: (primName, lists) ->
    head = lists[0]
    if not lists.every( (l) -> l.length is head.length )
      @validator.error(primName, "All the list arguments to _ must be the same length.", primName.toUpperCase())


module.exports = TaskChecks
