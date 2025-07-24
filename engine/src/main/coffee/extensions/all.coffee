# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['array', 'bitmap', 'codap', 'csv', 'encode', 'dialog', 'export-the', 'fetch', 'fp', 'http-req', 'import-a', 'logging', 'matrix', 'mini-csv', 'nlmap', 'nt', 'palette', 'resource', 'send-to', 'sound', 'store', 'string', 'table']

module.exports = {

  initialize: (workspace, importedExtensions...) ->
    console.log "Initializing extensions: #{importedExtensions.join(', ')}"
    upperNames = importedExtensions.map( (name) -> name.toUpperCase() )
    extensions = {}
    extensionPaths.forEach( (path) ->
      extensionModule = require("extensions/#{path}")
      extension = extensionModule.init(workspace)
      upperName = extension.name.toUpperCase()
      if upperNames.includes(upperName)
        extensions[upperName] = extension
    )
    importedExtensions.filter(NLWExtensionsLoader.isURL).forEach( (url) ->
      extensionModule = NLWExtensionsLoader.getExtensionModuleFromURL(url)
      if extensionModule?
        extension = extensionModule.init(workspace)
        upperName = extension.name.toUpperCase()
        extensions[upperName] = extension
      else
        console.warn "Extension at URL #{url} does not have an init function."
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
    importedExtensions.filter(NLWExtensionsLoader.isURL).forEach( (url) -> 
      extensionModule = NLWExtensionsLoader.getExtensionModuleFromURL(url)
      if extensionModule? and extensionModule.porter?
        upperName = extensionModule.porter.extensionName.toUpperCase()
        porters.push(extensionModule.porter)
      else
        console.warn "Extension at URL #{url} does not have an init function."
    )
    porters

}
