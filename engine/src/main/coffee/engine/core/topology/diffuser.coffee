# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# There are some key things to keep in mind to keep this code in sync with how headless/desktop operates:

# 1. The calculations must be done from patch perspective - diffusing "into" the patch, not "out to" surrounding patches
# 2. Changes from an earlier patch diffuse are not considered by later patches during a diffuse operation (hence the scratch array).
# 3. The patch sums must be done in "cross 4" then "diagonal 4" order to keep floating point math happy.
# 4. The `sum4` method must match what's used by headless/desktop - the high/low sorting is critical for floating point.

# -JMB March 2018

module.exports =
  class Diffuser
    @CENTER = 0
    @WEST   = -1
    @EAST   = 1
    @NORTH  = -1
    @SOUTH  = 1
    @CURRENT    = Object.freeze({ x: 0, y: 0 })
    @EAST_NORTH = Object.freeze({ x: 1, y: -1 })
    @WEST_SOUTH = Object.freeze({ x: -1, y: 1 })
    @EAST_SOUTH = Object.freeze({ x: 1, y: 1 })
    @WEST_NORTH = Object.freeze({ x: -1, y: -1 })

    constructor: (@_setPatchVariable, @_width, @_height, wrapInX, wrapInY) ->
      @_wrapWest = if wrapInX then (@_width - 1) else Diffuser.CENTER
      @_wrapEast = if wrapInX then (1 - @_width) else Diffuser.CENTER
      @_wrapNorth = if wrapInY then (@_height - 1) else Diffuser.CENTER
      @_wrapSouth = if wrapInY then (1 - @_height) else Diffuser.CENTER

    # (String, Number, Array[Number]) => Unit (side effect: diffuse to patches)
    diffuse4: (varName, coefficient, scratch) ->
      @_center4(  varName, coefficient, scratch)
      @_xBorders4(varName, coefficient, scratch)
      @_yBorders4(varName, coefficient, scratch)
      @_corners4( varName, coefficient, scratch)

    # (String, Number, Array[Number]) => Unit (side effect: diffuse to patches)
    diffuse8: (varName, coefficient, scratch) ->
      @_center8(  varName, coefficient, scratch)
      @_xBorders8(varName, coefficient, scratch)
      @_yBorders8(varName, coefficient, scratch)
      @_corners8( varName, coefficient, scratch)

    # (String, Number, Array[Number]) => Unit (side effect: diffuse all non-edge patches)
    _center4: (varName, coefficient, scratch) ->
      lastX = @_width - 1
      lastY = @_height - 1
      x = 1
      while x < lastX
        y = 1
        while y < lastY
          @_patch4(x, y, varName, coefficient, scratch,
            Diffuser.WEST, Diffuser.EAST, Diffuser.NORTH, Diffuser.SOUTH)
          y += 1
        x += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse all non-edge patches)
    _center8: (varName, coefficient, scratch) ->
      lastX = @_width - 1
      lastY = @_height - 1
      x = 1
      while x < lastX
        y = 1
        while y < lastY
          @_patch8(x, y, varName, coefficient, scratch,
            Diffuser.WEST, Diffuser.EAST, Diffuser.NORTH, Diffuser.SOUTH,
            Diffuser.EAST_NORTH, Diffuser.WEST_NORTH, Diffuser.EAST_SOUTH, Diffuser.WEST_SOUTH)
          y += 1
        x += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse non-corner y-edge patches)
    _yBorders4: (varName, coefficient, scratch) ->
      lastX = @_width - 1
      x = 1
      while x < lastX
        y = 0 # wrap to the north
        @_patch4(x, y, varName, coefficient, scratch,
          Diffuser.WEST, Diffuser.EAST, @_wrapNorth, Diffuser.SOUTH)

        y = @_height - 1 # wrap to the south
        @_patch4(x, y, varName, coefficient, scratch,
          Diffuser.WEST, Diffuser.EAST, Diffuser.NORTH, @_wrapSouth)

        x += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse non-corner y-edge patches)
    _yBorders8: (varName, coefficient, scratch) ->
      lastX = @_width - 1
      eastNorth = (if @_wrapNorth is 0 then Diffuser.CURRENT else { x: 1,  y: @_wrapNorth })
      westNorth = (if @_wrapNorth is 0 then Diffuser.CURRENT else { x: -1, y: @_wrapNorth })
      eastSouth = (if @_wrapSouth is 0 then Diffuser.CURRENT else { x: 1,  y: @_wrapSouth })
      westSouth = (if @_wrapSouth is 0 then Diffuser.CURRENT else { x: -1, y: @_wrapSouth })

      x = 1
      while x < lastX
        y = 0 # wrap to the north
        @_patch8(x, y, varName, coefficient, scratch,
          Diffuser.WEST, Diffuser.EAST, @_wrapNorth, Diffuser.SOUTH, eastNorth, westNorth, Diffuser.EAST_SOUTH, Diffuser.WEST_SOUTH)

        y = @_height - 1 # wrap to the south
        @_patch8(x, y, varName, coefficient, scratch,
          Diffuser.WEST, Diffuser.EAST, Diffuser.NORTH, @_wrapSouth, Diffuser.EAST_NORTH, Diffuser.WEST_NORTH, eastSouth, westSouth)

        x += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse non-corner x-edge patches)
    _xBorders4: (varName, coefficient, scratch) ->
      lastY = @_height - 1

      y = 1
      while y < lastY
        x = 0 # wrap to the west
        @_patch4(x, y, varName, coefficient, scratch, @_wrapWest, Diffuser.EAST, Diffuser.NORTH, Diffuser.SOUTH)

        x = @_width - 1 # wrap to the east
        @_patch4(x, y, varName, coefficient, scratch, Diffuser.WEST, @_wrapEast, Diffuser.NORTH, Diffuser.SOUTH)

        y += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse non-corner x-edge patches)
    _xBorders8: (varName, coefficient, scratch) ->
      lastY = @_height - 1
      eastNorth = (if @_wrapEast is 0 then Diffuser.CURRENT else { x: @_wrapEast, y: -1 })
      westNorth = (if @_wrapWest is 0 then Diffuser.CURRENT else { x: @_wrapWest, y: -1 })
      eastSouth = (if @_wrapEast is 0 then Diffuser.CURRENT else { x: @_wrapEast, y: 1 })
      westSouth = (if @_wrapWest is 0 then Diffuser.CURRENT else { x: @_wrapWest, y: 1 })

      y = 1
      while y < lastY
        x = 0 # wrap to the west
        @_patch8(x, y, varName, coefficient, scratch,
          @_wrapWest, Diffuser.EAST, Diffuser.NORTH, Diffuser.SOUTH, Diffuser.EAST_NORTH, westNorth, Diffuser.EAST_SOUTH, westSouth)

        x = @_width - 1 # wrap to the east
        @_patch8(x, y, varName, coefficient, scratch,
          Diffuser.WEST, @_wrapEast, Diffuser.NORTH, Diffuser.SOUTH, eastNorth, Diffuser.WEST_NORTH, eastSouth, Diffuser.WEST_SOUTH)

        y += 1
      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse all corner patches)
    _corners4: (varName, coefficient, scratch) ->
      x = 0 # Wrap west
      y = 0 # Wrap to the north
      @_patch4(x, y, varName, coefficient, scratch, @_wrapWest, Diffuser.EAST, @_wrapNorth, Diffuser.SOUTH)

      x = 0 # Wrap to the west
      y = @_height - 1 # Wrap to the south
      @_patch4(x, y, varName, coefficient, scratch, @_wrapWest, Diffuser.EAST, Diffuser.NORTH, @_wrapSouth)

      x = @_width - 1 # Wrap to the east
      y = 0 # Wrap to the north
      @_patch4(x, y, varName, coefficient, scratch, Diffuser.WEST, @_wrapEast, @_wrapNorth, Diffuser.SOUTH)

      x = @_width - 1 # Wrap east
      y = @_height - 1 # Wrap south
      @_patch4(x, y, varName, coefficient, scratch, Diffuser.WEST, @_wrapEast, Diffuser.NORTH, @_wrapSouth)

      return

    # (String, Number, Array[Number]) => Unit (side effect: diffuse all corner patches)
    _corners8: (varName, coefficient, scratch) ->
      x = 0 # Wrap west
      y = 0 # Wrap to the north
      eastNorth = (if @_wrapNorth is 0                     then Diffuser.CURRENT else { x: 1,          y: @_wrapNorth })
      westNorth = (if @_wrapWest  is 0 or @_wrapNorth is 0 then Diffuser.CURRENT else { x: @_wrapWest, y: @_wrapNorth })
      westSouth = (if @_wrapWest  is 0                     then Diffuser.CURRENT else { x: @_wrapWest, y: 1 })
      @_patch8(x, y, varName, coefficient, scratch,
        @_wrapWest, Diffuser.EAST, @_wrapNorth, Diffuser.SOUTH, eastNorth, westNorth, Diffuser.EAST_SOUTH, westSouth)

      x = 0 # Wrap to the west
      y = @_height - 1 # Wrap to the south
      westNorth = (if @_wrapWest  is 0                     then Diffuser.CURRENT else { x: @_wrapWest, y: -1 })
      eastSouth = (if @_wrapSouth is 0                     then Diffuser.CURRENT else { x: 1,          y: @_wrapSouth })
      westSouth = (if @_wrapWest  is 0 or @_wrapSouth is 0 then Diffuser.CURRENT else { x: @_wrapWest, y: @_wrapSouth })
      @_patch8(x, y, varName, coefficient, scratch,
        @_wrapWest, Diffuser.EAST, Diffuser.NORTH, @_wrapSouth, Diffuser.EAST_NORTH, westNorth, eastSouth, westSouth)

      x = @_width - 1 # Wrap to the east
      y = 0 # Wrap to the north
      eastNorth = (if @_wrapEast  is 0 or @_wrapNorth is 0 then Diffuser.CURRENT else { x: @_wrapEast, y: @_wrapNorth })
      westNorth = (if @_wrapNorth is 0                     then Diffuser.CURRENT else { x: -1,         y: @_wrapNorth })
      eastSouth = (if @_wrapEast  is 0                     then Diffuser.CURRENT else { x: @_wrapEast, y: 1 })
      @_patch8(x, y, varName, coefficient, scratch,
        Diffuser.WEST, @_wrapEast, @_wrapNorth, Diffuser.SOUTH, eastNorth, westNorth, eastSouth, Diffuser.WEST_SOUTH)

      x = @_width - 1 # Wrap east
      y = @_height - 1 # Wrap south
      eastNorth = (if @_wrapEast  is 0                     then Diffuser.CURRENT else { x: @_wrapEast, y: -1 })
      eastSouth = (if @_wrapEast  is 0 or @_wrapSouth is 0 then Diffuser.CURRENT else { x: @_wrapEast, y: @_wrapSouth })
      westSouth = (if @_wrapSouth is 0                     then Diffuser.CURRENT else { x: -1,         y: @_wrapSouth })
      @_patch8(x, y, varName, coefficient, scratch,
        Diffuser.WEST, @_wrapEast, Diffuser.NORTH, @_wrapSouth, eastNorth, Diffuser.WEST_NORTH, eastSouth, westSouth)

      return

    # (Number, Number, String, Number, Array[Number], Number, Number, Number, Number) => Unit
    # (side effect: diffuse a single patch)
    _patch4: (x, y, varName, coefficient, scratch, west, east, north, south) ->
      oldVal = scratch[x][y]
      ec = scratch[x + east][y]
      cn = scratch[x][y + north]
      cs = scratch[x][y + south]
      wc = scratch[x + west][y]
      newVal = @_patchVal4(coefficient, oldVal, ec, cn, cs, wc)
      @_setPatchVariable(x, y, varName, newVal, oldVal)
      return

    # (Number, Number, String, Number, Array[Number],
    #   Number, Number, Number, Number
    #   (Number, Number), (Number, Number), (Number, Number), (Number, Number)) => Unit
    # (side effect: diffuse a single patch)
    _patch8: (x, y, varName, coefficient, scratch, west, east, north, south, eastNorth, westNorth, eastSouth, westSouth) ->
      oldVal = scratch[x][y]
      ec = scratch[x + east][y        ]
      cn = scratch[x       ][y + north]
      cs = scratch[x       ][y + south]
      wc = scratch[x + west][y        ]
      en = scratch[x + eastNorth.x][y + eastNorth.y]
      wn = scratch[x + westNorth.x][y + westNorth.y]
      es = scratch[x + eastSouth.x][y + eastSouth.y]
      ws = scratch[x + westSouth.x][y + westSouth.y]
      newVal = @_patchVal8(coefficient, oldVal, ec, cn, cs, wc, en, wn, es, ws)
      @_setPatchVariable(x, y, varName, newVal, oldVal)
      return

    # (Number, Number, Number, Number) => Number
    _patchVal: (coefficient, oldVal, sum, dirCount) ->
      oldVal + coefficient * ( sum / dirCount - oldVal )

    # (Number, Number, Number, Number, Number, Number) => Number
    _patchVal4: (coefficient, oldVal, a, b, c, d) ->
      sum = @_sum4(a, b, c, d)
      @_patchVal(coefficient, oldVal, sum, 4)

    # (Number, Number, Number, Number, Number, Number, Number, Number, Number, Number) => Number
    _patchVal8: (coefficient, oldVal, a, b, c, d, e, f, g, h) ->
      sum = @_sum8(a, b, c, d, e, f, g, h)
      @_patchVal(coefficient, oldVal, sum, 8)

    # (Number, Number, Number, Number, Number, Number, Number, Number) => Number
    _sum8: (a, b, c, d, e, f, g, h) ->
      sum = @_sum4(a, b, c, d)
      sum + @_sum4(e, f, g, h)

    # (Number, Number, Number, Number) => Number
    _sum4: (a, b, c, d) ->
      if a < b
        low1 = a
        high1 = b
      else
        low1 = b
        high1 = a

      if c < d
        low2 = c
        high2 = d
      else
        low2 = d
        high2 = c

      if low2 < high1 and low1 < high2
        (low1 + low2) + (high1 + high2)
      else
        (low1 + high1) + (low2 + high2)
