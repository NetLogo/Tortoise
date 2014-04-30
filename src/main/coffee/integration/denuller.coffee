###
used to work around Nashorn bug where JSON.parse on objects with
integer keys sometimes invents nonexistent entries with null values;
see http://bugs.java.com/bugdatabase/view_bug.do?bug_id=8038119
###
define(['integration/lodash'], (_) -> {
  denull: (x) ->
    if _(x).isArray()
      @denull(y) for y in x
    else if x is null
      x
    else if typeof(x) is "object"
      result = {}
      for key, value of x
        if isNaN(key) or value isnt null
          result[key] = @denull(value)
      result
    else
      x
})
