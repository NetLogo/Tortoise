## (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

turtleBuiltins = ["id", "color", "heading", "xcor", "ycor", "shape", "label", "labelcolor", "breed", "hidden", "size", "pensize", "penmode"]
patchBuiltins = ["pxcor", "pycor", "pcolor", "plabel", "plabelcolor"]
linkBuiltins = ["end1", "end2", "lcolor", "llabel", "llabelcolor", "lhidden", "lbreed", "thickness", "lshape", "tiemode", "size", "heading", "midpointx", "midpointy"]

class NetLogoException
  constructor: (@message) ->
class DeathInterrupt extends NetLogoException
class TopologyInterrupt extends NetLogoException

Updates = []

Nobody = {
  toString: -> "nobody"
}

collectUpdates = ->
  result =
    if (Updates.length == 0)
      [turtles: {}, patches: {}]
    else
      Updates
  Updates = [{turtles: {}, patches: {}, links: {}, observer: {}, world: {}}]
  result

# gross hack - ST 1/25/13
died = (agent) ->
  if agent instanceof Turtle
    Updates[0].turtles[agent.id] = WHO: -1
  else if agent instanceof Link
    Updates[0].links[agent.id] = WHO: -1
  return

noop = (vars...) ->

updated = (obj, vars...) ->
  update = Updates[0]
  if obj instanceof Turtle
    agents = update.turtles
  else if obj instanceof Patch
    agents = update.patches
  else if obj instanceof Link
    agents = update.links
  agentUpdate = agents[obj.id] or {}

  # Receiving updates for a turtle that's about to die means the turtle was
  # reborn, so we revive it in the update - BH 1/13/2014
  if agentUpdate['WHO'] < 0
    delete agentUpdate['WHO']

  # is there some less simpleminded way we could build this? surely there
  # must be. my CoffeeScript fu is stoppable - ST 1/24/13
  # Possible strategy. For variables with -, just replace it with a _ instead
  # of concatenating the words. For variables with a ?, replace it with _p or
  # something. For variables that need some kind of accessor, make the variable
  # that has the NetLogo name refer to the same thing that the NetLogo variable
  # does and make a different variable that refers to the thing you want in js.
  # For example, turtle.breed should refer to the breed name and
  # turtle._breed should point to the actual breed object.
  # BH 1/13/2014
  for v in vars
    switch v
      when "xcor"
        agentUpdate["XCOR"] = obj.xcor()
      when "ycor"
        agentUpdate["YCOR"] = obj.ycor()
      when "id"
        agentUpdate[if obj instanceof Link then "ID" else "WHO"] = obj[v]
      when "plabelcolor"
        agentUpdate["PLABEL-COLOR"] = obj[v]
      when "breed"
        agentUpdate["BREED"] = obj[v].name
      when "labelcolor"
        agentUpdate["LABEL-COLOR"] = obj[v]
      when "pensize"
        agentUpdate["PEN-SIZE"] = obj[v]
      when "penmode"
        agentUpdate["PEN-MODE"] = obj[v]
      when "hidden"
        agentUpdate["HIDDEN?"] = obj[v]
      when "tiemode"
        agentUpdate["TIE-MODE"] = obj[v]
      when "end1"
        agentUpdate["END1"] = obj[v].id
      when "end2"
        agentUpdate["END2"] = obj[v].id
      else
        agentUpdate[v.toUpperCase()] = obj[v]
  agents[obj.id] = agentUpdate
  return

class Turtle
  vars: []
  _xcor: 0
  _ycor: 0
  _links: []
  constructor: (@color = 0, @heading = 0, xcor = 0, ycor = 0, breed = Breeds.get("TURTLES"), @label = "", @labelcolor = 9.9, @hidden = false, @size = 1.0, @pensize = 1.0, @penmode = "up") ->
    @_xcor = xcor
    @_ycor = ycor
    @breedVars = {}
    @updateBreed(breed)
    @vars = (x for x in TurtlesOwn.vars)
    @getPatchHere().arrive(this)
  updateBreed: (breed) ->
    if @breed
      @breed.remove(@)
    @breed = breed
    breed.add(@)
    @shape = @breed.shape()
    if(@breed != Breeds.get("TURTLES"))
      for x in @breed.vars
        if(@breedVars[x] == undefined)
          @breedVars[x] = 0
  xcor: -> @_xcor
  setXcor: (newX) ->
    originPatch = @getPatchHere()
    @_xcor = world.topology().wrapX(newX)
    if originPatch != @getPatchHere()
      originPatch.leave(this)
      @getPatchHere().arrive(this)
    @refreshLinks()
  ycor: -> @_ycor
  setYcor: (newY) ->
    originPatch = @getPatchHere()
    @_ycor = world.topology().wrapY(newY)
    if originPatch != @getPatchHere()
      originPatch.leave(this)
      @getPatchHere().arrive(this)
    @refreshLinks()
  setBreed: (breed) ->
    @updateBreed(breed)
    updated(this, "breed")
    updated(this, "shape")
  toString: -> "(" + @breed.singular + " " + @id + ")"
  keepHeadingInRange: ->
    if (@heading < 0 || @heading >= 360)
      @heading = ((@heading % 360) + 360) % 360
    return
  canMove: (amount) -> @patchAhead(amount) != Nobody
  distanceXY: (x, y) -> world.topology().distanceXY(@xcor(), @ycor(), x, y)
  distance: (agent) -> world.topology().distance(@xcor(), @ycor(), agent)
  faceXY: (x, y) ->
    if(x != @xcor() or y != @ycor())
      @heading = world.topology().towards(@xcor(), @ycor(), x, y)
      updated(this, "heading")
  face: (agent) ->
    if(agent instanceof Turtle)
      @faceXY(agent.xcor(), agent.ycor())
    else if (agent instanceof Patch)
      @faceXY(agent.pxcor, agent.pycor)
  inRadius: (agents, radius) ->
    world.topology().inRadius(this, @xcor(), @ycor(), agents, radius)
  patchAt: (dx, dy) ->
    @getPatchHere().patchAt(dx, dy)
  turtlesAt: (dx, dy) ->
    @getPatchHere().turtlesAt(dx, dy)
  connectedLinks: (directed, isSource) ->
    me = this
    if directed
      new Agents(world.links().items.map((l) ->
        if (l.directed and l.end1 == me and isSource) or (l.directed and l.end2 == me and !isSource)
          l
        else
          null).filter((o) -> o != null), Breeds.get("LINKS"))
    else
      new Agents(world.links().items.map((l) ->
        if (!l.directed and l.end1 == me) or (!l.directed and l.end2 == me)
          l
        else
          null).filter((o) -> o != null), Breeds.get("LINKS"))
  refreshLinks: ->
    if @_links.length > 0
      l.updateEndRelatedVars() for l in (@connectedLinks(true, true).items)
      l.updateEndRelatedVars() for l in (@connectedLinks(true, false).items)
      l.updateEndRelatedVars() for l in (@connectedLinks(false, false).items)
  linkNeighbors: (directed, isSource) ->
    me = this
    if directed
      new Agents(world.links().items.map((l) ->
        if l.directed and l.end1 == me and isSource
          l.end2
        else if l.directed and l.end2 == me and !isSource
          l.end1
        else
          null).filter((o) -> o != null), Breeds.get("TURTLES"))
    else
      new Agents(world.links().items.map((l) ->
        if !l.directed and l.end1 == me
          l.end2
        else if !l.directed and l.end2 == me
          l.end1
        else
          null).filter((o) -> o != null), Breeds.get("TURTLES"))
  isLinkNeighbor: (directed, isSource, other) ->
    @linkNeighbors(directed, isSource).items.filter((o) -> o == other).length > 0
  findLinkViaNeighbor: (directed, isSource, other) ->
    me = this
    links = []
    if directed
      links = world.links().items.map((l) ->
        if ((l.directed and l.end1 == me and l.end2 == other and isSource) or (l.directed and l.end1 == other and l.end2 == me and !isSource))
          l
        else
          null).filter((o) -> o != null)
    else
      throw new NetLogoException("LINKS is a directed breed.") if world.unbreededLinksAreDirected
      links = world.links().items.map((l) ->
        if ((!l.directed and l.end1 == me and l.end2 == other) or (!l.directed and l.end2 == me and l.end1 == other))
          l
        else
          null).filter((o) -> o != null)
    if links.length == 0 then Nobody else links[0]

  otherEnd: -> if this == AgentSet.myself().end1 then AgentSet.myself().end2 else AgentSet.myself().end1
  patchRightAndAhead: (angle, amount) ->
    heading = @heading + angle
    if (heading < 0 || heading >= 360)
      heading = ((heading % 360) + 360) % 360
    try
      newX = world.topology().wrapX(@xcor() + amount * Trig.sin(heading))
      newY = world.topology().wrapY(@ycor() + amount * Trig.cos(heading))
      return world.getPatchAt(newX, newY)
    catch error
      if error instanceof TopologyInterrupt then Nobody else throw error
  patchLeftAndAhead: (angle, amount) ->
    @patchRightAndAhead(-angle, amount)
  patchAhead: (amount) ->
    @patchRightAndAhead(0, amount)
  fd: (amount) ->
    if amount > 0
      while amount >= 1 and @jump(1)
        amount -= 1
      @jump(amount)
    else if amount < 0
      while amount <= -1 and @jump(-1)
        amount += 1
      @jump(amount)
    return
  jump: (amount) ->
    if @canMove(amount)
      @setXcor(@xcor() + amount * Trig.sin(@heading))
      @setYcor(@ycor() + amount * Trig.cos(@heading))
      updated(this, "xcor", "ycor")
      return true
    return false
  right: (amount) ->
    @heading += amount
    @keepHeadingInRange()
    updated(this, "heading")
    return
  setXY: (x, y) ->
    origXcor = @xcor()
    origYcor = @ycor()
    try
      @setXcor(x)
      @setYcor(y)
    catch error
      @setXcor(origXcor)
      @setYcor(origYcor)
      if error instanceof TopologyInterrupt
        throw new TopologyInterrupt("The point [ #{x} , #{y} ] is outside of the boundaries of the world and wrapping is not permitted in one or both directions.")
      else
        throw error
    updated(this, "xcor", "ycor")
    return
  hideTurtle: (flag) ->
    @hidden = flag
    updated(this, "hidden")
    return
  isBreed: (breedName) ->
    @breed.name == breedName
  die: ->
    @breed.remove(@)
    if (@id != -1)
      world.removeTurtle(@id)
      died(this)
      for l in world.links().items
        try
          l.die() if (l.end1.id == @id or l.end2.id == @id)
        catch error
          throw error if !(error instanceof DeathInterrupt)
      @id = -1
      @getPatchHere().leave(this)
    throw new DeathInterrupt("Call only from inside an askAgent block")
  getTurtleVariable: (n) ->
    if (n < turtleBuiltins.length)
      if(n == 3) #xcor
        @xcor()
      else if(n == 4) #ycor
        @ycor()
      else if(n == 8) #breed
        world.turtlesOfBreed(@breed.name)
      else
        this[turtleBuiltins[n]]
    else
      @vars[n - turtleBuiltins.length]
  setTurtleVariable: (n, v) ->
    if (n < turtleBuiltins.length)
      if(n == 3) #xcor
        @setXcor(v)
      else if(n == 4) #ycor
        @setYcor(v)
      else
        if (n == 5)  # shape
          v = v.toLowerCase()
        this[turtleBuiltins[n]] = v
        if (n == 2)  # heading
          @keepHeadingInRange()
      updated(this, turtleBuiltins[n])
    else
      @vars[n - turtleBuiltins.length] = v
  getBreedVariable: (n) -> @breedVars[n]
  setBreedVariable: (n, v) -> @breedVars[n] = v
  getPatchHere: -> world.getPatchAt(@xcor(), @ycor())
  getPatchVariable: (n)    -> @getPatchHere().getPatchVariable(n)
  setPatchVariable: (n, v) -> @getPatchHere().setPatchVariable(n, v)
  getNeighbors: -> @getPatchHere().getNeighbors()
  getNeighbors4: -> @getPatchHere().getNeighbors4()
  turtlesHere: -> @getPatchHere().turtlesHere()
  breedHere: (breedName) -> @getPatchHere().breedHere(breedName)
  hatch: (n, breedName) ->
    breed = if breedName then Breeds.get(breedName) else @breed
    newTurtles = []
    for num in [0...n]
      t = new Turtle(@color, @heading, @xcor(), @ycor(), breed, @label, @labelcolor, @hidden, @size, @pensize, @penmode)
      for v in [0..TurtlesOwn.vars.length]
        t.setTurtleVariable(turtleBuiltins.length + v, @getTurtleVariable(turtleBuiltins.length + v))
      newTurtles.push(world.createTurtle(t))
    new Agents(newTurtles, breed)
  moveTo: (agent) ->
    if (agent instanceof Turtle)
      @setXY(agent.xcor(), agent.ycor())
    else if(agent instanceof Patch)
      @setXY(agent.pxcor, agent.pycor)
  watchme: ->
    world.watch(this)

  _removeLink: (l) ->
    @_links.splice(@_links.indexOf(l))

class Patch
  vars: []
  constructor: (@id, @pxcor, @pycor, @pcolor = 0.0, @plabel = "", @plabelcolor = 9.9) ->
    @vars = (x for x in PatchesOwn.vars)
    @turtles = []
  toString: -> "(patch " + @pxcor + " " + @pycor + ")"
  getPatchVariable: (n) ->
    if (n < patchBuiltins.length)
      this[patchBuiltins[n]]
    else
      @vars[n - patchBuiltins.length]
  setPatchVariable: (n, v) ->
    if (n < patchBuiltins.length)
      this[patchBuiltins[n]] = v
      if(patchBuiltins[n] == "pcolor" && v != 0)
        world.patchesAllBlack(false)
      updated(this, patchBuiltins[n])
    else
      @vars[n - patchBuiltins.length] = v
  leave: (t) -> @turtles.splice(@turtles.indexOf(t, 0), 1)
  arrive: (t) ->
    @turtles.push(t)
  distanceXY: (x, y) -> world.topology().distanceXY(@pxcor, @pycor, x, y)
  distance: (agent) -> world.topology().distance(@pxcor, @pycor, agent)
  turtlesHere: -> new Agents(@turtles, Breeds.get("TURTLES"))
  getNeighbors: -> world.getNeighbors(@pxcor, @pycor) # world.getTopology().getNeighbors(this)
  getNeighbors4: -> world.getNeighbors4(@pxcor, @pycor) # world.getTopology().getNeighbors(this)
  sprout: (n, breedName) ->
    breed = if("" == breedName) then Breeds.get("TURTLES") else Breeds.get(breedName)
    new Agents(world.createTurtle(new Turtle(5 + 10 * Random.nextInt(14), Random.nextInt(360), @pxcor, @pycor, breed)) for num in [0...n])
  breedHere: (breedName) ->
    breed = Breeds.get(breedName)
    new Agents(t for t in @turtles when t.breed == breed, breed)
  turtlesAt: (dx, dy) ->
    @patchAt(dx, dy).turtlesHere()
  patchAt: (dx, dy) ->
    try
      newX = world.topology().wrapX(@pxcor + dx)
      newY = world.topology().wrapY(@pycor + dy)
      return world.getPatchAt(newX, newY)
    catch error
      if error instanceof TopologyInterrupt then Nobody else throw error
  watchme: ->
    world.watch(this)

Links =
  compare: (a, b) ->
    if (a == b)
      0
    else if(a.end1.id < b.end1.id)
      -1
    else if(a.end1.id > b.end1.id)
      1
    else if(a.end2.id < b.end2.id)
      -1
    else if(a.end2.id > b.end2.id)
      1
    else if(a.breed == b.breed)
      0
    else if(a.breed == Breeds.get("LINKS"))
      -1
    else if(b.breed == Breeds.get("LINKS"))
      1
    else
      throw new Error("We have yet to implement link breed comparison")

class Link
  color: 5
  label: ""
  labelcolor: 9.9
  hidden: false
  shape: "default"
  thickness: 0
  tiemode: "none"
  xcor: ->
  ycor: ->
  constructor: (@id, @directed, @end1, @end2) ->
    @breed = Breeds.get("LINKS")
    @breed.add(@)
    @end1._links.push(this)
    @end2._links.push(this)
    @updateEndRelatedVars()
  getLinkVariable: (n) ->
    if (n < linkBuiltins.length)
      this[linkBuiltins[n]]
    else
      @vars[n - linkBuiltins.length]
  setLinkVariable: (n, v) ->
    if (n < linkBuiltins.length)
      this[linkBuiltins[n]] = v
      updated(this, linkBuiltins[n])
    else
      @vars[n - linkBuiltins.length] = v
  die: ->
    @breed.remove(@)
    if (@id != -1)
      @end1._removeLink(this)
      @end2._removeLink(this)
      world.removeLink(@id)
      died(this)
      @id = -1
    throw new DeathInterrupt("Call only from inside an askAgent block")
  getTurtleVariable: (n) -> this[turtleBuiltins[n]]
  setTurtleVariable: (n, v) ->
    this[turtleBuiltins[n]] = v
    updated(this, turtleBuiltins[n])
  bothEnds: -> new Agents([@end1, @end2], Breeds.get("TURTLES"))
  otherEnd: -> if @end1 == AgentSet.myself() then @end2 else @end1
  updateEndRelatedVars: ->
    @heading = world.topology().towards(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
    @size = world.topology().distanceXY(@end1.xcor(), @end1.ycor(), @end2.xcor(), @end2.ycor())
    @midpointx = world.topology().midpointx(@end1.xcor(), @end2.xcor())
    @midpointy = world.topology().midpointy(@end1.ycor(), @end2.ycor())
    updated(this, linkBuiltins...)
  toString: -> "(" + @breed.singular + " " + @end1.id + " " + @end2.id + ")"

class World
  # any variables used in the constructor should come
  # before the constructor, else they get overwritten after it.
  _nextLinkId = 0
  _nextTurtleId = 0
  _turtles = []
  _turtlesById = {}
  _patches = []
  _links = []
  _topology = null
  _ticks = -1
  _timer = Date.now()
  _patchesAllBlack = true
  constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor, @patchSize, @wrappingAllowedInY, @wrappingAllowedInX, turtleShapeList, linkShapeList, @interfaceGlobalCount) ->
    @perspective = 0
    @targetAgent = null
    collectUpdates()
    Updates.push(
      {
        world: {
          0: {
            worldWidth: Math.abs(@minPxcor - @maxPxcor) + 1,
            worldHeight: Math.abs(@minPycor - @maxPycor) + 1,
            minPxcor: @minPxcor,
            minPycor: @minPycor,
            maxPxcor: @maxPxcor,
            maxPycor: @maxPycor,
            linkBreeds: "XXX IMPLEMENT ME",
            linkShapeList: linkShapeList,
            patchSize: @patchSize,
            patchesAllBlack: _patchesAllBlack,
            patchesWithLabels: 0,
            ticks: _ticks,
            turtleBreeds: "XXX IMPLEMENT ME",
            turtleShapeList: turtleShapeList,
            unbreededLinksAreDirected: false
            wrappingAllowedInX: @wrappingAllowedInX,
            wrappingAllowedInY: @wrappingAllowedInY
          }
        }
      })
    @updatePerspective()
    @resize(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
  createPatches: ->
    nested =
      for y in [@maxPycor..@minPycor]
        for x in [@minPxcor..@maxPxcor]
          new Patch((@width() * (@maxPycor - y)) + x - @minPxcor, x, y)
    # http://stackoverflow.com/questions/4631525/concatenating-an-array-of-arrays-in-coffeescript
    _patches = [].concat nested...
    for p in _patches
      updated(p, "pxcor", "pycor", "pcolor", "plabel", "plabelcolor")
  topology: -> _topology
  links: () ->
    new Agents(_links.sort(Links.compare))
  turtles: () -> new Agents(_turtles, Breeds.get("TURTLES"))
  turtlesOfBreed: (breedName) ->
    breed = Breeds.get(breedName)
    #new Agents((_turtles.filter (t) -> t.breed == breed ), breed)
    new Agents(breed.members, breed)
  patches: -> new Agents(_patches)
  resetTimer: ->
    _timer = Date.now()
  resetTicks: ->
    _ticks = 0
    Updates.push( world: { 0: { ticks: _ticks } } )
  clearTicks: ->
    _ticks = -1
    Updates.push( world: { 0: { ticks: _ticks } } )
  resize: (minPxcor, maxPxcor, minPycor, maxPycor) ->
    if(minPxcor > 0 || maxPxcor < 0 || minPycor > 0 || maxPycor < 0)
      throw new NetLogoException("You must include the point (0, 0) in the world.")
    @clearAll()
    @minPxcor = minPxcor
    @maxPxcor = maxPxcor
    @minPycor = minPycor
    @maxPycor = maxPycor
    if(@wrappingAllowedInX && @wrappingAllowedInY)
      _topology = new Torus(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
    else if(@wrappingAllowedInX)
      _topology = new VertCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
    else if(@wrappingAllowedInY)
      _topology = new HorzCylinder(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
    else
      _topology = new Box(@minPxcor, @maxPxcor, @minPycor, @maxPycor)
    @createPatches()
    Updates.push(
      world: {
        0: {
          worldWidth: Math.abs(@minPxcor - @maxPxcor) + 1,
          worldHeight: Math.abs(@minPycor - @maxPycor) + 1,
          minPxcor: @minPxcor,
          minPycor: @minPycor,
          maxPxcor: @maxPxcor,
          maxPycor: @maxPycor
        }
      }
    )
  tick: ->
    if(_ticks == -1)
      throw new NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
    _ticks++
    Updates.push( world: { 0: { ticks: _ticks } } )
  tickAdvance: (n) ->
    if(_ticks == -1)
      throw new NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
    if(n < 0)
      throw new NetLogoException("Cannot advance the tick counter by a negative amount.")
    _ticks += n
    Updates.push( world: { 0: { ticks: _ticks } } )
  timer: ->
    (Date.now() - _timer) / 1000
  ticks: ->
    if(_ticks == -1)
      throw new NetLogoException("The tick counter has not been started yet. Use RESET-TICKS.")
    _ticks
  # TODO: this needs to support all topologies
  width: () -> 1 + @maxPxcor - @minPxcor
  height: () -> 1 + @maxPycor - @minPycor
  getPatchAt: (x, y) ->
    index  = (@maxPycor - StrictMath.round(y)) * @width() + (StrictMath.round(x) - @minPxcor)
    return _patches[index]
  getTurtle: (id) -> _turtlesById[id] or Nobody
  getTurtleOfBreed: (breedName, id) ->
    turtle = @getTurtle(id)
    if turtle.breed.name == breedName then turtle else Nobody
  removeLink: (id) ->
    _links = @links().items.filter (l) -> l.id != id
    if _links.length == 0
      @unbreededLinksAreDirected = false
      Updates.push({ world: { 0: { unbreededLinksAreDirected: false } } })
    return
  removeTurtle: (id) ->
    turtle = _turtlesById[id]
    _turtles.splice(_turtles.indexOf(turtle), 1)
    delete _turtlesById[id]
  patchesAllBlack: (val) ->
    _patchesAllBlack = val
    Updates.push( world: { 0: { patchesAllBlack: _patchesAllBlack }})
  clearAll: ->
    Globals.clear(@interfaceGlobalCount)
    # We iterate through a copy of the array since it will be modified during
    # iteration.
    # A more efficient (but less readable) way of doing this is to iterate
    # backwards through the array.
    for t in @turtles().items[..]
      try
        t.die()
      catch error
        throw error if !(error instanceof DeathInterrupt)
    @createPatches()
    _nextTurtleId = 0
    _nextLinkId = 0
    @patchesAllBlack(true)
    @clearTicks()
    return
  createTurtle: (t) ->
    t.id = _nextTurtleId++
    updated(t, turtleBuiltins...)
    _turtles.push(t)
    _turtlesById[t.id] = t
    t
  createLink: (directed, from, to) ->
    if(from.id < to.id or directed)
      end1 = from
      end2 = to
    else
      end1 = to
      end2 = from
    if Nobody == @getLink(end1.id, end2.id)
      l = new Link(_nextLinkId++, directed, end1, end2)
      updated(l, linkBuiltins...)
      updated(l, turtleBuiltins.slice(1)...)
      _links.push(l)
      l
    else
      Nobody
  createOrderedTurtles: (n, breedName) ->
    new Agents(@createTurtle(new Turtle((10 * num + 5) % 140, (360 * num) / n, 0, 0, Breeds.get(breedName))) for num in [0...n])
  createTurtles: (n, breedName) ->
    new Agents(@createTurtle(new Turtle(5 + 10 * Random.nextInt(14), Random.nextInt(360), 0, 0, Breeds.get(breedName))) for num in [0...n])
  getNeighbors: (pxcor, pycor) -> @topology().getNeighbors(pxcor, pycor)
  getNeighbors4: (pxcor, pycor) -> @topology().getNeighbors4(pxcor, pycor)
  createDirectedLink: (from, to) ->
    @unbreededLinksAreDirected = true
    Updates.push({ world: { 0: { unbreededLinksAreDirected: true } } })
    @createLink(true, from, to)
  createDirectedLinks: (source, others) ->
    @unbreededLinksAreDirected = true
    Updates.push({ world: { 0: { unbreededLinksAreDirected: true } } })
    new Agents((@createLink(true, source, t) for t in others.items).filter((o) -> o != Nobody), Breeds.get("LINKS"))
  createReverseDirectedLinks: (source, others) ->
    @unbreededLinksAreDirected = true
    Updates.push({ world: { 0: { unbreededLinksAreDirected: true } } })
    new Agents((@createLink(true, t, source) for t in others.items).filter((o) -> o != Nobody), Breeds.get("LINKS"))
  createUndirectedLink: (source, other) ->
    @createLink(false, source, other)
  createUndirectedLinks: (source, others) ->
    new Agents((@createLink(false, source, t) for t in others.items).filter((o) -> o != Nobody), Breeds.get("LINKS"))
  getLink: (fromId, toId) ->
    filteredLinks = (@links().items.filter (l) -> (l.end1.id == fromId && l.end2.id == toId))
    if filteredLinks.length == 0 then Nobody else filteredLinks[0]
  updatePerspective: ->
    Updates.push({ observer: { 0: { perspective: @perspective, targetAgent: @targetAgent } } })
  watch: (agent) ->
    @perspective = 3
    agentKind = 0
    agentId = -1
    if(agent instanceof Turtle)
      agentKind = 1
      agentId = agent.id
    else if(agent instanceof Patch)
      agentKind = 2
      agentId = agent.id
    @targetAgent = [agentKind, agentId]
    @updatePerspective()
  resetPerspective: ->
    @perspective = 0
    @targetAgent = null
    @updatePerspective()

AgentSet =
  count: (x) -> x.items.length
  any: (x) -> x.items.length > 0
  all: (x, f) ->
    for a in x.items
      if(!@askAgent(a, f))
        return false
    true
  _self: 0
  _myself: 0
  self: -> @_self
  myself: -> if @_myself != 0 then @_myself else throw new NetLogoException("There is no agent for MYSELF to refer to.")
  askAgent: (a, f) ->
    oldMyself = @_myself
    oldAgent = @_self
    @_myself = @_self
    @_self = a
    try
      res = f()
    catch error
      throw error if!(error instanceof DeathInterrupt)
    @_self = oldAgent
    @_myself = oldMyself
    res
  ask: (agentsOrAgent, shuffle, f) ->
    if(agentsOrAgent.items)
      agents = agentsOrAgent.items
    else
      agents = [agentsOrAgent]
    iter =
      if (shuffle)
        new Shufflerator(agents)
      else
        new Iterator(agents)
    while (iter.hasNext())
      a = iter.next()
      @askAgent(a, f)
    # If an asker indirectly commits suicide, the exception should propogate.  FD 11/1/2013
    if(@_self.id && @_self.id == -1)
      throw new DeathInterrupt
    return
  # can't call it `with`, that's taken in JavaScript. so is `filter` - ST 2/19/14
  agentFilter: (agents, f) -> new Agents(a for a in agents.items when @askAgent(a, f))
  of: (agentsOrAgent, f) ->
    isagentset = agentsOrAgent.items
    if(isagentset)
      agents = agentsOrAgent.items
    else
      agents = [agentsOrAgent]
    result = []
    iter = new Shufflerator(agents)
    while (iter.hasNext())
      a = iter.next()
      result.push(@askAgent(a, f))
    if isagentset
      result
    else
      result[0]
  oneOf: (agentsOrList) ->
    isagentset = agentsOrList.items
    if(isagentset)
      l = agentsOrList.items
    else
      l = agentsOrList
    if l.length == 0 then Nobody else l[Random.nextInt(l.length)]
  nOf: (resultSize, agentsOrList) ->
    items = agentsOrList.items
    if(!items)
      throw new Error("n-of not implemented on lists yet")
    new Agents(
      switch resultSize
        when 0
          []
        when 1
          [items[Random.nextInt(items.length)]]
        when 2
          index1 = Random.nextInt(items.length)
          index2 = Random.nextInt(items.length - 1)
          [index1, index2] =
            if index2 >= index1
              [index1, index2 + 1]
            else
              [index2, index1]
          [items[index1], items[index2]]
        else
          i = 0
          j = 0
          result = []
          while j < resultSize
            if Random.nextInt(items.length - i) < resultSize - j
              result.push(items[i])
              j += 1
            i += 1
          result
    )
  # I'm putting some things in Agents, and some in Prims
  # I did that on purpose to show how arbitrary/confusing this seems.
  # May we should put *everything* in Prims, and Agents can be private.
  # Prims could/would/should be the compiler/runtime interface.
  turtlesOn: (agentsOrAgent) ->
    if(agentsOrAgent.items)
      agents = agentsOrAgent.items
    else
      agents = [agentsOrAgent]
    turtles = [].concat (agent.turtlesHere().items for agent in agents)...
    new Agents(turtles, agentsOrAgent.breed)
  die: -> @_self.die()
  connectedLinks: (directed, isSource) -> @_self.connectedLinks(directed, isSource)
  linkNeighbors: (directed, isSource) -> @_self.linkNeighbors(directed, isSource)
  isLinkNeighbor: (directed, isSource) ->
    t = @_self
    ((other) -> t.isLinkNeighbor(directed, isSource, other))
  findLinkViaNeighbor: (directed, isSource) ->
    t = @_self
    ((other) -> t.findLinkViaNeighbor(directed, isSource, other))
  getTurtleVariable: (n)    -> @_self.getTurtleVariable(n)
  setTurtleVariable: (n, v) -> @_self.setTurtleVariable(n, v)
  getLinkVariable: (n)    -> @_self.getLinkVariable(n)
  setLinkVariable: (n, v) -> @_self.setLinkVariable(n, v)
  getBreedVariable: (n)    -> @_self.getBreedVariable(n)
  setBreedVariable: (n, v) -> @_self.setBreedVariable(n, v)
  setBreed: (agentSet) -> @_self.setBreed(agentSet.breed)
  getPatchVariable:  (n)    -> @_self.getPatchVariable(n)
  setPatchVariable:  (n, v) -> @_self.setPatchVariable(n, v)
  createLinkFrom: (other) -> world.createDirectedLink(other, @_self)
  createLinksFrom: (others) -> world.createReverseDirectedLinks(@_self, @shuffle(others))
  createLinkTo: (other) -> world.createDirectedLink(@_self, other)
  createLinksTo: (others) -> world.createDirectedLinks(@_self, @shuffle(others))
  createLinkWith: (other) -> world.createUndirectedLink(@_self, other)
  createLinksWith: (others) -> world.createUndirectedLinks(@_self, @shuffle(others))
  other: (agentSet) ->
    self = @_self
    filteredAgents = (agentSet.items.filter((o) -> o != self))
    new Agents(filteredAgents, agentSet.breed)
  shuffle: (agents) ->
    result = []
    iter = new Shufflerator(agents.items)
    while (iter.hasNext())
      result.push(iter.next())
    new Agents(result, agents.breed)

class Agents
  constructor: (@items, @breed) ->
  toString: ->
    "(" + @items.length + " " + @breed.name + ")"
  sort: ->
    if(@items.length == 0)
      @items
    else if(@items[0] instanceof Link)
      @items.sort(Links.compare)
    else
      throw new Error("We don't know how to sort your kind here!")

class Iterator
  constructor: (@agents) ->
    @agents = @agents[..]
    @i = 0
  hasNext: -> @i < @agents.length
  next: ->
    result = @agents[@i]
    @i = @i + 1
    result

class Shufflerator
  constructor: (@agents) ->
    @agents = @agents[..]
    @fetch()
  i: 0
  nextOne: null
  hasNext: -> @nextOne != null
  next: ->
    result = @nextOne
    @fetch()
    result
  fetch: ->
    if (@i >= @agents.length)
      @nextOne = null
    else
      if (@i < @agents.length - 1)
        r = @i + Random.nextInt(@agents.length - @i)
        @nextOne = @agents[r]
        @agents[r] = @agents[@i]
      else
        @nextOne = @agents[@i]
      @i = @i + 1
    return

Prims =
  fd: (n) -> AgentSet.self().fd(n)
  bk: (n) -> AgentSet.self().fd(-n)
  right: (n) -> AgentSet.self().right(n)
  left: (n) -> AgentSet.self().right(-n)
  setXY: (x, y) -> AgentSet.self().setXY(x, y)
  empty: (l) -> l.length == 0
  getNeighbors: -> AgentSet.self().getNeighbors()
  getNeighbors4: -> AgentSet.self().getNeighbors4()
  sprout: (n, breedName) -> AgentSet.self().sprout(n, breedName)
  hatch: (n, breedName) -> AgentSet.self().hatch(n, breedName)
  patch: (x, y) -> world.getPatchAt(x, y)
  randomXcor: -> world.minPxcor - 0.5 + Random.nextDouble() * (world.maxPxcor - world.minPxcor + 1)
  randomYcor: -> world.minPycor - 0.5 + Random.nextDouble() * (world.maxPycor - world.minPycor + 1)
  shadeOf: (c1, c2) -> Math.floor(c1 / 10) == Math.floor(c2 / 10)
  equality: (a, b) ->
    if(a == undefined || b == undefined)
      throw new Error("Checking equality on undefined is an invalid condition")
    if(a == b)
      true
    else if (typeIsArray(a) && typeIsArray(b))
      a.length == b.length && a.every((elem, i) -> Prims.equality(elem, b[i]))
    else if (a instanceof Agents && b instanceof Agents)
      a.items.length == b.items.length && a.items.every((elem) -> (elem in b.items))
    else
      false
  scaleColor: (color, number, min, max) ->
    color = Math.floor(color / 10) * 10
    perc = 0.0
    if(min > max)
      if(number < max)
        perc = 1.0
      else if (number > min)
        perc = 0.0
      else
        tempval = min - number
        tempmax = min - max
        perc = tempval / tempmax
    else
      if(number > max)
        perc = 1.0
      else if (number < min)
        perc = 0.0
      else
        tempval = number - min
        tempmax = max - min
        perc = tempval / tempmax
    perc *= 10
    if(perc >= 9.9999)
      perc = 9.9999
    if(perc < 0)
      perc = 0
    color + perc
  random: (n) ->
    truncated =
      if n >= 0
        Math.floor(n)
      else
        Math.ceil(n)
    if truncated == 0
      0
    else if truncated > 0
      Random.nextLong(truncated)
    else
      -Random.nextLong(-truncated)
  randomFloat: (n) -> n * Random.nextDouble()
  list: (xs...) -> xs
  item: (n, xs) -> xs[n]
  first: (xs) -> xs[0]
  last: (xs) -> xs[xs.length - 1]
  fput: (x, xs) -> [x].concat(xs)
  lput: (x, xs) ->
    result = xs[..]
    result.push(x)
    result
  butFirst: (xs) -> xs[1..]
  butLast: (xs) -> xs[0...xs.length - 1]
  length: (xs) -> xs.length
  _int: (n) -> if n < 0 then Math.ceil(n) else Math.floor(n)
  mod: (a, b) -> ((a % b) + b) % b
  max: (xs) -> Math.max(xs...)
  min: (xs) -> Math.min(xs...)
  mean: (xs) -> @sum(xs) / xs.length
  sum: (xs) -> xs.reduce(((a, b) -> a + b), 0)
  precision: (n, places) ->
    multiplier = Math.pow(10, places)
    result = Math.floor(n * multiplier + .5) / multiplier
    if places > 0
      result
    else
      Math.round(result)

  sort: (xs) -> xs.sort()
  removeDuplicates: (xs) ->
    result = {}
    result[xs[key]] = xs[key] for key in [0...xs.length]
    value for key, value of result
  outputPrint: (x) ->
    println(Dump(x))
  patchSet: (inputs...) ->
    # O(n^2) -- should be smarter (use hashing for contains check)
    result = []
    recurse = (inputs) ->
      for input in inputs
        if (typeIsArray(input))
          recurse(input)
        else if (input instanceof Patch)
          result.push(input)
        else
          for agent in input.items
            if (!(agent in result))
              result.push(agent)
    recurse(inputs)
    new Agents(result)
  repeat: (n, fn) ->
    for i in [0...n]
      fn()
    return

Globals =
  vars: []
  # compiler generates call to init, which just
  # tells the runtime how many globals there are.
  # they are all initialized to 0
  init: (n) -> @vars = (0 for x in [0...n])
  clear: (n) ->
    @vars[i] = 0 for i in [n...@vars.length]
    return
  getGlobal: (n) -> @vars[n]
  setGlobal: (n, v) -> @vars[n] = v

TurtlesOwn =
  vars: []
  init: (n) -> @vars = (0 for x in [0...n])

PatchesOwn =
  vars: []
  init: (n) -> @vars = (0 for x in [0...n])

# like api.Dump. will need more cases. for now at least knows
# about lists.
Dump = (x) ->
  if (typeIsArray(x))
    "[" + (Dump(x2) for x2 in x).join(" ") + "]"
  else
    "" + x

Trig =
  squash: (x) ->
    if (StrictMath.abs(x) < 3.2e-15)
      0
    else
      x
  sin: (degrees) ->
    @squash(StrictMath.sin(StrictMath.toRadians(degrees)))
  cos: (degrees) ->
    @squash(StrictMath.cos(StrictMath.toRadians(degrees)))
  unsquashedSin: (degrees) ->
    StrictMath.sin(StrictMath.toRadians(degrees))
  unsquashedCos: (degrees) ->
    StrictMath.cos(StrictMath.toRadians(degrees))
  atan: (d1, d2) ->
    throw new NetLogoException("Runtime error: atan is undefined when both inputs are zero.") if (d1 == 0 && d2 == 0)
    if (d1 == 0)
      if (d2 > 0) then 0 else 180
    else if (d2 == 0)
      if (d1 > 0) then 90 else 270
    else (StrictMath.toDegrees(StrictMath.atan2(d1, d2)) + 360) % 360

class Breed
  constructor: (@name, @singular, @_shape = false, @members = []) ->
  shape: () -> if @_shape then @_shape else Breeds.get("TURTLES")._shape
  vars: []
  add: (agent) ->
    for a, i in @members
      if a.id > agent.id
        break
    @members.splice(i, 0, agent)
  remove: (agent) ->
    @members.splice(@members.indexOf(agent), 1)

Breeds = {
  breeds: {
    TURTLES: new Breed("TURTLES", "turtle", "default"),
    LINKS: new Breed("LINKS", "link", "default")
  }
  add: (name, singular) ->
    @breeds[name] = new Breed(name, singular)
  get: (name) ->
    @breeds[name]
  setDefaultShape: (agents, shape) ->
    agents.breed._shape = shape.toLowerCase()
}
class Topology
  # based on agent.Topology.wrap()
  wrap: (pos, min, max) ->
    if (pos >= max)
      (min + ((pos - max) % (max - min)))
    else if (pos < min)
      result = max - ((min - pos) % (max - min))
      if (result < max)
        result
      else
        min
    else
      pos

  getNeighbors: (pxcor, pycor) ->
    new Agents((patch for patch in @_getNeighbors(pxcor, pycor) when patch != false))

  _getNeighbors: (pxcor, pycor) ->
    if (pxcor == @maxPxcor && pxcor == @minPxcor)
      if (pycor == @maxPycor && pycor == @minPycor) []
      else [@getPatchNorth(pxcor, pycor), @getPatchSouth(pxcor, pycor)]
    else if (pycor == @maxPycor && pycor == @minPycor)
      [@getPatchEast(pxcor, pycor), @getPatchWest(pxcor, pycor)]
    else [@getPatchNorth(pxcor, pycor),     @getPatchEast(pxcor, pycor),
          @getPatchSouth(pxcor, pycor),     @getPatchWest(pxcor, pycor),
          @getPatchNorthEast(pxcor, pycor), @getPatchSouthEast(pxcor, pycor),
          @getPatchSouthWest(pxcor, pycor), @getPatchNorthWest(pxcor, pycor)]

  getNeighbors4: (pxcor, pycor) ->
    new Agents((patch for patch in @_getNeighbors4(pxcor, pycor) when patch != false))

  _getNeighbors4: (pxcor, pycor) ->
    if (pxcor == @maxPxcor && pxcor == @minPxcor)
      if (pycor == @maxPycor && pycor == @minPycor) []
      else [@getPatchNorth(pxcor, pycor), @getPatchSouth(pxcor, pycor)]
    else if (pycor == @maxPycor && pycor == @minPycor)
      [@getPatchEast(pxcor, pycor), @getPatchWest(pxcor, pycor)]
    else [@getPatchNorth(pxcor, pycor),     @getPatchEast(pxcor, pycor),
          @getPatchSouth(pxcor, pycor),     @getPatchWest(pxcor, pycor)]

  distanceXY: (x1, y1, x2, y2) ->
    StrictMath.sqrt(StrictMath.pow(@shortestX(x1, x2), 2) + StrictMath.pow(@shortestY(y1, y2), 2))
  distance: (x1, y1, agent) ->
    if (agent instanceof Turtle)
      @distanceXY(x1, y1, agent.xcor(), agent.ycor())
    else if(agent instanceof Patch)
      @distanceXY(x1, y1, agent.pxcor, agent.pycor)

  towards: (x1, y1, x2, y2) ->
    dx = @shortestX(x1, x2)
    dy = @shortestY(y1, y2)
    if dx == 0
      if dy >= 0 then 0 else 180
    else if dy == 0
      if dx >= 0 then 90 else 270
    else
      (270 + StrictMath.toDegrees (Math.PI + StrictMath.atan2(-dy, dx))) % 360
  midpointx: (x1, x2) -> @wrap((x1 + (x1 + @shortestX(x1, x2))) / 2, world.minPxcor - 0.5, world.maxPxcor + 0.5)
  midpointy: (y1, y2) -> @wrap((y1 + (y1 + @shortestY(y1, y2))) / 2, world.minPycor - 0.5, world.maxPycor + 0.5)

  inRadius: (origin, x, y, agents, radius) ->
    result = []

    r = Math.ceil(radius)
    width = world.width() / 2
    height = world.height() / 2
    if(r < width || !world.wrappingAllowedInX)
      minDX = -r
      maxDX = r
    else
      maxDX = StrictMath.floor(width)
      minDX = -Math.ceil(width - 1)
    if(r < height || !world.wrappingAllowedInY)
      minDY = -r
      maxDY = r
    else
      maxDY = StrictMath.floor(height)
      minDY = -Math.ceil(height - 1)

    for dy in [minDY..maxDY]
      for dx in [minDX..maxDX]
        p = origin.patchAt(dx, dy)
        if p != Nobody
          if(@distanceXY(p.pxcor, p.pycor, x, y) <= radius && agents.items.filter((o) -> o == p).length > 0)
            result.push(p)
          for t in p.turtlesHere().items
            if(@distanceXY(t.xcor(), t.ycor(), x, y) <= radius && agents.items.filter((o) -> o == t).length > 0)
              result.push(t)
    new Agents(result, agents.breed)

class Torus extends Topology
  constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor) ->

  wrapX: (pos) ->
    @wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)
  wrapY: (pos) ->
    @wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)
  shortestX: (x1, x2) ->
    if(StrictMath.abs(x1 - x2) > world.width() / 2)
      (world.width() - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
    else
      Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
  shortestY: (y1, y2) ->
    if(StrictMath.abs(y1 - y2) > world.height() / 2)
      (world.height() - StrictMath.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
    else
      Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
  diffuse: (vn, amount) ->
    scratch = for x in [0...world.width()]
      []
    for patch in world.patches().items
      scratch[patch.pxcor - @minPxcor][patch.pycor - @minPycor] = patch.getPatchVariable(vn)
    for patch in world.patches().items
      pxcor = patch.pxcor
      pycor = patch.pycor
      # We have to order the neighbors exactly how Torus.java:diffuse does them so we don't get floating discrepancies.  FD 10/19/2013
      diffusallyOrderedNeighbors =
        [@getPatchSouthWest(pxcor, pycor), @getPatchWest(pxcor, pycor),
         @getPatchNorthWest(pxcor, pycor), @getPatchSouth(pxcor, pycor),
         @getPatchNorth(pxcor, pycor), @getPatchSouthEast(pxcor, pycor),
         @getPatchEast(pxcor, pycor), @getPatchNorthEast(pxcor, pycor)]
      diffusalSum = (scratch[n.pxcor - @minPxcor][n.pycor - @minPycor] for n in diffusallyOrderedNeighbors).reduce((a, b) -> a + b)
      patch.setPatchVariable(vn, patch.getPatchVariable(vn) * (1.0 - amount) + (diffusalSum / 8) * amount)

  getPatchNorth: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      world.getPatchAt(pxcor, @minPycor)
    else
      world.getPatchAt(pxcor, pycor + 1)

  getPatchSouth: (pxcor, pycor) ->
    if (pycor == @minPycor)
      world.getPatchAt(pxcor, @maxPycor)
    else
      world.getPatchAt(pxcor, pycor - 1)

  getPatchEast: (pxcor, pycor) ->
    if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor)
    else
      world.getPatchAt(pxcor + 1, pycor)

  getPatchWest: (pxcor, pycor) ->
    if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor)
    else
      world.getPatchAt(pxcor - 1, pycor)

  getPatchNorthWest: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      if (pxcor == @minPxcor)
        world.getPatchAt(@maxPxcor, @minPycor)
      else
        world.getPatchAt(pxcor - 1, @minPycor)

    else if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor + 1)
    else
      world.getPatchAt(pxcor - 1, pycor + 1)

  getPatchSouthWest: (pxcor, pycor) ->
    if (pycor == @minPycor)
      if (pxcor == @minPxcor)
        world.getPatchAt(@maxPxcor, @maxPycor)
      else
        world.getPatchAt(pxcor - 1, @maxPycor)
    else if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor - 1)
    else
      world.getPatchAt(pxcor - 1, pycor - 1)

  getPatchSouthEast: (pxcor, pycor) ->
    if (pycor == @minPycor)
      if (pxcor == @maxPxcor)
        world.getPatchAt(@minPxcor, @maxPycor)
      else
        world.getPatchAt(pxcor + 1, @maxPycor)
    else if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor - 1)
    else
      world.getPatchAt(pxcor + 1, pycor - 1)

  getPatchNorthEast: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      if (pxcor == @maxPxcor)
        world.getPatchAt(@minPxcor, @minPycor)
      else
        world.getPatchAt(pxcor + 1, @minPycor)
    else if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor + 1)
    else
      world.getPatchAt(pxcor + 1, pycor + 1)

class VertCylinder extends Topology
  constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor) ->

  shortestX: (x1, x2) ->
    if(StrictMath.abs(x1 - x2) > (1 + @maxPxcor - @minPxcor) / 2)
      (world.width() - StrictMath.abs(x1 - x2)) * (if x2 > x1 then -1 else 1)
    else
      Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
  shortestY: (y1, y2) -> Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
  wrapX: (pos) ->
    @wrap(pos, @minPxcor - 0.5, @maxPxcor + 0.5)
  wrapY: (pos) ->
    if(pos >= @maxPycor + 0.5 || pos <= @minPycor - 0.5)
      throw new TopologyInterrupt ("Cannot move turtle beyond the world's edge.")
    else pos
  getPatchNorth: (pxcor, pycor) -> (pycor != @maxPycor) && world.getPatchAt(pxcor, pycor + 1)
  getPatchSouth: (pxcor, pycor) -> (pycor != @minPycor) && world.getPatchAt(pxcor, pycor - 1)
  getPatchEast: (pxcor, pycor) ->
    if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor)
    else
      world.getPatchAt(pxcor + 1, pycor)

  getPatchWest: (pxcor, pycor) ->
    if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor)
    else
      world.getPatchAt(pxcor - 1, pycor)

  getPatchNorthWest: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      false
    else if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor + 1)
    else
      world.getPatchAt(pxcor - 1, pycor + 1)

  getPatchSouthWest: (pxcor, pycor) ->
    if (pycor == @minPycor)
      false
    else if (pxcor == @minPxcor)
      world.getPatchAt(@maxPxcor, pycor - 1)
    else
      world.getPatchAt(pxcor - 1, pycor - 1)

  getPatchSouthEast: (pxcor, pycor) ->
    if (pycor == @minPycor)
      false
    else if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor - 1)
    else
      world.getPatchAt(pxcor + 1, pycor - 1)

  getPatchNorthEast: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      false
    else if (pxcor == @maxPxcor)
      world.getPatchAt(@minPxcor, pycor + 1)
    else
      world.getPatchAt(pxcor + 1, pycor + 1)
  diffuse: (vn, amount) ->
    yy = world.height()
    xx = world.width()
    scratch = for x in [0...xx]
      for y in [0...yy]
        world.getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(vn)
    scratch2 = for x in [0...xx]
      for y in [0...yy]
        0
    for y in [yy...(yy * 2)]
      for x in [xx...(xx * 2)]
        diffuseVal = (scratch[x - xx][y - yy] / 8) * amount
        if (y > yy && y < (yy * 2) - 1)
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (8 * diffuseVal)
          scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
        else if (y == yy)
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
          scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
        else
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
          scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
    for y in [0...yy]
      for x in [0...xx]
        world.getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

class HorzCylinder extends Topology
  constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor) ->

  shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
  shortestY: (y1, y2) ->
    if(StrictMath.abs(y1 - y2) > (1 + @maxPycor - @minPycor) / 2)
      (world.height() - Math.abs(y1 - y2)) * (if y2 > y1 then -1 else 1)
    else
      Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
  wrapX: (pos) ->
    if(pos >= @maxPxcor + 0.5 || pos <= @minPxcor - 0.5)
      throw new TopologyInterrupt ("Cannot move turtle beyond the world's edge.")
    else pos
  wrapY: (pos) ->
    @wrap(pos, @minPycor - 0.5, @maxPycor + 0.5)
  getPatchEast: (pxcor, pycor) -> (pxcor != @maxPxcor) && world.getPatchAt(pxcor + 1, pycor)
  getPatchWest: (pxcor, pycor) -> (pxcor != @minPxcor) && world.getPatchAt(pxcor - 1, pycor)
  getPatchNorth: (pxcor, pycor) ->
    if (pycor == @maxPycor)
      world.getPatchAt(pxcor, @minPycor)
    else
      world.getPatchAt(pxcor, pycor + 1)
  getPatchSouth: (pxcor, pycor) ->
    if (pycor == @minPycor)
      world.getPatchAt(pxcor, @maxPycor)
    else
      world.getPatchAt(pxcor, pycor - 1)

  getPatchNorthWest: (pxcor, pycor) ->
    if (pxcor == @minPxcor)
      false
    else if (pycor == @maxPycor)
      world.getPatchAt(pxcor - 1, @minPycor)
    else
      world.getPatchAt(pxcor - 1, pycor + 1)

  getPatchSouthWest: (pxcor, pycor) ->
    if (pxcor == @minPxcor)
      false
    else if (pycor == @minPycor)
      world.getPatchAt(pxcor - 1, @maxPycor)
    else
      world.getPatchAt(pxcor - 1, pycor - 1)

  getPatchSouthEast: (pxcor, pycor) ->
    if (pxcor == @maxPxcor)
      false
    else if (pycor == @minPycor)
      world.getPatchAt(pxcor + 1, @maxPycor)
    else
      world.getPatchAt(pxcor + 1, pycor - 1)

  getPatchNorthEast: (pxcor, pycor) ->
    if (pxcor == @maxPxcor)
      false
    else if (pycor == @maxPycor)
      world.getPatchAt(pxcor + 1, @minPycor)
    else
      world.getPatchAt(pxcor + 1, pycor + 1)
  diffuse: (vn, amount) ->
    yy = world.height()
    xx = world.width()
    scratch = for x in [0...xx]
      for y in [0...yy]
        world.getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(vn)
    scratch2 = for x in [0...xx]
      for y in [0...yy]
        0
    for y in [yy...(yy * 2)]
      for x in [xx...(xx * 2)]
        diffuseVal = (scratch[x - xx][y - yy] / 8) * amount
        if (x > xx && x < (xx * 2) - 1)
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (8 * diffuseVal)
          scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
        else if (x == xx)
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
          scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x + 1) % xx][(y + 1) % yy] += diffuseVal
        else
          scratch2[(x    ) - xx][(y    ) - yy] += scratch[x - xx][y - yy] - (5 * diffuseVal)
          scratch2[(x    ) % xx][(y + 1) % yy] += diffuseVal
          scratch2[(x    ) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y - 1) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y    ) % yy] += diffuseVal
          scratch2[(x - 1) % xx][(y + 1) % yy] += diffuseVal
    for y in [0...yy]
      for x in [0...xx]
        world.getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

class Box extends Topology
  constructor: (@minPxcor, @maxPxcor, @minPycor, @maxPycor) ->

  shortestX: (x1, x2) -> Math.abs(x1 - x2) * (if x1 > x2 then -1 else 1)
  shortestY: (y1, y2) -> Math.abs(y1 - y2) * (if y1 > y2 then -1 else 1)
  wrapX: (pos) ->
    if(pos >= @maxPxcor + 0.5 || pos <= @minPxcor - 0.5)
      throw new TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")
    else pos
  wrapY: (pos) ->
    if(pos >= @maxPycor + 0.5 || pos <= @minPycor - 0.5)
      throw new TopologyInterrupt ("Cannot move turtle beyond the worlds edge.")
    else pos

  getPatchNorth: (pxcor, pycor) -> (pycor != @maxPycor) && world.getPatchAt(pxcor, pycor + 1)
  getPatchSouth: (pxcor, pycor) -> (pycor != @minPycor) && world.getPatchAt(pxcor, pycor - 1)
  getPatchEast: (pxcor, pycor) -> (pxcor != @maxPxcor) && world.getPatchAt(pxcor + 1, pycor)
  getPatchWest: (pxcor, pycor) -> (pxcor != @minPxcor) && world.getPatchAt(pxcor - 1, pycor)

  getPatchNorthWest: (pxcor, pycor) -> (pycor != @maxPycor) && (pxcor != @minPxcor) && world.getPatchAt(pxcor - 1, pycor + 1)
  getPatchSouthWest: (pxcor, pycor) -> (pycor != @minPycor) && (pxcor != @minPxcor) && world.getPatchAt(pxcor - 1, pycor - 1)
  getPatchSouthEast: (pxcor, pycor) -> (pycor != @minPycor) && (pxcor != @maxPxcor) && world.getPatchAt(pxcor + 1, pycor - 1)
  getPatchNorthEast: (pxcor, pycor) -> (pycor != @maxPycor) && (pxcor != @maxPxcor) && world.getPatchAt(pxcor + 1, pycor + 1)

  diffuse: (vn, amount) ->
    yy = world.height()
    xx = world.width()
    scratch = for x in [0...xx]
      for y in [0...yy]
        world.getPatchAt(x + @minPxcor, y + @minPycor).getPatchVariable(vn)
    scratch2 = for x in [0...xx]
      for y in [0...yy]
        0
    for y in [0...yy]
      for x in [0...xx]
        diffuseVal = (scratch[x][y] / 8) * amount
        if (y > 0 && y < yy - 1 && x > 0 && x < xx - 1)
          scratch2[x    ][y    ] += scratch[x][y] - (8 * diffuseVal)
          scratch2[x - 1][y - 1] += diffuseVal
          scratch2[x - 1][y    ] += diffuseVal
          scratch2[x - 1][y + 1] += diffuseVal
          scratch2[x    ][y + 1] += diffuseVal
          scratch2[x    ][y - 1] += diffuseVal
          scratch2[x + 1][y - 1] += diffuseVal
          scratch2[x + 1][y    ] += diffuseVal
          scratch2[x + 1][y + 1] += diffuseVal
        else if (y > 0 && y < yy - 1)
          if (x == 0)
            scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y + 1] += diffuseVal
          else
            scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x - 1][y - 1] += diffuseVal
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y + 1] += diffuseVal
        else if (x > 0 && x < xx - 1)
          if (y == 0)
            scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y + 1] += diffuseVal
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y + 1] += diffuseVal
          else
            scratch2[x    ][y    ] += scratch[x][y] - (5 * diffuseVal)
            scratch2[x - 1][y    ] += diffuseVal
            scratch2[x - 1][y - 1] += diffuseVal
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y - 1] += diffuseVal
        else if (x == 0)
          if (y == 0)
            scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
            scratch2[x    ][y + 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y + 1] += diffuseVal
          else
            scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
            scratch2[x    ][y - 1] += diffuseVal
            scratch2[x + 1][y    ] += diffuseVal
            scratch2[x + 1][y - 1] += diffuseVal
        else if (y == 0)
          scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
          scratch2[x    ][y + 1] += diffuseVal
          scratch2[x - 1][y    ] += diffuseVal
          scratch2[x - 1][y + 1] += diffuseVal
        else
          scratch2[x    ][y    ] += scratch[x][y] - (3 * diffuseVal)
          scratch2[x    ][y - 1] += diffuseVal
          scratch2[x - 1][y    ] += diffuseVal
          scratch2[x - 1][y - 1] += diffuseVal
    for y in [0...yy]
      for x in [0...xx]
        world.getPatchAt(x + @minPxcor, y + @minPycor).setPatchVariable(vn, scratch2[x][y])

# Copied pretty much verbatim from Layouts.java
Layouts =
  layoutSpring: (nodeSet, linkSet, spr, len, rep) ->
    nodeCount = nodeSet.items.length
    if nodeCount == 0
      return

    ax = []
    ay = []
    tMap = []
    degCount = (0 for i in [0...nodeCount])

    agt = []
    i = 0
    for t in AgentSet.shuffle(nodeSet).items
      agt[i] = t
      tMap[t.id] = i
      ax[i] = 0.0
      ay[i] = 0.0
      i++

    for link in linkSet.items
      t1 = link.end1
      t2 = link.end2
      if (tMap[t1.id] != undefined)
        t1Index = tMap[t1.id]
        degCount[t1Index]++
      if (tMap[t2.id] != undefined)
        t2Index = tMap[t2.id]
        degCount[t2Index]++

    for link in linkSet.items
      dx = 0
      dy = 0
      t1 = link.end1
      t2 = link.end2
      t1Index = -1
      degCount1 = 0
      if tMap[t1.id] != undefined
        t1Index = tMap[t1.id]
        degCount1 = degCount[t1Index]
      t2Index = -1
      degCount2 = 0
      if tMap[t2.id] != undefined
        t2Index = tMap[t2.id]
        degCount2 = degCount[t2Index]
      dist = t1.distance(t2)
      # links that are connecting high degree nodes should not
      # be as springy, to help prevent "jittering" behavior
      div = (degCount1 + degCount2) / 2.0
      div = Math.max(div, 1.0)

      if dist == 0
        dx += (spr * len) / div # arbitrary x-dir push-off
      else
        f = spr * (dist - len) / div
        dx = dx + (f * (t2.xcor() - t1.xcor()) / dist)
        dy = dy + (f * (t2.ycor() - t1.ycor()) / dist)
      if t1Index != -1
        ax[t1Index] += dx
        ay[t1Index] += dy
      if t2Index != -1
        ax[t2Index] -= dx
        ay[t2Index] -= dy

    for i in [0...nodeCount]
      t1 = agt[i]
      for j in [(i + 1)...nodeCount]
        t2 = agt[j]
        dx = 0.0
        dy = 0.0
        div = (degCount[i] + degCount[j]) / 2.0
        div = Math.max(div, 1.0)

        if (t2.xcor() == t1.xcor() && t2.ycor() == t1.ycor())
          ang = 360 * Random.nextDouble()
          dx = -(rep / div * Trig.sin(StrictMath.toRadians(ang)))
          dy = -(rep / div * Trig.cos(StrictMath.toRadians(ang)))
        else
          dist = t1.distance(t2)
          f = rep / (dist * dist) / div
          dx = -(f * (t2.xcor() - t1.xcor()) / dist)
          dy = -(f * (t2.ycor() - t1.ycor()) / dist)
        ax[i] += dx
        ay[i] += dy
        ax[j] -= dx
        ay[j] -= dy

    # we need to bump some node a small amount, in case all nodes
    # are stuck on a single line
    if (nodeCount > 1)
      perturbAmt = (world.width() + world.height()) / 1.0e10
      ax[0] += Random.nextDouble() * perturbAmt - perturbAmt / 2.0
      ay[0] += Random.nextDouble() * perturbAmt - perturbAmt / 2.0

    # try to choose something that's reasonable perceptually --
    # for temporal aliasing, don't want to jump too far on any given timestep.
    limit = (world.width() + world.height()) / 50.0

    for i in [0...nodeCount]
      t = agt[i]
      fx = ax[i]
      fy = ay[i]

      if fx > limit
        fx = limit
      else if fx < -limit
        fx = -limit

      if fy > limit
        fy = limit
      else if fy < -limit
        fy = -limit

      newx = t.xcor() + fx
      newy = t.ycor() + fy

      if newx > world.maxPxcor
        newx = world.maxPxcor
      else if newx < world.minPxcor
        newx = world.minPxcor

      if newy > world.maxPycor
        newy = world.maxPycor
      else if newy < world.minPycor
        newy = world.minPycor
      t.setXY(newx, newy)
