# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
{ Setters: TurtleSetters } = require('../engine/core/turtle/turtlevariables')

# Random-network generators for the nw extension.  Extracted from nw.coffee; receives shared foundation
# helpers from its caller.
{ getBreedName } = require('extensions/nw-core')

module.exports = (deps) ->
  { workspace } = deps

  generatePreferentialAttachment = (turtleBreed, linkBreed, numTurtles, minDegree) ->
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

    return

  generateRandom = (turtleBreed, linkBreed, nbTurtles, connexionProbability) ->
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

    return

  generateWattsStrogatz = (turtleBreed, linkBreed, nbTurtles, neighborhoodSize, rewireProbability) ->
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
    adjacency = new Map()
    for source, i in turtles
      targets = new Set()
      for neighbor in [1..neighborhoodSize]
        targets.add(turtles[(i + neighbor) % nbTurtles].id)
      adjacency.set(source.id, targets)

    # availBuffer is shuffled in place across the whole run; each rewire runs a partial Fisher-Yates from the front.
    availBuffer = turtles.slice()

    for source, i in turtles
      for neighbor in [1..neighborhoodSize]
        target     = turtles[(i + neighbor) % nbTurtles]
        realTarget = target

        if rng.nextDouble() < rewireProbability
          # Removing `target` first guarantees at least `target` itself stays a valid fallback candidate below.
          adjacency.get(source.id).delete(target.id)

          # Draw candidates via a running Fisher-Yates until one is neither self nor already adjacent (either
          # direction).  This matches the desktop selection loop, including its RNG draw per candidate.
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

    return

  {
    "GENERATE-PREFERENTIAL-ATTACHMENT": generatePreferentialAttachment
  , "GENERATE-RANDOM":                  generateRandom
  , "GENERATE-WATTS-STROGATZ":          generateWattsStrogatz
  }
