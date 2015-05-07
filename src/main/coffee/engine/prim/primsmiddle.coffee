# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

SimplePrims = require('./simpleprims')

# (Array[Any]) => Array[Number]
justTheNumbersFrom = (xs) ->
  xs.filter((x) -> NLType(x).isNumber())

module.exports =
  class PrimsMiddle

    # (ListPrims) => PrimsMiddle
    constructor: (@_listPrims) ->

    # (Array[Any]) => Number
    median_list: (xs) ->
      nums = justTheNumbersFrom(xs)
      if nums.length isnt 0
        median = SimplePrims.median_numberList(nums)
        NLMath.validateNumber(median)
      else
        throw new Error("Can't find the median of a list with no numbers: #{Dump(xs)}.")

    # [T, U >: T] @ (Number, Array[T], U) => Array[U]
    replaceItem_number_list_t: (index, xs, newItem) ->
      if index < 0
        throw new Error("#{index} isn't greater than or equal to zero.")
      else if index >= xs.length
        throw new Error("Can't find element #{index} of the list #{Dump(xs)}, which is only of length #{xs.length}.")
      else
        SimplePrims.replaceItem_number_list_t(index, xs, newItem)

    # (Number, String, String) => String
    replaceItem_number_string_string: (index, str, newItem) ->
      if index < 0
        throw new Error("#{index} isn't greater than or equal to zero.")
      else if index >= str.length
        throw new Error("Can't find element #{index} of the string #{Dump(str)}, which is only of length #{str.length}.")
      else
        SimplePrims.replaceItem_number_string_string(index, str, newItem)

    # [T] @ (Array[T]) => Array[T]
    sort_list: (xs) ->
      filtered     = xs.filter((x) -> x isnt Nobody)
      forAll       = (f) -> _.all(filtered, f)
      agentClasses = [Turtle, Patch, Link]
      if _(filtered).isEmpty()
        filtered
      else if forAll((x) -> NLType(x).isNumber())
        SimplePrims.sort_numberList(filtered)
      else if forAll((x) -> NLType(x).isString())
        SimplePrims.sort_stringList(filtered)
      else if _(agentClasses).some((agentClass) -> forAll((x) -> x instanceof agentClass))
        SimplePrims.sort_agentList(filtered)
      else
        throw new Error("We don't know how to sort your kind here!")

    # (Array[Any]) => Number
    standardDeviation_list: (xs) ->
      nums = justTheNumbersFrom(xs)
      if nums.length > 1
        stdDev = SimplePrims.standardDeviation_numberList(nums)
        NLMath.validateNumber(stdDev)
      else
        throw new Error("Can't find the standard deviation of a list without at least two numbers: #{Dump(xs)}")

    # (Array[Number]) => Number
    sum_list: (xs) ->
      NLMath.validateNumber(SimplePrims.sum_list(xs))

    # (Array[Any]) => Number
    variance_list: (xs) ->
      nums = justTheNumbersFrom(xs)
      if nums.length >= 2
        SimplePrims.variance_numberList(nums)
      else
        throw new Error("Can't find the variance of a list without at least two numbers")
