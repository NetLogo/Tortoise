# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ BreedNamePair
, BreedReference
, ExportedCommandLambda
, ExportedLinkSet
, ExportedPatchSet
, ExportedReporterLambda
, ExportedTurtleSet
, LinkReference
, NobodyReference
, PatchReference
, TurtleReference
} = require('./exportstructures')

{ fold, isSomething, map: mapMaybe, maybe, None } = require('brazier/maybe')

# (String) => Number
firstIndexOfUnescapedQuote = (str) ->
  index = str.indexOf('"')
  if index > 0
    if str[index - 1] isnt "\\"
      index
    else
      1 + index + firstIndexOfUnescapedQuote(str.slice(index + 1))
  else
    index

# (String, (String) => Any, (String) => Any) => Array[Any]
parseList = ->

  parseListHelper = (list, readValue, readAgentLike) ->

    parseInner = (contents, acc = [], accIndex = 0) ->

      strIndex = ( char) -> contents.indexOf(char)
      strFrom  = (index) -> contents.slice(index)
      strUntil = (index) -> contents.slice(0, index)
      tempered = (index) -> index + (if contents[index + 1] is ']' then 1 else 2)

      recurse = (nextIndex, item) ->
        parseInner(strFrom(nextIndex), acc.concat([item]), accIndex + nextIndex)

      if not (contents.startsWith('(anonymous command:') or contents.startsWith('(anonymous reporter:'))
        switch contents[0]
          when ']' # End of list
            [acc, accIndex + 1]
          when '[' # Start of list
            [item, endIndex] = parseListHelper(contents, readValue, readAgentLike)
            recurse(tempered(endIndex), item)
          when '{' # Start of agent/agentset
            index = strIndex('}')
            recurse(tempered(   index), readAgentLike(strUntil(index + 1)))
          when '"' # Start of string
            index = firstIndexOfUnescapedQuote(strFrom(1)) + 1
            recurse(tempered(   index), readValue(    strUntil(index + 1)))
          else
            rightIndex = strIndex(']') # End of next item, if there's no item after it
            spaceIndex = strIndex(' ') # Separator between next item and the one after
            if rightIndex < spaceIndex or spaceIndex < 0
              recurse(rightIndex    , readValue(strUntil(rightIndex)))
            else
              recurse(spaceIndex + 1, readValue(strUntil(spaceIndex)))
      else
        throw new Error("Importing a list of anonymous procedures?  Not happening!")

    if list[0] is '['
      parseInner(list.slice(1))
    else
      throw new Error("Not a valid list: #{list}")

  parseListHelper(arguments...)[0]

# (Regex, String, String) => RegexMatch
match = (regex, str) ->
  result = str.match(regex)
  if result?
    result
  else
    throw new Error("Could not match regex #{regex} with this string: #{str}")

# (String) => Boolean
module.exports.parseBool = (x) ->
  x.toLowerCase() is "true"

# (String) => BreedReference
parseBreedMaybe = (x) ->
  switch x
    when "{all-turtles}" then maybe(new BreedReference("TURTLES"))
    when "{all-patches}" then maybe(new BreedReference("PATCHES"))
    when "{all-links}"   then maybe(new BreedReference( "LINKS" ))
    else
      parseGeneric(/{breed (.*)}/)(
        ([_, breedName]) -> new BreedReference(breedName.toLowerCase())
      )(x)

# (String) => BreedReference
module.exports.parseBreed = (x) ->
  fold(-> throw new Error("Cannot parse as breed: #{x}"))((x) -> x)(parseBreedMaybe(x))

# (String) => String
module.exports.parseString = (str) ->
  match(/^"(.*)"$/, str)[1]

# [T] @ (RegExp) => ((Array[String]) => Maybe[T]) => (String) => Maybe[T]
parseGeneric = (regex) -> (f) -> (x) ->
  mapMaybe(f)(maybe(x.match(regex)))

# ((String) => String) => (String) => Maybe[TurtleReference]
parseTurtleRefMaybe = (singularToPlural) ->
  parseGeneric(/{([^ ]+) (\d+)}/)(
    ([_, breedName, idStr]) ->
      breed = new BreedNamePair(breedName, singularToPlural(breedName).toLowerCase())
      new TurtleReference(breed, parseInt(idStr))
  )

module.exports.parseTurtleRefMaybe = parseTurtleRefMaybe

# (String) => Maybe[PatchReference]
parsePatchRefMaybe =
  parseGeneric(/{patch ([\d-]+) ([\d-]+)}/)(
    ([_, xStr, yStr]) ->
      new PatchReference(parseInt(xStr), parseInt(yStr))
  )

# ((String) => String) => (String) => Maybe[LinkReference]
parseLinkRefMaybe = (singularToPlural) ->
  parseGeneric(/{([^ ]+) (\d+) (\d+)}/)(
    ([_, breedName, end1IDStr, end2IDStr]) ->
      breed = new BreedNamePair(breedName, singularToPlural(breedName).toLowerCase())
      new LinkReference(breed, parseInt(end1IDStr), parseInt(end2IDStr))
  )

# [T] @ (Array[(String) => Maybe[T]]) => (String) => Maybe[T]
tryParsers = (parsers) -> (x) ->
  for parser in parsers
    result = parser(x)
    if isSomething(result)
      return result
  None

# ((String) => String) => (String) => Maybe[AgentReference]
module.exports.parseAgentRefMaybe = (singularToPlural) -> (x) ->
  lowerCased = x.toLowerCase()
  stp        = singularToPlural
  if lowerCased is 'nobody'
    maybe(NobodyReference)
  else
    tryParsers([parsePatchRefMaybe, parseLinkRefMaybe(stp), parseTurtleRefMaybe(stp)])(lowerCased)

# ((String) => String) => (String) => LinkReference
parseInnerLink = (pluralToSingular) -> (x) ->
  [_, id1, id2, unparsedBreed] = match(/\[(\d+) (\d+) (.*)/, x)
  breedName = if unparsedBreed is "{all-links}" then "links" else match(/{breed (.*)}/, unparsedBreed)[1]
  breed     = new BreedNamePair(pluralToSingular(breedName), breedName.toLowerCase())
  new LinkReference(breed, parseInt(id1), parseInt(id2))

# ((String) => String, (String) => String) => (String) => Any
readAgenty = (singularToPlural, pluralToSingular) -> (x) ->

  lowerCased = x.toLowerCase()
  stp        = singularToPlural

  parseTurtleSet = parseGeneric(/{turtles ?([^}]*)}/)(
    ([_, nums]) ->
      breed = new BreedNamePair("turtle", "turtles")
      new ExportedTurtleSet(nums.split(' ').map((x) -> parseInt(x)).map((who) -> new TurtleReference(breed, who)))
  )

  parsePatchSet = parseGeneric(/{patches ?([^}]*)}/)(
    ([_, pairs]) ->
      new ExportedPatchSet(pairs.split(/] ?/).slice(0, -1).map((x) -> x.slice(1).split(' ').map((x) -> parseInt(x))).map(([x, y]) -> new PatchReference(x, y)))
  )

  parseLinkSet = parseGeneric(/{links ?(.*)}$/)(
    ([_, triples]) ->
      new ExportedLinkSet(triples.split(/] ?/).slice(0, -1).map(parseInnerLink(pluralToSingular)))
  )

  parsers = [ parseBreedMaybe, parseTurtleSet, parsePatchSet, parseLinkSet
            , parsePatchRefMaybe, parseLinkRefMaybe(stp), parseTurtleRefMaybe(stp)
            ]

  parsedMaybe = tryParsers(parsers)(lowerCased)
  fold(-> throw new Error("You supplied #{x}, and I don't know what the heck that is!"))((x) -> x)(parsedMaybe)


# ((String) => String, (String) => String) => (String) => Any
module.exports.parseAny = (singularToPlural, pluralToSingular) ->

  helper = (x) ->

    lowerCased = x.toLowerCase()

    result =
      switch lowerCased
        when "e"         then maybe(Math.E)
        when "pi"        then maybe(Math.PI)
        when "true"      then maybe(true)
        when "false"     then maybe(false)
        when "nobody"    then maybe(NobodyReference)
        when "black"     then maybe(  0)
        when "gray"      then maybe(  5)
        when "white"     then maybe(9.9)
        when "red"       then maybe( 15)
        when "orange"    then maybe( 25)
        when "brown"     then maybe( 35)
        when "yellow"    then maybe( 45)
        when "green"     then maybe( 55)
        when "lime"      then maybe( 65)
        when "turquoise" then maybe( 75)
        when "cyan"      then maybe( 85)
        when "sky"       then maybe( 95)
        when "blue"      then maybe(105)
        when "violet"    then maybe(115)
        when "magenta"   then maybe(125)
        when "pink"      then maybe(135)
        else                  None

    fold(->
      listMatch = x.match(/^\[.*\]$/)
      if listMatch?
        parseList(x, helper, readAgenty(singularToPlural, pluralToSingular))
      else # If not a list
        strMatch =  x.match(/^"(.*)"$/)
        if strMatch?
          strMatch[1]
        else # If not a string
          parsedNum = parseFloat(x)
          # I wanted to use `Number.isNaN` here, but Nashorn's ES6 implementation doesn't have it, and I don't think
          # that it's worth a full polyfill.  The MDN page on the function says that `x !== x` is the polyfill for it
          # "because NaN is the only value in javascript which is not equal to itself". --JAB (2/7/18)
          if parsedNum is parsedNum
            parsedNum
          else # If not a number
            commandLambdaMatch = x.match(/\(anonymous command: (\[.*\])\)$/)
            if commandLambdaMatch?
              new ExportedCommandLambda(commandLambdaMatch[1])
            else
              reporterLambdaMatch = x.match(/\(anonymous reporter: (\[.*\])\)$/)
              if reporterLambdaMatch?
                new ExportedReporterLambda(reporterLambdaMatch[1])
              else # If not a lambda
                readAgenty(singularToPlural, pluralToSingular)(lowerCased)
    )((res) -> res)(result)

  helper
