# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  NOT_EQUALS: {}

  # type Comparison = { toInt: Number }

  EQUALS:       { toInt: 0 }
  GREATER_THAN: { toInt: 1 }
  LESS_THAN:    { toInt: -1 }

  # (Number, Number) => Comparison
  numericCompare: (x, y) ->
    if x < y
      @LESS_THAN
    else if x > y
      @GREATER_THAN
    else
      @EQUALS

}
