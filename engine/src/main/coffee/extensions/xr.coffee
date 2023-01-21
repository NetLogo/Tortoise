# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
GlobalStateExtensionPorter = require('../engine/core/world/globalstateextensionporter')

getXR = () =>
  if window?.TortugaXR?
    return window.TortugaXR.Instance
  else
    return null

extensionName = "xr"

exportGlobal = () ->
    if XR = getXR()
        XR.ExportState()
    else {}
        
formatGlobal = (exported) ->
    JSON.stringify(exported).replace(/,/g, "`")

readGlobal = (line) ->
    JSON.parse(line[0].replace(/`/g, ","))
    
importGlobal = (state, objects) ->
    if XR = getXR()
        XR.ImportState(state)

module.exports = {
  porter: new GlobalStateExtensionPorter(extensionName,
    exportGlobal, formatGlobal, readGlobal, importGlobal
  )
  init: (workspace) =>
    # () -> Unit
    clearAll = () ->
      return
      
    # () => Boolean
    isSupported = () ->
      if XR = getXR()
        return XR.IsSupported()
      else
        return false
      
    # () => Boolean
    isOn = () ->
      if XR = getXR()
        return XR.IsOn()
      else
        return false
      
    # () => Unit
    startXR = () ->
      if XR = getXR()
        return XR.Switch(true)
      else
        workspace.printPrims.print("Try to start the XR view.")
      return
      
    # () => Unit
    stopXR = () ->
      if XR = getXR()
        return XR.Switch(false)
      else
        workspace.printPrims.print("Try to stop the XR view.")
      return

    # () -> [Number, Number]
    getGravity = () ->
      if XR = getXR()
        XR.GetGravity()
      else
        [0, 0]

    # () -> Number
    getScale = () ->
      if XR = getXR()
        XR.GetScale()
      else
        0
      
    # (Number) -> Unit
    setScale = (scale) ->
      if XR = getXR()
        XR.SetScale(scale)
      else
        workspace.printPrims.print("Try to set the mapping scale between real-world and model world to #{scale}.")
      return

    # (Wildcard) => Unit
    roomScan = (callback) ->
      if XR = getXR()
        XR.RoomScan(callback)
      else
        workspace.printPrims.print("Try to initiate an XR room scan.")
      return
      
    # (Number) => Boolean
    isRoomScanSupported = (type) ->
      if XR = getXR()
        return XR.IsRoomScanSupported(type)
      else
        return false
        
    # () => List
    scans = () ->
      if XR = getXR()
        return XR.GetKnownIDs()
      else
        return []

    # () => String
    currentScan = () ->
      if XR = getXR()
        return XR.GetCurrentScan()
      else
        return []

    # (String) => Unit
    useScan = (id) ->
      if XR = getXR()
        return XR.SetCurrentScan(id)
      else
        workspace.printPrims.print("Try to set the current scan to #{id}.")
      return

    # () -> Unit
    resizeWorld = () ->
      if XR = getXR()
        XR.ResizeWorld()
      else
        workspace.printPrims.print("Try to resize the world based on the current scan.")
      return

    # (String) -> List
    getDimensions = () ->
      if XR = getXR()
        return XR.GetDimensions()
      else
        return [0, 0]
      
    # (Wildcard) => Unit
    iterateAsPatches = (callback) ->
      if XR = getXR()
        XR.IterateAsPatches(callback)
      else
        workspace.printPrims.print("Try to iterate on the current scan as patches.")
      return

    # (Wildcard) => Unit
    iterateAsTurtles = (callback) ->
      if XR = getXR()
        XR.IterateAsTurtles(callback)
      else
        workspace.printPrims.print("Try to iterate on the current scan as turtles.")
      return

    {
      name: "xr"
    , clearAll: clearAll
    , prims: {
        "IS-SUPPORTED?": isSupported,
        "IS-ON?": isOn,
        "START": startXR,
        "STOP": stopXR,
        "GET-GRAVITY": getGravity,
        "GET-SCALE": getScale,
        "SET-SCALE": setScale,
        "SHOW-WIREFRAMES": showWireframes,
        "HIDE-WIREFRAMES": hideWireframes,
        "SHOW-WIREFRAME": showWireframe,
        "HIDE-WIREFRAME": hideWireframe,
        "ROOM-SCAN": roomScan,
        "CURRENT-SCAN": currentScan,
        "USE-SCAN": useScan,
        "IS-ROOM-SCAN-SUPPORTED?": isRoomScanSupported,
        "SCANS": scans,
        "RESIZE-WORLD": resizeWorld,
        "GET-DIMENSIONS": getDimensions,
        "ITERATE-AS-PATCHES": iterateAsPatches,
        "ITERATE-AS-TURTLES": iterateAsTurtles,
        "INSIDE-SCAN?": insideScan,
      }
    }
}