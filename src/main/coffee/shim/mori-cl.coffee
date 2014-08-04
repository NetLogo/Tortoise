# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('shim.mori')

shim.mori = Mori = if mori?
  mori
else
  require_node('mori') # Yay, Node hackery! --JAB (4/24/14)

