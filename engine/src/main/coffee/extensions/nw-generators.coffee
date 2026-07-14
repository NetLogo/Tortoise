# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
{ Setters: TurtleSetters } = require('../engine/core/turtle/turtlevariables')

{ getBreedName } = require('extensions/nw-core')

# ({ workspace: Workspace }) => Object
module.exports = (deps) ->
  { workspace } = deps

  # (AgentSet, AgentSet, Number, Number, Command) => Unit
  generatePreferentialAttachment = (turtleBreed, linkBreed, numTurtles, minDegree, runBlock) ->
    if numTurtles < 1
      throw exceptions.extension("The number of nodes in the generated network must be at least 1.")

    if minDegree < 1
      throw exceptions.extension("The minimum degree must be at least 1.")

    if numTurtles <= minDegree
      throw exceptions.extension("The number of turtles must be larger than the minimum degree.")

    turtleBreedName = getBreedName(turtleBreed)
    linkBreedName = getBreedName(linkBreed)
    linkBreedObj = workspace.world.breedManager.get(linkBreedName)
    isDirected = linkBreedObj.isDirected()

    initialTurtles = []
    for i in [0...minDegree + 1]
      color = 5 + (i % 14) * 10
      heading = (360 * i) / (minDegree + 1)
      workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
      allTurtles = workspace.world.turtles().toArray()
      newTurtle = allTurtles[allTurtles.length - 1]
      TurtleSetters.setHeading.call(newTurtle, heading)
      TurtleSetters.setColor.call(newTurtle, color)
      initialTurtles.push(newTurtle)

    links = []
    for i in [0...initialTurtles.length]
      for j in [i + 1...initialTurtles.length]
        end1 = initialTurtles[i]
        end2 = initialTurtles[j]
        if isDirected
          link = workspace.world.linkManager.createDirectedLink(end1, end2, linkBreedName)
        else
          link = workspace.world.linkManager.createUndirectedLink(end1, end2, linkBreedName)
        links.push(link)

    allTurtles = initialTurtles.slice()
    for t in [initialTurtles.length...numTurtles]
      color = 5 + (t % 14) * 10
      heading = (360 * t) / numTurtles
      workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
      allTurtlesList = workspace.world.turtles().toArray()
      newTurtle = allTurtlesList[allTurtlesList.length - 1]
      TurtleSetters.setHeading.call(newTurtle, heading)
      TurtleSetters.setColor.call(newTurtle, color)

      connected = new Set()
      attempts = 0
      while connected.size < minDegree and attempts < minDegree * 100
        attempts++
        if links.length is 0
          break
        randomLink = links[workspace.world.rng.nextInt(links.length)]
        target = if workspace.world.rng.nextInt(2) is 0 then randomLink.end1 else randomLink.end2
        if not connected.has(target.id)
          if isDirected
            newLink = workspace.world.linkManager.createDirectedLink(newTurtle, target, linkBreedName)
          else
            newLink = workspace.world.linkManager.createUndirectedLink(newTurtle, target, linkBreedName)
          if newLink
            links.push(newLink)
            connected.add(target.id)

      allTurtles.push(newTurtle)

    runBlockPerTurtle(allTurtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Number, Command) => Unit
  generateRandom = (turtleBreed, linkBreed, nbTurtles, connexionProbability, runBlock) ->
    if nbTurtles < 1
      throw exceptions.extension("A positive number of turtles must be specified.")

    if connexionProbability < 0 or connexionProbability > 1.0
      throw exceptions.extension("The connexion probability must be between 0 and 1.")

    turtleBreedName = getBreedName(turtleBreed)
    linkBreedName = getBreedName(linkBreed)
    linkBreedObj = workspace.world.breedManager.get(linkBreedName)
    isDirected = linkBreedObj.isDirected()

    turtles = []
    for i in [0...nbTurtles]
      color = 5 + (i % 14) * 10
      heading = (360 * i) / nbTurtles
      workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
      allTurtles = workspace.world.turtles().toArray()
      newTurtle = allTurtles[allTurtles.length - 1]
      TurtleSetters.setHeading.call(newTurtle, heading)
      TurtleSetters.setColor.call(newTurtle, color)
      turtles.push(newTurtle)

    for i in [0...nbTurtles]
      jRange = if isDirected then [0...nbTurtles].filter((j) -> j isnt i) else [i + 1...nbTurtles]
      for j in jRange
        if workspace.world.rng.nextDouble() < connexionProbability
          if isDirected
            workspace.world.linkManager.createDirectedLink(turtles[i], turtles[j], linkBreedName)
          else
            workspace.world.linkManager.createUndirectedLink(turtles[i], turtles[j], linkBreedName)

    runBlockPerTurtle(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Number, Number, Command) => Unit
  generateWattsStrogatz = (turtleBreed, linkBreed, nbTurtles, neighborhoodSize, rewireProbability, runBlock) ->
    if nbTurtles < 1
      throw exceptions.extension("A positive number of turtles must be specified.")

    if neighborhoodSize < 0 or neighborhoodSize > Math.ceil(nbTurtles / 2 - 1)
      throw exceptions.extension("Neighborhood size must be less than half the number of turtles.")

    if rewireProbability < 0 or rewireProbability > 1.0
      throw exceptions.extension("The rewire probability must be between 0 and 1.")

    turtleBreedName = getBreedName(turtleBreed)
    linkBreedName   = getBreedName(linkBreed)
    linkBreedObj    = workspace.world.breedManager.get(linkBreedName)
    isDirected      = linkBreedObj.isDirected()
    rng             = workspace.world.rng

    turtles = []
    for i in [0...nbTurtles]
      workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
      allTurtles = workspace.world.turtles().toArray()
      newTurtle  = allTurtles[allTurtles.length - 1]
      TurtleSetters.setColor.call(newTurtle, 5 + (i % 14) * 10)
      TurtleSetters.setHeading.call(newTurtle, (360 * i) / nbTurtles)
      turtles.push(newTurtle)

    # Seed the adjacency map with the full forward ring lattice: turtle i is connected to turtles i+1 .. i+k (mod n).
    # This mirrors the desktop generator (NW-Extension WattsStrogatzGenerator.scala) so link structure and RNG usage
    # stay in lock-step with NetLogo desktop.  Sets are forward-only; dedup checks both directions.
    # -Jeremy B July 2026
    adjacency = new Map()
    for source, i in turtles
      targets = new Set()
      for neighbor in [1..neighborhoodSize]
        targets.add(turtles[(i + neighbor) % nbTurtles].id)
      adjacency.set(source.id, targets)

    availBuffer = turtles.slice()

    for source, i in turtles
      for neighbor in [1..neighborhoodSize]
        target     = turtles[(i + neighbor) % nbTurtles]
        realTarget = target

        if rng.nextDouble() < rewireProbability
          adjacency.get(source.id).delete(target.id)

          c = 0
          loop
            j              = rng.nextInt(availBuffer.length - c) + c
            candidate      = availBuffer[j]
            availBuffer[j] = availBuffer[c]
            availBuffer[c] = candidate
            c += 1
            if candidate isnt source and not adjacency.get(source.id).has(candidate.id) and not adjacency.get(candidate.id).has(source.id)
              break

          adjacency.get(source.id).add(candidate.id)
          realTarget = candidate

        if isDirected
          workspace.world.linkManager.createDirectedLink(source, realTarget, linkBreedName)
        else
          workspace.world.linkManager.createUndirectedLink(source, realTarget, linkBreedName)

    runBlockPerTurtle(turtles, runBlock)
    return

  # (Number, Number, String) => Number
  requireIntMinimum = (value, minimum, things = "nodes") ->
    if value < minimum
      throw exceptions.extension("The number of #{things} in the generated network must be at least #{minimum}.")
    value

  # (AgentSet, AgentSet) => { turtleBreedName: String, linkBreedName: String, isDirected: Boolean }
  generatorBreeds = (turtleBreed, linkBreed) ->
    linkBreedName = getBreedName(linkBreed)
    {
      turtleBreedName: getBreedName(turtleBreed)
      linkBreedName:   linkBreedName
      isDirected:      workspace.world.breedManager.get(linkBreedName).isDirected()
    }

  # (Number, String) => Array[Turtle]
  makeGeneratorTurtles = (n, turtleBreedName) ->
    turtles = []
    for i in [0...n]
      workspace.world.turtleManager.createTurtles(1, turtleBreedName, 0, 0)
      all = workspace.world.turtles().toArray()
      t   = all[all.length - 1]
      TurtleSetters.setColor.call(t, 5 + (i % 14) * 10)
      TurtleSetters.setHeading.call(t, (360 * i) / n)
      turtles.push(t)
    turtles

  # (Turtle, Turtle, String, Boolean) => Link
  link = (end1, end2, linkBreedName, isDirected) ->
    if isDirected
      workspace.world.linkManager.createDirectedLink(end1, end2, linkBreedName)
    else
      workspace.world.linkManager.createUndirectedLink(end1, end2, linkBreedName)

  # (Turtle, Turtle, String, Boolean, Set[String]) => Unit
  linkOnce = (end1, end2, linkBreedName, isDirected, seen) ->
    key = if isDirected then "#{end1.id}->#{end2.id}"
    else if end1.id < end2.id then "#{end1.id}-#{end2.id}"
    else "#{end2.id}-#{end1.id}"
    if not seen.has(key)
      seen.add(key)
      link(end1, end2, linkBreedName, isDirected)
    return

  # (Array[Turtle], Command) => Unit
  runBlockPerTurtle = (turtles, runBlock) ->
    if runBlock?
      for t in turtles
        workspace.world.selfManager.askAgent(runBlock)(t)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateRing = (turtleBreed, linkBreed, nodeCount, runBlock) ->
    n = requireIntMinimum(nodeCount, 3)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeGeneratorTurtles(n, turtleBreedName)
    link(turtles[i], turtles[(i + 1) % n], linkBreedName, isDirected) for i in [0...n]
    runBlockPerTurtle(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateStar = (turtleBreed, linkBreed, nodeCount, runBlock) ->
    n = requireIntMinimum(nodeCount, 1)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeGeneratorTurtles(n, turtleBreedName)
    link(turtles[0], turtles[i], linkBreedName, isDirected) for i in [1...n]
    runBlockPerTurtle(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Boolean, Command) => Unit
  buildWheel = (turtleBreed, linkBreed, nodeCount, spokesFromHub, runBlock) ->
    n = requireIntMinimum(nodeCount, 4)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeGeneratorTurtles(n, turtleBreedName)
    hub = turtles[0]
    rim = turtles[1...n]
    for r, k in rim
      link(r, rim[(k + 1) % rim.length], linkBreedName, isDirected)
      if spokesFromHub then link(hub, r, linkBreedName, isDirected) else link(r, hub, linkBreedName, isDirected)
    runBlockPerTurtle(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateWheel        = (turtleBreed, linkBreed, nodeCount, runBlock) -> buildWheel(turtleBreed, linkBreed, nodeCount, true,  runBlock)
  # (AgentSet, AgentSet, Number, Command) => Unit
  generateWheelInward  = (turtleBreed, linkBreed, nodeCount, runBlock) -> buildWheel(turtleBreed, linkBreed, nodeCount, false, runBlock)
  # (AgentSet, AgentSet, Number, Command) => Unit
  generateWheelOutward = (turtleBreed, linkBreed, nodeCount, runBlock) -> buildWheel(turtleBreed, linkBreed, nodeCount, true,  runBlock)

  # (Array[Turtle], Number, Number, Boolean, String, Boolean, Set[String]) => Unit
  buildLattice = (turtles, rows, cols, isToroidal, linkBreedName, isDirected, seen) ->
    at = (r, c) -> turtles[r * cols + c]
    for r in [0...rows]
      for c in [0...cols]
        if c + 1 < cols                 then linkOnce(at(r, c), at(r, c + 1), linkBreedName, isDirected, seen)
        else if isToroidal and cols > 2 then linkOnce(at(r, c), at(r, 0), linkBreedName, isDirected, seen)
        if r + 1 < rows                 then linkOnce(at(r, c), at(r + 1, c), linkBreedName, isDirected, seen)
        else if isToroidal and rows > 2 then linkOnce(at(r, c), at(0, c), linkBreedName, isDirected, seen)
    return

  # (AgentSet, AgentSet, Number, Number, Boolean, Command) => Unit
  generateLattice2d = (turtleBreed, linkBreed, rowCount, colCount, isToroidal, runBlock) ->
    rows = requireIntMinimum(rowCount, 2, "rows")
    cols = requireIntMinimum(colCount, 2, "columns")
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeGeneratorTurtles(rows * cols, turtleBreedName)
    buildLattice(turtles, rows, cols, isToroidal, linkBreedName, isDirected, new Set())
    runBlockPerTurtle(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Number, Number, Boolean, Command) => Unit
  generateSmallWorld = (turtleBreed, linkBreed, rowCount, colCount, clusteringExponent, isToroidal, runBlock) ->
    rows = requireIntMinimum(rowCount, 2, "rows")
    cols = requireIntMinimum(colCount, 2, "columns")
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeGeneratorTurtles(rows * cols, turtleBreedName)
    seen    = new Set()
    buildLattice(turtles, rows, cols, isToroidal, linkBreedName, isDirected, seen)

    idx  = (r, c) -> r * cols + c
    dist = (r1, c1, r2, c2) ->
      dr = Math.abs(r1 - r2)
      dc = Math.abs(c1 - c2)
      if isToroidal
        dr = Math.min(dr, rows - dr)
        dc = Math.min(dc, cols - dc)
      dr + dc

    rng = workspace.world.rng
    for r in [0...rows]
      for c in [0...cols]
        source     = turtles[idx(r, c)]
        candidates = []
        total      = 0
        for r2 in [0...rows]
          for c2 in [0...cols] when not (r2 is r and c2 is c)
            total += Math.pow(dist(r, c, r2, c2), -clusteringExponent)
            candidates.push({ turtle: turtles[idx(r2, c2)], cum: total })
        if total > 0
          pick   = rng.nextDouble() * total
          chosen = candidates[candidates.length - 1].turtle
          for cand in candidates when pick <= cand.cum
            chosen = cand.turtle
            break
          linkOnce(source, chosen, linkBreedName, isDirected, seen)
    runBlockPerTurtle(turtles, runBlock)
    return

  {
    "GENERATE-PREFERENTIAL-ATTACHMENT": generatePreferentialAttachment
  , "GENERATE-RANDOM":                  generateRandom
  , "GENERATE-WATTS-STROGATZ":          generateWattsStrogatz
  , "GENERATE-RING":                    generateRing
  , "GENERATE-STAR":                    generateStar
  , "GENERATE-WHEEL":                   generateWheel
  , "GENERATE-WHEEL-INWARD":            generateWheelInward
  , "GENERATE-WHEEL-OUTWARD":           generateWheelOutward
  , "GENERATE-LATTICE-2D":              generateLattice2d
  , "GENERATE-SMALL-WORLD":             generateSmallWorld
  }
