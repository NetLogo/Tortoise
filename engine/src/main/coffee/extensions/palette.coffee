# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

Color = require('../engine/core/colormodel')

Patch = require('../engine/core/patch')

ColorSchemes = require('./palette-color-schemes')
# MAIN FUNCTIONS #

#RGBList
validateRGB = (color) ->
  if (not isValidRGBList(color))
    throw exceptions.extension("Color must have a valid RGB List.")
  return

isValidRGBList = (color) ->
  valid = (true)

  color = toColorList(color)
  if (color.length < 3 or color.length > 4)
    return false
  valid = color.every((component) ->
    typeof component is "number" and component >= 0 and component <= 255)
  valid

extractRGB = (color, index) ->
  newList = toColorList(color)
  validateRGB(newList)
  newList[index]

rgbUpdated = (color, value, index) ->
  color = toColorList(color)
  validateRGB(color)
  newList = color.slice()
  newList[index] = value
  newList


#HSB
validateHSB = (color) ->
  if (not isValidHSBList(color))
    throw exceptions.extension("Color must be a valid HSB list.")
  return

isValidHSBList = (color) -> # must be a list upon import
  valid = true
  if (typeof color is "number")
    throw exceptions.extension("Input must be an HSB list for scale-gradient-hsb.")
  if (color.length is not 3)
    return false
  valid = color.every((component) ->
    return typeof component is "number")
  if (color[0] > 360 or color[0] < 0)
    return false
  for x in [1..2]
    if (color[x] > 100 or color[x] < 0)
      return false
  valid

extractHSB = (color, index) ->
  newList = toColorList(color)
  validateRGB(newList)
  newList = Color.rgbToHSB(newList[0],newList[1],newList[2])
  newList[index]

hsbUpdated = (color, value, index) ->
  newList = toColorList(color)
  validateRGB(newList)
  alpha = 255
  re_add = false
  if (newList.length is 4)
    alpha = newList[3]
    readd = true
  newList = Color.rgbToHSB(newList[0],newList[1],newList[2])
  newList[index] = value
  newList = Color.hsbToRGB(newList[0],newList[1],newList[2])
  if (readd is true)
    newList[3] = alpha
  newList

#GRADIENTS AND COLOR SCHEMES
#interestingly, the index calculation varies for scale gradient and scale schemes
getIndexGradient = (number, min, max, colorListLength, SIZE) ->
  perc = 0
  if (min > max)
    if (number < max)
      perc = 1
    else if (number > min)
      perc = 0
    else
      perc = (min - number) / (min - max)
  else
    if (number > max)
      perc = 1
    else if (number < min)
      perc = 0
    else
      if (max is min)
        perc = 0
      else
       perc = (number - min) / (max - min)
  index = 0

  if (colorListLength < 3)
    index = Math.floor(perc * (SIZE - 1))
  else
    index = Math.floor(perc * ( (SIZE - 1) + (SIZE) * (colorListLength - 2) ))

getIndexScheme = (number, min, max, SIZE) ->
  perc = 0
  if (min > max)
    if (number < max)
      perc = SIZE - 1
    else if (number > min)
      perc = 0
    else
      perc = Math.floor((min - number) / ((min - max) / SIZE))
  else
    if (number > max)
      perc = SIZE - 1
    else if (number < min)
      perc = 0
    else
      if (max is min)
        perc = 0
      else
        perc = Math.floor((number - min) / ((max - min) / SIZE))
  index = Math.min(perc, SIZE - 1)

colorHSBArray = (startColor, endColor, width) -> # input colors in HSB form
  width--
  inc = startColor.slice()

  if (endColor[0] > startColor[0])
    if (startColor[0] + 360.0 - endColor[0] < endColor[0] - startColor[0])
      inc[0] = (endColor[0] - (startColor[0] + 360.0)) / width
    else
      inc[0] = (endColor[0] - startColor[0]) / width
  else
    if (endColor[0] + 360.0 - startColor[0] < startColor[0] - endColor[0])
      inc[0] = (endColor[0] + 360.0 - startColor[0]) / width
    else
      inc[0] = (endColor[0] - startColor[0]) / width
  inc[1] = (endColor[1] - startColor[1]) / width
  inc[2] = (endColor[2] - startColor[2]) / width
  width++

  gradientHSBarray = [[],[]]
  gradientHSBarray[0] = startColor.slice()
  i = 1
  for i in [1...width]
    gradientHSBarray[i] = startColor.slice() # just to avoid errors – all values will be over written
    for j in [0..2]
      gradientHSBarray[i][j] = gradientHSBarray[i - 1][j] + inc[j]
      if (j > 0)
        gradientHSBarray[i][j] = Math.min(100, Math.max(0, gradientHSBarray[i][j]))
      else
        if (gradientHSBarray[i][j] >= 360)
          gradientHSBarray[i][j] -= 360
        if (gradientHSBarray[i][j] < 0)
          gradientHSBarray[i][j] += 360

  gradientHSBarray

colorRGBArray = (startColor, endColor, width) ->

  startColorList = toColorList(startColor)
  endColorList = toColorList(endColor)
  inc = startColorList.slice()
  inc[0] = (endColorList[0] - startColorList[0]) / width
  inc[1] = (endColorList[1] - startColorList[1]) / width
  inc[2] = (endColorList[2] - startColorList[2]) / width


  gradientRGBArray = [[],[]]
  gradientRGBArray[0] = startColorList.slice()

  for i in [1...width]
    gradientRGBArray[i] = startColorList.slice() # just to avoid errors – all values will be over written
    for j in [0..2]
      gradientRGBArray[i][j] = gradientRGBArray[i - 1][j] + inc[j]
      gradientRGBArray[i][j] = Math.min(255, Math.max(0, gradientRGBArray[i][j]))

  for i in [1...width]
    for j in [0..2]
      gradientRGBArray[i][j] = Math.floor(gradientRGBArray[i][j])

  gradientRGBArray


#MISC
modDouble = (number, limit) ->
  while number > limit
    number -= limit
  while number < 0
    number += limit
  return number

toColorList = (color) ->
  if (typeof color is "number")
    color = Color.colorToRGB(color)
    if (color.length is 4) # sometimes gives an alpha of 0
      color.pop()
  return color

module.exports = {

  init: (workspace) ->

    getMyColor = () ->
      self = workspace.selfManager.self()
      mycolor = []
      if (self instanceof Patch)
        mycolor = self.getVariable("pcolor")
      else
        mycolor = self.getVariable("color")
      toColorList(mycolor)

    setMyColor = (mycolor) ->
      self = workspace.selfManager.self()
      if (self instanceof Patch)
        self.setVariable("pcolor", mycolor)
      else
        self.setVariable("color", mycolor)
      return

    # PRIMS #

    #alpha/trapnsparency
    alphaOf = (color) ->
      if typeof color is "number"
        return 255
      validateRGB(color)
      if (color.length is 4)
        return color[3]
      255

    transparencyOf = (color) ->
      (1 - alphaOf(color) / 255.0) * 100.0

    withAlpha = (color, newVal) ->
      if (newVal < 0 or newVal > 255)
        throw exceptions.extension("Alpha must be in the range from 0 to 255.")
      if (typeof color is "number")
        color = Color.colorToRGB(color)
      validateRGB(color)
      color[3] = newVal
      color

    withTransparency = (color, newVal) ->
      if (newVal < 0 or newVal > 100)
        throw exceptions.extension("Transparency must be in the range from 0 to 100.")
      newVal = (1.0 - newVal / 100.0) * 255.0
      withAlpha(color, newVal)

    getAlpha = () ->
      self = workspace.selfManager.self()
      mycolor = self.getVariable("color")
      if (self instanceof Patch)
        return 255
      alphaOf(mycolor)

    getTransparency = () ->
      (1 - getAlpha() / 255.0) * 100.0

    setAlpha = (newVal) ->
      self = workspace.selfManager.self()
      mycolor = self.getVariable("color")
      if (self instanceof Patch)
        throw exceptions.extension("Alpha for 2D patches cannot be changed.")
      setMyColor(withAlpha(mycolor, newVal))
      return

    setTransparency = (newVal) ->
      self = workspace.selfManager.self()
      mycolor = self.getVariable("color")
      if (self instanceof Patch)
        throw exceptions.extension("Transparency for 2D patches cannot be changed.")
      setMyColor(withTransparency(mycolor, newVal))

    #HSB
    HSBOf = (index) ->
      (color) ->
        extractHSB(color, index)

    withHSB = (index) ->
      (color, newVal) ->
        if(index is 0)
          newVal = modDouble(newVal, 360)
        else
          newVal = Math.max(Math.min(newVal, 100), 0)
        hsbUpdated(color, newVal, index)

    getHSB = (index) ->
      () ->
        HSBOf(index)(getMyColor())

    setHSB = (index) ->
      (number) ->
        type = ["Hue", "Saturation", "Brightness"]
        range = 100
        if(index is 0)
          range = 360
        if (number < 0 or number > 360)
          throw exceptions.extension(type[index] + " must be in the range from 0 to " + range + ".")
        setMyColor(withHSB(index)(getMyColor(), number))
        return

    #RGB
    rgbOf = (index) ->
      (color) ->
        extractRGB(color, index)

    withRGB = (index) ->
      (color, newVal) ->
        if (newVal < 0 or newVal > 255) # withRGB is a primitive that takes input from the user, so it needs this check
          throw exceptions.extension("Value must be in the range from 0 to 255.")
        rgbUpdated(color, newVal, index)

    getRGB = (index) ->
      () ->
        mycolor = getMyColor()
        mycolor[index]

    setRGB = (index) ->
      (number) ->
        mycolor = getMyColor()
        setMyColor(withRGB(index)(mycolor, number))
        return

    #Gradients and schemes
    scaleGradientHSB = (colorList, number, min, max) -> # takes HSB colors as input
      SIZE = 256
      for color in colorList
        validateHSB(color)

      index = getIndexGradient(number, min, max, colorList.length, SIZE)
      gradientArray = [[],[]]

      for x in [0...colorList.length - 1]
        color1 = colorList[x]
        color2 = colorList[x + 1]
        gradient = colorHSBArray(color1, color2, SIZE)
        for j in [0...SIZE]
          gradientArray[j + SIZE * x] = Color.hsbToRGB(gradient[j][0], gradient[j][1], gradient[j][2])
      gradientArray[index]

    scaleGradient = (colorList, number, min, max) ->
      SIZE = 256
      for color in colorList
        validateRGB(color)

      index = getIndexGradient(number, min, max, colorList.length, SIZE)
      gradientArray = [[],[]]

      for x in [0...colorList.length - 1]
        color1 = colorList[x]
        color2 = colorList[x + 1]
        gradient = colorRGBArray(color1, color2, SIZE)
        for j in [0...SIZE]
          gradientArray[j + SIZE * x] = gradient[j]
      gradientArray[index]

    scaleScheme = (schemename, legendname, size, number, min, max) ->
      index = getIndexScheme(number, min, max, size)
      legend = ColorSchemes.getRGBArray(schemename, legendname, size)
      legend[index]

    schemeColors = (schemename, legendname, size) ->
      ColorSchemes.getRGBArray(schemename, legendname, size)





    {
      name: "palette"
    , prims: {
        "ALPHA-OF": alphaOf
    ,   "TRANSPARENCY-OF": transparencyOf
    ,   "ALPHA": getAlpha
    ,   "SET-ALPHA": setAlpha
    ,   "TRANSPARENCY": getTransparency
    ,   "SET-TRANSPARENCY": setTransparency
    ,   "WITH-ALPHA": withAlpha
    ,   "WITH-TRANSPARENCY": withTransparency
    ,   "HUE-OF": HSBOf(0)
    ,   "SATURATION-OF": HSBOf(1)
    ,   "BRIGHTNESS-OF": HSBOf(2)
    ,   "WITH-HUE": withHSB(0)
    ,   "WITH-SATURATION": withHSB(1)
    ,   "WITH-BRIGHTNESS": withHSB(2)
    ,   "HUE": getHSB(0)
    ,   "SATURATION": getHSB(1)
    ,   "BRIGHTNESS": getHSB(2)
    ,   "SET-HUE": setHSB(0)
    ,   "SET-SATURATION": setHSB(1)
    ,   "SET-BRIGHTNESS": setHSB(2)
    ,   "R-OF": rgbOf(0)
    ,   "G-OF": rgbOf(1)
    ,   "B-OF": rgbOf(2)
    ,   "WITH-R": withRGB(0)
    ,   "WITH-G": withRGB(1)
    ,   "WITH-B": withRGB(2)
    ,   "R": getRGB(0)
    ,   "G": getRGB(1)
    ,   "B": getRGB(2)
    ,   "SET-R": setRGB(0)
    ,   "SET-G": setRGB(1)
    ,   "SET-B": setRGB(2)
    ,   "SCALE-GRADIENT-HSB": scaleGradientHSB
    ,   "SCALE-GRADIENT": scaleGradient
    ,   "SCALE-SCHEME": scaleScheme
    ,   "SCHEME-COLORS": schemeColors
      }
    }
}
