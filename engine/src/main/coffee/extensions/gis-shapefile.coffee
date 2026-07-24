# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# Port of the desktop extension's io/shapefile package (ESRIShapeBuffer,
# ESRIShapefileReader/Writer, ESRIShapeIndexWriter, DBase*) plus pure-JS base64
# helpers, so no browser/Java APIs are needed.

JSTS = require('jsts/dist/jsts.min.js')
{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')

{ Coordinate, Envelope } = JSTS.geom

SHAPE_TYPE_NULL        = 0
SHAPE_TYPE_POINT       = 1
SHAPE_TYPE_POLYLINE    = 3
SHAPE_TYPE_POLYGON     = 5
SHAPE_TYPE_MULTIPOINT  = 8
SHAPE_TYPE_POINTZ      = 11
SHAPE_TYPE_POLYLINEZ   = 13
SHAPE_TYPE_POLYGONZ    = 15
SHAPE_TYPE_MULTIPOINTZ = 18

BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

# (Uint8Array) => String
bytesToBase64 = (bytes) ->
  out = ""
  i = 0
  while i < bytes.length
    b0 = bytes[i]
    b1 = if i + 1 < bytes.length then bytes[i + 1] else 0
    b2 = if i + 2 < bytes.length then bytes[i + 2] else 0
    out += BASE64_CHARS[b0 >> 2]
    out += BASE64_CHARS[((b0 & 3) << 4) | (b1 >> 4)]
    out += if i + 1 < bytes.length then BASE64_CHARS[((b1 & 15) << 2) | (b2 >> 6)] else "="
    out += if i + 2 < bytes.length then BASE64_CHARS[b2 & 63] else "="
    i += 3
  out

# tolerates line breaks and other whitespace, like Java's MIME decoder
# (String) => Uint8Array
base64ToBytes = (text) ->
  cleaned = text.replace(/[\s\r\n]/g, "").replace(/=+$/, "")
  if /[^A-Za-z0-9+\/]/.test(cleaned)
    throw exceptions.extension("invalid base64 content")
  bytes = new Uint8Array(Math.floor((cleaned.length * 3) / 4))
  byteIndex = 0
  accumulator = 0
  bits = 0
  for char in cleaned
    accumulator = (accumulator << 6) | BASE64_CHARS.indexOf(char)
    bits += 6
    if bits >= 8
      bits -= 8
      bytes[byteIndex++] = (accumulator >> bits) & 0xFF
  bytes

# byte-array-backed buffer mirroring util/Buffer.java; strings are latin-1
class BinaryBuffer

  # (Number)
  constructor: (size) ->
    @bytes = new Uint8Array(size)
    @view = new DataView(@bytes.buffer)
    @little = true

  # (Boolean) => Unit
  setLittleEndian: (little) ->
    @little = little
    return

  # (Number) => Unit
  ensureCapacity: (size) ->
    if size > @bytes.length
      newBytes = new Uint8Array(Math.max(size, @bytes.length * 2))
      newBytes.set(@bytes)
      @bytes = newBytes
      @view = new DataView(@bytes.buffer)
    return

  # (Number) => Number
  getByte:  (offset) -> @view.getInt8(offset)
  # (Number) => Number
  getUByte: (offset) -> @view.getUint8(offset)
  # (Number) => Number
  getShort: (offset) -> @view.getInt16(offset, @little)
  # (Number) => Number
  getInt:   (offset) -> @view.getInt32(offset, @little)
  # (Number) => Number
  getDouble: (offset) -> @view.getFloat64(offset, @little)

  # (Number, Number) => Number
  putByte: (offset, value) ->
    @ensureCapacity(offset + 1)
    @view.setInt8(offset, value)
    1
  # (Number, Number) => Number
  putShort: (offset, value) ->
    @ensureCapacity(offset + 2)
    @view.setInt16(offset, value, @little)
    2
  # (Number, Number) => Number
  putInt: (offset, value) ->
    @ensureCapacity(offset + 4)
    @view.setInt32(offset, value, @little)
    4
  # (Number, Number) => Number
  putDouble: (offset, value) ->
    @ensureCapacity(offset + 8)
    @view.setFloat64(offset, value, @little)
    8

  # trims leading/trailing chars <= ' ' like desktop's getTrimmedString
  # (Number, Number) => String
  getTrimmedString: (offset, length) ->
    begin = offset
    end = offset + length - 1
    begin += 1 while begin < end and @bytes[begin] <= 0x20
    end -= 1 while end >= begin and @bytes[end] <= 0x20
    String.fromCharCode(@bytes.subarray(begin, end + 1)...)

  # (Number, Number) => String
  getCString: (offset, maxLength) ->
    length = maxLength
    for i in [0...length]
      length = i if @bytes[offset + i] is 0
    @getTrimmedString(offset, length)

  # (Number, Number, String) => Number
  putCString: (offset, length, str) ->
    @ensureCapacity(offset + length)
    for i in [0...length]
      @bytes[offset + i] = if i < str.length then str.charCodeAt(i) & 0xFF else 0
    length

  # (Number, Number, String, Boolean) => Number
  putJustifiedString: (offset, length, str, rightJustify) ->
    @ensureCapacity(offset + length)
    pad = Math.max(0, length - str.length)
    leftPad = if rightJustify then pad else 0
    for i in [0...length]
      @bytes[offset + i] =
        if i < leftPad or i >= leftPad + str.length
          0x20
        else
          str.charCodeAt(i - leftPad) & 0xFF
    length

# ring orientation via signed area; CCW when positive, matching JTS Orientation.isCCW
# (Array[Coordinate]) => Boolean
isCCW = (coords) ->
  area = 0
  for c, i in coords[...-1]
    next = coords[i + 1]
    area += (c.x * next.y) - (next.x * c.y)
  area > 0

# port of JTSUtils.buildPolygonGeometry
# (Array[LinearRing], GeometryFactory) => MultiPolygon
buildPolygonGeometry = (rings, factory) ->
  if rings.length is 0
    factory.createMultiPolygon([])
  else if rings.length is 1
    factory.createMultiPolygon([factory.createPolygon(rings[0], [])])
  else
    shells = []
    holes  = []
    for ring in rings when ring.getNumPoints() > 0
      if isCCW(ring.getCoordinates())
        holes.push(ring)
      else
        shells.push(ring)
    if shells.length is 1
      factory.createMultiPolygon([factory.createPolygon(shells[0], holes)])
    else if holes.length is 0
      factory.createMultiPolygon(shells.map((shell) -> factory.createPolygon(shell, [])))
    else
      polygonHoles = shells.map(-> [])
      polygons = shells.map((shell) -> factory.createPolygon(shell, []))
      for hole in holes
        containers = (j for polygon, j in polygons when polygon.contains(hole))
        if containers.length > 0
          # prefer the most specific (innermost) container
          containers.sort((a, b) ->
            if polygons[a].contains(polygons[b]) then 1
            else if polygons[b].contains(polygons[a]) then -1
            else 0
          )
          polygonHoles[containers[0]].push(hole)
      factory.createMultiPolygon(shells.map((shell, j) -> factory.createPolygon(shell, polygonHoles[j])))

class PointZWrapper
  # (Point, Number)
  constructor: (@point, @z) ->

# --- .shp reading (ESRIShapefileReader + ESRIShapeBuffer get* methods) ---

# (BinaryBuffer, Number, GeometryFactory) => Geometry | PointZWrapper
readShpGeometry = (buffer, offset, factory) ->
  buffer.setLittleEndian(true)
  shapeType = buffer.getInt(offset + 8)
  offset += 12

  readParts = (minPoints) ->
    offset += 32 # bounding box
    nParts = buffer.getInt(offset)
    offset += 4
    nPoints = buffer.getInt(offset)
    offset += 4
    if nParts is 0 or nPoints < minPoints
      return null
    partOffsets = []
    for i in [0...nParts]
      partOffsets.push(buffer.getInt(offset))
      offset += 4
    parts = []
    startIndex = partOffsets[0]
    for i in [0...nParts]
      endIndex = if i is nParts - 1 then nPoints else partOffsets[i + 1]
      coords = []
      for j in [startIndex...endIndex]
        x = buffer.getDouble(offset)
        offset += 8
        y = buffer.getDouble(offset)
        offset += 8
        coords.push(new Coordinate(x, y))
      parts.push(coords)
      startIndex = endIndex
    parts

  switch shapeType
    when SHAPE_TYPE_POINT
      factory.createPoint(new Coordinate(buffer.getDouble(offset), buffer.getDouble(offset + 8)))
    when SHAPE_TYPE_POINTZ
      point = factory.createPoint(new Coordinate(buffer.getDouble(offset), buffer.getDouble(offset + 8)))
      new PointZWrapper(point, buffer.getDouble(offset + 16))
    when SHAPE_TYPE_MULTIPOINT, SHAPE_TYPE_MULTIPOINTZ
      offset += 32
      nPoints = buffer.getInt(offset)
      offset += 4
      coords = []
      for i in [0...nPoints]
        coords.push(new Coordinate(buffer.getDouble(offset), buffer.getDouble(offset + 8)))
        offset += 16
      factory.createMultiPoint(coords.map((c) -> factory.createPoint(c)))
    when SHAPE_TYPE_POLYLINE, SHAPE_TYPE_POLYLINEZ
      parts = readParts(2)
      if not parts?
        factory.createMultiLineString([])
      else
        factory.createMultiLineString(parts.map((coords) -> factory.createLineString(coords)))
    when SHAPE_TYPE_POLYGON, SHAPE_TYPE_POLYGONZ
      parts = readParts(3)
      if not parts?
        factory.createMultiPolygon([])
      else
        buildPolygonGeometry(parts.map((coords) -> factory.createLinearRing(coords)), factory)
    else
      throw exceptions.extension("unsupported shape type")

# (Uint8Array, GeometryFactory) => { shapeType: Number, geometries: Array[Geometry | PointZWrapper] }
readShapefile = (bytes, factory) ->
  buffer = new BinaryBuffer(bytes.length)
  buffer.bytes.set(bytes)
  buffer.view = new DataView(buffer.bytes.buffer)
  buffer.setLittleEndian(true)
  fileShapeType = buffer.getInt(32)
  geometries = []
  offset = 100
  while offset + 8 <= bytes.length
    buffer.setLittleEndian(false)
    contentBytes = buffer.getInt(offset + 4) * 2
    break if offset + 8 + contentBytes > bytes.length
    geometries.push(readShpGeometry(buffer, offset, factory))
    offset += 8 + contentBytes
  { shapeType: fileShapeType, geometries }

# --- .dbf reading (DBaseFileReader + DBaseBuffer) ---

# (Uint8Array) => { fields: Array[{ name: String, type: String, length: Number, decimalCount: Number }], records: Array[Array[Any]] }
readDbf = (bytes) ->
  buffer = new BinaryBuffer(bytes.length)
  buffer.bytes.set(bytes)
  buffer.view = new DataView(buffer.bytes.buffer)
  buffer.setLittleEndian(true)
  fileCode = buffer.getByte(0)
  if fileCode isnt 0x03
    throw exceptions.extension("invalid file code #{fileCode}, probably not a dBase file")
  recordCount  = buffer.getInt(4)
  headerSize   = buffer.getShort(8)
  recordLength = buffer.getShort(10)
  fields = []
  offset = 32
  while offset < headerSize and buffer.getUByte(offset) isnt 0x0d
    fields.push({
      name:         buffer.getCString(offset, 11)
      type:         String.fromCharCode(buffer.getUByte(offset + 11))
      length:       buffer.getUByte(offset + 16)
      decimalCount: buffer.getUByte(offset + 17)
    })
    offset += 32

  fieldValue = (fieldOffset, field) ->
    switch field.type
      when "C"
        buffer.getTrimmedString(fieldOffset, field.length)
      when "D"
        dateStr = buffer.getCString(fieldOffset, 8)
        if dateStr.length < 8 then "" else "#{dateStr.substring(0, 4)}-#{dateStr.substring(4, 6)}-#{dateStr.substring(6, 8)}"
      when "N"
        str = buffer.getTrimmedString(fieldOffset, field.length)
        value = parseFloat(str)
        if str is "" or isNaN(value) then null else value
      when "F"
        str = buffer.getTrimmedString(fieldOffset, field.length).replace(/e/g, "E").replace(/\+/g, "")
        value = parseFloat(str)
        if str is "" or isNaN(value) then null else value
      when "L"
        c = String.fromCharCode(buffer.getUByte(fieldOffset))
        if "yYtT".indexOf(c) >= 0 then true else if "nNfF".indexOf(c) >= 0 then false else null
      else
        null

  records = []
  recordOffset = headerSize
  for r in [0...recordCount]
    break if recordOffset + recordLength > bytes.length
    fieldOffset = recordOffset + 1 # skip the status byte
    values = []
    for field in fields
      values.push(fieldValue(fieldOffset, field))
      fieldOffset += field.length
    records.push(values)
    recordOffset += recordLength
  { fields, records }

# --- writing ---

# Java DecimalFormat "###...0.###..." (up to maxDigits fraction digits, trailing zeros
# dropped)
# (Number, Number) => String
decimalFormat = (value, maxDigits) ->
  s = value.toFixed(maxDigits)
  if s.indexOf(".") >= 0
    s = s.replace(/0+$/, "").replace(/\.$/, "")
  s

# port of DBaseFieldDescriptor.makeLegalFieldNames (without the common-prefix-stripping
# pass, which only matters for names over 10 characters sharing prefixes)
# (String) => String
makeLegalFieldName = (name) ->
  stripped = name.replace(/[^A-Za-z0-9_]/g, "").toUpperCase()
  stripped = "F" + stripped if not /^[A-Za-z]/.test(stripped)
  stripped.substring(0, 10)

# (VectorDataset) => Number
esriShapeTypeFor = (dataset) ->
  switch dataset.shapeType
    when "POINT"
      if dataset.features.some((f) -> f.geometry.getNumPoints() isnt 1)
        SHAPE_TYPE_MULTIPOINT
      else
        SHAPE_TYPE_POINT
    when "LINE"    then SHAPE_TYPE_POLYLINE
    when "POLYGON" then SHAPE_TYPE_POLYGON

# (BinaryBuffer, Number, Envelope) => Number
putBoundingBox = (buffer, offset, envelope) ->
  buffer.putDouble(offset,      envelope.getMinX())
  buffer.putDouble(offset + 8,  envelope.getMinY())
  buffer.putDouble(offset + 16, envelope.getMaxX())
  buffer.putDouble(offset + 24, envelope.getMaxY())
  32

# (BinaryBuffer, Number, Number, Envelope) => Unit
putShpHeader = (buffer, fileSizeBytes, shapeType, envelope) ->
  buffer.setLittleEndian(false)
  buffer.putInt(0, 9994)
  buffer.putInt(24, fileSizeBytes / 2)
  buffer.setLittleEndian(true)
  buffer.putInt(28, 1000)
  buffer.putInt(32, shapeType)
  putBoundingBox(buffer, 36, envelope)
  return

# port of ESRIShapeBuffer.putESRIRecord and friends; returns bytes written
# (BinaryBuffer, Number, Geometry, Number, Number) => Number
putShpRecord = (buffer, offset, geometry, shapeType, index) ->
  written = 0
  buffer.setLittleEndian(false)
  written += buffer.putInt(offset + written, index + 1)
  putRing = (line) ->
    for i in [0...line.getNumPoints()]
      c = line.getCoordinateN(i)
      written += buffer.putDouble(offset + written, c.x)
      written += buffer.putDouble(offset + written, c.y)
    return
  switch shapeType
    when SHAPE_TYPE_POINT
      written += buffer.putInt(offset + written, 10)
      buffer.setLittleEndian(true)
      written += buffer.putInt(offset + written, SHAPE_TYPE_POINT)
      point = if geometry.getGeometryType() is "Point" then geometry else geometry.getGeometryN(0)
      written += buffer.putDouble(offset + written, point.getX())
      written += buffer.putDouble(offset + written, point.getY())
    when SHAPE_TYPE_MULTIPOINT
      written += buffer.putInt(offset + written, 20 + (geometry.getNumGeometries() * 8))
      buffer.setLittleEndian(true)
      written += buffer.putInt(offset + written, SHAPE_TYPE_MULTIPOINT)
      written += putBoundingBox(buffer, offset + written, geometry.getEnvelopeInternal())
      written += buffer.putInt(offset + written, geometry.getNumGeometries())
      for i in [0...geometry.getNumGeometries()]
        point = geometry.getGeometryN(i)
        written += buffer.putDouble(offset + written, point.getX())
        written += buffer.putDouble(offset + written, point.getY())
    when SHAPE_TYPE_POLYLINE
      segments = (geometry.getGeometryN(i) for i in [0...geometry.getNumGeometries()])
      pointCount = geometry.getNumPoints()
      written += buffer.putInt(offset + written, 22 + (segments.length * 2) + (pointCount * 8))
      buffer.setLittleEndian(true)
      written += buffer.putInt(offset + written, SHAPE_TYPE_POLYLINE)
      written += putBoundingBox(buffer, offset + written, geometry.getEnvelopeInternal())
      written += buffer.putInt(offset + written, segments.length)
      written += buffer.putInt(offset + written, pointCount)
      segmentOffset = 0
      for segment in segments
        written += buffer.putInt(offset + written, segmentOffset)
        segmentOffset += segment.getNumPoints()
      putRing(segment) for segment in segments
    when SHAPE_TYPE_POLYGON
      rings = []
      for i in [0...geometry.getNumGeometries()]
        polygon = geometry.getGeometryN(i)
        rings.push(polygon.getExteriorRing())
        rings.push(polygon.getInteriorRingN(j)) for j in [0...polygon.getNumInteriorRing()]
      pointCount = rings.reduce(((sum, ring) -> sum + ring.getNumPoints()), 0)
      written += buffer.putInt(offset + written, 22 + (rings.length * 2) + (pointCount * 8))
      buffer.setLittleEndian(true)
      written += buffer.putInt(offset + written, SHAPE_TYPE_POLYGON)
      written += putBoundingBox(buffer, offset + written, geometry.getEnvelopeInternal())
      written += buffer.putInt(offset + written, rings.length)
      written += buffer.putInt(offset + written, pointCount)
      ringOffset = 0
      for ring in rings
        written += buffer.putInt(offset + written, ringOffset)
        ringOffset += ring.getNumPoints()
      putRing(ring) for ring in rings
  written

# (VectorDataset) => { shp: Uint8Array, shx: Uint8Array, dbf: Uint8Array }
writeShapefile = (dataset) ->
  shapeType = esriShapeTypeFor(dataset)
  envelope  = dataset.getEnvelope()

  shp = new BinaryBuffer(1024)
  shx = new BinaryBuffer(1024)
  shpOffset = 100
  shxOffset = 100
  for feature, index in dataset.features
    recordSize = putShpRecord(shp, shpOffset, feature.geometry, shapeType, index)
    shx.setLittleEndian(false)
    shx.putInt(shxOffset, shpOffset / 2)
    shx.putInt(shxOffset + 4, (recordSize - 8) / 2)
    shxOffset += 8
    shpOffset += recordSize
  putShpHeader(shp, shpOffset, shapeType, envelope)
  putShpHeader(shx, shxOffset, shapeType, envelope)

  # dbf field descriptors, sized from the data like desktop's dBaseFieldDescriptors
  fields = dataset.properties.map( (property) ->
    { name: makeLegalFieldName(property.name), type: (if property.type is "STRING" then "C" else "N"), length: 0, decimalCount: 0 }
  )
  for feature in dataset.features
    for property, j in dataset.properties
      value = feature.getProperty(property.name)
      continue if not value?
      if property.type is "STRING"
        fields[j].length = Math.max(fields[j].length, String(value).length)
      else
        str = decimalFormat(value, 18)
        fields[j].length = Math.max(fields[j].length, str.length)
        decIndex = str.indexOf(".")
        if decIndex >= 0
          fields[j].decimalCount = Math.max(fields[j].decimalCount, str.length - decIndex - 1)

  headerSize   = 32 + (32 * fields.length) + 1
  recordLength = 1 + fields.reduce(((sum, f) -> sum + f.length), 0)
  dbf = new BinaryBuffer(headerSize + (recordLength * dataset.features.length) + 1)
  dbf.setLittleEndian(true)
  dbf.putByte(0, 0x03)
  # matches desktop's (buggy) use of Date#getYear/getDay for the header date
  now = new Date()
  dbf.putByte(1, (now.getFullYear() - 3800) & 0xFF)
  dbf.putByte(2, now.getMonth())
  dbf.putByte(3, now.getDay())
  dbf.putInt(4, dataset.features.length)
  dbf.putShort(8, headerSize)
  dbf.putShort(10, recordLength)
  dbf.putByte(29, 1) # MS DOS codepage
  offset = 32
  for field in fields
    dbf.putCString(offset, 11, field.name)
    dbf.putByte(offset + 11, field.type.charCodeAt(0))
    dbf.putByte(offset + 16, field.length)
    dbf.putByte(offset + 17, field.decimalCount)
    offset += 32
  dbf.putByte(headerSize - 1, 0x0d)
  recordOffset = headerSize
  for feature in dataset.features
    dbf.putByte(recordOffset, 0x20) # active record
    fieldOffset = recordOffset + 1
    for property, j in dataset.properties
      value = feature.getProperty(property.name)
      str =
        if not value?
          ""
        else if fields[j].type is "N"
          value.toFixed(fields[j].decimalCount)
        else
          String(value)
      dbf.putJustifiedString(fieldOffset, fields[j].length, str, fields[j].type is "N")
      fieldOffset += fields[j].length
    recordOffset += recordLength
  dbf.putByte(recordOffset, 0x1a) # file terminator

  {
    shp: shp.bytes.subarray(0, shpOffset)
    shx: shx.bytes.subarray(0, shxOffset)
    dbf: dbf.bytes.subarray(0, recordOffset + 1)
  }

module.exports = {
  readShapefile
, readDbf
, writeShapefile
, bytesToBase64
, base64ToBytes
, PointZWrapper
}
