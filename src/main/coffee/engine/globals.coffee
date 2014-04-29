#@# Attach it to an `Observer` object
define(->
  class Globals
    vars: []
    # Tells runtime how many globals to reserve space for and initialize to `0` --JAB (4/29/14)
    init: (n) -> @vars = (0 for x in [0...n])
    clear: (n) ->
      @vars[i] = 0 for i in [n...@vars.length]
      return
    getGlobal: (n) -> @vars[n]
    setGlobal: (n, v) -> @vars[n] = v
)
