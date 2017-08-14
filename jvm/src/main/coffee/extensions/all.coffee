# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['codap', 'logging', 'nlmap']

module.exports =
  (workspace) ->
    extObj = {}
    extensionPaths.forEach((path) -> e = require("extensions/#{path}")(workspace); extObj[e.name.toUpperCase()] = e)
    extObj
