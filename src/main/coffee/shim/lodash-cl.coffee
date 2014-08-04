# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('shim.lodash')

  if _?
    _
  else
    require_node('lodash') # Yay, Node hackery! --JAB (4/24/14)

