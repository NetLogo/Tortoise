# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# (Link, Link) => Number
module.exports =
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
    else if a.getBreedOrdinal() < b.getBreedOrdinal()
      -1
    else if a.getBreedOrdinal() > b.getBreedOrdinal()
      1
    else
      0
