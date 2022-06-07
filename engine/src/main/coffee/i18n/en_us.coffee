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

  , '_ is too large to be represented exactly as an integer in NetLogo': (n) ->
      "#{n} is too large to be represented exactly as an integer in NetLogo"

  , '_ expected input to be _ but got _ instead.': (prim, expectedType, actualType) ->
      "#{prim} expected input to be #{expectedType} but got #{actualType} instead."

  , 'List is empty.': () ->
      "List is empty."

  , 'Can_t find element _ of the _ _, which is only of length _.': (n, type, list, length) ->
      "Can't find element #{n} of the #{type} #{list}, which is only of length #{length}."

  , 'The list argument to reduce must not be empty.': () ->
      "The list argument to reduce must not be empty."

  , '_ is greater than the length of the input list (_).': (endIndex, listLength) ->
      "#{endIndex} is greater than the length of the input list (#{listLength})."

  , '_ is less than zero.': (index) ->
      "#{index} is less than zero."

  , '_ is less than _.': (endIndex, startIndex) ->
      "#{endIndex} is less than #{startIndex}."

  , '_ got an empty _ as input.': (prim, type) ->
      "#{prim} got an empty #{type} as input."

  , '_ isn_t greater than or equal to zero.': (index) ->
      "#{index} isn't greater than or equal to zero."

  , 'Can_t find the _ of a list with no numbers: __': (aspect, list, punc) ->
      "Can't find the #{aspect} of a list with no numbers: #{list}#{punc}"

  , 'Requested _ random items from a list of length _.': (count, length) ->
      "Requested #{count} random items from a list of length #{length}."

  , 'Requested _ random agents from a set of only _ agents.': (count, size) ->
      "Requested #{count} random agents from a set of only #{size} agents."

  , 'Can_t find the _ of a list without at least two numbers: __': (aspect, list, punc) ->
      "Can't find the #{aspect} of a list without at least two numbers: #{list}#{punc}"

  , 'Invalid list of points: _': (points) ->
      "Invalid list of points: #{points}"

  , 'Requested _ random agents from a set of only _ agents.': (n, size) ->
      "Requested #{n} random agents from a set of only #{size} agents."

  , 'First input to _ can_t be negative.': (prim) ->
      "First input to #{prim} can't be negative."

  , '_ expected a true/false value from _, but got _ instead.': (prim, item, value) ->
    "#{prim} expected a true/false value from #{item}, but got #{value} instead."

  , '_ expected input to be a _ agentset or _ but got _ instead.': (prim, agentType, value) ->
    "#{prim} expected input to be a #{agentType} agentset or #{agentType} but got #{value} instead."

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.': (prim, agentType, list, value) ->
    "List inputs to #{prim} must only contain #{agentType}, #{agentType} agentset, or list elements.  The list #{list} contained #{value} which is NOT a #{agentType} or #{agentType} agentset."

  , 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.': (prim, agentType, list, value) ->
    "List inputs to #{prim} must only contain #{agentType}, #{agentType} agentset, or list elements.  The list #{list} contained a different type agentset: #{value}."

  , 'SORT-ON works on numbers, strings, or agents of the same type, but not on _ and _': (type1, type2) ->
    "SORT-ON works on numbers, strings, or agents of the same type, but not on #{type1} and #{type2}"

  , 'anonymous procedure expected _ input_, but only got _': (needed, given) ->
    "anonymous procedure expected #{needed} input#{if needed isnt 1 then "s" else ""}, but only got #{given}"

  , 'REPORT can only be used inside TO-REPORT.': () ->
    "REPORT can only be used inside TO-REPORT."

  , 'STOP is not allowed inside TO-REPORT.': () ->
    "STOP is not allowed inside TO-REPORT."

  , 'Reached end of reporter procedure without REPORT being called.': () ->
    "Reached end of reporter procedure without REPORT being called."

  , '_ doesn_t accept further inputs if the first is a string': (primName) ->
    "#{primName} doesn't accept further inputs if the first is a string"

  , 'Unfortunately, no perfect equivalent to `_` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web.': (primName) ->
    "Unfortunately, no perfect equivalent to `#{primName}` can be implemented in NetLogo Web.  However, the \'import-a\' and \'fetch\' extensions offer primitives that can accomplish this in both NetLogo and NetLogo Web."

  , 'The point [ _ , _ ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.': (x, y) ->
    "The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions."

  , 'Cannot move turtle beyond the world_s edge.': () ->
    "Cannot move turtle beyond the world's edge."

  , 'there is no heading of a link whose endpoints are in the same position': () ->
    "there is no heading of a link whose endpoints are in the same position"

  , 'No heading is defined from a point (_,_) to that same point.': (x, y) ->
    "No heading is defined from a point (#{x},#{y}) to that same point."

  , '_ breed does not own variable _': (breedName, varName) ->
    "#{breedName} breed does not own variable #{varName}"

  , 'All the list arguments to _ must be the same length.': (primName) ->
    "All the list arguments to #{primName} must be the same length."

  , 'The step-size for range must be non-zero.': () ->
    "The step-size for range must be non-zero."

  , 'range expects at most three arguments': () ->
    "range expects at most three arguments"

}

module.exports = bundle
