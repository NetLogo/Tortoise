{ exceptionFactory: exceptions } = require('util/exception')

module.exports = {

  porter: undefined

  init: (workspace) ->

    getResource = (key) ->
      if not workspace.resources.hasOwnProperty(key)
        exceptions.extension("Resource \"#{key}\" does not exist.")

      workspace.resources[key].data

    listResourceKeys = () ->
      Object.keys(workspace.resources)

    {
      name: "resource"
    , prims: {
        "GET":  getResource
      , "LIST": listResourceKeys
      }
    }

}
