# (C) Omar Ibrahim. https://github.com/NetLogo/Tortoise

SingleObjectExtensionPorter = require('../engine/core/world/singleobjectextensionporter')
{ exceptionFactory: exceptions } = require('util/exception')

Turtle = require('../engine/core/turtle')
Patch  = require('../engine/core/patch')
PatchSet = require('../engine/core/patchset')

Planck = require('planck')
const Vec2 = Vec2

extensionName = "phys"

isPhysics = (x) ->
    x instanceof Physics

toBase64 = (physics) ->
    # This is a placeholder function. In a real implementation, this would convert the physics state to a base64 string.
    "base64-encoded-physics-state"

fromBase64 = (base64String) ->
    # This is a placeholder function. In a real implementation, this would convert a base64 string back to a Physics object.
    new Physics()

exportPhysicsData = (physics) ->
    # This is a placeholder function. In a real implementation, this would export the physics data in a specific format.
    {

    }

importPhysicsData = (data) ->
    # This is a placeholder function. In a real implementation, this would import physics data from
    # a specific format and return a new Physics object.
    new Physics(undefined)  # Assuming the constructor can handle undefined


whatAmI = (agent) ->
    if agent instanceof Turtle
        return "turtle"
    else if agent instanceof Patch
        return "patch"
    else if agent instanceof PatchSet
        return "patchset"
    else
        throw exceptions.extension("Unknown agent type")

headingToRadians = (heading) ->
    return Math.radians(90 - heading)

class TurtleBodyMonad:
    @pipe: (physics, myself, func) ->
        if whatAmI(myself) is "turtle"
            body = physics.turtlesToBodies.get(myself)
            if body?
                return func(body)
            else
                throw exceptions.extension("Turtle is not physical")
        else
            throw exceptions.extension("Cannot call pipe on non-turtle agent")

class MapUtils
    @swap(map) ->
        swapped = new Map()
        for [key, value] of map.entries()
            if swapped.has(value)
                swapped.get(value).push(key)
            else
                swapped.set(value, [key])
        return swapped

class Dyn4jPolyfill
    constructor: (@world) ->
        @_accumulatedTime = 0

    update: (elapsedTime, stepElapsedTime = 1.0 / 60.0, maxSteps = 5) ->
        @_accumulatedTime ?= 0
        @_accumulatedTime += elapsedTime

        stepsPerformed = 0
        while @_accumulatedTime >= stepElapsedTime and stepsPerformed < maxSteps
            @world.step(stepElapsedTime)
            @_accumulatedTime -= stepElapsedTime
            stepsPerformed += 1

       stepsPerformed

    updateVectorMagnitude: (vector, magnitude) ->
        if vector.length() > 0
            vector.normalize().scale(magnitude)
        else
            new Vec2(0.0, 0.0)

class Physics
    @extensionName = extensionName
    @createPlanckWorld: ->
        new Planck.World({
            gravity: new Vec2(0.0, 0.0),
            velocityIterations: 1,
            positionIterations: 1,
            continuousPhysics: true,
        })

    constructor: (workspace) ->
        @workspace = workspace                        # Workspace
        @world = Physics.createPlanckWorld()          # Planck.World
        @dyn4j     = new Dyn4jPolyfill(@world)        # Dyn4jPolyfill

        @turtleChanges = 10                           # Double
        @collisions = 0                               # Double
        @patchesCollisionList = new Map()             # Map[Turtle, List[Patch]]
        @turtlesCollisionList = new Map()             # Map[Turtle, List[Turtle]]
        @turtlesCollisionListPatches = new Map()      # Map[Patch, List[Turtle]]
        @turtlesToBodies = new Map()                  # Map[Turtle, Body]
        @patchesToBodies = new Map()                  # Map[Patch, Body]
        @bodiesToTurtles = new Map()                  # Map[Body, Turtle]
        @bodiesToPatches = new Map()                  # Map[Body, Patch]
        @turtlesLastE = new Map()                     # Map[Turtle, Vector2]
        @turtlesLastV = new Map()                     # Map[Turtle, Vector2]
        @collisionSetList = []                        # List[Set[Body]]
        @cTime = 0                                    # Long
        @floor = -16.0                                # Double
        @lastGrav = new Vec2(0.0, 0.0)             # Vector2
        @newE = 0.0                                   # Double
        @newEa = 0.0                                  # Double
        @outOfOrder = 0                               # Long
        @eDiffTolerance = 0.00000000000001            # Double
        @numCorrections = 0                           # Long
        @numUncorrectable = 0                         # Long
        @numEnergyDiscrepancies = 0                   # Long
        @totalEnergyDiscrepancy = 0                   # Double
        @doConservation = true                        # Boolean
        @doCollisionDetection = true                  # Boolean

        # Settings
        restitutionVelocity = 0.0
        velocityIterations = 1
        positionIterations = 1
        continuousPhysics = true

    setGravity: (vector) ->
        @world.gravity.x = vector.x
        @world.gravity.y = vector.y

    clearAll: () ->
        @world = Physics.createPlanckWorld()
        @dyn4j = new Dyn4jPolyfill(@world)
        @setGravity(new Vec2(0.0, 0.0))
        @turtlesToBodies.clear()
        @patchesToBodies.clear()
        @bodiesToTurtles.clear()
        @bodiesToPatches.clear()
        @turtlesCollisionList.clear()
        @patchesCollisionList.clear()
        @turtlesCollisionListPatches.clear()
        @turtlesLastE.clear()
        @turtlesLastV.clear()
        @turtleChanges = 0
        @numCorrections = 0
        @numUncorrectable = 0
        @numEnergyDiscrepancies = 0
        @totalEnergyDiscrepancy = 0.0
        @lastGrav = new Vec2(0.0, 0.0)
        @newE = 0.0
        @newEa = 0.0

    setPhysical: (isPhysical) ->
        myself = @workspace.selfManager.self()
        switch whatAmI(myself)
            when "turtle"
                if isPhysical
                    body = @world.createBody({
                        type: 'dynamic', # MassType.NORMAL in dyn4j
                        position: new Vec2(myself.pxcor, myself.pycor),
                        angle: headingToRadians(myself.heading),
                        linearDamping: 0.0,
                        angularDamping: 0.0,
                        allowSleep: false,
                        awake: true,
                    })
                    shape = new Planck.Circle(new Vec2(myself.pxcor, myself.pycor), myself.size / 2)
                    fixture = body.createFixture({
                        shape: shape,
                        density: 1.0,      # Not in Java impl.
                        friction: 0.0,
                        restitution: 1.0
                    })

                    @turtlesToBodies.set(myself, body)
                else
                    body = @turtlesToBodies.get(myself)
                    if body?
                        @world.destroyBody(body)
                        @turtlesToBodies.delete(myself)
            when "patch"
                if isPhysical
                    body = @world.createBody({
                        type: 'static', # MassType.STATIC in dyn4j
                        position: new Vec2(myself.pxcor, myself.pycor),
                        awake: true
                    })
                    fixture = @world.fixture.create({
                        shape: new Planck.Box(1.0, 1.0), # Geometry.createSquare(1) in dyn4j
                        friction: 0.0,
                        restitution: 1.0
                    })
                    @patchesToBodies.set(myself, body)
                else
                    body = @patchesToBodies.get(myself)
                    if body?
                        @world.destroyBody(body)
                        @patchesToBodies.delete(myself)
            else
                throw exceptions.extension("Unknown agent type for self: #{myself}")

    update: (elapsedTime) ->
        # Update the physics world based to match the current
        # state of the NetLogo world.
        @turtlesToBodies.entries().forEach(([turtle, body]) ->
            if turtle.id < 0
                @world.destroyBody(body)
                @turtlesToBodies.delete(turtle)
            else
                worldCenter = body.getWorldCenter()
                if turtle.xcor != worldCenter.x or turtle.ycor != worldCenter.y
                    @turtleChanges += 1
                    body.setPosition(new Vec2(turtle.xcor, turtle.ycor))
                radians = headingToRadians(turtle.heading)
                if radians != body.getAngle()
                    @turtleChanges += 1
                    body.setAngle(radians)
        )

        # Ensure efficiency objects are up to date
        @bodiesToTurtles = MapUtils.swap(@turtlesToBodies)
        @bodiesToPatches = MapUtils.swap(@patchesToBodies)

        # Clear collision lists
        @turtlesCollisionList = new Map()  # Map[Turtle, List[Turtle]]
        @patchesCollisionList = new Map()  # Map[Turtle, List[Patch]]
        @turtlesCollisionListPatches = new Map()  # Map[Patch, List[Turtle]]
        @newEa = 0.0

        if @doCollisionDetection
            # Do we also need begin/end-contact events?
            @world.on('pre-solve', @_onPreSolve)
            @world.on('post-solve', @_onPostSolve)
        @dyn4j.update(elapsedTime, 1.0 / 60.0, 1)
        if @doCollisionDetection
            @world.off('pre-solve', @_onPreSolve)
            @world.off('post-solve', @_onPostSolve)

        # Handle energy conservation
        if Math.abs(@totalEnergyDiscrepancy) > @eDiffTolerance
            turtlesToBodies.entries.forEach(([turtle, body]) ->
                if Math.abs(@totalEnergyDiscrepancy) > @eDiffTolerance
                    ke = 0.5 * body.getMass() * body.getLinearVelocity().lengthSquared()
                    eDiff = 0.0
                    if @totalEnergyDiscrepancy < (ke / 20.0)
                        eDiff = @totalEnergyDiscrepancy
                    else
                        eDiff = ke / 20.0
                    vFin = Math.sqrt(body.getLinearVelocity().lengthSquared() - (2 * eDiff / body.getMass()))
                    body.setLinearVelocity(
                        @dyn4j.updateVectorMagnitude(body.getLinearVelocity(), vFin)
                    )
                    @totalEnergyDiscrepancy -= eDiff
                #endif
            ) #end forEach
        #endif

        # Update NetLogo turtles' positions and headings
        # based on the physics bodies' positions and angles
        turtlesToBodies.entries.forEach(([turtle, body]) ->
            if turtle.xcor != body.getWorldCenter().x or turtle.ycor != body.getWorldCenter().y
                @turtle.xcor = body.getWorldCenter().x
                @turtle.ycor = body.getWorldCenter().y
            #endif

            degrees = 90 - Math.degrees(body.getAngle())
            if turtle.heading != degrees
                @turtle.heading = degrees
            #endif
        ) #end forEach

    setConservation: (doConservation) ->
        @doConservation = doConservation

    setCollisionDetection: (doCollisionDetection) ->
        @doCollisionDetection = doCollisionDetection

    setGravity: (x, y) ->
        @world.gravity.x = x
        @world.gravity.y = y

    forward: (amount) ->
        myself = @workspace.selfManager.self()
        if whatAmI(myself) is "turtle"
            body = @turtlesToBodies.get(myself)
            if body?
                force = new Vec2(
                    myself.dx * amount,
                    myself.dy * amount
                )
                body.applyForce(force)
            else
                throw exceptions.extension("Turtle is not physical")
        else
            throw exceptions.extension("Cannot call forward on non-turtle agent")

    applyForce: (amount, degrees) ->
        myself = @workspace.selfManager.self()
        if whatAmI(myself) is "turtle"
            body = @turtlesToBodies.get(myself)
            if body?
                radians = headingToRadians(degrees)
                force = new Vec2(
                    Math.cos(radians) * amount,
                    Math.sin(radians) * amount
                )
                body.applyForce(force)
            else
                throw exceptions.extension("Turtle is not physical")
        else
            throw exceptions.extension("Cannot call applyForce on non-turtle agent")

    getTotalKE: () ->
        totalKE = 0.0
        @turtlesToBodies.entries().forEach(([turtle, body]) ->
            if body?
                totalKE += 0.5 * body.getMass() * Math.pow(body.getLinearVelocity().lengthSquared(), 2.0) # 1/2 * m * v^2
        )
        return totalKE

    getTotalE: () ->
        totalE = 0.0
        @turtlesToBodies.entries().forEach(([turtle, body]) ->
            if body?
                ke = 0.5 * body.getMass() * body.getLinearVelocity().lengthSquared() # 1/2 * m * v^2
                pe = (@floor - body.getPosition().y) * @world.getGravity().y * body.getMass() # m * g * h
                totalE += ke + pe
        )
        return totalE

    getTotalLastE: () ->
        totalLastE = 0.0
        @turtlesLastE.entries().forEach(([turtle, vec]) ->
            if vec?
                totalLastE += vec.x + vec.y
        )
        return totalLastE

    getNumChanges: () ->
        return @turtleChanges

    getTotalCorrections: () ->
        return @numCorrections

    getTotalUncorrectable: () ->
        return @numUncorrectable

    getEnergyDiscrepancies: () ->
        return @numEnergyDiscrepancies

    getEnergyDiscrepancy: () ->
        return @totalEnergyDiscrepancy

    getMLC: () ->
        return Planck.Settings.maximumLinearCorrection

    turtleCollisions: () ->
        throw "Not implemented yet. Need to figure out how to build an AgentSet from a Map."

    patchCollisions: () ->
        throw "Not implemented yet. Need to figure out how to build an AgentSet from a Map."

    centerOfMass: () ->
        throw "Not implemented yet. Need to figure out how to build a LogoList."

    getVelocity: () ->
        myself = @workspace.selfManager.self()
        return TurtleBodyMonad.pipe(@, myself, (body) ->
            return body.getLinearVelocity()
        )

    getMass: () ->
        myself = @workspace.selfManager.self()
        return TurtleBodyMonad.pipe(@, myself, (body) ->
            return body.getMass()
        )

    getInertia: () ->
        myself = @workspace.selfManager.self()
        return TurtleBodyMonad.pipe(@, myself, (body) ->
            return body.getInertia()
        )

    getKineticEnergy: () ->
        myself = @workspace.selfManager.self()
        cls    = @
        return TurtleBodyMonad.pipe(@, myself, (body) ->
            return cls._getKineticEnergy(body)
        )

    getVelocityX: () ->
        myself = @workspace.selfManager.self()
        return TurtleBodyMonad.pipe(@, myself, (body) ->
            return body.getLinearVelocity().x
        )

    getVelocityY: () ->
        myself = @workspace.selfManager.self()
        return TurtleBodyMonad.pipe(@, myself, (body) ->
           return body.getLinearVelocity().y
        )

    setMass: (mass) ->
        myself = @workspace.selfManager.self()
        TurtleBodyMonad.pipe(@, myself, (body) ->
            body.setMassData({
                center: body.getLocalCenter(),
                I: body.getInertia(),
                mass: mass
            })
        )

    setVelocity: (vx, vy) ->
        myself = @workspace.selfManager.self()
        TurtleBodyMonad.pipe(@, myself, (body) ->
            newVelocity = new Vec2(vx, vy)
            body.setLinearVelocity(newVelocity)
        )

    setVelocityMagnitude: (magnitude) ->
        myself = @workspace.selfManager.self()
        TurtleBodyMonad.pipe(@, myself, (body) ->
            currentVelocity = body.getLinearVelocity()
            newVelocity = @dyn4j.updateVectorMagnitude(currentVelocity, magnitude)
            body.setLinearVelocity(newVelocity)
        )

    getCollisionCount: () ->
        return @collisions

    getTotalNewEnergy: () ->
        return @newE

    stopAll: () ->
        # Stop all turtles by setting their velocities to zero
        @turtlesToBodies.forEach((body, turtle) ->
            if body?
                body.setLinearVelocity(new Vec2(0.0, 0.0))
        )

    # Helpers
    _getKineticEnergy: (body) ->
        if body?
            return 0.5 * body.getMass() * body.getLinearVelocity().lengthSquared() # 1/2 * m * v^2
        else
            return 0.0

    _getPotentialEnergy: (body) ->
        if body?
            return (@floor - body.getPosition().y) * @world.getGravity().y * body.getMass() # m * g * h
        else
            return 0.0

    _calculateFinalVelocityMagnitude: (body, eDiff) ->
        if body?
            vFin = Math.sqrt(body.getLinearVelocity().lengthSquared() - (2 * eDiff / body.getMass()))
            return vFin
        else
            return 0.0

    # ContactHandler() in Java impl.
    _onPreSolve:  (contact) ->
        fixtureA = contact.getFixtureA()
        fixtureB = contact.getFixtureB()

        bodyA = fixtureA.getBody()
        bodyB = fixtureB.getBody()

        if @bodiesToTurtles.has(bodyA) and @bodiesToTurtles.has(bodyB)   # Turtle, Turtle
            turtleA = @bodiesToTurtles.get(bodyA)
            turtleB = @bodiesToTurtles.get(bodyB)
            keA     = @_getKineticEnergy(bodyA)
            keB     = @_getKineticEnergy(bodyB)
            peA     = @_getPotentialEnergy(bodyA)
            peB     = @_getPotentialEnergy(bodyB)

            @turtlesLastE.set(turtleA, new Vec2(peA, keA))
            @turtlesLastE.set(turtleB, new Vec2(peB, keB))
        else if @bodiesToTurtles.has(bodyA) and @bodiesToPatches.has(bodyB)  # Turtle, Patch
            turtle = @bodiesToTurtles.get(bodyA)
            patch  = @bodiesToPatches.get(bodyB)
            ke     = @_getKineticEnergy(bodyA)
            pe     = @_getPotentialEnergy(bodyA)
            @turtlesLastE.set(turtle, new Vec2(pe, ke))
        else if @bodiesToPatches.has(bodyA) and @bodiesToTurtles.has(bodyB)  # Patch, Turtle
            turtle = @bodiesToTurtles.get(bodyB)
            patch  = @bodiesToPatches.get(bodyA)
            ke     = @_getKineticEnergy(bodyB)
            pe     = @_getPotentialEnergy(bodyB)
            @turtlesLastE.set(turtle, new Vec2(pe, ke))
        else
            # Patch, Patch or other combinations
            return  # No turtles involved, so no need to track energy

    _onPostSolve: (contact) ->
        fixtureA = contact.getFixtureA()
        fixtureB = contact.getFixtureB()

        bodyA = fixtureA.getBody()
        bodyB = fixtureB.getBody()

        if @bodiesToTurtles.has(bodyA) and @bodiesToTurtles.has(bodyB)   # Turtle, Turtle
            turtleA = @bodiesToTurtles.get(bodyA)
            turtleB = @bodiesToTurtles.get(bodyB)
            keA     = @_getKineticEnergy(bodyA)
            keB     = @_getKineticEnergy(bodyB)
            peA     = @_getPotentialEnergy(bodyA)
            peB     = @_getPotentialEnergy(bodyB)

            oldE = @turtlesLastE.get(turtleA).x + @turtlesLastE.get(turtleA).y + @turtlesLastE.get(turtleB).x + @turtlesLastE.get(turtleB).y
            newE = keA + keB + peA + peB
            eDiff = newE - oldE

            eDiff1 = eDiff * (keA + peA) / (keA + peA + keB + peB)
            eDiff2 = eDiff * (keB + peB) / (keA + peA + keB + peB)
            if eDiff > newE
                @numUncorrectable += 1

            vFin1 = @_calculateFinalVelocityMagnitude(bodyA, eDiff1)
            vFin2 = @_calculateFinalVelocityMagnitude(bodyB, eDiff2)

            if vFin1 >= 0 and vFin2 >= 0
                if Math.abs(eDiff) > @eDiffTolerance and @doConservation
                    @numCorrections += 1
                    bodyA.setLinearVelocity(@dyn4j.updateVectorMagnitude(bodyA.getLinearVelocity(), vFin1))
                    bodyB.setLinearVelocity(@dyn4j.updateVectorMagnitude(bodyB.getLinearVelocity(), vFin2))
            else
                @numUncorrectable += 1

            kef1 = @_getKineticEnergy(bodyA)
            kef2 = @_getKineticEnergy(bodyB)
            pef1 = @_getPotentialEnergy(bodyA)
            pef2 = @_getPotentialEnergy(bodyB)

            @turtlesLastE.set(turtleA, new Vec2(pef1, kef1))
            @turtlesLastE.set(turtleB, new Vec2(pef2, kef2))

            newEf = kef1 + kef2 + pef1 + pef2
            eDiffF = newEf - oldE
            if Math.abs(eDiffF) > @eDiffTolerance
                @totalEnergyDiscrepancy += newEf - oldE
                @numEnergyDiscrepancies += 1

        else if (@bodiesToTurtles.has(bodyA) and @bodiesToPatches.has(bodyB))
             or (@bodiesToPatches.has(bodyA) and @bodiesToTurtles.has(bodyB))  # Turtle, Patch
            turtleBody = if @bodiesToTurtles.has(bodyA) then bodyA else bodyB
            patchBody  = if @bodiesToPatches.has(bodyA) then bodyA else bodyB

            turtle = @bodiesToTurtles.get(turtleBody)
            patch  = @bodiesToPatches.get(patchBody)

            ke     = @_getKineticEnergy(turtleBody)
            pe     = @_getPotentialEnergy(turtleBody)

            oldE = @turtlesLastE.get(turtle).x + @turtlesLastE.get(turtle).y
            newE = ke + pe

            eDiff = newE - oldE
            vFin = @_calculateFinalVelocityMagnitude(turtleBody, eDiff)
            if vFin >= 0
                if Math.abs(eDiff) > @eDiffTolerance and @doConservation
                    @numCorrections += 1
                    turtleBody.setLinearVelocity(@dyn4j.updateVectorMagnitude(turtleBody.getLinearVelocity(), vFin))

            kef = @_getKineticEnergy(turtleBody)
            pef = @_getPotentialEnergy(turtleBody)

            @turtlesLastE.set(turtle, new Vec2(pef, kef))

            newEf = kef + pef
            eDiffF = newEf - oldE
            if Math.abs(eDiffF) > @eDiffTolerance
                @totalEnergyDiscrepancy += newEf - oldE
                @numEnergyDiscrepancies += 1

        else
            # Patch, Patch or other combinations
            return  # No turtles involved, so no need to track energy

        # Collision List Building
        if @bodiesToTurtles.has(bodyA) and @bodiesToTurtles.has(bodyB)
            # Turtle, Turtle
            turtleA = @bodiesToTurtles.get(bodyA)
            turtleB = @bodiesToTurtles.get(bodyB)

            if not @turtlesCollisionList.has(turtleA)
                @turtlesCollisionList.set(turtleA, [])
            if not @turtlesCollisionList.has(turtleB)
                @turtlesCollisionList.set(turtleB, [])

            @turtlesCollisionList.get(turtleA).push(turtleB)
            @turtlesCollisionList.get(turtleB).push(turtleA)

        else if @bodiesToTurtles.has(bodyA) and @bodiesToPatches.has(bodyB)
            # Turtle, Patch
            turtle = @bodiesToTurtles.get(bodyA)
            patch  = @bodiesToPatches.get(bodyB)
            if not @turtlesCollisionList.has(turtle)
                @turtlesCollisionList.set(turtle, [])
            if not @patchesCollisionList.has(turtle)
                @patchesCollisionList.set(turtle, [])
            @turtlesCollisionList.get(turtle).push(patch)
            @patchesCollisionList.get(turtle).push(turtle)

        else if @bodiesToPatches.has(bodyA) and @bodiesToTurtles.has(bodyB)
            # Patch, Turtle
            turtle = @bodiesToTurtles.get(bodyB)
            patch  = @bodiesToPatches.get(bodyA)
            if not @turtlesCollisionList.has(turtle)
                @turtlesCollisionList.set(turtle, [])
            if not @patchesCollisionList.has(turtle)
                @patchesCollisionList.set(turtle, [])
            @turtlesCollisionList.get(turtle).push(patch)
            @patchesCollisionList.get(turtle).push(turtle)
        else
            # Patch, Patch or other combinations
            return  # No turtles involved, so no need to track collisions

        @collisions += 1

physicsExtension = {
    porter: new SingleObjectExtensionPorter(extensionName, isPhysics, toBase64, exportPhysicsData, toBase64, fromBase64, importPhysicsData),

    init: (workspace) ->
        physics = new Physics(workspace)
        {
            name: extensionName,
            prims: {
                "SET-PHYSICAL": physics.setPhysical.bind(physics),
                "SET-GRAVITY": physics.setGravity.bind(physics),
                "UPDATE": physics.update.bind(physics),
                "PUSH": physics.forward.bind(physics),
                "APPLY-FORCE": physics.applyForce.bind(physics),
                "GET-TOTAL-CORRECTIONS": physics.getTotalCorrections.bind(physics),
                "GET-TOTAL-UNCORRECTABLE": physics.getTotalUncorrectable.bind(physics),
                "GET-TOTAL-ENERGY-DISCREPANCY": physics.getEnergyDiscrepancy.bind(physics),
                "GET-NUM-ENERGY-DISCREPANCIES": physics.getEnergyDiscrepancies.bind(physics),
                "TOTAL-KE": physics.getTotalKE.bind(physics),
                "TOTAL-E": physics.getTotalE.bind(physics),
                "TOTAL-NEWE": physics.getTotalNewEnergy.bind(physics),
                "TOTAL-LASTE": physics.getTotalLastE.bind(physics),
                "GET-V": physics.getVelocity.bind(physics),
                "SET-V-MAGNITUDE": physics.setVelocityMagnitude.bind(physics),
                "GET-KE": physics.getKineticEnergy.bind(physics),
                "GET-E": physics.getTotalE.bind(physics),
                "GET-VX": physics.getVelocityX.bind(physics),
                "GET-VY": physics.getVelocityY.bind(physics),
                "GET-MASS": physics.getMass.bind(physics),
                "GET-CENTER-OF-MASS": physics.centerOfMass.bind(physics),
                "GET-INERTIA": physics.getInertia.bind(physics),
                "SET-MASS": physics.setMass.bind(physics),
                "SET-V": physics.setVelocity.bind(physics),
                "STOP-ALL": physics.stopAll.bind(physics),
                "CHANGES": physics.getNumChanges.bind(physics),
                "COLLISION-NUMBER": physics.getCollisionCount.bind(physics),
                "GET-TURTLE-COLLISIONS": physics.turtleCollisions.bind(physics),
                "GET-PATCH-COLLISIONS": physics.patchCollisions.bind(physics),
                "GET-MLC": physics.getMLC.bind(physics),
                "DO-CONSERVATION": physics.setConservation.bind(physics),
                "DO-COLLISION-DETECTION": physics.setCollisionDetection.bind(physics),
            }
        }
}

module.exports = physicsExtension