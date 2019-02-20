# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports = {

  init: (workspace) ->

    # (String, (String) => Unit) => Unit
    fromFilepath = (filepath, callback) ->
      workspace.ioConfig.slurpFilepathAsync(filepath)(callback)
      return

    # (String) => String
    fromFilepathSynchronously = (filepath, callback) ->
      throw new Error("'fetch:file' is not supported in NetLogo Web.  Use 'fetch:file-async' instead.")
      return

    # (String, (String) => Unit) => Unit
    fromURL = (url, callback) ->
      workspace.ioConfig.slurpURLAsync(url)(callback)
      return

    # (String) => String
    fromURLSynchronously = (url) ->
      workspace.ioConfig.slurpURL(url)

    {
      name: "fetch"
    , prims: {
              "FILE": fromFilepathSynchronously
      , "FILE-ASYNC": fromFilepath
      ,        "URL": fromURLSynchronously
      ,  "URL-ASYNC": fromURL
      }
    }

}
