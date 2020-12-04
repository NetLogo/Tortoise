# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../engine/core/typechecker')

parse = require('csv-parse/lib/sync')

boolNames = ["false", "true"]

# (String) => Float | Null
tryParseFloat = (value) ->
  # NetLogo does not consider ',' a valid float character and I don't want
  # to pull the whole NetLogo `NumberParser` in from Scala, so...
  # Jeremy B -August 2020
  if (value.includes(","))
    return null

  maybeFloat = Number.parseFloat(value)
  if (not Number.isNaN(maybeFloat))
    return maybeFloat

  return null

# (String) => Bool | Null
tryParseBool = (value) ->
  if (value is null or value.length < 4 or value.length > 5)
    return null

  lower = value.toLowerCase()
  if ("false" is lower)
    return false

  if ("true" is lower)
    return true

  return null

# It's silly we have to do this, but csv-parse doesn't cast boolean values, and if you
# add a cast function, it completely disables the built-in auto-cast.  Bwuh?
# -Jeremy B August 2020

# (String, CsvParseContext) => Bool | Float | String
cast = (value, context) ->

  if (context.quoting)
    return value

  maybeFloat = tryParseFloat(value)
  if (maybeFloat isnt null)
    return maybeFloat

  maybeBool = tryParseBool(value)
  if (maybeBool isnt null)
    return maybeBool

  value

module.exports = {

  porter: undefined

  init: (workspace) ->

    # (String, String) => List[List[Any]]
    fromString = (csvText, delimiter = ",") ->
      parse(csvText, {
        comment: '#',
        cast: cast,
        max_record_size: 1e12,
        skip_empty_lines: true,
        relax_column_count: true,
        delimiter: delimiter
      })

    # (String, String) => List[Any]
    fromRow = (csvText, delimiter = ",") ->
      # Match the desktop extension's behavior with empty rows
      # -Jeremy B August 2020
      if (csvText.trim() is "")
        return [csvText]

      list = fromString(csvText, delimiter)
      if (list.length is 0) then list else list[0]

    # (List[List[Any]], String) => String
    toString = (list, delimiter = ",") ->
      list.map( (maybeRow) -> guardedToRow(maybeRow, delimiter) ).join("\n")

    # (Any | List[Any], String) => String
    guardedToRow = (maybeRow, delimiter) ->
      if (not checks.isList(maybeRow))
        throw new Error("Extension exception: Expected a list of lists, but #{workspace.dump(maybeRow)} was one of the elements.")

      toRow(maybeRow, delimiter)

    # (List[Any], String) => String
    toRow = (row, delimiter = ",") ->
      row.map( (cell) -> dumpAndWrap(cell, delimiter)  ).join(delimiter)

    # (Any, String) => String
    dumpAndWrap = (cell, delimiter) ->
      cellString = workspace.dump(cell)
      if (cellString.startsWith("\"") and cellString.endsWith("\""))
        "\"\"#{cellString}\"\""
      else if (cellString.includes(delimiter) or cellString.includes("\n"))
        "\"#{cellString}\""
      else
        cellString

    # () => Unit
    fromFileNotSupported = () ->
      throw new Error("Extension exception: Reading directly from a file is not supported in NetLogo Web.  Instead you can use the Fetch extension to asynchronously read in a text file.\n\nfetch:user-file-async [ file-contents -> show csv:from-string file-contents ]")

    # () => Unit
    toFileNotSupported = () ->
      throw new Error("Extension exception: Writing directly to a file is not supported in NetLogo Web.  Instead you can use the SendTo extension to download a text file of the user's choice.\n\nsend-to:file \"output.csv\" csv:to-string [[0 1 true \"hello\"][1 10 false \"goodbye\"][2 5 true \"...\"]]")

    {
      name: "csv"
    , prims: {
        "FROM-STRING": fromString
      , "FROM-ROW": fromRow
      , "FROM-FILE": fromFileNotSupported
      , "TO-STRING": toString
      , "TO-ROW": toRow
      , "TO-FILE": toFileNotSupported
      }
    }

}
