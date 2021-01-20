{ find, map   } = require('brazierjs/array')
{ arrayEquals } = require('brazierjs/equals')
{ pipeline    } = require('brazierjs/function')
{ fold        } = require('brazierjs/maybe')
{ rangeUntil  } = require('brazierjs/number')

{ floor }       = require('util/nlmath')
{ checks }      = require('../engine/core/typechecker')

StrictMath      = require('shim/strictmath')
vec             = require('vectorious')

SingleObjectExtensionPorter = require('../engine/core/world/singleobjectextensionporter')

notImplementedException = (prim) ->
  throw new Error("Extension exception: #{prim} has not been implemented.")

# Check nestedList input for possible problems, used by fromRowList & fromColumnList
# If input nestedList includes items, not numbers, replace them by zeros.
# -- XZ(Summer, 2020)
# List[Any] => List[List[Number]]
checkNestedList = (list) ->
  numRows = list.length
  if numRows is 0
    throw new Error("Extension exception: input list was empty")

  numCols = -1

  for rowList in list
    if rowList instanceof Array
      if numCols is -1
        numCols = rowList.length
      else if numCols isnt rowList.length
        throw new Error(
          "Extension exception: To convert a nested list into a matrix, all nested lists must be the same length" +
          " -- e.g. [[1 2 3 4] [1 2 3]] is invalid, because row 1 has one more entry."
        )
    else
      throw new Error(
        "Extension exception: To convert a nested list into a matrix, there must be exactly two levels of nesting" +
        " -- e.g. [[1 2 3] [4 5 6]] creates a good 2x3 matrix."
      )

  if numCols is 0
    throw new Error("Extension exception: input list contained only empty lists")

  # Assign zeros if the element is not a number
  for row in rangeUntil(0)(numRows)
    for column in rangeUntil(0)(numCols)
      if typeof(list[row][column]) isnt 'number'
        list[row][column] = 0

  return list

# Any => Boolean
isMatrix = (x) ->
  # not sure about this before, but in vectorious 6.0.2, default export (vec) isn't callable. Gotta do `vec.matrix` --Ruoshui (01/16/2021)
  x instanceof vec
  # x instanceof vec

dumpMatrix = (matrix) ->
  " #{formatMatrix(matrix)}"

exportMatrix = (matrix) ->
  matrix

# Matrix => String
formatExpMatrix = (exportedObj) ->
  formatMatrix(exportedObj.data)

formatMatrix = (matrix) ->
  inner = matrix.toArray().map((row) -> "[ #{row.join(" ")} ]").join("")
  "[ #{inner} ]"

readMatrix = (x, parseAny) ->
  parseable = x.replaceAll("\[ ", "[").replaceAll(" \]", "]").replaceAll("][", "] [")
  list = parseAny(parseable)
  vec.array(list)

importMatrix = (exportedObj) ->
  exportedObj.data

extensionName = "matrix"

module.exports = {

  porter: new SingleObjectExtensionPorter(extensionName, isMatrix, dumpMatrix, exportMatrix, formatExpMatrix, readMatrix, importMatrix)

  init: (workspace) ->

    # Check input values: matrix is valid; rows & cols are not out of boundary; newVals is a valid list.
    # Return [Integer(rows), Integer(cols)].
    # e.g. matrix:get glob1 1.1 2.2 == matrix:get glob1 1 2
    # -- XZ(Summer, 2020)
    # (Any, Number*, Number*, List[Number]*) => [Number|Null, Number|Null]
    validate = (matrix, rows, cols, newVals) ->
      if not isMatrix(matrix)
        throw new Error("Extension exception: not a matrix: #{workspace.dump(matrix, true)}")

      [numRows, numCols] = matrix.shape

      if rows? and cols?
        if not (0 <= rows < numRows) or not (0 <= cols < numCols)
          throw new Error(
            "Extension exception: " +
            "[#{rows} #{cols}] are not valid indices for a matrix with dimensions #{numRows}x#{numCols}"
          )
        else
          return [floor(rows), floor(cols)]
      else if rows?
        if not (0 <= rows < numRows)
          throw new Error(
            "Extension exception: " +
            "#{rows} is not a valid index for a matrix with dimensions #{numRows}x#{numCols}"
          )
        if newVals and (len = newVals.length) isnt numCols
          throw new Error(
            "Extension exception: " +
            "The length of the given list (#{len}) is different from the length of the matrix row (#{numRows})")
        else
          return [floor(rows), null]
      else if cols?
        if not (0 <= cols < numCols)
          throw new Error(
            "Extension exception: " +
            "#{cols} is not a valid index for a matrix with dimensions #{numRows}x#{numCols}"
          )
        if newVals and (len = newVals.length) isnt numRows
            throw new Error(
              "Extension exception: " +
              "The length of the given list (#{len}) is different from the length of the matrix column (#{numCols})")
        else
          return [null, floor(cols)]


    # (Number, Number, Number) => Matrix
    makeConstant = (rows, cols, initialValue) ->
      vec.matrix(rows, cols).fill(initialValue)

    # Number => Matrix
    makeIdentity = (size) ->
      vec.eye(size)

    # List[List[Number]] => Matrix
    fromRowList = (nestedList) ->
      nestedList = checkNestedList(nestedList)
      vec.array(nestedList)

    # List[List[Number]] => Matrix
    fromColumnList = (nestedList) ->
      nestedList = checkNestedList(nestedList)
      vec.array(nestedList).T

    # Matrix => List[List[Number]]
    toRowList = (matrix) ->
      validate(matrix)
      matrix.toArray()

    # Matrix => List[List[Number]]
    toColumnList = (matrix) ->
      validate(matrix)
      matrix.T.toArray()

    # Matrix => Matrix
    copy = (matrix) ->
      validate(matrix)
      matrix.copy()

    # Matrix => String
    prettyPrint = (matrix) ->
      validate(matrix)

      alignRow = (row) ->
        "[ #{row.join('  ')} ]"

      aligned = matrix.toArray().map((row) -> alignRow(row)).join('\n ')

      "[#{aligned}]"

    # (Matrix, Number, Number) => Number
    get = (matrix, i, j) ->
      [i, j] = validate(matrix, i, j)
      matrix.get(i, j)

    # (Matrix, Number) => List[Number]
    getRow = (matrix, i) ->
      [i, _] = validate(matrix, i)
      [_, cols] = matrix.shape
      rangeUntil(0)(cols).map((j) -> matrix.get(i, j))


    # (Matrix, Number) => List[Number]
    getColumn = (matrix, j) ->
      [_, j] = validate(matrix, _, j)
      [rows, _] = matrix.shape
      rangeUntil(0)(rows).map((i) -> matrix.get(i, j))

    # (Matrix, Number, Number, Number) => Unit
    set = (matrix, i, j, newVal) ->
      [i, j] = validate(matrix, i, j)
      matrix.set(i, j, newVal)
      return

    # (Matrix, Number, List[Number]) => Unit
    setRow = (matrix, i, newVals) ->
      [i, _] = validate(matrix, i, _, newVals)
      [_, cols] = matrix.shape
      rangeUntil(0)(cols).forEach((j) -> matrix.set(i, j, newVals[j]))
      return

    # (Matrix, Number, List[Number]) => Unit
    setColumn = (matrix, j, newVals) ->
      [_, j] = validate(matrix, _, j, newVals)
      [rows, _] = matrix.shape
      rangeUntil(0)(rows).forEach((i) -> matrix.set(i, j, newVals[i]))
      return

    # (Matrix, Number, Number) => Unit
    swapRows = (matrix, r1, r2) ->
      validate(matrix, r1)
      validate(matrix, r2)
      matrix.swap(r1, r2)
      return

    # (Matrix, Number, Number) => Unit
    swapColumns = (matrix, c1, c2) ->
      [_, c1] = validate(matrix, _, c1)
      [_, c2] = validate(matrix, _, c2)
      [rows, _] = matrix.shape
      for i in rangeUntil(0)(rows)
        oldC1 = matrix.get(i, c1)
        matrix.set(i, c1, matrix.get(i, c2))
        matrix.set(i, c2, oldC1)
      return

    # (Matrix, Number, Number, Number) => Matrix
    setAndReport = (matrix, i, j, newVal) ->
      validate(matrix, i, j)
      dupe = matrix.copy()
      set(dupe, i, j, newVal)
      dupe

    # (Matrix) => (Number, Number)
    dimensions = (matrix) ->
      validate(matrix)
      matrix.shape

    # (Matrix, Number, Number, Number, Number) => Matrix
    submatrix = (matrix, r1, c1, r2, c2) ->

      (-> # Error-checking blurb

        [numRows, numCols] = matrix.shape

        checkArg = ({ arg, lower, upper, isStart, isRow }) ->
          if not (lower <= arg <= upper)
            polarity  = if isStart then "Start" else "End"
            dimName   = if isRow   then "row"   else "column"
            complaint = "Extension exception: #{polarity} #{dimName} index (#{arg}) is invalid."
            remedy    = "Should be between #{lower} and #{upper} inclusive."
            throw new Error("#{complaint}  #{remedy}")

        [{ arg: r1, lower: 0, upper: numRows - 1, isStart:  true, isRow:  true }
        ,{ arg: c1, lower: 0, upper: numCols - 1, isStart:  true, isRow: false }
        ,{ arg: r2, lower: 1, upper: numRows    , isStart: false, isRow:  true }
        ,{ arg: c2, lower: 1, upper: numCols    , isStart: false, isRow: false }].forEach(checkArg)

      )()

      arr     = matrix.toArray()
      subRows = r2 - r1
      subCols = c2 - c1
      subArr  = pipeline(rangeUntil(0), map(-> []))(subRows)

      for i in rangeUntil(0)(subRows)
        for j in rangeUntil(0)(subCols)
          subArr[i][j] = arr[r1 + i][c1 + j]

      vec.array(subArr)

    # ((Number* => Number), Matrix, Matrix*) => Matrix
    matrixMap = (reporter, matrix, rest...) ->

      if reporter.length > rest.length + 1
        throw new Error("Extension exception: Task expected #{reporter.length} matrix inputs but only got #{rest.length + 1}.")

      for m in rest
        if not arrayEquals(matrix.shape)(m.shape)
          shapeToStr = ([x, y]) -> "#{x}x#{y}"
          firstShape = shapeToStr(matrix.shape)
          badShape   = shapeToStr(m.shape)
          throw new Error("Extension exception: All matrices must have the same dimensions: the first was #{firstShape} and another was #{badShape}.")

      matrix.map(
        (item, i) ->
          restItems = rest.map((m) -> m.get(floor(i / m.shape[1]), i % m.shape[1]))
          reporter(item, restItems...)
      )

    # ((Number, Number) => Number, (Matrix, Matrix) => Matrix, (Matrix, Number) => Matrix) =>
    #   (Matrix|Number, Matrix|Number, (Matrix|Number)*) =>
    #     Matrix|Number
    opReducer = (scalarOp, matrixOp, mixedOp) ->
      (m1, m2, rest...) ->
        [m1, m2, rest...].reduce(
          (left, right) ->
            if checks.isNumber(left)
              if checks.isNumber(right)
                scalarOp(left, right)
              else
                mixedOp(right, left)
            else
              if checks.isNumber(right)
                mixedOp(left, right)
              else
                matrixOp(left, right)
        )

    # (Matrix|Number, Matrix|Number, (Matrix|Number)*) => Matrix|Number
    times = (m1, m2, rest...) ->
      opReducer(((s1, s2) => s1 * s2), vec.multiply, vec.scale)(m1, m2, rest...)

    # (Matrix, Matrix, Matrix*) => Matrix
    timesElementWise = (m1, m2, rest...) ->
      opReducer(((s1, s2) => s1 * s2), vec.product, vec.scale)(m1, m2, rest...)

    # (Matrix|Number, Matrix|Number, (Matrix|Number)*) => Matrix|Number
    plus = (m1, m2, rest...) ->
      opReducer(((s1, s2) => s1 + s2), vec.add, ((m, s) -> m.map((x) -> x + s)))(m1, m2, rest...)

    # (Matrix|Number, Matrix|Number, (Matrix|Number)*) => Matrix|Number
    minus = (m1, m2, rest...) ->
      operands          = [m1, m2, rest...]
      [rows, cols]      = pipeline(find(isMatrix), fold(-> throw new Error("One or more (-) operands must be a matrix..."))((x) -> x.shape))(operands)
      broadcastIfNumber = (x) -> if checks.isNumber(x) then makeConstant(rows, cols, x) else x
      operands.reduce((left, right) -> vec.subtract(broadcastIfNumber(left), broadcastIfNumber(right)))

    # Matrix => Matrix
    inverse = (matrix) ->
      validate(matrix)
      matrix.inv()

    # Matrix => Matrix
    transpose = (matrix) ->
      validate(matrix)
      matrix.T

    # Apparently this is inefficient for large matrices. --SL (Spring, 2017)
    # Matrix => Number
    det = (matrix) ->
      validate(matrix)
      matrix.det()

    # Matrix => Number
    rank = (matrix) ->
      validate(matrix)
      matrix.rank()

    # Matrix => Number
    trace = (matrix) ->
      validate(matrix)
      matrix.trace()

    # (Matrix, Matrix) => Matrix
    solve = (m1, m2) ->
      validate(m1)
      validate(m2)
      m1.solve(m2)

    # Following three eigen-related APIs are dummy implementations.
    # We throw an error to explain we have not implemented them yet. -- XZ (Summer, 2020)
    # (Matrix) => List
    realEigenvalues = (matrix) ->
      notImplementedException("matrix:real-eigenvalues")

    # (Matrix) => List
    imaginaryEigenvalues = (matrix) ->
      notImplementedException("matrix:imaginary-eigenvalues")

    # (Matrix) => Matrix
    eigenvectors = (matrix) ->
      notImplementedException("matrix:eigenvectors")

    # List[Number] => (Number, Number, Number, Number)
    forecastGrowthHelper = (data) ->
      indepVar                  = rangeUntil(0)(data.length)
      dataMatrix                = fromColumnList([data, indepVar])
      [[constant, slope], [r2]] = regress(dataMatrix)
      [constant, slope, r2]

    # List[Number] => (Number, Number, Number, Number)
    forecastLinearGrowth = (data) ->
      [constant, slope, r2] = forecastGrowthHelper(data)
      forecast              = slope * data.length + constant
      [forecast, constant, slope, r2]

    # List[Number] => (Number, Number, Number, Number)
    forecastCompoundGrowth = (data) ->
      lnData     = data.map((x) -> StrictMath.log(x))
      [c, p, r2] = forecastGrowthHelper(lnData)
      constant   = StrictMath.exp(c)
      proportion = StrictMath.exp(p)
      forecast   = constant * proportion ** data.length
      [forecast, constant, proportion, r2]

    # List[Number] => (Number, Number, Number, Number)
    forecastContinuousGrowth = (data) ->
      lnData        = data.map((x) -> StrictMath.log(x))
      [c, rate, r2] = forecastGrowthHelper(lnData)
      constant      = StrictMath.exp(c)
      forecast      = constant * StrictMath.exp(rate * data.length)
      [forecast, constant, rate, r2]

    # Matrix => (List[Number], (Number, Number, Number))
    regress = (data) ->

      y = fromColumnList([getColumn(data, 0)])

      # To construct the matrix (known as "matrix" in the code, and as "X" in the comments),
      # we replace the first column (the dependent variable) of the input matrix with all 1's --SL (Spring, 2017)
      [nObservations, nVars] = data.shape
      indepVars              = submatrix(data, 0, 1, nObservations, nVars)
      ones                   = y.map(-> 1)
      matrix                 = vec.augment(ones, indepVars)

      # Solve the system Xb = y for b, the row vector of coefficients for each independent variable.
      # The following form ensures X does not need to be square: y.T * X * (X.T * X)^-1 --SL (Spring, 2017)
      coefficients = times(y.T, matrix, inverse(times(matrix.copy().T, matrix)))

      ySum       = y.reduce((a, b) -> a + b)
      yBar       = ySum / nObservations
      yDiff      = minus(y, makeConstant(nObservations, 1, yBar))
      totalSumSq = times(yDiff.copy().T, yDiff).get(0, 0)

      resid      = minus(times(matrix, coefficients.copy().T), y)
      residSumSq = times(resid.copy().T, resid).get(0, 0)

      rSquared = 1 - (residSumSq / totalSumSq)
      stats    = [rSquared, totalSumSq, residSumSq]

      [getRow(coefficients, 0), stats]

    {
      name: extensionName
    , prims: {
        "MAKE-CONSTANT":              makeConstant
      , "MAKE-IDENTITY":              makeIdentity
      , "FROM-ROW-LIST":              fromRowList
      , "FROM-COLUMN-LIST":           fromColumnList
      , "TO-ROW-LIST":                toRowList
      , "TO-COLUMN-LIST":             toColumnList
      , "COPY":                       copy
      , "PRETTY-PRINT-TEXT":          prettyPrint
      , "SOLVE":                      solve
      , "GET":                        get
      , "GET-ROW":                    getRow
      , "GET-COLUMN":                 getColumn
      , "SET":                        set
      , "SET-ROW":                    setRow
      , "SET-COLUMN":                 setColumn
      , "SWAP-ROWS":                  swapRows
      , "SWAP-COLUMNS":               swapColumns
      , "SET-AND-REPORT":             setAndReport
      , "DIMENSIONS":                 dimensions
      , "SUBMATRIX":                  submatrix
      , "MAP":                        matrixMap
      , "TIMES-SCALAR":               times
      , "TIMES":                      times
      , "*":                          times
      , "TIMES-ELEMENT-WISE":         timesElementWise
      , "PLUS-SCALAR":                plus
      , "PLUS":                       plus
      , "+":                          plus
      , "MINUS":                      minus
      , "-":                          minus
      , "INVERSE":                    inverse
      , "TRANSPOSE":                  transpose
      , "DET":                        det
      , "RANK":                       rank
      , "TRACE":                      trace
      , "FORECAST-LINEAR-GROWTH":     forecastLinearGrowth
      , "FORECAST-COMPOUND-GROWTH":   forecastCompoundGrowth
      , "FORECAST-CONTINUOUS-GROWTH": forecastContinuousGrowth
      , "REGRESS":                    regress
      , "IS-MATRIX?":                 isMatrix
      , "REAL-EIGENVALUES":           realEigenvalues
      , "IMAGINARY-EIGENVALUES":      imaginaryEigenvalues
      , "EIGENVECTORS":               eigenvectors
      }
    }

}
