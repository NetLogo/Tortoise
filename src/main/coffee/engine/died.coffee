# gross hack - ST 1/25/13
#@# Rename to "seppuku", polymorphize properly!
define(['engine/turtle', 'engine/link']
     , ( Turtle,          Link) ->
  (agent) ->
    if agent instanceof Turtle
      agent.world.updater.update("turtles", agent.id, { WHO: -1 }) #@# If you're awful and you know it, clap your hands!
    else if agent instanceof Link.Class
      agent.world.updater.update("links", agent.id, { WHO: -1 })
    return
)
