#@# Attach it to an `Observer` object
define(->
  class Globals
    vars: []
    # compiler generates call to init, which just
    # tells the runtime how many globals there are.
    # they are all initialized to 0
    init: (n) -> @vars = (0 for x in [0...n])
    clear: (n) ->
      @vars[i] = 0 for i in [n...@vars.length]
      return
    getGlobal: (n) -> @vars[n]
    setGlobal: (n, v) -> @vars[n] = v
)
