# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

define(['engine/core/abstractagentset', 'engine/core/link', 'engine/core/nobody', 'engine/core/turtle', 'shim/lodash'
      , 'util/typechecker']
     , ( AbstractAgentSet,               Link,               Nobody,               Turtle,               _
      ,  Type) ->

  # Function given a name for the sake of recursion --JAB (7/31/14)
  # (Any) => String
  Hasher =
    (x) ->
      if x instanceof Turtle or x instanceof Link
        x.id
      else if x is Nobody
        -1
      else if Type(x).isArray()
        f = (acc, x) -> 31 * acc + (if x? then Hasher(x) else 0)
        _(x).foldl(f, 1)
      else if x instanceof AbstractAgentSet
        Hasher(x.toArray())
      else
        x.toString()

  Hasher

)
