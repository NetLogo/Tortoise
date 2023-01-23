# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
GlobalStateExtensionPorter = require('../engine/core/world/globalstateextensionporter')

getPhysics = () =>
  if window?.TortugaPhysics?
    return window.TortugaPhysics.Instance
  else
    return null

extensionName = "phys"

exportGlobal = () ->
    if physics = getPhysics()
        physics.ExportState()
    else {}
        
formatGlobal = (exported) ->
    JSON.stringify(exported).replace(/,/g, "`")

readGlobal = (line) ->
    JSON.parse(line[0].replace(/`/g, ","))
    
importGlobal = (state, objects) ->
    if physics = getPhysics()
        physics.ImportState(state)

module.exports = {
  porter: new GlobalStateExtensionPorter(extensionName,
    exportGlobal, formatGlobal, readGlobal, importGlobal
  )

  init: (workspace) ->
    # () => Unit
    clearAll = () ->
      if physics = getPhysics()
        physics.Reset()
      return

    # (Number) => Unit
    update = (delta) ->
      if physics = getPhysics()
        physics.Update(delta)
      else
        workspace.printPrims.print("Update the physics by #{delta} seconds")
      return

    # (Any) => Unit
    contactBegin = (callback) ->
      if physics = getPhysics()
        physics.ContactBegin(callback)
      return
      
    # (Any) => Unit
    contactEnd = (callback) ->
      if physics = getPhysics()
        physics.ContactEnd(callback)
      return
    
    # (Any) => Unit
    contactStay = (callback) ->
      if physics = getPhysics()
        physics.ContactStay(callback)
      return

    # (Any) => Unit
    filterContact = (callback) ->
      if physics = getPhysics()
        physics.FilterContact(callback)
      return

    # () => AgentSet
    contacts = () ->
      if physics = getPhysics()
        return new TurtleSet(physics.GetContacts(SelfManager.self()), world)
      
    # (Any) => Unit
    allContacts = (callback) ->
      if physics = getPhysics()
        physics.GetAllContacts(SelfManager.self(), callback)
        return

    # (Color, Number, Number) => Unit
    showVector = (color, x, y) ->
      if physics = getPhysics()
        physics.ShowVector(SelfManager.self(), x, y)
      return

    # (Color, Number, Number, Boolean) => Unit
    showOrthogonal = (color, x, y, align) ->
      if physics = getPhysics()
        physics.ShowVector(SelfManager.self(), x, y, align)
      return

    # () => Unit
    hideVectors = () ->
      if physics = getPhysics()
        physics.HideVectors(SelfManager.self())
      return

    # () => Unit
    clearVectors = () ->
      if physics = getPhysics()
        physics.ClearVectors()
      return

    # (Number, Number, Number, Number) => AgentSet
    raycast = (X1, Y1, X2, Y2) ->
      if physics = getPhysics()
        return new TurtleSet(physics.Raycast(X1, Y1, X2, Y2), world)
      else
        return new TurtleSet({}, world)

    # () => List
    raycastAll = (X1, Y1, X2, Y2, callback) ->
      if physics = getPhysics()
        physics.RaycastAll(X1, Y1, X2, Y2, callback)
      return
        
    # () => AgentSet
    pointcast = (X, Y) ->
      if physics = getPhysics()
        return new TurtleSet(physics.Pointcast(X, Y), world)
      else
        return new TurtleSet({}, world)
        
    # (Number, Number, Number, Number) => AgentSet
    query = (X1, Y1, X2, Y2) ->
      if physics = getPhysics()
        return new TurtleSet(physics.Query(X1, Y1, X2, Y2), world)
      else
        return new TurtleSet({}, world)
        
    # (Number) => AgentSet
    turtlesAround = (Radius) ->
      self = SelfManager.self()
      return query(self.xcor + Radius, self.ycor + Radius, self.xcor - Radius, self.ycor - Radius)
        
    # (Number) => AgentSet
    turtlesHere = (Radius) ->
      self = SelfManager.self()
      return pointcast(self.xcor, self.ycor)

    # () => List
    getGravity = () ->
      if physics = getPhysics()
        physics.GetGravity()
      else
        [0, 0]

    # (Number, Number) => Unit
    setGravity = (x, y) ->
      if physics = getPhysics()
        physics.SetGravity(x, y)
      else
        workspace.printPrims.print("Set the gravity of the world to be (#{x}, #{y})")
      return

    # () => Number
    getType = () ->
      if physics = getPhysics()
        physics.GetType(SelfManager.self())
      else
        [0, 0]

    # (Number) => Unit
    setType = (type) ->
      if physics = getPhysics()
        physics.SetType(SelfManager.self(), type)
      else
        workspace.printPrims.print("Set the type of the agent to be #{type}")
      return

    # () => Number
    getGroup = () ->
      if physics = getPhysics()
        physics.GetGroup(SelfManager.self())
      else
        [0, 0]

    # (Number) => Unit
    setGroup = (Group) ->
      if physics = getPhysics()
        physics.SetGroup(SelfManager.self(), Group)
      else
        workspace.printPrims.print("Set the group of the agent to be #{Group}")
      return

    # (Boolean) => Unit
    setPhysical = (status) ->
      if physics = getPhysics()
        physics.SetPhysical(SelfManager.self(), status)
      else
        workspace.printPrims.show(SelfManager.self)("Set the agent to be physical: #{status}")
      return

    # () => Boolean
    isPhysical = () ->
      if physics = getPhysics()
        physics.IsPhysical(SelfManager.self())
      else
        false
    
    # () => Number
    getFriction = () ->
      if physics = getPhysics()
        physics.GetFriction(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setFriction = (value) ->
      if physics = getPhysics()
        physics.SetFriction(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the friction to be #{value}")
      return
    
    # () => Number
    getRestitution = () ->
      if physics = getPhysics()
        physics.GetRestitution(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setRestitution = (value) ->
      if physics = getPhysics()
        physics.SetRestitution(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the restitution to be #{value}")
      return
    
    # () => Number
    getMass = () ->
      if physics = getPhysics()
        physics.GetMass(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setMass = (value) ->
      if physics = getPhysics()
        physics.SetMass(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the mass to be #{value}")
      return
    
    # () => Number
    getDensity = () ->
      if physics = getPhysics()
        physics.GetDensity(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setDensity = (value) ->
      if physics = getPhysics()
        physics.SetDensity(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the density to be #{value}")
      return
    
    # () => [Number, Number]
    getOrigin = () ->
      if physics = getPhysics()
        physics.GetOrigin(SelfManager.self())
      else
        [SelfManager.self().xcor, SelfManager.self().ycor]
      
    # (Number) => Unit
    setOrigin = (x, y) ->
      if physics = getPhysics()
        physics.SetOrigin(SelfManager.self(), x, y)
      else
        workspace.printPrims.show(SelfManager.self)("Set the origin position to be #{x}, #{y}")
      return
    
    # () => [Number, Number]
    getV = () ->
      if physics = getPhysics()
        physics.GetVelocity(SelfManager.self())
      else
        [0, 0]
    
    # () => [Number, Number]
    getA = () ->
      if physics = getPhysics()
        physics.GetAcceleration(SelfManager.self())
      else
        [0, 0]
    
    # () => Number
    getVx = () ->
      if physics = getPhysics()
        physics.GetVelocity(SelfManager.self())[0]
      else
        false
    
    # () => Number
    getVy = () ->
      if physics = getPhysics()
        physics.GetVelocity(SelfManager.self())[1]
      else
        false
      
    # (Number) => Unit
    setV = (x, y) ->
      if physics = getPhysics()
        physics.SetVelocity(SelfManager.self(), x, y)
      else
        workspace.printPrims.show(SelfManager.self)("Set the linear velocity to be #{x} #{y}")
      return
    
    # () => Number
    getAngularV = () ->
      if physics = getPhysics()
        physics.GetAngularVelocity(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setAngularV = (value) ->
      if physics = getPhysics()
        physics.SetAngularVelocity(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the angular velocity to be #{value}")
      return
      
    # () => Number
    getAngularA = () ->
      if physics = getPhysics()
        physics.GetAngularAcceleration(SelfManager.self())
      else
        0
    
    # () => Number
    getLinearDamping = () ->
      if physics = getPhysics()
        physics.GetLinearDamping(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setLinearDamping = (value) ->
      if physics = getPhysics()
        physics.SetLinearDamping(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the linear damping to be #{value}")
      return
    
    # () => Number
    getAngularDamping = () ->
      if physics = getPhysics()
        physics.GetAngularDamping(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setAngularDamping = (value) ->
      if physics = getPhysics()
        physics.SetAngularDamping(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the angular damping to be #{value}")
      return
      
    # (Number, Number) => Boolean
    canMove = (steps, type) ->
      if physics = getPhysics()
        physics.CanMove(SelfManager.self(), steps, type)
      else
        SelfManager.self().canMove(steps)
      
    # (Number) => Unit
    push = (value) ->
      if physics = getPhysics()
        physics.Push(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Push the agent with a #{value}N")
      return
      
    # (Number, Number) => Unit
    applyForce = (x, y) ->
      if physics = getPhysics()
        physics.Push(SelfManager.self(), x, y)
      else
        workspace.printPrims.show(SelfManager.self)("Apply a force on the agent with #{x}N (x) and #{y}N (y)")
      return
      
    # (Number) => Unit
    applyTorque = (value) ->
      if physics = getPhysics()
        physics.Push(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Apply a torque on the agent with #{value}N·m")
      return

    # (Boolean, Number) => Unit
    makeCircle = (filled, radius) ->
      if physics = getPhysics()
        physics.MakeCircle(SelfManager.self(), filled, radius)
      else
        workspace.printPrims.show(SelfManager.self)("Set the shape as a circle with radius #{radius}, filled: #{filled}")
      return

    # (Boolean, Number) => Unit
    addCircle = (filled, radius, xAnchor, yAnchor) ->
      if physics = getPhysics()
        physics.MakeCircle(SelfManager.self(), filled, radius, true, xAnchor, yAnchor)
      else
        workspace.printPrims.show(SelfManager.self)("Add a circle with radius #{radius} into the shape, anchor: #{xAnchor},#{yAnchor}, filled: #{filled}")
      return

    # (Boolean, Number, Number) => Unit
    makeBox = (filled, x, y) ->
      if physics = getPhysics()
        physics.MakeBox(SelfManager.self(), filled, x, y)
      else
        workspace.printPrims.show(SelfManager.self)("Set the shape as a #{x}x#{y} box, filled: #{filled}")
      return

    # (Boolean, Number, Number, Number, Number) => Unit
    addBox = (filled, x, y, xAnchor, yAnchor) ->
      if physics = getPhysics()
        physics.MakeBox(SelfManager.self(), filled, x, y, true, xAnchor, yAnchor)
      else
        workspace.printPrims.show(SelfManager.self)("Add a #{x}x#{y} box into the shape, anchor: #{xAnchor},#{yAnchor}, filled: #{filled}")
      return

    # (Boolean, List) => Unit
    makePolygon = (filled, vertexes) ->
      if physics = getPhysics()
        physics.MakePolygon(SelfManager.self(), filled, vertexes)
      else
        workspace.printPrims.show(SelfManager.self)("Set the shape as a polygon with #{vertexes.length} vertexes, filled: #{filled}")
      return

    # (Boolean, List) => Unit
    addPolygon = (filled, vertexes) ->
      if physics = getPhysics()
        physics.MakePolygon(SelfManager.self(), filled, vertexes, true)
      else
        workspace.printPrims.show(SelfManager.self)("Add a polygon with #{vertexes.length} vertexes into the shape, filled: #{filled}")
      return

    # (Boolean, Width, List) => Unit
    makeEdges = (looping, vertexes) ->
      if physics = getPhysics()
        physics.MakeEdges(SelfManager.self(), looping, vertexes)
      else
        workspace.printPrims.show(SelfManager.self)("Set the shape as edges with #{vertexes.length} vertexes, loop: #{looping}")
      return

    # (Boolean, Width, List) => Unit
    addEdges = (looping, vertexes) ->
      if physics = getPhysics()
        physics.MakeEdges(SelfManager.self(), looping, vertexes, true)
      else
        workspace.printPrims.show(SelfManager.self)("Add edges with #{vertexes.length} vertexes into the shape, loop: #{looping}")
      return

    # (Number, Number, Number, Number) => Unit
    distanceJoint = (x1, y1, x2, y2) ->
      if physics = getPhysics()
        physics.DistanceJoint(SelfManager.self(), x1, y1, x2, y2)
      else
        workspace.printPrims.show(SelfManager.self)("Set the link as a distance joint with (#{x1}, #{y1}) as anchor1, and (#{x2}, #{y2}) as anchor2")
      return

    # () => Unit
    mouseJoint = () ->
      if physics = getPhysics()
        physics.MouseJoint(SelfManager.self())
      else
        workspace.printPrims.show(SelfManager.self)("Set the link as a mouse joint")
      return

    # () => Unit
    detachJoint = () ->
      if physics = getPhysics()
        physics.DetachJoint(SelfManager.self())
      else
        workspace.printPrims.show(SelfManager.self)("Detach the joint from the link")
      return
      
    # () => Unit
    getLength = () ->
      if physics = getPhysics()
        physics.GetLength(SelfManager.self())
      else
        0
      
    # () => Unit
    setLength = (resting, minimum, maximum) ->
      minimum ?= resting
      maximum ?= resting
      if physics = getPhysics()
        physics.SetLength(SelfManager.self(), resting, minimum, maximum)
      else
        workspace.printPrims.show(SelfManager.self)("Set the length of the joint to be #{resting}, min #{minimum}, max #{maximum}")
      return
      
    # (Number, Number) => Unit
    setLinearStiffness = (frequency, damping) ->
      if physics = getPhysics()
        physics.SetLinearStiffness(SelfManager.self(), frequency, damping)
      else
        workspace.printPrims.show(SelfManager.self)("Set the stiffness and damping of the joint to be based on frequency #{frequency} and damping ratio #{damping}")
      return
      
    # () => Number
    getDamping = () ->
      if physics = getPhysics()
        physics.GetDamping(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setDamping = (value) ->
      if physics = getPhysics()
        physics.SetDamping(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the damping of the joint to be #{value}")
      return
      
    # () => Number
    getStiffness = () ->
      if physics = getPhysics()
        physics.GetStiffness(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setStiffness = (value) ->
      if physics = getPhysics()
        physics.SetStiffness(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the stiffness of the joint to be #{value}")
      return
      
    # () => Number
    getMaxForce = () ->
      if physics = getPhysics()
        physics.GetMaxForce(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setMaxForce = (value) ->
      if physics = getPhysics()
        physics.SetMaxForce(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the maximum force of the joint to be #{value}")
      return
      
    # () => Number
    getMaxTorque = () ->
      if physics = getPhysics()
        physics.GetMaxTorque(SelfManager.self())
      else
        0
      
    # (Number) => Unit
    setMaxTorque = (value) ->
      if physics = getPhysics()
        physics.SetMaxTorque(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the maximum torque of the joint to be #{value}")
      return
      
    # () => [Number, Number]
    getForce = () ->
      if physics = getPhysics()
        physics.GetReactionaryForce(SelfManager.self())
      else
        [0, 0]
      
    # () => Number
    getTorque = () ->
      if physics = getPhysics()
        physics.GetReactionaryTorque(SelfManager.self())
      else
        0

    {
      name: "phys"
    , clearAll: clearAll
    , prims: {
        "UPDATE": update,
        "RAYCAST": raycast,
        "POINTCAST": pointcast,
        "RAYCAST-ALL": raycastAll,
        "QUERY": query,
        "TURTLES-HERE": turtlesHere,
        "TURTLES-AROUND": turtlesAround,
        "CONTACTS": contacts,
        "ALL-CONTACTS": allContacts,
        "GET-TYPE": getType,
        "SET-TYPE": setType,
        "GET-GROUP": getGroup,
        "SET-GROUP": setGroup,
        "GET-GRAVITY": getGravity,
        "SET-GRAVITY": setGravity,
        "CONTACT-STAY": contactStay,
        "CONTACT-BEGIN": contactBegin,
        "CONTACT-END": contactEnd,
        "FILTER-CONTACT": filterContact,
        "SHOW-VECTOR": showVector,
        "SHOW-ORTHOGONAL": showOrthogonal,
        "HIDE-VECTORS": hideVectors,
        "CLEAR-VECTORS": clearVectors,
        "IS-PHYSICAL?": isPhysical,
        "SET-PHYSICAL": setPhysical,
        "GET-FRICTION": getFriction,
        "SET-FRICTION": setFriction,
        "GET-RESTITUTION": getRestitution,
        "SET-RESTITUTION": setRestitution,
        "GET-MASS": getMass,
        "SET-MASS": setMass,
        "GET-DENSITY": getDensity,
        "SET-DENSITY": setDensity,
        "GET-ORIGIN": getOrigin,
        "SET-ORIGIN": setOrigin,
        "GET-V": getV,
        "GET-VX": getVx,
        "GET-VY": getVy,
        "GET-A": getA,
        "SET-V": setV,
        "GET-ANGULAR-V": getAngularV,
        "SET-ANGULAR-V": setAngularV,
        "GET-ANGULAR-A": getAngularA,
        "GET-LINEAR-DAMPING": getLinearDamping,
        "SET-LINEAR-DAMPING": setLinearDamping,
        "GET-ANGULAR-DAMPING": getAngularDamping,
        "SET-ANGULAR-DAMPING": setAngularDamping,
        "CAN-MOVE": canMove,
        "PUSH": push,
        "APPLY-FORCE": applyForce,
        "APPLY-TORQUE": applyTorque,
        "MAKE-BOX": makeBox,
        "MAKE-CIRCLE": makeCircle,
        "MAKE-POLYGON": makePolygon,
        "MAKE-EDGES": makeEdges,
        "ADD-BOX": addBox,
        "ADD-CIRCLE": addCircle,
        "ADD-POLYGON": addPolygon,
        "ADD-EDGES": addEdges,
        "DETACH-JOINT": detachJoint,
        "DISTANCE-JOINT": distanceJoint,
        "DISTANCE-JOINT-ANCHORED": distanceJoint,
        "MOUSE-JOINT": mouseJoint,
        "GET-LENGTH": getLength,
        "SET-LENGTH": setLength,
        "SET-LENGTHS": setLength,
        "SET-LINEAR-STIFFNESS": setLinearStiffness,
        "SET-DAMPING": setDamping,
        "GET-DAMPING": getDamping,
        "GET-STIFFNESS": getStiffness,
        "SET-STIFFNESS": setStiffness,
        "GET-MAX-FORCE": getMaxForce,
        "SET-MAX-FORCE": setMaxForce,
        "GET-MAX-TORQUE": getMaxTorque,
        "SET-MAX-TORQUE": setMaxTorque,
        "GET-FORCE": getForce,
        "GET-TORQUE": getTorque
      }
    }
}
