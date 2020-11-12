# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

bundle = {

  # Math Prims

    'atan is undefined when both inputs are zero.': () ->
      "atan is undefined when both inputs are zero."

  , '_ isn_t a valid base for a logarithm.': (b) ->
      "#{b} isn't a valid base for a logarithm."

  , 'The square root of _ is an imaginary number.': (n) ->
      "The square root of #{n} is an imaginary number."

  , 'math operation produced a non-number': () ->
      "math operation produced a non-number"

  , 'math operation produced a number too large for NetLogo': () ->
      "math operation produced a number too large for NetLogo"

  , 'Division by zero.': () ->
      "Division by zero."

  , 'Can_t take logarithm of _.': (n) ->
      "Can't take logarithm of #{n}."

  , 'random-normal_s second input can_t be negative.': () ->
      "random-normal's second input can't be negative."

  , 'Both Inputs to RANDOM-GAMMA must be positive.': () ->
      "Both Inputs to RANDOM-GAMMA must be positive."

  , '_ is not in the allowable range for random seeds (-2147483648 to 2147483647)': (n) ->
      "#{n} is not in the allowable range for random seeds (-2147483648 to 2147483647)"

}

module.exports = bundle
