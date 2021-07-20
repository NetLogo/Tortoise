# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

csv = require("extensions/csv")
{ parseString } = require('../serialize/readexportedvalue')

instance = null

module.exports = {

  porter: {

    extensionName: "mini-csv"

    canHandle: () ->
      false

  , export: () ->
    {
      extensionName: "mini-csv"
    , value: instance.value.report()
    }

  , format: (state) ->
    str = JSON.stringify(state)
    '"""' + str.replace(/"/g, '\\""') + '"""'

  , read: (str) ->
    json = parseString(str[0])
    JSON.parse(json)

  , import: (state) ->
    instance.value.set(state.value)

  }

  init: (workspace) ->

    core = csv.init(workspace)

    val = 100

    value = {
      set: (v) ->
        val = v

      decrement: () ->
        val = (val - 1)
        return

      report: () ->
        val

      increment: () ->
        val = (val + 1)
        return
    }

    # (String, String, U => T) => U => T
    deprecatePrim = (oldName, newName, f) ->
      () ->
        workspace.printPrims.print("#{oldName} is deprecated and will be removed in a future NetLogo Web release.  Please switch to using #{newName} instead.")
        f.apply(null, arguments)

    instance = {
      name: "mini-csv"
    , clearAll: value.decrement
    , value: value
    , prims: {
        "FROM-STRING": deprecatePrim("mini-csv:from-string", "csv:from-string", core.prims["FROM-STRING"])
      , "FROM-ROW": deprecatePrim("mini-csv:from-row", "csv:from-row", core.prims["FROM-ROW"])
      , "TO-STRING": deprecatePrim("mini-csv:to-string", "csv:to-string", core.prims["TO-STRING"])
      , "TO-ROW": deprecatePrim("mini-csv:to-row", "csv:to-row", core.prims["TO-ROW"])
      # These are non-functional prims just to test our extension format parsing/loading.
      # At the moment there is no easy way to add a "test only" extension, so they get
      # put here.  -Jeremy B July 2021
      , "__T-CONTEXT-REPORTER": value.report
      , "__O-CONTEXT-COMMAND":  value.increment
      }
    }

    instance

}
