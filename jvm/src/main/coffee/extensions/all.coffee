# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['nlmap']
extObj         = {}

extensionPaths.forEach((path) -> e = require("extensions/#{path}"); extObj[e.name.toUpperCase()] = e)

module.exports = extObj
