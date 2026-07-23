# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Direct port of the desktop extension's org.myworldgis.projection and org.myworldgis.wkt
# packages (the subset needed so far: Geographic, Mercator, TransverseMercator, and
# LambertConformalConic).  Formulas are kept term-for-term identical to the Java for
# numeric parity with desktop NetLogo, including any quirks.

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')

{ Coordinate } = JSTS.geom

TWO_PI             = Math.PI * 2.0
HALF_PI            = Math.PI / 2.0
THREE_QUARTERS_PI  = (3.0 * Math.PI) / 4.0
EPSILON            = 1.567855942887398e-7
DEGREES_TO_RADIANS = Math.PI / 180.0

# (Number) => Number
wrapLongitude = (lon) ->
  if lon < -TWO_PI * 10 or lon > TWO_PI * 10
    return NaN
  lon -= TWO_PI while lon > Math.PI
  lon += TWO_PI while lon < -Math.PI
  lon

# (Number) => Number
sign = (x) -> if x < 0 then -1 else 1

# (Number, Number, Number, Number) => Number
# Haversine angular distance; all inputs/outputs in radians
greatCircleDistance = (lon1, lat1, lon2, lat2) ->
  dlat = Math.sin((lat2 - lat1) / 2.0)
  dlon = Math.sin((lon2 - lon1) / 2.0)
  a = (dlat * dlat) + (Math.cos(lat1) * Math.cos(lat2)) * (dlon * dlon)
  2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))

class Ellipsoid

  # (String, Number, Number) — radius in meters; eccsq is eccentricity squared
  constructor: (@name, @radius, @eccsq) ->

  # (Any) => Boolean
  equals: (other) ->
    other instanceof Ellipsoid and other.radius is @radius and other.eccsq is @eccsq

  # (String | null, Number, Number) => Ellipsoid
  @fromInverseFlattening: (name, radius, inverseFlattening) ->
    new Ellipsoid(name ? "", radius, (2.0 / inverseFlattening) - (1.0 / (inverseFlattening * inverseFlattening)))

Ellipsoid.WGS_84 = new Ellipsoid("WGS 84", 6378137.0, 0.0066943799901413165)

# Holds PARAMETER entries from a PROJCS; angularFactor/linearFactor convert the
# WKT's units to radians/meters
class ProjectionParameters

  # (Number, Number)
  constructor: (@angularFactor, @linearFactor) ->
    @params = new Map()

  add: (name, value) ->
    @params.set(name.toLowerCase(), value)
    return

  _required: (name) ->
    if not @params.has(name.toLowerCase())
      throw exceptions.extension("missing required parameter '#{name}'")
    @params.get(name.toLowerCase())

  getAngular:       (name) -> @_required(name) * @angularFactor
  getLinear:        (name) -> @_required(name) * @linearFactor
  getDimensionless: (name) -> @_required(name)

  getCenterLongitude: ->
    for name in ["longitude_of_center", "central_meridian"] when @params.has(name)
      return @params.get(name) * @angularFactor
    throw exceptions.extension("unable to find parameter for center longitude")

  getCenterLatitude: ->
    for name in ["latitude_of_center", "latitude_of_origin", "standard_parallel_1"] when @params.has(name)
      return @params.get(name) * @angularFactor
    throw exceptions.extension("unable to find parameter for center latitude")

class AbstractProjection
  isGeographic: false

  # (Ellipsoid, Number, Number) — lambda0/phi0 in radians
  constructor: (ellipsoid, lambda0, phi0) ->
    @ellipsoid = ellipsoid
    @a         = ellipsoid.radius
    @e2        = ellipsoid.eccsq
    @lambda0   = lambda0
    @phi0      = phi0

  # point-level geometry pre-processing (hemisphere clipping); null means "clipped away"
  # (Coordinate) => Coordinate | null
  processPoint: (c) -> c

class Geographic extends AbstractProjection
  isGeographic: true

  # (Ellipsoid, Coordinate, Number) — angularFactor converts this projection's units to radians
  constructor: (ellipsoid, center, angularFactor) ->
    super(ellipsoid, center.x, center.y)
    @angularFactor = angularFactor
    @cosPhi0       = Math.cos(@phi0)

  # (Number, Number) => Coordinate
  forwardPoint: (lon, lat) ->
    new Coordinate((wrapLongitude(lon - @lambda0) * @cosPhi0) / @angularFactor, lat / @angularFactor)

  # (Number, Number) => Coordinate
  inversePoint: (x, y) ->
    new Coordinate(@lambda0 + ((x * @angularFactor) / @cosPhi0), y * @angularFactor)

class ProjectedProjection extends AbstractProjection

  # (Ellipsoid, ProjectionParameters)
  constructor: (ellipsoid, params) ->
    super(ellipsoid, params.getCenterLongitude(), params.getCenterLatitude())
    @toMeters = params.linearFactor
    # like desktop, false easting/northing are converted to meters but applied in units
    @falseEasting  = params.getLinear("false_easting")
    @falseNorthing = params.getLinear("false_northing")

  # (Number, Number) => Coordinate
  forwardPoint: (lon, lat) ->
    c = @forwardPointRaw(lon, lat)
    new Coordinate((c.x / @toMeters) + @falseEasting, (c.y / @toMeters) + @falseNorthing)

  # (Number, Number) => Coordinate
  inversePoint: (x, y) ->
    @inversePointRaw((x - @falseEasting) * @toMeters, (y - @falseNorthing) * @toMeters)

class HemisphericalProjection extends ProjectedProjection
  processPoint: (c) ->
    center = @getHemisphereCenter()
    if greatCircleDistance(center.x, center.y, c.x, c.y) > @getMaxC()
      null
    else
      c

  inversePoint: (x, y) ->
    c = super(x, y)
    center = @getHemisphereCenter()
    if greatCircleDistance(center.x, center.y, c.x, c.y) > @getMaxC()
      new Coordinate(NaN, NaN)
    else
      c

class Mercator extends ProjectedProjection
  constructor: (ellipsoid, params) ->
    super(ellipsoid, params)
    @k0 = params.getDimensionless("scale_factor")
    e2 = @e2
    @e = Math.sqrt(e2)
    # the *360.0 in the last term matches desktop (sic)
    @subLat = [
      e2 / 2.0 + 5.0 * e2 * e2 / 24.0 + e2 * e2 * e2 / 12.0 + 13.0 * e2 * e2 * e2 * e2 * 360.0
      7.0 * e2 * e2 / 48.0 + 29.0 * e2 * e2 * e2 / 240.0 + 811.0 * e2 * e2 * e2 * e2 / 11520.0
      7.0 * e2 * e2 * e2 / 120.0 + 81.0 * e2 * e2 * e2 * e2 / 1120.0
      4279.0 * e2 * e2 * e2 * e2 / 161280.0
    ]
    if @phi0 is 0.0
      @spq = 1.0
    else
      sinPhi0 = Math.sin(@phi0)
      @spq = Math.cos(@phi0) / Math.sqrt(1.0 - (e2 * sinPhi0 * sinPhi0))

  forwardPointRaw: (lon, lat) ->
    x = @k0 * @a * wrapLongitude(lon - @lambda0) * @spq
    sinPhi = Math.sin(lat)
    y =
      if sinPhi is 1.0
        if lat > 0 then Infinity else -Infinity
      else
        @k0 * ((@a / 2.0) * Math.log(((1 + sinPhi) / (1 - sinPhi)) * Math.pow((1 - (@e * sinPhi)) / (1 + (@e * sinPhi)), @e))) * @spq
    new Coordinate(x, y)

  inversePointRaw: (x, y) ->
    lon = ((x / @spq) / (@k0 * @a)) + @lambda0
    t = Math.pow(Math.E, -((y / @spq) / (@k0 * @a)))
    chi = HALF_PI - 2 * Math.atan(t)
    lat = chi +
          @subLat[0] * Math.sin(2.0 * chi) +
          @subLat[1] * Math.sin(4.0 * chi) +
          @subLat[2] * Math.sin(6.0 * chi) +
          @subLat[3] * Math.sin(8.0 * chi)
    new Coordinate(lon, lat)

class TransverseMercator extends HemisphericalProjection
  constructor: (ellipsoid, params) ->
    super(ellipsoid, params)
    @k0 = params.getDimensionless("scale_factor")
    e2 = @e2
    @ePrimeSq = e2 / (1.0 - e2)
    @subM = [
      1.0 - e2 / 4.0 - 3.0 * e2 * e2 / 64.0 - 5.0 * e2 * e2 * e2 / 256.0
      3.0 * e2 / 8.0 + 3.0 * e2 * e2 / 32.0 + 45.0 * e2 * e2 * e2 / 1024.0
      15.0 * e2 * e2 / 256.0 + 45.0 * e2 * e2 * e2 / 1024.0
      35.0 * e2 * e2 * e2 / 3072.0
    ]
    @M0 = @a * (@subM[0] * @phi0 - @subM[1] * Math.sin(2.0 * @phi0) + @subM[2] * Math.sin(4.0 * @phi0) - @subM[3] * Math.sin(6.0 * @phi0))
    @subMU = @a * (1.0 - e2 / 4.0 - 3.0 * e2 * e2 / 64.0 - 5.0 * e2 * e2 * e2 / 256.0)
    e1 = (1.0 - Math.sqrt(1.0 - e2)) / (1.0 + Math.sqrt(1.0 - e2))
    @subPhi1 = [
      3.0 * e1 / 2.0 - 27.0 * e1 * e1 * e1 / 32.0
      21.0 * e1 * e1 / 16.0 - 55.0 * e1 * e1 * e1 * e1 / 32.0
      151.0 * e1 * e1 * e1 / 96.0
      1097.0 * e1 * e1 * e1 * e1 / 512.0
    ]
    @hemisphereCenter = new Coordinate(@lambda0, 0.0)

  getMaxC: -> 1.4137167 # 81 degrees expressed in radians

  getHemisphereCenter: -> @hemisphereCenter

  forwardPointRaw: (lambda, phi) ->
    if Math.abs(Math.abs(phi) - HALF_PI) < EPSILON
      M = @a * (@subM[0] * phi - @subM[1] * Math.sin(2.0 * phi) + @subM[2] * Math.sin(4.0 * phi) - @subM[3] * Math.sin(6.0 * phi))
      new Coordinate(0.0, @k0 * (M - @M0))
    else
      sinPhi = Math.sin(phi)
      cosPhi = Math.cos(phi)
      tanPhi = Math.tan(phi)
      N = @a / Math.sqrt(1 - (@e2 * (sinPhi * sinPhi)))
      T = tanPhi * tanPhi
      C = @ePrimeSq * (cosPhi * cosPhi)
      A = (lambda - @lambda0) * cosPhi
      M = @a * (@subM[0] * phi - @subM[1] * Math.sin(2.0 * phi) + @subM[2] * Math.sin(4.0 * phi) - @subM[3] * Math.sin(6.0 * phi))
      x = @k0 * N * (A + (1.0 - T + C) * A * A * A / 6.0 + (5.0 - 18.0 * T + T * T + 72.0 * C - 58.0 * @ePrimeSq) * A * A * A * A * A / 120.0)
      y = @k0 * (M - @M0 + N * tanPhi * (A * A / 2.0 + (5 - T + 9.0 * C + 4.0 * C * C) * A * A * A * A / 24.0 + (61.0 - 58.0 * T + T * T + 600.0 * C - 330.0 * @ePrimeSq) * A * A * A * A * A * A / 720.0))
      new Coordinate(x, y)

  inversePointRaw: (x, y) ->
    M = @M0 + (y / @k0)
    mu = M / @subMU
    phi1 = mu + @subPhi1[0] * Math.sin(2.0 * mu) + @subPhi1[1] * Math.sin(4.0 * mu) + @subPhi1[2] * Math.sin(6.0 * mu) + @subPhi1[3] * Math.sin(8.0 * mu)
    sinPhi1 = Math.sin(phi1)
    cosPhi1 = Math.cos(phi1)
    tanPhi1 = Math.tan(phi1)
    C1 = @ePrimeSq * cosPhi1 * cosPhi1
    T1 = tanPhi1 * tanPhi1
    N1 = @a / Math.sqrt(1 - @e2 * sinPhi1 * sinPhi1)
    R1 = @a * (1.0 - @e2) / Math.pow(1.0 - @e2 * sinPhi1 * sinPhi1, 1.5)
    D = x / (N1 * @k0)
    lat = phi1 - (N1 * tanPhi1 / R1) * (D * D / 2.0 - (5.0 + 3.0 * T1 + 10.0 * C1 - 4.0 * C1 * C1 - 9.0 * @ePrimeSq) * D * D * D * D / 24.0 + (61.0 + 90.0 * T1 + 298.0 * C1 + 45.0 * T1 * T1 - 252.0 * @ePrimeSq - 3.0 * C1 * C1) * D * D * D * D * D * D / 720.0)
    lon = @lambda0 + (D - (1.0 + 2.0 * T1 + C1) * D * D * D / 6.0 + (5.0 - 2.0 * C1 + 28.0 * T1 - 3.0 * C1 * C1 + 8.0 * @ePrimeSq + 24.0 * T1 * T1) * D * D * D * D * D / 120.0) / cosPhi1
    new Coordinate(lon, lat)

NORTH_POLE = new Coordinate(0.0, HALF_PI)
SOUTH_POLE = new Coordinate(0.0, -HALF_PI)

class Conic extends HemisphericalProjection
  constructor: (ellipsoid, params) ->
    super(ellipsoid, params)
    @phi1 = params.getAngular("standard_parallel_1")
    @phi2 = params.getAngular("standard_parallel_2")
    if Math.abs(@phi2) is Math.abs(@phi1)
      # all kinds of mathematical problems result when abs(phi1) == abs(phi2)
      @phi2 += (@phi2 * 0.01)

  getHemisphereCenter: -> if @phi0 >= 0.0 then NORTH_POLE else SOUTH_POLE

  getMaxC: -> THREE_QUARTERS_PI

class LambertConformalConic extends Conic
  constructor: (ellipsoid, params) ->
    super(ellipsoid, params)
    e2 = @e2
    @e = Math.sqrt(e2)
    t0 = @getT(@phi0)
    t1 = @getT(@phi1)
    sinPhi1 = Math.sin(@phi1)
    m1 = Math.cos(@phi1) / Math.sqrt(1 - e2 * sinPhi1 * sinPhi1)
    if @phi1 is @phi2
      @n = sinPhi1
    else
      t2 = @getT(@phi2)
      sinPhi2 = Math.sin(@phi2)
      m2 = Math.cos(@phi2) / Math.sqrt(1.0 - e2 * sinPhi2 * sinPhi2)
      @n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2))
    @inverseN = 1.0 / @n
    @F = m1 / (@n * Math.pow(t1, @n))
    @rho0 = @a * @F * Math.pow(t0, @n)
    @subPhi = [
      (e2 / 2.0) + (5.0 * e2 * e2 / 24.0) + (e2 * e2 * e2 / 12.0) + (13.0 * e2 * e2 * e2 * e2 / 360.0)
      (7.0 * e2 * e2 / 48.0) + (29.0 * e2 * e2 * e2 / 240.0) + (811.0 * e2 * e2 * e2 * e2 / 11520.0)
      (7.0 * e2 * e2 * e2 / 120.0) + (81.0 * e2 * e2 * e2 * e2 / 1120.0)
      (4279.0 * e2 * e2 * e2 * e2 / 161280.0)
    ]

  # equation 15-9a on p. 108 of Snyder
  getT: (phi) ->
    sinPhi = Math.sin(phi)
    Math.sqrt(((1.0 - sinPhi) / (1.0 + sinPhi)) * Math.pow((1.0 + @e * sinPhi) / (1.0 - @e * sinPhi), @e))

  forwardPointRaw: (lon, lat) ->
    rho = @a * @F * Math.pow(@getT(lat), @n)
    theta = @n * wrapLongitude(lon - @lambda0)
    new Coordinate(rho * Math.sin(theta), @rho0 - (rho * Math.cos(theta)))

  inversePointRaw: (x, y) ->
    rho0minusY = @rho0 - y
    rho = Math.sqrt(x * x + rho0minusY * rho0minusY) * sign(@n)
    theta = if @n < 0.0 then Math.atan2(-x, -rho0minusY) else Math.atan2(x, rho0minusY)
    lat =
      if rho is 0.0
        HALF_PI * sign(@n)
      else
        t = Math.pow(rho / (@a * @F), @inverseN)
        chi = HALF_PI - 2.0 * Math.atan(t)
        chi +
          @subPhi[0] * Math.sin(2.0 * chi) +
          @subPhi[1] * Math.sin(4.0 * chi) +
          @subPhi[2] * Math.sin(6.0 * chi) +
          @subPhi[3] * Math.sin(8.0 * chi)
    thetaOverN = theta / @n
    lon =
      if Math.abs(thetaOverN) > Math.PI
        NaN
      else
        wrapLongitude(@lambda0 + thetaOverN)
    new Coordinate(lon, lat)

# --- WKT parsing (ports of wkt/WKTElement.java, wkt/WKTFormat.java) ---

class WKTElement
  constructor: (keyword, contents = []) ->
    @keyword  = keyword.toUpperCase()
    @contents = contents

  nextNumber: (required) ->
    for value, i in @contents when checks.isNumber(value)
      @contents.splice(i, 1)
      return value
    if required
      throw exceptions.extension("missing required number parameter")
    null

  nextString: (required) ->
    for value, i in @contents when checks.isString(value)
      @contents.splice(i, 1)
      return value
    if required
      throw exceptions.extension("missing required string parameter")
    null

  nextElement: (key, required) ->
    for value, i in @contents when value instanceof WKTElement and value.keyword is key
      @contents.splice(i, 1)
      return value
    if required
      throw exceptions.extension("missing required element '#{key}'")
    null

# (String) => Boolean
isIdentifierStart = (ch) -> /[A-Za-z_]/.test(ch)

# (String) => Boolean
isIdentifierPart  = (ch) -> /[A-Za-z0-9_]/.test(ch)

OPEN_BRACKETS  = "[("
QUOTE          = "\""
CLOSE_BRACKETS = "])"
SEPARATORS     = ",;"

# (String, { index: Number }, String) => Number
# Advances past whitespace; if the next char is in `separators`, consumes it and
# returns its index therein, else returns -1
parseOptionalSeparator = (text, pos, separators) ->
  index = pos.index
  index += 1 while index < text.length and /\s/.test(text[index])
  separatorIndex = if index < text.length then separators.indexOf(text[index]) else -1
  if separatorIndex >= 0
    index += 1
  pos.index = index
  separatorIndex

# (String, { index: Number }) => WKTElement
parseWKT = (text, pos = { index: 0 }) ->
  keywordStart = pos.index
  keywordStart += 1 while keywordStart < text.length and /\s/.test(text[keywordStart])
  keywordEnd = keywordStart
  keywordEnd += 1 while keywordEnd < text.length and isIdentifierPart(text[keywordEnd])
  if keywordEnd <= keywordStart
    throw exceptions.extension("empty keyword")
  keyword = text.substring(keywordStart, keywordEnd)
  pos.index = keywordEnd
  openBracketType = parseOptionalSeparator(text, pos, OPEN_BRACKETS)
  if openBracketType < 0
    return new WKTElement(keyword)
  contents = []
  loop
    if pos.index >= text.length
      throw exceptions.extension("unexpected end of input")
    if parseOptionalSeparator(text, pos, QUOTE) >= 0
      stringBegin = pos.index
      stringEnd = text.indexOf(QUOTE, stringBegin)
      if stringEnd <= stringBegin
        throw exceptions.extension("expected closing quote")
      contents.push(text.substring(stringBegin, stringEnd))
      pos.index = stringEnd + 1
    else if not isIdentifierStart(text[pos.index])
      match = /^[-+]?(\d+\.?\d*|\.\d+)/.exec(text.substring(pos.index))
      if not match?
        throw exceptions.extension("unparseable number")
      contents.push(parseFloat(match[0]))
      pos.index += match[0].length
    else
      contents.push(parseWKT(text, pos))
    break if parseOptionalSeparator(text, pos, SEPARATORS) < 0
  closeBracketType = parseOptionalSeparator(text, pos, CLOSE_BRACKETS)
  if closeBracketType is openBracketType
    new WKTElement(keyword, contents)
  else
    throw exceptions.extension("invalid close bracket at position #{pos.index} of '#{text}'")

# --- projection construction from WKT (port of projection/ProjectionFormat.java) ---

PROJECTION_CONSTRUCTORS = {
  "Mercator_1SP":                Mercator
  "Transverse_Mercator":         TransverseMercator
  "Lambert_Conformal_Conic_2SP": LambertConformalConic
}

# supported by desktop but not yet ported here
DESKTOP_ONLY_PROJECTIONS = [
  "Albers_Conic_Equal_Area", "Lambert_Azimuthal_Equal_Area", "Azimuthal_Equidistant"
  "Cylindrical_Equal_Area", "Equidistant_Conic", "Gnomonic", "Miller_Cylindrical"
  "Oblique_Mercator", "hotine_oblique_mercator", "Orthographic", "Polyconic"
  "Robinson", "Stereographic"
]

# (WKTElement) => Ellipsoid
parseEllipsoidElement = (parent) ->
  datumElt    = parent.nextElement("DATUM", true)
  spheroidElt = datumElt.nextElement("SPHEROID", true)
  Ellipsoid.fromInverseFlattening(spheroidElt.nextString(false), spheroidElt.nextNumber(true), spheroidElt.nextNumber(true))

# (WKTElement) => Geographic
parseGeographic = (element) ->
  ellipsoid     = parseEllipsoidElement(element)
  primeMElement = element.nextElement("PRIMEM", true)
  unitsElement  = element.nextElement("UNIT", true)
  angularFactor = unitsElement.nextNumber(true) # radians per unit
  centerLon     = (primeMElement.nextNumber(true) * DEGREES_TO_RADIANS) / angularFactor
  new Geographic(ellipsoid, new Coordinate(centerLon, 0.0), angularFactor)

# (WKTElement) => Projection
parseProjected = (element) ->
  gcsElement          = element.nextElement("GEOGCS", true)
  angularUnitsElement = gcsElement.nextElement("UNIT", true)
  angularFactor       = angularUnitsElement.nextNumber(true)
  ellipsoid           = parseEllipsoidElement(gcsElement)
  linearUnitsElement  = element.nextElement("UNIT", true)
  linearFactor        = linearUnitsElement.nextNumber(true)
  parameters = new ProjectionParameters(angularFactor, linearFactor)
  while (paramElement = element.nextElement("PARAMETER", false))?
    parameters.add(paramElement.nextString(true), paramElement.nextNumber(true))
  projectionElt  = element.nextElement("PROJECTION", true)
  projectionName = projectionElt.nextString(true)
  ProjectionClass = PROJECTION_CONSTRUCTORS[projectionName]
  if ProjectionClass?
    new ProjectionClass(ellipsoid, parameters)
  else if projectionName in DESKTOP_ONLY_PROJECTIONS
    throw exceptions.extension("the projection '#{projectionName}' is not yet implemented in the NetLogo Web GIS extension")
  else
    throw exceptions.extension("unsupported projection '#{projectionName}'")

# (WKTElement) => Projection
parseProjectionElement = (wkt) ->
  if wkt.keyword is "GEOGCS"
    parseGeographic(wkt)
  else if wkt.keyword is "PROJCS"
    parseProjected(wkt)
  else
    throw exceptions.extension("only GEOGCS and PROJCS are supported. Try using a tool like QGIS or ArcMap to convert your data to a different projection like WGS84")

# (WKTElement) => String
# port of WKTFormat.formatWKT (numbers: min 1, max 12 fraction digits)
formatWKTElement = (element) ->
  formatNumber = (n) ->
    s = n.toFixed(12).replace(/0+$/, "")
    if s.endsWith(".") then s + "0" else s
  if element.contents.length is 0
    element.keyword
  else
    contents = element.contents.map( (item) ->
      if item instanceof WKTElement
        formatWKTElement(item)
      else if checks.isString(item)
        "\"#{item}\""
      else
        formatNumber(item)
    )
    "#{element.keyword}[#{contents.join(",")}]"

# (String) => Projection — retains the source WKT so datasets can be stored back out
parseProjection = (text) ->
  result = parseProjectionElement(parseWKT(text))
  result.wktSource = text
  result

# (Projection, Projection) => Boolean
# src is always Geographic in practice (datasets load as WGS84/degrees), so only
# Geographic-vs-Geographic equality needs real field comparison
projectionsEqual = (a, b) ->
  if a.isGeographic and b.isGeographic
    a.ellipsoid.equals(b.ellipsoid) and
      Math.abs(a.lambda0 - b.lambda0) < EPSILON and
      Math.abs(a.phi0 - b.phi0) < EPSILON and
      a.angularFactor is b.angularFactor
  else
    false

# (GeometryFactory, Geometry, Geographic, Projection) => Geometry
# Coordinate-level port of the desktop Forward/InverseTransformer pair.  The desktop
# forward pass also wraps/clips lines and polygons at the dateline or hemisphere edge
# (ProjectionUtils.wrap/clip) and repairs invalid polygons; that is not yet ported, so
# geometries crossing those boundaries reproject approximately.
reprojectGeometry = (factory, geom, srcGeo, dstProj) ->
  { Coordinate } = JSTS.geom

  # inverse filter from desktop's InverseTransformer (odd grouping matches Java)
  keepInverse = (c) ->
    ((not isNaN(c.x)) and (not isNaN(c.y)) and (Math.abs(c.x) <= Math.PI)) or (Math.abs(c.y) <= HALF_PI)

  mapCoords = (coords) ->
    result = []
    for c in coords
      inv = srcGeo.inversePoint(c.x, c.y)
      if keepInverse(inv)
        result.push(dstProj.forwardPoint(inv.x, inv.y))
    result

  mapRing = (ring) ->
    coords = mapCoords(ring.getCoordinates())
    if coords.length > 2 and not coords[0].equals2D(coords[coords.length - 1])
      coords.push(coords[0])
    if coords.length < 4
      throw exceptions.extension("a polygon ring became invalid when projected into the current coordinate system")
    factory.createLinearRing(coords)

  switch geom.getGeometryType()
    when "Point"
      if geom.isEmpty()
        return geom
      inv = srcGeo.inversePoint(geom.getX(), geom.getY())
      if not keepInverse(inv)
        return factory.createPoint(null)
      clipped = dstProj.processPoint(inv)
      if not clipped?
        return factory.createPoint(null)
      factory.createPoint(dstProj.forwardPoint(clipped.x, clipped.y))
    when "LineString"
      factory.createLineString(mapCoords(geom.getCoordinates()))
    when "Polygon"
      shell = mapRing(geom.getExteriorRing())
      holes = (mapRing(geom.getInteriorRingN(i)) for i in [0...geom.getNumInteriorRing()])
      factory.createPolygon(shell, holes)
    when "MultiPoint"
      points = (reprojectGeometry(factory, geom.getGeometryN(i), srcGeo, dstProj) for i in [0...geom.getNumGeometries()])
      factory.createMultiPoint(points.filter((p) -> not p.isEmpty()))
    when "MultiLineString"
      lines = (reprojectGeometry(factory, geom.getGeometryN(i), srcGeo, dstProj) for i in [0...geom.getNumGeometries()])
      factory.createMultiLineString(lines)
    when "MultiPolygon"
      polygons = (reprojectGeometry(factory, geom.getGeometryN(i), srcGeo, dstProj) for i in [0...geom.getNumGeometries()])
      factory.createMultiPolygon(polygons)
    else
      children = (reprojectGeometry(factory, geom.getGeometryN(i), srcGeo, dstProj) for i in [0...geom.getNumGeometries()])
      factory.createGeometryCollection(children)

# (List) => WKTElement
# nested-list WKT representation (port of netlogo/WKLogoListFormat.java)
logoListToWKT = (list) ->
  element = new WKTElement(list[0])
  for item in list[1..]
    element.contents.push(if checks.isList(item) then logoListToWKT(item) else item)
  element

# (GisCore, Workspace) => GisProjection
module.exports = ({ core, workspace }) ->

  # (Projection) => Unit
  setProjection = (newProjection) ->
    if core.state.datasetCount > 0
      workspace.printPrims.print("GIS Extension Warning: datasets previously loaded will not be re-projected to match the new projection.")
    core.state.projection = newProjection
    core.state.datasetCount = 0
    return

  # port of netlogo/ProjectLatLon.java
  # (Number, Number, Ellipsoid) => List
  projectLatLon = (lat, lon, srcEllipsoid) ->
    if lat > 90 or lat < -90 or lon > 180 or lon < -180
      return []
    dstProj = core.state.projection
    if not dstProj?
      throw exceptions.extension("You must use gis:load-coordinate-system or gis:set-coordinate-system before you can project lat/lon pairs.")
    shouldReproject = (not dstProj.isGeographic) or (not srcEllipsoid.equals(dstProj.ellipsoid))
    if shouldReproject
      src = new Geographic(srcEllipsoid, new Coordinate(0.0, 0.0), DEGREES_TO_RADIANS)
      c = src.inversePoint(lon, lat)
      # this condition's odd grouping matches desktop's InverseTransformer filter
      if not (((not isNaN(c.x)) and (not isNaN(c.y)) and (Math.abs(c.x) <= Math.PI)) or (Math.abs(c.y) <= HALF_PI))
        return []
      c = dstProj.processPoint(c)
      if not c?
        return []
      c = dstProj.forwardPoint(c.x, c.y)
    else
      c = new Coordinate(lon, lat)
    transformed = core.gisToNetLogo(c)
    if transformed?
      [transformed.x, transformed.y]
    else
      []

  prims = {
    "SET-COORDINATE-SYSTEM": (arg) ->
      projection =
        if checks.isString(arg)
          parseProjection(arg)
        else
          element = logoListToWKT(arg)
          result = parseProjectionElement(element)
          result.wktSource = formatWKTElement(logoListToWKT(arg))
          result
      setProjection(projection)

    "PROJECT-LAT-LON": (lat, lon) ->
      projectLatLon(lat, lon, Ellipsoid.WGS_84)

    "PROJECT-LAT-LON-FROM-ELLIPSOID": (lat, lon, radius, inverseFlattening) ->
      projectLatLon(lat, lon, Ellipsoid.fromInverseFlattening("user", radius, inverseFlattening))
  }

  {
    prims
  , parseProjection
  , setProjection
  , projectionsEqual
  , reprojectGeometry
  , Ellipsoid
  , Geographic
  , DEGREES_TO_RADIANS
  }
