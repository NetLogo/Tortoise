# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
TurtleSet = require('../engine/core/turtleset')

{ getBreedName } = require('extensions/nw-core')

# ({ workspace: Workspace }) => Object
module.exports = (deps) ->
  { workspace } = deps

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
  makeRandomTurtles = (n, turtleBreedName) ->
    workspace.world.turtleManager.createTurtles(n, turtleBreedName, 0, 0).toArray()

  # (String) => Turtle
  makeRandomTurtle = (turtleBreedName) ->
    makeRandomTurtles(1, turtleBreedName)[0]

  # Watts–Strogatz is the one desktop generator that does NOT draw RNG for turtle attributes.
  # -Jeremy B July 2026
  # (Number, String) => Array[Turtle]
  makeOrderedTurtles = (n, turtleBreedName) ->
    workspace.world.turtleManager.createOrderedTurtles(n, turtleBreedName).toArray()

  # (Turtle, Turtle, String, Boolean) => Link
  link = (end1, end2, linkBreedName, isDirected) ->
    if isDirected
      workspace.world.linkManager.createDirectedLink(end1, end2, linkBreedName)
    else
      # This preserves the link ordering, whihc a normal `createUndirectedLink()` would not do.  This is just to match
      # the behavior of desktop NW, which similarly skips the normal "sorted by who" path.  -Jeremy B July 2026
      workspace.world.linkManager._createLink(false, end1, end2, linkBreedName, true)

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
  runTurtleBlock = (turtles, runBlock) ->
    new TurtleSet(turtles, workspace.world).ask(runBlock ? (->), true)
    return

  # (AgentSet, AgentSet, Number, Number, Command) => Unit
  generatePreferentialAttachment = (turtleBreed, linkBreed, numTurtles, minDegree, runBlock) ->
    if numTurtles < 1
      throw exceptions.extension("The number of nodes in the generated network must be at least 1.")

    if minDegree < 1
      throw exceptions.extension("The minimum degree must be at least 1.")

    if numTurtles <= minDegree
      throw exceptions.extension("The number of turtles must be larger than the minimum degree.")

    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    rng = workspace.world.rng

    # Seed graph: a clique of (minDegree + 1) turtles with all mutual links, as in BarabasiAlbertGenerator.scala.
    # Turtles get random color/heading (matches desktop's createTurtle). Desktop builds the clique with
    # `getOrCreateLink(s, t)`, which preserves (from, to) endpoint order on create; the order matters because later
    # turtles sample `link.end1`/`end2` to pick attachment targets, so we use the order-preserving `link` helper (not
    # the canonicalizing one).
    # -Jeremy B July 2026
    turtles = makeRandomTurtles(minDegree + 1, turtleBreedName)
    links   = []
    for i in [0...turtles.length]
      for j in [i + 1...turtles.length]
        links.push(link(turtles[i], turtles[j], linkBreedName, isDirected))

    # Each new turtle attaches to `minDegree` distinct existing targets by sampling a random end of a random link.
    # Desktop draws `links(rng.nextInt(links.length))` then `if rng.nextBoolean) l.end1 else l.end2` per attempt, and
    # only appends the new links to the sampling pool AFTER the turtle is done (`links ++= ls`).  We mirror that: the
    # pool stays fixed during the loop (so `nextInt(links.length)` ranges over the same set as desktop),
    # `rng.nextBoolean` picks the end, and the new links are pushed only after the while-loop.  Endpoint order is
    # preserved (`link`, not `canonicalLink`) so that `end1`/`end2` line up with desktop for the next turtle's sampling.
    # Dedup is by target id, which for a fresh `s` is equivalent to desktop's `LinkedHashSet[Link]` dedup.
    # -Jeremy B July 2026
    for _ in [turtles.length...numTurtles]
      s          = makeRandomTurtle(turtleBreedName)
      newLinks   = []
      connected  = new Set()
      while connected.size < minDegree
        randomLink = links[rng.nextInt(links.length)]
        target     = if rng.nextBoolean() then randomLink.end1 else randomLink.end2
        if not connected.has(target.id)
          connected.add(target.id)
          newLinks.push(link(s, target, linkBreedName, isDirected))
      links.push(newLinks...)
      turtles.push(s)

    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Number, Command) => Unit
  generateRandom = (turtleBreed, linkBreed, nbTurtles, connexionProbability, runBlock) ->
    if nbTurtles < 1
      throw exceptions.extension("A positive number of turtles must be specified.")

    if connexionProbability < 0 or connexionProbability > 1.0
      throw exceptions.extension("The connexion probability must be between 0 and 1.")

    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)

    turtles = makeRandomTurtles(nbTurtles, turtleBreedName)

    # One `nextDouble` per candidate pair (drawn whether or not the link is created), in the same (i, j) order as
    # algorithms/ErdosRenyiGenerator: undirected walks j > i, directed walks all j ≠ i in ascending order.
    # -Jeremy B July 2026
    for i in [0...nbTurtles]
      jRange = if isDirected then [0...nbTurtles].filter((j) -> j isnt i) else [i + 1...nbTurtles]
      for j in jRange
        if workspace.world.rng.nextDouble() < connexionProbability
          link(turtles[i], turtles[j], linkBreedName, isDirected)

    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Number, Number, Command) => Unit
  generateWattsStrogatz = (turtleBreed, linkBreed, nbTurtles, neighborhoodSize, rewireProbability, runBlock) ->
    if nbTurtles < 1
      throw exceptions.extension("A positive number of turtles must be specified.")

    if neighborhoodSize < 0 or neighborhoodSize > Math.ceil(nbTurtles / 2 - 1)
      throw exceptions.extension("Neighborhood size must be less than half the number of turtles.")

    if rewireProbability < 0 or rewireProbability > 1.0
      throw exceptions.extension("The rewire probability must be between 0 and 1.")

    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    rng = workspace.world.rng

    turtles = makeOrderedTurtles(nbTurtles, turtleBreedName)

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

        link(source, realTarget, linkBreedName, isDirected)

    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateRing = (turtleBreed, linkBreed, nodeCount, runBlock) ->
    n = requireIntMinimum(nodeCount, 3)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeRandomTurtles(n, turtleBreedName)
    link(turtles[i], turtles[(i + 1) % n], linkBreedName, isDirected) for i in [0...n]
    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateStar = (turtleBreed, linkBreed, nodeCount, runBlock) ->
    n = requireIntMinimum(nodeCount, 1)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeRandomTurtles(n, turtleBreedName)
    # Desktop StarGraphGenerator makes the first turtle the center and adds edges (leaf, center) for each
    # leaf in ascending order, so end1=leaf, end2=center.  -Jeremy B July 2026
    hub = turtles[0]
    link(turtles[i], hub, linkBreedName, isDirected) for i in [1...n]
    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Boolean, Command) => Unit
  buildWheel = (turtleBreed, linkBreed, nodeCount, spokesFromHub, runBlock) ->
    n = requireIntMinimum(nodeCount, 4)
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeRandomTurtles(n, turtleBreedName)
    # Desktop WheelGraphGenerator creates the (n-1) rim turtles first and the hub last, then adds the rim
    # cycle followed by the spokes.  So the hub is the last turtle; inward spokes run (rim, hub), outward
    # spokes run (hub, rim).  `spokesFromHub` true => outward (hub -> rim), false => inward (rim -> hub).
    # -Jeremy B July 2026
    hub = turtles[n - 1]
    rim = turtles[0...n - 1]
    for i in [0...rim.length]
      link(rim[i], rim[(i + 1) % rim.length], linkBreedName, isDirected)
    for r in rim
      if spokesFromHub then link(hub, r, linkBreedName, isDirected) else link(r, hub, linkBreedName, isDirected)
    runTurtleBlock(turtles, runBlock)
    return

  # (AgentSet, AgentSet, Number, Command) => Unit
  generateWheel        = (turtleBreed, linkBreed, nodeCount, runBlock) -> buildWheel(turtleBreed, linkBreed, nodeCount, false, runBlock)
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

  # This code is written to be structurally equivalent with desktop NW, but not bit-identical.  That means things like
  # RNG state might not be 100% consistent between implementations.  This is to avoid re-implement the Jung-library's
  # algorithm here.  -Jeremy B July 2026
  # (AgentSet, AgentSet, Number, Number, Boolean, Command) => Unit
  generateLattice2d = (turtleBreed, linkBreed, rowCount, colCount, isToroidal, runBlock) ->
    rows = requireIntMinimum(rowCount, 2, "rows")
    cols = requireIntMinimum(colCount, 2, "columns")
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeRandomTurtles(rows * cols, turtleBreedName)
    buildLattice(turtles, rows, cols, isToroidal, linkBreedName, isDirected, new Set())
    runTurtleBlock(turtles, runBlock)
    return

  # This code is written to be structurally equivalent with desktop NW, but not bit-identical.  That means things like
  # RNG state might not be 100% consistent between implementations.  This is to avoid re-implement the Jung-library's
  # algorithm here.  -Jeremy B July 2026
  # (AgentSet, AgentSet, Number, Number, Number, Boolean, Command) => Unit
  generateSmallWorld = (turtleBreed, linkBreed, rowCount, colCount, clusteringExponent, isToroidal, runBlock) ->
    rows = requireIntMinimum(rowCount, 2, "rows")
    cols = requireIntMinimum(colCount, 2, "columns")
    { turtleBreedName, linkBreedName, isDirected } = generatorBreeds(turtleBreed, linkBreed)
    turtles = makeRandomTurtles(rows * cols, turtleBreedName)
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
    runTurtleBlock(turtles, runBlock)
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
