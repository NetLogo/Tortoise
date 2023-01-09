# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = [
  'array', 'bitmap', 'codap', 'csv', 'encode', 'dialog', 'export-the', 'fetch', 'fp', 'http-req', 'import-a', 'logging', 'matrix', 'mini-csv', 'nlmap', 'nt', 'palette', 'send-to', 'sound', 'store', 'table',
  # Followings are Turtle Universe extensions
  'plot', 'tutorial', 'widget', 'workspace', 'nettango', 'sensor', 'tune', 'phys', 'xr'
]

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
