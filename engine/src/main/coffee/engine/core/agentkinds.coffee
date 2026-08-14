# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# One bit per agent kind, ordered the way NetLogo's "OTPL" `agentClassString` is.  Agents carry their own bit and
# `SelfManager` tracks the current one, so asking whether the running agent is allowed to execute a given prim is a
# single bitwise test.  -Jeremy B August 2026

Observer = 1
Turtle   = 2
Patch    = 4
Link     = 8

All = Observer | Turtle | Patch | Link

allBits = [Observer, Turtle, Patch, Link]

# The names the compiler knows these by, for wrapping code that has to be compiled for a specific kind.
names = new Map([[Observer, "observer"], [Turtle, "turtle"], [Patch, "patch"], [Link, "link"]])

# (Int) => String
kindName = (bit) ->
  names.get(bit)

# (Int) => Array[Int]
splitMask = (mask) ->
  allBits.filter( (bit) -> (mask & bit) isnt 0 )

module.exports = { Observer, Turtle, Patch, Link, All, kindName, splitMask }
