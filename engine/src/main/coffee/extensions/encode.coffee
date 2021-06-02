# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../engine/core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

{ all, map }   = require('brazier/array')
{ pipeline }   = require('brazier/function')
{ rangeUntil } = require('brazier/number')

module.exports = {

  init: (workspace) ->

    # [T] @ (Array[Number], String) => ((Array[Number]) => T) => T
    _reportFromBytes = (bytes, primName) -> (f) ->

      isLegit = (x) -> checks.isNumber(x) and (x >= -128) and (x <= 127)

      if all(isLegit)(bytes)
        f(bytes)
      else
        throw exceptions.extension("All elements of the list argument to 'encode:#{primName}' must be numbers between -128 and 127")

    # (String) => Array[Number]
    base64ToBytes = (base64) ->
      str = atob(base64)
      pipeline(rangeUntil(0), map((n) -> str.codePointAt(n)))(str.length)

    # Array[Number] => String
    bytesToBase64 = (bytes) ->
      _reportFromBytes(bytes, "bytes-to-base64")((bytes) -> btoa(String.fromCharCode(bytes...)))

    # Array[Number] => String
    bytesToString = (bytes) ->
      _reportFromBytes(bytes, "bytes-to-string")((bytes) -> String.fromCharCode(bytes...))

    # (String) => Array[Number]
    stringToBytes = (str) ->
      pipeline(rangeUntil(0), map((n) -> str.codePointAt(n)))(str.length)

    {
      name: "encode"
    , prims: {
        "BASE64-TO-BYTES": base64ToBytes
      , "BYTES-TO-BASE64": bytesToBase64
      , "BYTES-TO-STRING": bytesToString
      , "STRING-TO-BYTES": stringToBytes
      }
    }

}
