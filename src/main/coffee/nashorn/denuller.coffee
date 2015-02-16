# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
used to work around Nashorn bug where JSON.parse on objects with
integer keys sometimes invents nonexistent entries with null values;
see http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119 --ST

The bug has been marked as fixed in Java 8u20, but that's the most recent
Java 8 version at the moment, so let's give it a little time to disseminate
before throwing `Denuller` out. --JAB (9/8/14)
###

_    = require('lodash')
Type = require('tortoise/util/typechecker')

# [T] @ (T) => T
denull =
  (x) ->
    if Type(x).isArray()
      _(x).map(denull).value()

    else if Type(x).isObject()
      transformFunc =
        (acc, value, key) ->
          if value? or isNaN(key)
            acc[key] = denull(value)
          acc

      _(x).transform(transformFunc, {}).value()

    else
      x

module.exports = denull
