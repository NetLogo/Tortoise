# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.structure.linkcompare')

goog.require('util.exception')

  # (Link, Link) => Int
  (a, b) ->
    if a is b
      0
    else if a.id is -1 and b.id is -1
      0
    else if a.end1.id < b.end1.id
      -1
    else if a.end1.id > b.end1.id
      1
    else if a.end2.id < b.end2.id
      -1
    else if a.end2.id > b.end2.id
      1
    else if a.getBreedName() is b.getBreedName()
      0
    else if a.getBreedName() is "LINKS"
      -1
    else if b.getBreedName() is "LINKS"
      1
    else
      throw new Exception.NetLogoException("Unsure how Link #{a.id} differs from Link #{b.id}") # JVM NetLogo uses the order the breeds were declared in, but that incites my hatred --JAB (6/26/14)
