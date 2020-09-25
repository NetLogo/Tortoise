# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# type ExtensionPorter[T] = {
#   canHandle:      (Any) => Boolean,
#   dump:           (T) => String,
#   importState:    (T, (Any) => Any) => T
# }

# (Array[ExtensionPorter]) => ExtensionsHandler
extensionsHandler = (extensionPorters) ->
  extensionReferences = new Map()
  inProgressMarker    = Object.freeze({ type: "operation-in-progress" })

  # (Any, (Any) -> Any, (ExtensionPorter) => (Any, (Any) => Any)) => Any
  traverse = (x, helper, f) ->
    if not extensionReferences.has(x)
      porter = extensionPorters.filter( (p) -> p.canHandle(x) )[0]
      extensionReferences.set(x, inProgressMarker)
      extensionObject = f(porter)(x, helper)
      extensionReferences.set(x, extensionObject)
      extensionObject

    else
      extensionObject = extensionReferences.get(x)
      if extensionObject is inProgressMarker
        throw new Error("Circular references within extension objects are not supported.")
      extensionObject

  {
    # (Any) => Boolean
    canHandle: (x) ->
      applicablePorters = extensionPorters.filter( (p) -> p.canHandle(x) )
      if applicablePorters.length > 1
        throw new Error("Multiple extensions claim to know how to handle this object type: #{JSON.stringify(x)}")
      (applicablePorters.length is 1)

    # (Any, (Any) => Any) => String
    dump: (x, helper) ->
      traverse(x, helper, (porter) -> porter.dump)

    # (Any, (Any) => Any) => Any
    exportState: (x, helper) ->
      traverse(x, helper, (porter) -> porter.exportState)

    # (Any, (Any) => Any) => Any
    reify: (x, helper) ->
      traverse(x, helper, (porter) -> porter.importState)

    # () => Unit
    reset: () ->
      extensionReferences.clear()
  }

module.exports = extensionsHandler
