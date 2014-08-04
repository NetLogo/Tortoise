# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('util.comparator')

util.comparator = Comparator = {
  NOT_EQUALS: {}

  EQUALS:       { toInt: 0 }
  GREATER_THAN: { toInt: 1 }
  LESS_THAN:    { toInt: -1 }

  # (Number, Number) => { toInt: Number }
  numericCompare: (x, y) ->
    if x < y
      @LESS_THAN
    else if x > y
      @GREATER_THAN
    else
      @EQUALS

}
