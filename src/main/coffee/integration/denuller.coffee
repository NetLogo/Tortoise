# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
used to work around Nashorn bug where JSON.parse on objects with
integer keys sometimes invents nonexistent entries with null values;
see http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
###
define(['integration/lodash'], (_) ->

  denull =
    (x) ->
      if _(x).isArray()
        _(x).map(denull).value()

      else if _(x).isObject()
        transformFunc =
          (acc, value, key) ->
            if value? or isNaN(key)
              acc[key] = denull(value)
            acc

        _(x).transform(transformFunc, {}).value()

      else
        x

  denull

)
