# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

cryptoMd5 = require("crypto-js/md5")

{ exceptionFactory: exceptions } = require('util/exception')
{ escapeRegEx } = require('util/regex')

explode = (s) ->
  [...s]

fromFile = (f) ->
  throw exceptions.extension("There are no local files to access in a web application.  To get the contents of a text file as a string on NetLogo Web try the Fetch extension instead.")

fromList = (workspace) -> (l) ->
  l.map( (i) -> workspace.dump(i, false) ).join("")

hashCode = (s) ->
  if s.length is 0
    return 0
  chars = explode(s).map( (_1, i) -> s.charCodeAt(i) )
  hash = chars.reduce( (hashSoFar, c) ->
    hash = ((hashSoFar << 5) - hashSoFar) + c
    hash |= 0
  , 0)
  hash

md5 = (s) ->
  cryptoMd5(s).toString()

rexMatch = (rex, s) ->
  matches = s.match("^#{rex}$")
  matches? and matches.length isnt 0

rexReplaceFirst = (rex, s, sub) ->
  re = new RegExp(rex)
  s.replace(re, sub)

rexReplaceAll = (rex, s, sub) ->
  re = new RegExp(rex, "g")
  s.replaceAll(re, sub)

rexSplit = (s, rex) ->
  re = new RegExp(rex)
  s.split(re)

startsWith = (s, sub) ->
  s.startsWith(sub)

endsWith = (s, sub) ->
  s.endsWith(sub)

trim = (s) ->
  s.trim()

upperCase = (s) ->
  s.toLocaleUpperCase()

lowerCase = (s) ->
  s.toLocaleLowerCase()

splitOn = (sub, s) ->
  escaped = escapeRegEx(sub)
  # This check is to match Java's behavior for compatibility with desktop
  if escaped is s
    return ['']
  re = new RegExp(escaped)
  s.split(re)

module.exports = {
  init: (workspace) ->
    {
      name: "string"
    , prims: {
        "EXPLODE":           explode
      , "FROM-FILE":         fromFile
      , "FROM-LIST":         fromList(workspace)
      , "HASH-CODE":         hashCode
      , "MD5":               md5
      , "MESSAGE-DIGEST-5":  md5
      , "REX-MATCH?":        rexMatch
      , "REX-REPLACE-FIRST": rexReplaceFirst
      , "REX-REPLACE-ALL":   rexReplaceAll
      , "REX-SPLIT":         rexSplit
      , "STARTS-WITH?":      startsWith
      , "ENDS-WITH?":        endsWith
      , "TRIM":              trim
      , "UPPER-CASE":        upperCase
      , "LOWER-CASE":        lowerCase
      , "SPLIT-ON":          splitOn
      }
    }
}
