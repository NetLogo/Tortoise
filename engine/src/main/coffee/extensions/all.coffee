# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['array', 'codap', 'csv', 'encode', 'dialog', 'export-the', 'fetch', 'http-req', 'import-a', 'logging', 'matrix', 'mini-csv', 'nlmap', 'nt', 'palette', 'send-to', 'sound', 'store', 'table']

module.exports = {

  initialize: (workspace, importedExtensions...) ->
    upperNames = importedExtensions.map( (name) -> name.toUpperCase() )
    extensions = {}
    extensionPaths.forEach( (path) ->
      extensionModule = require("extensions/#{path}")
      extension = extensionModule.init(workspace)
      upperName = extension.name.toUpperCase()
      if upperNames.includes(upperName)
        extensions[upperName] = extension
    )
    extensions

  porters: (importedExtensions...) ->
    upperNames = importedExtensions.map( (name) -> name.toUpperCase() )
    porters = []
    extensionPaths.forEach( (path) ->
      extensionModule = require("extensions/#{path}")
      if extensionModule.porter?
        upperName = extensionModule.porter.extensionName.toUpperCase()
        if upperNames.includes(upperName)
          porters.push(extensionModule.porter)
    )
    porters

}
