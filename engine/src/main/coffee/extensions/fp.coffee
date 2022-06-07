# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../engine/core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

# (Int, Array) => Array
take = (n, l) ->
  if n < 0
    throw exceptions.extension('First argument must be a positive number.')
  l.slice(0, n)

# (Int, Array) => Array
drop = (n, l) ->
  if n < 0
    throw exceptions.extension('First argument must be a positive number.')
  l.slice(n)

# ((Any, Any) => Any, Array) => Array
scan = (r, l) ->
  l.reduce( (results, value, index) ->
    result = if index is 0
      value
    else
      r(results[index - 1], value)
    results.push(result)
    results
  , [])

# (Array[Reporter]) => Reporter
reduceReporters = (rs) ->
  reduced = () ->
    firstResult = rs[0](arguments...)
    rs.slice(1).reduce( (resultSoFar, reporter) ->
      reporter(resultSoFar)
    , firstResult)
  reduced.isReporter  = true
  reduced.minArgCount = rs[0].minArgCount
  reduced

# (Array[Reporter]) => Reporter
compose = (rs...) ->
  rs.reverse()
  reduceReporters(rs)

# (Array[Reporter]) => Reporter
pipe = (rs...) ->
  reduceReporters(rs)

# (Reporter, Array[Any]) => Reporter
curry = (r, leftArgs...) ->
  curried = (rightArgs...) ->
    args = leftArgs.concat(rightArgs)
    r(args...)
  curried.isReporter  = true
  curried.minArgCount = (r.minArgCount - leftArgs.length)
  curried

# ((Any) => Boolean, Array[Any]) => Array[Int]
findIndices = (r, l) ->
  indices = l.map( (v, i) ->
    check = r(v)
    if not checks.isBoolean(check)
      throw exceptions.extension('The reporter does not return a boolean value.')
    if check then i else -1
  )
  indices.filter( (i) -> i isnt -1 )

# ((Any) => Boolean, Array[Any]) => Any
find = (r, l) ->
  l.find( (v) ->
    check = r(v)
    if not checks.isBoolean(check)
      throw exceptions.extension('The reporter does not return a boolean value.')
    check
  )

# (Array[Array[Any]]) => Array[Array[Any]]
zip = (ls...) ->
  length = Math.min(ls.map( (l) -> l.length )...)
  results = (new Array(length)).fill(0)
  results.map( (_, i) ->
    result = (new Array(ls.length)).fill(0)
    result.map( (_, j) -> ls[j][i] )
  )

# (Array[Array[Any]]) => Array[Array[Any]]
unzip = (ls) ->
  ls.forEach( (l) ->
    if not checks.isList(l) then throw exceptions.extension('Input must be a list of lists.')
  )
  length = Math.max(ls.map( (l) -> l.length )...)
  results = (new Array(length)).fill(0)
  results.map( (_, i) ->
    ls.reduce( (result, l) ->
      if i < l.length
        result.push(l[i])
      result
    , [])
  )

# (Array[Any]) => Array[Any]
flatten = (l) ->
  flattenRec = (v) ->
    if checks.isList(v)
      v.flatMap(flattenRec)
    else
      v
  flattenRec(l)

module.exports = {

  porter: undefined

  init: (workspace) ->
    prims = { take, drop, scan, compose, pipe, curry, "find-indices": findIndices, find, zip, unzip, flatten }
    Object.keys(prims).forEach( (p) => prims[p.toUpperCase()] = prims[p] )
    { name: "fp", prims }

}
