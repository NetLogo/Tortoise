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

    # (Bool) => Unit
    setPhysical = (status) ->
      if physics = getPhysics()
        physics.SetPhysical(SelfManager.self(), status)
      else
        workspace.printPrims.print("Set the agent #{SelfManager.self().toString()} to be physical: #{status}")
      return

    {
      name: "phys"
    , prims: {
        "UPDATE": update,
        "SET-GRAVITY": setGravity,
        "SET-PHYSICAL": setPhysical,
      }
    }
}
