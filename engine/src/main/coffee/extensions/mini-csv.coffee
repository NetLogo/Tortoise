# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

csv = require("extensions/csv")

module.exports = {

  dumper: undefined

  init: (workspace) ->

    core = csv.init(workspace)

    # (String, String, U => T) => U => T
    deprecatePrim = (oldName, newName, f) ->
      () ->
        workspace.printPrims.print("#{oldName} is deprecated and will be removed in a future NetLogo Web release.  Please switch to using #{newName} instead.")
        f.apply(null, arguments)

    {
      name: "mini-csv"
    , prims: {
        "FROM-STRING": deprecatePrim("mini-csv:from-string", "csv:from-string", core.prims["FROM-STRING"])
      , "FROM-ROW": deprecatePrim("mini-csv:from-row", "csv:from-row", core.prims["FROM-ROW"])
      , "TO-STRING": deprecatePrim("mini-csv:to-string", "csv:to-string", core.prims["TO-STRING"])
      , "TO-ROW": deprecatePrim("mini-csv:to-row", "csv:to-row", core.prims["TO-ROW"])
      }
    }

}
