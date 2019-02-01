# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

parse = require('csv-parse/lib/sync')

module.exports = {

  dumper: undefined

  init: (workspace) ->

    # ( String, String ) => List[List[Any]]
    fromString = ( csvText, delimiter = "," ) ->
      parse( csvText, {
        comment: '#',
        auto_parse: true,
        skip_empty_lines: true,
        relax_column_count: true,
        delimiter: delimiter
      })

    # ( String, String ) => List[Any]
    fromRow = ( csvText, delimiter = "," ) ->
      list = fromString(csvText, delimiter)
      if (list.length is 0) then list else list[0]

    # ( List[List[Any]], String ) => String
    toString = ( list, delimiter = "," ) ->
      list.map( (row) -> toRow(row, delimiter) ).join( "\n" )

    # ( List[Any], String ) => String
    toRow = ( row, delimiter = "," ) ->
      row.map( (cell) -> dumpAndWrap(cell, delimiter)  ).join( delimiter )

    # ( Any, String ) => String
    dumpAndWrap = ( cell, delimiter ) ->
      cellString = workspace.dump(cell)
      if ( cellString.includes( delimiter ) or cellString.includes( "\n" ) )
        "\"#{cellString}\""
      else
        cellString

    {
      name: "mini-csv"
    , prims: {
        "FROM-STRING": fromString
      , "FROM-ROW": fromRow
      , "TO-STRING": toString
      , "TO-ROW": toRow
      }
    }

}
