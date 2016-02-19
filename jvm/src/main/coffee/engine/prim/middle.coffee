# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# type ErrorI18NBundle = Object[FunctionN[..., String]]

en_us_Errors = {

  ListTypeName:   "list"
  StringTypeName: "string"

  "an rgb list must contain 3 numbers 0-255": ->
    "an rgb list must contain 3 numbers 0-255"

  "an rgb list must contain 3 or 4 numbers 0-255": ->
    "an rgb list must contain 3 or 4 numbers 0-255"

  "atan is undefined when both inputs are zero": ->
    "atan is undefined when both inputs are zero."

  "cant find element _ of the _ _ which is only of length _": (n, list, typeName, length) ->
    "Can't find element #{n} of the #{typeName} #{list}, which is only of length #{length}."

  "cant find the maximum of a list with no numbers _": (list) ->
    "Can't find the maximum of a list with no numbers: #{list}"

  "cant find the minimum of a list with no numbers _": (list) ->
    "Can't find the minimum of a list with no numbers: #{list}"

  "cant find the variance of a list without at least two numbers _": (list) ->
    "Can't find the variance of a list without at least two numbers: #{list}."

  "cant set _ variable _ to non-number _": (type, varName, value) ->
    "can't set #{type} variable #{varName} to non-number #{value}"

  "first input to n-of cant be negative": ->
    "First input to N-OF can't be negative."

  "_ is a directed breed": (breedName) ->
    "#{breedName} is a directed breed."

  "_ is an undirected breed": (breedName) ->
    "#{breedName} is an undirected breed."

  "_ is greater than the length of the input list (_)": (n, length) ->
    "#{n} is greater than the length of the input list (#{length})."

  "_ is less than _": (n, m) ->
    "#{n} is less than #{m}."

  "_ is less than zero": (n) ->
    "#{n} is less than zero."

  "_ isnt a valid base for a logarithm": (x) ->
    "#{x} isn't a valid base for a logarithm."

  "_ isnt greater than or equal to zero": (n) ->
    "#{n} isn't greater than or equal to zero."

  "_ is too large to be represented exactly as an integer in netlogo": (x) ->
    "#{x} is too large to be represented exactly as an integer in NetLogo"

  "list is empty": ->
    "List is empty."

  "requested _ random agents from a set of only _ agents": (gotNum, maxNum) ->
    "Requested #{gotNum} random agents from a set of only #{maxNum} agents."

  "rgb values must be 0-255": ->
    "rgb values must be 0-255"

  "that _ is dead": (breedName) ->
    "That #{breedName} is dead."

  "the list argument to reduce must not be empty": ->
    "The list argument to reduce must not be empty."

  "there is already a _ with endpoints _ and _": (breedName, end1, end2) ->
    "there is already a #{breedName} with endpoints #{end1} and #{end2}"

  "the square root of _ is an imaginary number": (x) ->
    "The square root of #{x} is an imaginary number."

  "you cannot have both breeded and unbreeded links in the same world": ->
    "You cannot have both breeded and unbreeded links in the same world."

  "you cant set breed to a non-breed agentset": ->
    "You can't set BREED to a non-breed agentset."

  "you cant set breed to a non-link-breed agentset": ->
    "You can't set BREED to a non-link-breed agentset."

}

module.exports =
  class PrimsMiddle

    @_i18nBundle: undefined # ErrorI18NBundle

    #@#@#@#@#  It doesn't make sense that we're handing this a `Workspace`.  On top of potential performance concerns, it's just implausible, because `MiddlePrims` is going to be _created by_ the `Workspace`, so how's it going to give itself to the class, sanely?
    # (Dump, Workspace) => (ErrorI18NBundle) => PrimsMiddle
    constructor: (@_dumper, @_workspace) -> (preferredBundle = en_us_Errors) ->
      @_i18nBundle = Object.assign({}, en_us_Errors, preferredBundle)

    # (Agent, Command, Boolean) => Unit
    ask_agent_command_boolean: (agent, block, shouldShuffle) ->
      if NLType(agent).isTurtle() and agent.isDead()
        throw new Error(@_i18nBundle['that _ is dead'](agent._finalBreedName))
      else
        agent.ask(block, shouldShuffle)

    # (Number, Number) => Number
    atan_number_number: (x, y) ->
      if x is 0 and y is 0
        throw new Error(@_i18nBundle['atan is undefined when both inputs are zero']())
      else
        NLMath.atan(x, y)

    # (String, Number) => Turtle
    breedsingular_string_number: (breedName, id) ->
      @_throwIfInvalidLong(id)
      @_workspace.world.turtleManager.getTurtleOfBreed(breedName, id)

    # [T] @ (Array[T]) => T
    first_list: (xs) ->
      if xs.length <= 0
        throw new Error(@_i18nBundle['list is empty']())
      else
        @_workspace.listPrims.first(xs)

    # (Number) => Number
    int_number: (x) ->
      @_throwIfInvalidLong(x)
      NLMath.toInt(x)

    # [T] @ (Number, Array[T]) => T
    item_number_list: (n, xs) ->
      if n < 0
        throw new Error(@_i18nBundle['_ isnt greater than or equal to zero'](n))
      else if n <= xs.length
        throw new Error(@_i18nBundle['cant find element _ of the _ _ which is only of length _'](n, @_dumper(xs), xs.length))
      else
        @_workspace.listPrims.item(n, xs)

    # [T] @ (Array[T]) => T
    last_list: (xs) ->
      if xs.length <= 0
        throw new Error(@_i18nBundle['list is empty']())
      else
        @_workspace.listPrims.last(xs)

    # (Number, Number) => Number
    log_number_number: (x, base) ->
      if base <= 0
        throw new Error(@_i18nBundle['_ isnt a valid base for a logarithm'](base))
      else
        NLMath.log(x, base)

    # [T] @ (Array[T]) => Number
    max_list: (xs) ->
      numbers = xs.filter((x) -> NLType(x).isNumber())
      if numbers.length <= 0
        throw new Error(@_i18nBundle['cant find the maximum of a list with no numbers _'](xs))
      else
        @_workspace.listPrims.max(xs)

    # (Array[Number]) => Number
    mean_list: (xs) ->
      if xs.length <= 0
        throw new Error(@_i18nBundle['list is empty']())
      else
        @_workspace.listPrims.mean(xs)

    # [T] @ (Array[T]) => Number
    min_list: (xs) ->
      numbers = xs.filter((x) -> NLType(x).isNumber())
      if numbers.length <= 0
        throw new Error(@_i18nBundle['cant find the minimum of a list with no numbers _'](xs))
      else
        @_workspace.listPrims.min(xs)

    # [T] @ (Number, AbstractAgentSet[T]) => AbstractAgentSet[T]
    nOf_number_agentset: (n, agents) ->
      size = agents.size()
      if n < 0
        throw new Error(@_i18nBundle['first input to n-of cant be negative']())
      else if n <= size
        throw new Error(@_i18nBundle['request _ random agents from a set of only _ agents'](n, size))
      else
        @_workspace.listPrims.nOf_number_agentset(n, agents)

    # [T] @ (Any, Any) => (Array[T]|AbstractAgentSet[T])
    # Stopgap; type branching like this should eventually be done in the outer layer. --JAB (2/15/16)
    nOf_wildcard_wildcard: (n, agentsOrList) ->
      type = NLType(agentsOrList)
      if type.isList()
        @_workspace.listPrims.nOf_number_list(n, agentsOrList)
      else if type.isAgentSet()
        @nOf_number_agentset(n, agentsOrList)
      else
        throw new Error("N-OF expected input to be a list or agentset but got #{Dump(agentsOrList)} instead.")

    # [T] @ (Agent, () => T) => T
    of_agent_reporter: (agent, f) ->
      if NLType(agent).isTurtle() and agent.isDead()
        throw new Error(@_i18nBundle['that _ is dead'](agent._finalBreedName))
      else
        agent.projectionBy(f)

    # (Number) => Number
    random_number: (upperBound) ->
      @_throwIfInvalidLong(upperBound)
      @_workspace.prims.random(upperBound)

    # [T] @ (Task[T, T, T], Array[T]) => T
    reduce_reportertask_list: (task, xs) ->
      if xs.length is 0
        throw new Error(@_i18nBundle['the list argument to reduce must not be empty']())
      else
        @_workspace.listPrims.reduce(task, xs)

    # [T] @ (Number, Array[T]) => Array[T]
    removeItem_number_list: (n, xs) ->
      if n < 0
        throw new Error(@_i18nBundle['isnt greater than or equal to zero'](n))
      else if n <= xs.length
        throw new Error(@_i18nBundle['cant find element _ of the'](n, @_dumper(xs), @_i18nBundle.ListTypeName, xs.length))
      else
        @_workspace.listPrims.removeItem_number_list(n, xs)

    # [T] @ (Number, String) => String
    removeItem_number_string: (n, str) ->
      if n < 0
        throw new Error(@_i18nBundle['isnt greater than or equal to zero'](n))
      else if n <= xs.length
        throw new Error(@_i18nBundle['cant find element _ of the _ _ which is only of length _'](n, @_dumper(str), @_i18nBundle.StringTypeName, str.length))
      else
        @_workspace.listPrims.removeItem_number_string(n, str)

    # [T, U >: T] @ (Number, Array[T], U) => Array[U]
    replaceItem_number_list_any: (n, xs, x) ->
      if n < 0
        throw new Error(@_i18nBundle['isnt greater than or equal to zero'](n))
      else if n <= xs.length
        throw new Error(@_i18nBundle['cant find element _ of the _ _ which is only of length _'](n, @_dumper(xs), xs.length))
      else
        @_workspace.listPrims.replaceItem(n, xs, x)

    # (String, Any) => Unit
    # Much of this should probably be shelled out to the outer layer at some point --JAB (2/15/16)
    setVariable_string_any: (name, value) ->

      self      = SelfManager.self()
      selfType  = NLType(self)
      valueType = NLType(value)

      selfTypeName =
        if selfType.isTurtle()
          "turtle"
        else if selfType.isPatch()
          "patch"
        else if selfType.isLink()
          "link"
        else
          "impossible_type"

      colorNumIsOOB = (num) -> num < 0 or num > 255

      switch name is "breed"

        when "breed"
          if selfType.isTurtle() and (not valueType.isTurtleSet())
            throw new Error(@_i18nBundle['you cant set breed to a non-breed agentset']())
          if selfType.isLink() and (not valueType.isLinkSet())
            throw new Error(@_i18nBundle['you cant set breed to a non-link-breed agentset']())
          if selfType.isLink() and (not NLType(self.world.linkManager.getLink(self.end1, self.end2, value)).isNobody())
            throw new Error(@_i18nBundle['there is already a _ with endpoints _ and _'](value, @_dumper(self.end1), @_dumper(self.end2)))

        when "color"
          if not valueType.isNumber()
            throw new Error(@_i18nBundle['cant set _ variable _ to non-number _'](selfTypeName, name.toUpperCase(), @_dumper(value)))
          if ((not NLType(value[0]).isNumber()) or (not NLType(value[1]).isNumber()) or (not NLType(value[2]).isNumber())) and
               ((value.length is 3) or ((value.length is 4) and (not NLType(value[3]).isNumber())))
            throw new Error(@_i18nBundle['an rgb list must contain 3 or 4 numbers 0-255']())
          if (colorNumIsOOB(value[0])) or (colorNumIsOOB(value[1])) or (colorNumIsOOB(value[2])) or (value[3]? and colorNumIsOOB(value[3]))
            throw new Error(@_i18nBundle['rgb values must be 0-255']())

        when "pcolor"
          if not valueType.isNumber()
            throw new Error(@_i18nBundle['cant set _ variable _ to non-number _'](selfTypeName, name.toUpperCase(), @_dumper(value)))
          if (value.length isnt 3) or (not NLType(value[0]).isNumber()) or (not NLType(value[1]).isNumber()) or (not NLType(value[2]).isNumber())
            throw new Error(@_i18nBundle['an rgb list must contain 3 numbers 0-255']())
          if (colorNumIsOOB(value[0])) or (colorNumIsOOB(value[1])) or (colorNumIsOOB(value[2]))
            throw new Error(@_i18nBundle['rgb values must be 0-255']())


      self.setVariable(name, value)

      return

    # (Number) => Number
    sqrt_number: (x) ->
      if x < 0
        throw new Error(@_i18nBundle['the square root of is an imaginary number'](x))
      else
        NLMath.sqrt(x)

    # [T] @ (Array[T], Number, Number) => Array[T]
    sublist_list_number_number: (xs, start, end) ->
      if start < 0
        throw new Error(@_i18nBundle['_ is less than zero'](start))
      else if end < start
        throw new Error(@_i18nBundle['_ is less than _'](end, start))
      else if end > xs.length
        throw new Error(@_i18nBundle['_ is greater than the length of the input list (_)'](end, xs.length))
      else
        @_workspace.listPrims.sublist(xs, start, end)

    # (Number) => Turtle
    turtle_number: (id) ->
      @_throwIfInvalidLong(id)
      @_workspace.world.turtleManager.getTurtle(id)

    # [T] @ (Array[T]) => Number
    variance_list: (xs) ->
      numbers = xs.filter((x) -> NLType(x).isNumber())
      if numbers.length < 2
        throw new Error(@_i18nBundle['cant find the variance of a list without at least two numbers _'](@_dumper(xs)))
      else
        @_workspace.listPrims.variance(numbers)

    ### LinkPrims ###

    # (Turtle, String) => Link
    createLinkFrom_turtle_string: (otherTurtle, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinkFrom(otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksFrom_turtleset_string: (otherTurtles, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinksFrom(otherTurtles, breedName)

    # (Turtle, String) => Link
    createLinkTo_turtle_string: (otherTurtle, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinkTo(otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksTo_turtleset_string: (otherTurtles, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinksTo(otherTurtles, breedName)

    # (Turtle, String) => Link
    createLinkWith_turtle_string: (otherTurtle, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinkWith(otherTurtle, breedName)

    # (TurtleSet, String) => LinkSet
    createLinksWith_turtleset_string: (otherTurtles, breedName) ->
      if not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName)
        if breedName is "LINKS"
          throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
        else
          throw new Error(@_i18nBundle['you cannot have both breeded and unbreeded links in the same world']())
      else
        @_workspace.linkPrims.createLinksWith(otherTurtles, breedName)

    # (String, Turtle) => Boolean
    isInLinkNeighbor_string_turtle: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.isInLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Boolean
    isLinkNeighbor: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
      else
        @_workspace.linkPrims.isLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Boolean
    isOutLinkNeighbor: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.isOutLinkNeighbor(breedName, otherTurtle)

    # (String, Turtle) => Link
    inLinkFrom: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.isLinkFrom(breedName, otherTurtle)

    # (String, Turtle) => Link
    linkWith: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
      else
        @_workspace.linkPrims.linkWith(breedName, otherTurtle)

    # (String, Turtle) => Link
    outLinkTo: (breedName, otherTurtle) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.outLinkTo(breedName, otherTurtle)

    # (String) => TurtleSet
    inLinkNeighbors: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.inLinkNeighbors(breedName)

    # (String) => TurtleSet
    linkNeighbors: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
      else
        @_workspace.linkPrims.linkNeighbors(breedName)

    # (String) => TurtleSet
    outLinkNeighbors: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.outLinkNeighbors(breedName)

    # (String) => LinkSet
    myInLinks: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.myInLinks(breedName)

    # (String) => LinkSet
    myLinks: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is a directed breed'](breedName))
      else
        @_workspace.linkPrims.myLinks(breedName)

    # (String) => LinkSet
    myOutLinks: (breedName) ->
      if breedName is "LINKS" and (not @_workspace.linkPrims._linkManager.breedIsAcceptable(breedName))
        throw new Error(@_i18nBundle['_ is an undirected breed'](breedName))
      else
        @_workspace.linkPrims.myOutLinks(breedName)

    # (Number) => Unit
    _throwIfInvalidLong = (x) ->
      if not (Number.MIN_SAFE_INTEGER <= x <= Number.MAX_SAFE_INTEGER)
        throw new Error(@_i18nBundle['_ is too large to be represented exactly as an integer in NetLogo'](x))
      return
