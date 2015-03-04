# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

###
  Inclusion of `ask` is inspired by the fact that, since a primitive like `create-link-with` can
  return `nobody`, and it can also take an initialization block for the to-be-created thing, either
  the init block must be branched against or `nobody` must ignore it  --JAB (7/18/14)
###

module.exports = {
  ask:      -> return
  id:          -1
  isDead:   -> true
  toString: -> "nobody"
}
