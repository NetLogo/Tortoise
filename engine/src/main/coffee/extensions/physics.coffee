# (C) Omar Ibrahim. https://github.com/NetLogo/Tortoise

SingleObjectExtensionPorter = require('../engine/core/world/singleobjectextensionporter')
{ exceptionFactory: exceptions } = require('util/exception')

Turtle = require('../engine/core/turtle')
TurtleSet = require('../engine/core/turtleset')
Patch  = require('../engine/core/patch')
PatchSet = require('../engine/core/patchset')

Planck = require('planck')
Vec2 = Planck.Vec2

extensionName = "phys"
version       = "0.1.0"

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

# Testing utility
assert = (f, message) ->
    if not f
        throw exceptions.extension(message)

# Returns the type of the agent as a string
# if the agent is a Turtle, Patch, or PatchSet.
whatAmI = (agent) ->
    if agent instanceof Turtle
        return "turtle"
    else if agent instanceof Patch
        return "patch"
    else if agent instanceof PatchSet
        return "patchset"
    else
        throw exceptions.extension("Unknown agent type")

# Math utility functions
# Mainly adds radians and degrees conversion
class MathUtils
    @radians: (degrees) ->
        return degrees * Math.PI / 180.0

    @degrees: (radians) ->
        return radians * 180.0 / Math.PI

# DefaultMap is a Map that returns a default value
# when a key is not found. DefaultMap.has() returns true
# iff the key is explicitly assigned a value in the map.
class DefaultMap extends Map
    constructor: (@defaultValue = undefined) ->
        super()

    get: (key) ->
        if super.has(key)
            return super.get(key)
        else
            return @defaultValue

    set: (key, value) ->
        super.set(key, value)
        return this

# Converts a heading in degrees to radians
# by adjusting the heading to match the
# coordinate system used by Planck.js.
headingToRadians = (heading) ->
    return MathUtils.radians(90 - heading)

# This function pipes the turtle body to the provided function.
# T => Maybe Turtle[Maybe Body] -> (Body -> T) -> T
pipeTurtleBody = (physics, myself, func) ->
    if whatAmI(myself) is "turtle"
        body = physics.turtlesToBodies.get(myself)
        if body?
            return func(body)
        else
            throw exceptions.extension("Turtle is not physical")
    else
        throw exceptions.extension("Cannot call pipe on non-turtle agent")

# Utility class for Map operations
class MapUtils
    # Swaps keys and values in a Map.
    @swap: (map) ->
        if not (map instanceof Map)
            throw exceptions.extension("Input is not a Map")

        swapped = new Map()
        for key, value of map.entries()
            if swapped.has(value)
                swapped.get(value).push(key)
            else
                swapped.set(value, [key])
        return swapped

# The Java implementation of the `phys` extension uses
# dyn4j for physics simulation. This class provides a polyfill
# for missing features in Planck.js that dyn4j provides.
class Dyn4jPolyfill
    constructor: (@world) ->
        @_accumulatedTime = 0

    # Accumulates elapsed time and steps the world based on
    # on a constant step time.
    update: (elapsedTime, stepElapsedTime = 1.0 / 60.0, maxSteps = 5, options) ->
        @_accumulatedTime ?= 0
        @_accumulatedTime += elapsedTime

        stepsPerformed = 0
        while @_accumulatedTime >= stepElapsedTime and stepsPerformed < maxSteps
            @world.step(stepElapsedTime, options.velocityIterations, options.positionIterations)
            @_accumulatedTime -= stepElapsedTime
            stepsPerformed += 1

        return stepsPerformed

    # returns the normalized vector scaled to the given magnitude.
    updateVectorMagnitude: (vector, magnitude) ->
        if vector.length() > 0
            vector.normalize().scale(magnitude)
        else
            new Vec2(0.0, 0.0)

class Physics
    @extensionName = extensionName        # String
    @createPlanckWorld: ->
        new Planck.World({
            gravity: new Vec2(0.0, 0.0),
            velocityIterations: 1,
            positionIterations: 1,
            continuousPhysics: true,
        })

    constructor: (workspace) ->
        @workspace = workspace                              # Workspace
        @world = Physics.createPlanckWorld()                # Planck.World
        @dyn4j     = new Dyn4jPolyfill(@world)              # Dyn4jPolyfill

        @turtleChanges = 10                                 # Double
        @collisions = 0                                     # Double
        @patchesCollisionList = new Map()                   # Map[Turtle, List[Patch]]
        @turtlesCollisionList = new Map()                   # Map[Turtle, List[Turtle]]
        @turtlesCollisionListPatches = new Map()            # Map[Patch, List[Turtle]]
        @turtlesToBodies = new Map()                        # Map[Turtle, Body]
        @patchesToBodies = new Map()                        # Map[Patch, Body]
        @bodiesToTurtles = new Map()                        # Map[Body, Turtle]
        @bodiesToPatches = new Map()                        # Map[Body, Patch]
        @turtlesLastE = new DefaultMap(new Vec2(0.0, 0.0))  # Map[Turtle, Vector2]
        @turtlesLastV = new DefaultMap(new Vec2(0.0, 0.0))  # Map[Turtle, Vector2]
        @collisionSetList = []                              # List[Set[Body]]
        @cTime = 0                                          # Long
        @floor = -16.0                                      # Double
        @lastGrav = new Vec2(0.0, 0.0)                      # Vector2
        @newE = 0.0                                         # Double
        @newEa = 0.0                                        # Double
        @outOfOrder = 0                                     # Long
        @eDiffTolerance = 0.00000000000001                  # Double
        @numCorrections = 0                                 # Long
        @numUncorrectable = 0                               # Long
        @numEnergyDiscrepancies = 0                         # Long
        @totalEnergyDiscrepancy = 0                         # Double
        @doConservation = true                              # Boolean
        @doCollisionDetection = true                        # Boolean

        # Settings (not impl.)
        @restitutionVelocity = 0.0

        # Settings (impl.)
        @velocityIterations = 1
        @positionIterations = 1

        # Clear the world
        @clearAll()

    clearAll: () ->
        @world = Physics.createPlanckWorld()
        @dyn4j = new Dyn4jPolyfill(@world)
        @world.setGravity(new Vec2(0.0, 0.0))
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
                        angle: headingToRadians(myself._heading),
                        linearDamping: 0.0,
                        angularDamping: 0.0,
                        allowSleep: false,
                        awake: true,
                    })
                    shape = new Planck.Circle(myself._size / 2)
                    fixture = body.createFixture({
                        shape: shape,
                        density: 1.0,      # Not in Java impl.
                        friction: 0.0,
                        restitution: 1.0
                    })
                    body.setLinearVelocity(new Vec2(0, 0)) # Reset velocity

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
                        angle: 0,
                        awake: true
                    })
                    fixture = body.createFixture({
                        shape: new Planck.Box(0.5, 0.5), # Geometry.createSquare(1) in dyn4j
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
        @turtlesToBodies.entries().forEach(([turtle, body]) =>
            if turtle.id < 0
                @world.destroyBody(body)
                @turtlesToBodies.delete(turtle)
            else
                bodyPosition = body.getPosition()
                if turtle.xcor != bodyPosition.x or turtle.ycor != bodyPosition.y
                    @turtleChanges += 1
                    body.setPosition(new Vec2(turtle.xcor, turtle.ycor))
                radians = headingToRadians(turtle._heading)
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
        @dyn4j.update(elapsedTime, 1.0 / 60.0, 1, @)
        @world.clearForces()
        if @doCollisionDetection
            @world.off('pre-solve', @_onPreSolve)
            @world.off('post-solve', @_onPostSolve)

        # Handle energy conservation
        if Math.abs(@totalEnergyDiscrepancy) > @eDiffTolerance
            @turtlesToBodies.entries().forEach(([turtle, body]) =>
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
        @turtlesToBodies.entries().forEach(([turtle, body]) =>
            bodyPosition = body.getPosition()
            if turtle.xcor != bodyPosition.x or turtle.ycor != bodyPosition.y
                turtle.setXY(bodyPosition.x, bodyPosition.y)
            #endif

            degrees = 90 - MathUtils.degrees(body.getAngle())
            if turtle._heading != degrees
                turtle.setVariable("heading", degrees)
                turtle._heading = degrees
            #endif
        ) #end forEach

    setConservation: (doConservation) ->
        @doConservation = doConservation

    setCollisionDetection: (doCollisionDetection) ->
        @doCollisionDetection = doCollisionDetection

    setGravity: (x, y) ->
        @world.setGravity(new Vec2(x, y))

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
        @turtlesToBodies.entries().forEach(([turtle, body]) =>
            if body?
                totalKE += 0.5 * body.getMass() * Math.pow(body.getLinearVelocity().lengthSquared(), 2.0) # 1/2 * m * v^2
        )
        return totalKE

    getTotalE: () ->
        totalE = 0.0
        @turtlesToBodies.entries().forEach(([turtle, body]) =>
            if body?
                ke = 0.5 * body.getMass() * body.getLinearVelocity().lengthSquared() # 1/2 * m * v^2
                pe = (@floor - body.getPosition().y) * @world.getGravity().y * body.getMass() # m * g * h
                totalE += ke + pe
        )
        return totalE

    getTotalLastE: () ->
        totalLastE = 0.0
        @turtlesLastE.entries().forEach(([turtle, vec]) =>
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

    _toAgentSetString: (set) ->
        # [(breed-singular who), (breed-singular who), ...]
        return "[" + set.map((el) -> "(" + el.getBreedNameSingular() + " " + el.who + ")").join(", ") + "]"

    turtleCollisions: () -> # TurtCols
        myself = @workspace.selfManager.self()
        switch whatAmI(myself)
            when "turtle"
                if @turtlesCollisionList.has(myself)
                    agents = @turtlesCollisionList.get(myself) or []
                    return new TurtleSet(agents, @workspace, @_toAgentSetString(agents))
                else
                    return new TurtleSet([], @workspace, "[]")
            when "patch"
                agents = @turtlesCollisionListPatches.get(myself) or []
                return new TurtleSet(agents, @workspace, @_toAgentSetString(agents))
            else
                return new TurtleSet([], @workspace, "[]")

    patchCollisions: () ->
        myself = @workspace.selfManager.self()
        switch whatAmI(myself)
            when "turtle"
                if @patchesCollisionList.has(myself)
                    agents = @patchesCollisionList.get(myself) or []
                    return new PatchSet(agents, @workspace, @_toAgentSetString(agents))
                else
                    return new PatchSet([], @workspace, "[]")
            else
                return new PatchSet([], @workspace, "[]")

    centerOfMass: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
            position = body.getPosition()
            return [position.x, position.y]
        )

    getVelocity: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
            return body.getLinearVelocity()
        )

    getMass: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
            return body.getMass()
        )

    getInertia: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
            return body.getInertia()
        )

    getKineticEnergy: () ->
        myself = @workspace.selfManager.self()
        cls    = @
        return pipeTurtleBody(@, myself, (body) =>
            return cls._getKineticEnergy(body)
        )

    getVelocityX: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
            return body.getLinearVelocity().x
        )

    getVelocityY: () ->
        myself = @workspace.selfManager.self()
        return pipeTurtleBody(@, myself, (body) =>
           return body.getLinearVelocity().y
        )

    setMass: (mass) ->
        myself = @workspace.selfManager.self()
        pipeTurtleBody(@, myself, (body) =>
            body.setMassData({
                center: body.getLocalCenter(),
                I: body.getInertia(),
                mass: mass
            })
        )

    setVelocity: (vx, vy) ->
        myself = @workspace.selfManager.self()
        pipeTurtleBody(@, myself, (body) =>
            newVelocity = new Vec2(vx, vy)
            body.setLinearVelocity(newVelocity)
        )

    setVelocityMagnitude: (magnitude) ->
        myself = @workspace.selfManager.self()
        pipeTurtleBody(@, myself, (body) =>
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
        @turtlesToBodies.forEach((body, turtle) =>
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
    _onPreSolve:  (contact) =>
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

    _onPostSolve: (contact) =>
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

        else if (@bodiesToTurtles.has(bodyA) and @bodiesToPatches.has(bodyB)) \
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

LoudPhysics = new Proxy Physics,
  construct: (target, args, newTarget) ->
    # 1) create the real Physics instance
    instance = Reflect.construct target, args, newTarget
    # 2) wrap it in a proxy that intercepts all method calls
    new Proxy instance,
      get: (obj, prop, receiver) ->
        val = Reflect.get obj, prop, receiver
        # only wrap functions
        if typeof val is 'function'
          return (args...) ->
            try
              val.apply obj, args
            catch e
              console.error "Error in physics extension method: #{prop}", e
              throw exceptions.extension "Error in physics extension method: #{prop}"
        # non‐functions pass through
        return val

class PhysicsPorter
    constructor: (dependencies) ->
        # Pass in external types to keep the porter self-contained
        { @Planck, @Vec2 } = dependencies

    # Converts a planck.js Body into a plain, serializable object
    # by converting its properties and fixtures into a JSON-compatible format.
    _serializeBody: (body) ->
        # Prepare the fixtures
        fixturesData = []
        fixture = body.getFixtureList()
        while fixture
            shape = fixture.getShape()
            shapeData = type: shape.getType()

            switch shapeData.type
                when 'circle'
                    shapeData.radius = shape.getRadius()
                when 'box'
                    # A 1x1 patch box has half-width/height of 0.5
                    # We can get this from the vertices for robustness
                    shapeData.halfWidth = Math.abs(shape.m_vertices[1].x)
                    shapeData.halfHeight = Math.abs(shape.m_vertices[2].y)

            fixturesData.push({
                density: fixture.getDensity(),
                friction: fixture.getFriction(),
                restitution: fixture.getRestitution(),
                shape: shapeData
            })

            fixture = fixture.getNext() # Move to the next fixture in the list

        # Other types are already plain objects
        {
            type: body.getType()
            position: body.getPosition()
            angle: body.getAngle()
            linearVelocity: body.getLinearVelocity()
            angularVelocity: body.getAngularVelocity()
            linearDamping: body.getLinearDamping()
            angularDamping: body.getAngularDamping()
            mass: body.getMass()
            inertia: body.getInertia()
            fixtures: fixturesData
        }

    # Re-creates a planck.js Body from a plain object within a given world.
    _deserializeBody: (world, bodyData) ->
        body = world.createBody({
            type: bodyData.type,
            position: new @Vec2(bodyData.position.x, bodyData.position.y),
            angle: bodyData.angle,
            linearDamping: bodyData.linearDamping,
            angularDamping: bodyData.angularDamping,
            awake: true,
            allowSleep: false
        })

        body.setLinearVelocity(new @Vec2(bodyData.linearVelocity.x, bodyData.linearVelocity.y))
        body.setAngularVelocity(bodyData.angularVelocity)
        body.setMassData({
            mass: bodyData.mass,
            center: new @Vec2(0, 0), # Assuming center of mass is at local origin
            I: bodyData.inertia
        })

        for fixtureData in bodyData.fixtures
            shape = null
            switch fixtureData.shape.type
                when 'circle'
                    shape = new @Planck.Circle(fixtureData.shape.radius)
                when 'box'
                    shape = new @Planck.Box(fixtureData.shape.halfWidth, fixtureData.shape.halfHeight)

            if shape
                body.createFixture({ shape, ...fixtureData })

        return body

    # The main serialization function.
    exportData: (physics) ->
        turtlesData = []
        physics.turtlesToBodies.forEach((body, turtle) =>
            if turtle? and turtle.id >= 0
                turtlesData.push({ turtleId: turtle.id, body: @_serializeBody(body) })
        )

        patchesData = []
        physics.patchesToBodies.forEach((body, patch) =>
            patchesData.push({ pxcor: patch.pxcor, pycor: patch.pycor, body: @_serializeBody(body) })
        )

        turtlesLastEData = []
        physics.turtlesLastE.forEach((vec, turtle) =>
            if turtle? and turtle.id >= 0
                turtlesLastEData.push({ turtleId: turtle.id, vec: vec })
        )

        {
            version: version,

            # World and simulation properties
            gravity: physics.world.getGravity(),
            turtleChanges: physics.turtleChanges,
            collisions: physics.collisions,
            floor: physics.floor,
            eDiffTolerance: physics.eDiffTolerance,
            numCorrections: physics.numCorrections,
            numUncorrectable: physics.numUncorrectable,
            numEnergyDiscrepancies: physics.numEnergyDiscrepancies,
            totalEnergyDiscrepancy: physics.totalEnergyDiscrepancy,
            doConservation: physics.doConservation,
            doCollisionDetection: physics.doCollisionDetection,
            velocityIterations: physics.velocityIterations,
            positionIterations: physics.positionIterations,

            # Serialized data structures
            turtles: turtlesData,
            patches: patchesData,
            turtlesLastE: turtlesLastEData
        }

    # The main deserialization function.
    importData: (data, reify) ->
        physics = new Physics(reify.workspace) # Create a fresh instance

        # Restore simple properties
        physics.world.setGravity(new @Vec2(data.gravity.x, data.gravity.y))
        Object.assign(physics, {
            turtleChanges: data.turtleChanges,
            collisions: data.collisions,
            floor: data.floor,
            eDiffTolerance: data.eDiffTolerance,
            numCorrections: data.numCorrections,
            numUncorrectable: data.numUncorrectable,
            numEnergyDiscrepancies: data.numEnergyDiscrepancies,
            totalEnergyDiscrepancy: data.totalEnergyDiscrepancy,
            doConservation: data.doConservation,
            doCollisionDetection: data.doCollisionDetection,
            velocityIterations: data.velocityIterations,
            positionIterations: data.positionIterations
        })

        # Clear default maps before repopulating
        physics.turtlesToBodies.clear()
        physics.patchesToBodies.clear()

        # Re-link turtles to their bodies
        for turtleData in data.turtles
            turtle = reify.workspace.turtleManager.turtle(turtleData.turtleId)
            if turtle
                body = @_deserializeBody(physics.world, turtleData.body)
                physics.turtlesToBodies.set(turtle, body)

        # Re-link patches to their bodies
        for patchData in data.patches
            patch = reify.workspace.world.getPatch(patchData.pxcor, patchData.pycor)
            if patch
                body = @_deserializeBody(physics.world, patchData.body)
                physics.patchesToBodies.set(patch, body)

        # Restore other agent-linked maps
        physics.turtlesLastE.clear()
        for item in data.turtlesLastE
            turtle = reify.workspace.turtleManager.turtle(item.turtleId)
            if turtle then physics.turtlesLastE.set(turtle, new @Vec2(item.vec.x, item.vec.y))

        # Rebuild inverse maps for efficiency
        physics.bodiesToTurtles = MapUtils.swap(physics.turtlesToBodies)
        physics.bodiesToPatches = MapUtils.swap(physics.patchesToBodies)

        return physics

    # Wrapper for human-readable/string-based dump
    toBase64: (physics) ->
        data = @exportData(physics)
        jsonString = JSON.stringify(data)
        return btoa(unescape(encodeURIComponent(jsonString))) # Robust btoa

    # Wrapper for reading from a string
    fromBase64: (base64String, reify) ->
        jsonString = decodeURIComponent(escape(atob(base64String))) # Robust atob
        data = JSON.parse(jsonString)
        return @importData(data, reify)

physicsExtension = {
    porterInstance: new PhysicsPorter({ Planck, Vec2 }),
    porter: new SingleObjectExtensionPorter(
        extensionName,
        isPhysics,
        (obj, dump) => @porterInstance.toBase64(obj),
        (obj, expo) => @porterInstance.exportData(obj),
        (obj, form) => @porterInstance.toBase64(obj),
        (str, read) => @porterInstance.fromBase64(str, read),
        (dat, reify) => @porterInstance.importData(dat, reify)
    ),

    init: (workspace) ->
        physics = new LoudPhysics(workspace)
        {
            name: extensionName,
            clearAll: physics.clearAll.bind(physics),
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