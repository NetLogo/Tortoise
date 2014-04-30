define(['integration/typeisarray'], (typeIsArray) ->

  # Needs a name here since it's recursive --JAB (4/16/14)
  Dump =
    (x) ->
      if typeIsArray(x)
        itemStr = (Dump(x2) for x2 in x).join(" ")
        "[#{itemStr}]"
      else if typeof(x) is "function" #@# I hate this; Lodash it
        if x.isReporter
          "(reporter task)"
        else
          "(command task)"
      else
        "" + x #@# `toString`

  Dump

)
