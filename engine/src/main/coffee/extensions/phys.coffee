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
        
formatGlobal = (exported) ->
    JSON.stringify(exported)

readGlobal = (line) ->
    JSON.parse(line)
    
importGlobal = (state, objects) ->
    if physics = getPhysics()
        physics.ImportState(state)

module.exports = {
  porter: new GlobalStateExtensionPorter(extensionName,
    exportGlobal, formatGlobal, readGlobal, importGlobal
  )

  init: (workspace) ->

    # (Number) => Unit
    update = (delta) ->
      if physics = getPhysics()
        physics.Update(delta)
      else
        workspace.printPrims.print("Update the physics by #{delta} seconds")
      return

    # (Number, Number) => Unit
    setGravity = (x, y) ->
      if physics = getPhysics()
        physics.SetGravity(x, y)
      else
        workspace.printPrims.print("Set the gravity of the world to be (#{x}, #{y})")
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
      return
    
    # () => Number
    getFriction = () ->
      if physics = getPhysics()
        physics.GetFriction(SelfManager.self())
      else
        false
      return
      
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
        false
      return
      
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
        false
      return
      
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
        false
      return
      
    # (Number) => Unit
    setDensity = (value) ->
      if physics = getPhysics()
        physics.SetDensity(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the density to be #{value}")
      return
    
    # () => Number
    getV = () ->
      if physics = getPhysics()
        velocity = physics.GetVelocity(SelfManager.self())
        Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1])
      else
        false
      return
    
    # () => Number
    getVx = () ->
      if physics = getPhysics()
        physics.GetVelocity(SelfManager.self())[0]
      else
        false
      return
    
    # () => Number
    getVy = () ->
      if physics = getPhysics()
        physics.GetVelocity(SelfManager.self())[1]
      else
        false
      return
      
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
        false
      return
      
    # (Number) => Unit
    setAngularV = (value) ->
      if physics = getPhysics()
        physics.SetAngularVelocity(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the angular velocity to be #{value}")
      return
    
    # () => Number
    getLinearDamping = () ->
      if physics = getPhysics()
        physics.GetLinearDamping(SelfManager.self())
      else
        false
      return
      
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
        false
      return
      
    # (Number) => Unit
    setAngularDamping = (value) ->
      if physics = getPhysics()
        physics.SetAngularDamping(SelfManager.self(), value)
      else
        workspace.printPrims.show(SelfManager.self)("Set the angular damping to be #{value}")
      return
      
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
        physics.Push(SelfManager.self(), value)
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

    {
      name: "phys"
    , prims: {
        "UPDATE": update,
        "SET-GRAVITY": setGravity,
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
        "GET-V": getV,
        "GET-VX": getVx,
        "GET-VY": getVy,
        "SET-V": setV,
        "GET-ANGULAR-V": getAngularV,
        "SET-ANGULAR-V": setAngularV,
        "GET-LINEAR-DAMPING": getLinearDamping,
        "SET-LINEAR-DAMPING": setLinearDamping,
        "GET-ANGULAR-DAMPING": getAngularDamping,
        "SET-ANGULAR-DAMPING": setAngularDamping,
        "PUSH": push,
        "APPLY-FORCE": applyForce,
        "APPLY-TORQUE": applyTorque,
      }
    }
}
