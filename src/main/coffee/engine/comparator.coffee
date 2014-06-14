# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(-> {

  NOT_EQUALS: {}

  EQUALS:       { toInt: 0 }
  GREATER_THAN: { toInt: 1 }  #@# Should inherit from `NOT_EQUALS`
  LESS_THAN:    { toInt: -1 } #@# Should inherit from `NOT_EQUALS`

  numericCompare: (x, y) ->
    if x < y
      @LESS_THAN
    else if x > y
      @GREATER_THAN
    else
      @EQUALS

})
