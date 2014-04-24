## (C) Uri Wilensky. https://github.com/NetLogo/NetLogo

define(->
  if mori?
    mori
  else
    require_node('mori') # Yay, Node hackery! --JAB (4/24/14)
)
