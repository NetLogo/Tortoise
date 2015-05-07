# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

NLType = require('../core/typechecker')

Middle      = require('./primsmiddle')
SimplePrims = require('./simpleprims')




# Theoretically, this should be packed up and moved into `SimplePrims`, but doing so would be very messy,
# and I don't want to deal with that right now.  I also fear a ginormous performance hit. --JAB (4/30/15)
equality = (a, b) ->
  typeA = NLType(a)
  typeB = NLType(b)
  (a is b) or (
    if typeA.isList() and typeB.isList()
      a.length is b.length and a.every((elem, i) => @equality(elem, b[i]))
    else if typeA.isAgentSet() and typeB.isAgentSet()
      subsumes = (xs, ys) =>
        for x, index in xs
          if not equality(ys[index], x)
            return false
        true
      a.size() is b.size() and Object.getPrototypeOf(a) is Object.getPrototypeOf(b) and subsumes(a.sort(), b.sort())
    else
      typeA.isBreedSet(b.name) or typeB.isBreedSet(a.name) or
        (a is Nobody and b.isDead?()) or (b is Nobody and a.isDead?()) or ((typeA.isTurtle() or (typeA.isLink() and b isnt Nobody)) and a.compare(b) is EQ)
  )

perform = (options, primName, args) -> throw new Error("unimplemented")

module.exports =

  class PrimsOuter

    primTypechecker: undefined

    # (EveryPrims, RNGPrims) => PrimsOuter
    constructor: (@_rngPrims) ->
      @primTypechecker = new PrimTypechecker

    # () => Nothing
    boom: ->
      SimplePrims.boom()

    # (Any) => Array[_]|String
    butFirst: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.butFirst_list(xs)],
        [[StringType], -> SimplePrims.butFirst_string(xs)]
      ]
      perform(options, "but-first", [xs])

    # (Any) => Array[_]|String
    butLast: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.butLast_list(xs)],
        [[StringType], -> SimplePrims.butLast_string(xs)]
      ]
      perform(options, "but-last", [xs])

    # (Any, Any) => TurtleSet
    breedOn: (breedName, x) ->
      options = [
          [[PatchType],     -> SimplePrims.breedOn_string_patch(breedName, x)],
          [[PatchSetType],  -> SimplePrims.breedOn_string_patchset(breedName, x)],
          [[TurtleType],    -> SimplePrims.breedOn_string_turtle(breedName, x)],
          [[TurtleSetType], -> SimplePrims.breedOn_string_turtleset(breedName, x)]
        ]
      perform(options, "#{breedName}-on", [x])

    # (Any) => Boolean
    empty: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.empty_list(xs)],
        [[StringType], -> SimplePrims.empty_string(xs)]
      ]
      perform(options, "empty", [xs])

    # (Any, Any) => Boolean
    equality: (a, b) ->
      options = [
        [[WildcardType, WildcardType], -> equality(a, b)]
      ]
      perform(options, "=", [a, b])

    # (Any) => Any
    first: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.first_list(xs)],
        [[StringType], -> SimplePrims.first_string(xs)]
      ]
      perform(options, "first", [xs])

    # [T] @ (T, Any) => Array[T]
    fput: (x, xs) ->
      options = [
        [[WildcardType, ListType], -> SimplePrims.fput_t_list(x, xs)]
      ]
      perform(options, "fput", [x, xs])

    # (Any, Any) => Boolean
    gt: (a, b) ->
      options = [
        [[StringType, StringType], -> SimplePrims.gt_string_string(a, b)],
        [[NumberType, NumberType], -> SimplePrims.gt_number_number(a, b)],
        [[AgentType,  AgentType],  -> SimplePrims.gt_comparable_comparable(a, b)]
      ]
      perform(options, ">", [a, b])

    # (Any, Any) => Boolean
    gte: (a, b) ->
      options = [
        [[StringType, StringType], -> SimplePrims.gt_string_string(a, b)         or equality(a, b)],
        [[NumberType, NumberType], -> SimplePrims.gt_number_number(a, b)         or equality(a, b)],
        [[AgentType,  AgentType],  -> SimplePrims.gt_comparable_comparable(a, b) or equality(a, b)]
      ]
      perform(options, ">=", [a, b])

    # (Any, Any) => Any
    item: (i, xs) ->
      options = [
        [[NumberType, ListType],   -> SimplePrims.item_number_list(i, xs)],
        [[NumberType, StringType], -> SimplePrims.item_number_string(i, xs)]
      ]
      perform(options, "item", [i, xs])

    # (Any) => Any
    last: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.last_list(xs)],
        [[StringType], -> SimplePrims.last_string(xs)]
      ]
      perform(options, "last", [xs])

    # (Any) => Number
    length: (xs) ->
      options = [
        [[ListType],   -> SimplePrims.length_list(xs)],
        [[StringType], -> SimplePrims.length_string(xs)]
      ]
      perform(options, "length", [xs])

    # [T] @ (T*) => Array[T]
    list: (xs...) ->
      options = [
        [[TypeSet(WildcardType, false, true)], -> SimplePrims.list_ts(xs...)]
      ]
      perform(options, "list", [xs])

    # [T] @ (T, Any) => Array[T]
    lput: (x, xs) ->
      options = [
        [[WildcardType, ListType], -> SimplePrims.lput_t_list(x, xs)]
      ]
      perform(options, "lput", [x, xs])

    # (Any, Any) => Boolean
    lte: (a, b) ->
      options = [
        [[StringType, StringType], -> SimplePrims.lt_string_string(a, b)         or equality(a, b)],
        [[NumberType, NumberType], -> SimplePrims.lt_number_number(a, b)         or equality(a, b)],
        [[AgentType,  AgentType],  -> SimplePrims.lt_comparable_comparable(a, b) or equality(a, b)]
      ]
      perform(options, "<=", [a, b])

    # (Any, Any) => Boolean
    lt: (a, b) ->
      options = [
        [[StringType, StringType], -> SimplePrims.lt_string_string(a, b)],
        [[NumberType, NumberType], -> SimplePrims.lt_number_number(a, b)],
        [[AgentType,  AgentType],  -> SimplePrims.lt_comparable_comparable(a, b)]
      ]
      perform(options, "<", [a, b])

    # (Any) => Number
    max: (xs) ->
      options = [
        [[ListType], -> SimplePrims.max_list(xs)]
      ]
      perform(options, "max", [xs])

    # (Any) => Number
    mean: (xs) ->
      options = [
        [[ListType], -> SimplePrims.mean_list(xs)]
      ]
      perform(options, "mean", [xs])

    # (Any) => Number
    median: (xs) ->
      options = [
        [[ListType], -> Middle.median_list(xs)]
      ]
      perform(options, "median", [xs])

    # (Any) => Number
    min: (xs) ->
      options = [
        [[ListType], -> SimplePrims.min_list(xs)]
      ]
      perform(options, "min", [xs])

    # (Any) => Number
    random: (n) ->
      options = [
        [[NumberType], => @_rngPrims.random_number(n)]
      ]
      perform(options, "random", [n])

    # (Any) => Number
    randomFloat: (n) ->
      options = [
        [[NumberType], => @_rngPrims.randomFloat_number(n)]
      ]
      perform(options, "random-float", [n])

    # (Any, Any) => Array[_]|String
    removeItem: (i, xs) ->
      options = [
        [[NumberType, ListType],   -> SimplePrims.removeItem_number_list(i, xs)],
        [[NumberType, StringType], -> SimplePrims.removeItem_number_string(i, xs)]
      ]
      perform(options, "remove-item", [i, xs])

    # (Any) => Array[_]
    reverse: (xs) ->
      options = [
        [[ListType], -> SimplePrims.revserse_list(xs)]
      ]
      perform(options, "reverse", [xs])

    # (Any*) => Array[_]
    sentence: (xs...) ->
      options = [
        [[TypeSet(WildcardType, false, true)], -> SimplePrims.sentence_listOrTs(xs...)]
      ]
      perform(options, "sentence", [xs])

    # (Any) => Array[_]
    sort: (xs) ->
      options = [
        [[ListType], -> Middle.sort_list(xs)]
      ]
      perform(options, "sort", [xs])

    # (Any) => Number
    standardDeviation: (xs) ->
      options = [
        [[ListType], -> Middle.standardDeviation_list(xs)]
      ]
      perform(options, "standard-deviation", [xs])

    # [T] @ (Any, Any, Any) => Array[T]
    sublist: (xs, n1, n2) ->
      options = [
        [[ListType, NumberType, NumberType], -> SimplePrims.sublist_list_number_number(xs, n1, n2)]
      ]
      perform(options, "sublist", [xs, n1, n2])

    # (Any, Any, Any) => String
    substring: (str, n1, n2) ->
      options = [
        [[StringType, NumberType, NumberType], -> SimplePrims.substring_list_number_number(str, n1, n2)]
      ]
      perform(options, "substring", [str, n1, n2])

    # (Any) => Number
    sum: (xs) ->
      options = [
        [[ListType], -> Middle.sum_list(xs)]
      ]
      perform(options, "sum", [xs])

    # (Any) => TurtleSet
    turtlesOn: (x) ->
      options = [
        [[PatchType],     -> SimplePrims.turtlesOn_patch(x)],
        [[PatchSetType],  -> SimplePrims.turtlesOn_patchset(x)],
        [[TurtleType],    -> SimplePrims.turtlesOn_turtle(x)],
        [[TurtleSetType], -> SimplePrims.turtlesOn_turtleset(x)]
      ]
      perform(options, "turtles-on", [x])

    # (Any) => Number
    variance: (xs) ->
      options = [
        [[ListType], -> Middle.variance_list(xs)]
      ]
      perform(options, "variance", [xs])

