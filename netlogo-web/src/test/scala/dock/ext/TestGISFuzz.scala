// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.nlw
package dock
package ext

import
  org.nlogo.core.{ Model, View }

import
  scala.util.Random

// Fuzzing suite for the `gis` extension.  See `ExtensionFuzzSuite` for how the docking-based fuzzing works: identical
// NetLogo code runs through headless desktop NetLogo (the oracle) and the compiled JS engine, and any divergence in
// reporter output, world state, or RNG state fails the test.
//
// GIS-specific ground rules, learned from the port:
//   - Never compare raw serialized strings (GeoJSON/prj): desktop's json-simple uses HashMap ordering.  Compare via
//     round-trip loads and semantic reporters instead.
//   - Never compare `gis:property-names` order or multi-property feature dumps: desktop's property schema also sits in
//     a HashMap.  Access properties by name.
//   - `gis:random-point-inside` / `create-turtles-inside-polygon` produce different (but equally valid) points on the
//     two engines (Tinfour vs earcut triangulations); their RNG draw pattern is identical, so other prims stay docked,
//     but their outputs cannot be compared.
//   - NaN-valued cells (NODATA) are avoided: Java boxed-Double equality and JS `===` disagree about NaN.
class TestGISFuzz extends ExtensionFuzzSuite {

  override def fixedSeeds =
    Seq(1L, 2L, 42L, 1337L, 8675309L, 20260714L, 271828L, 161803L, 999983L, 4294967311L)

  override def randomRunCount: Int = 10

  val gisModel =
    Model(code = "extensions [gis]\nglobals [ds ds2]\npatches-own [elev cov]\n", widgets = List(View.square(5)))

  private val digits = 6

  private val numberToken = """-?\d+\.?\d*(?:[Ee]-?\d+)?""".r
  private def canonNums(s: String): String =
    numberToken.replaceAllIn(s, m => java.util.regex.Matcher.quoteReplacement(f"${m.matched.toDouble}%.6f"))

  private def compareNums(reporter: String)(implicit fixture: DockingFixture): Unit =
    fixture.compareMunged(reporter, canonNums, canonNums)

  // --- random input generators ---------------------------------------------------------------------------------------

  private def num(rng: Random, lo: Double, hi: Double): Double =
    BigDecimal(lo + (rng.nextDouble() * (hi - lo))).setScale(6, BigDecimal.RoundingMode.HALF_UP).toDouble

  private def randomEnvelope(rng: Random): String = {
    val xs = Seq(num(rng, -1000, 1000), num(rng, -1000, 1000)).sorted
    val ys = Seq(num(rng, -1000, 1000), num(rng, -1000, 1000)).sorted
    s"[${xs(0)} ${xs(1)} ${ys(0)} ${ys(1)}]"
  }

  private val nameStrings = Seq("alpha", "beta", "gamma", "San Juan", "Santiago", "Busan", "x*y", "")

  private def jsonPoint(rng: Random): String =
    s"[${num(rng, -50, 50)}, ${num(rng, -50, 50)}]"

  private def jsonPointList(rng: Random, minPts: Int, maxPts: Int): String =
    Seq.fill(minPts + rng.nextInt(maxPts - minPts + 1))(jsonPoint(rng)).mkString("[", ", ", "]")

  // axis-aligned rectangle ring, clockwise (shapefile shell order), optionally with a hole
  private def jsonRectRings(rng: Random, withHole: Boolean): String = {
    val x0 = num(rng, -50, 40); val x1 = x0 + num(rng, 1, 10)
    val y0 = num(rng, -50, 40); val y1 = y0 + num(rng, 1, 10)
    val shell = s"[[$x0, $y0], [$x0, $y1], [$x1, $y1], [$x1, $y0], [$x0, $y0]]"
    if (!withHole) s"[$shell]"
    else {
      val hx0 = x0 + (x1 - x0) * 0.25; val hx1 = x0 + (x1 - x0) * 0.75
      val hy0 = y0 + (y1 - y0) * 0.25; val hy1 = y0 + (y1 - y0) * 0.75
      val hole = s"[[$hx0, $hy0], [$hx1, $hy0], [$hx1, $hy1], [$hx0, $hy1], [$hx0, $hy0]]"
      s"[$shell, $hole]"
    }
  }

  private def jsonGeometry(rng: Random, geomType: String): String = geomType match {
    case "Point"           => s"""{"type": "Point", "coordinates": ${jsonPoint(rng)}}"""
    case "MultiPoint"      => s"""{"type": "MultiPoint", "coordinates": ${jsonPointList(rng, 1, 4)}}"""
    case "LineString"      => s"""{"type": "LineString", "coordinates": ${jsonPointList(rng, 2, 5)}}"""
    case "MultiLineString" =>
      val lines = Seq.fill(1 + rng.nextInt(3))(jsonPointList(rng, 2, 4)).mkString("[", ", ", "]")
      s"""{"type": "MultiLineString", "coordinates": $lines}"""
    case "Polygon"         => s"""{"type": "Polygon", "coordinates": ${jsonRectRings(rng, rng.nextBoolean())}}"""
    case "MultiPolygon"    =>
      val polys = Seq.fill(1 + rng.nextInt(2))(jsonRectRings(rng, withHole = false)).mkString("[", ", ", "]")
      s"""{"type": "MultiPolygon", "coordinates": $polys}"""
  }

  private val geometryTypes = Seq("Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon")

  // a homogeneous FeatureCollection with a fixed two-property schema, as an escaped NetLogo string literal
  private def randomGeoJson(rng: Random, geomTypeOpt: Option[String] = None): String = {
    val geomType = geomTypeOpt.getOrElse(geometryTypes(rng.nextInt(geometryTypes.length)))
    val features = Seq.fill(1 + rng.nextInt(5)) {
      val name = nameStrings(rng.nextInt(nameStrings.length))
      s"""{"type": "Feature", "geometry": ${jsonGeometry(rng, geomType)}, "properties": {"NAME": "$name", "NUM": ${num(rng, -100, 100)}}}"""
    }
    val json = s"""{"type": "FeatureCollection", "features": ${features.mkString("[", ", ", "]")}}"""
    json.replace("\"", "\\\"")
  }

  // an ASC grid (no NODATA cells; see the NaN ground rule above)
  private def randomAsc(rng: Random): String = {
    val cols = 2 + rng.nextInt(7)
    val rows = 2 + rng.nextInt(7)
    val cell = num(rng, 0.5, 5)
    val xll  = num(rng, -100, 100)
    val yll  = num(rng, -100, 100)
    val rowsData = Seq.fill(rows)(Seq.fill(cols)(num(rng, -1000, 1000)).mkString(" ")).mkString("\\n")
    s"ncols $cols\\nnrows $rows\\nxllcorner $xll\\nyllcorner $yll\\ncellsize $cell\\n$rowsData\\n"
  }

  private def setupTransformation(run: FuzzRun)(implicit fixture: DockingFixture): Unit = {
    import fixture._
    testCommand("clear-all")
    testCommand(s"random-seed ${run.rng.nextInt()}")
    testCommand(s"gis:set-transformation-ds ${randomEnvelope(run.rng)} [-5 5 -5 5]")
  }

  // location-of every vertex of every feature, precision-limited
  private val allVertexLocations =
    s"""map [ f -> map [ vl -> map [ v -> map [ c -> precision c $digits ] gis:location-of v ] vl ] gis:vertex-lists-of f ] gis:feature-list-of ds"""

  // ===== envelopes and transformations ===============================================================================

  test("envelopes and world-envelope") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("envelopes") { run =>
      import run.rng
      testCommand("clear-all")
      testCommand(s"random-seed ${rng.nextInt()}")
      testCommand(s"gis:set-transformation ${randomEnvelope(rng)} [${num(rng, -5, -1)} ${num(rng, 1, 5)} ${num(rng, -5, -1)} ${num(rng, 1, 5)}]")
      compareNums("map [ x -> precision x 6 ] gis:world-envelope")
      testCommand(s"gis:set-world-envelope-ds ${randomEnvelope(rng)}")
      compareNums("map [ x -> precision x 6 ] gis:world-envelope")
      testCommand(s"create-turtles ${1 + rng.nextInt(8)} [ setxy random-xcor random-ycor ]")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of turtles")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of one-of patches")
      compareNums(s"map [ x -> precision x 6 ] (gis:envelope-union-of ${randomEnvelope(rng)} ${randomEnvelope(rng)} ${randomEnvelope(rng)})")
    }
  }

  // ===== vector datasets from GeoJSON ================================================================================

  test("geojson loading: properties, vertices, searches") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("geojson-load") { run =>
      import run.rng
      setupTransformation(run)
      testCommand(s"""set ds gis:load-dataset-from-string "geojson" "${randomGeoJson(rng)}"""")
      compare("gis:shape-type-of ds")
      compare("length gis:feature-list-of ds")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of ds")
      compareNums(s"""map [ f -> (list gis:property-value f "NAME" (precision gis:property-value f "NUM" $digits)) ] gis:feature-list-of ds""")
      compareNums(allVertexLocations)
      compareNums(s"""map [ f -> map [ c -> precision c $digits ] gis:location-of gis:centroid-of f ] gis:feature-list-of ds""")
      compare("""length gis:find-features ds "NAME" "San*"""")
      compare("""length gis:find-features ds "NAME" "*a*"""")
      compare(s"""length gis:find-less-than ds "NUM" ${num(rng, -100, 100)}""")
      compare(s"""length (gis:find-range ds "NUM" ${num(rng, -100, -1)} ${num(rng, 1, 100)})""")
      compareNums("""(list gis:property-minimum ds "NUM" gis:property-maximum ds "NUM")""")
      compare("""(list gis:property-minimum ds "NAME" gis:property-maximum ds "NAME")""")
    }
  }

  test("spatial relationships") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("spatial-relations") { run =>
      import run.rng
      setupTransformation(run)
      val typeA = Seq("Polygon", "MultiPolygon", "Point", "LineString")(rng.nextInt(4))
      val typeB = Seq("Polygon", "Point")(rng.nextInt(2))
      testCommand(s"""set ds gis:load-dataset-from-string "geojson" "${randomGeoJson(rng, Some(typeA))}"""")
      testCommand(s"""set ds2 gis:load-dataset-from-string "geojson" "${randomGeoJson(rng, Some(typeB))}"""")
      compare("map [ f -> map [ g -> gis:intersects? f g ] gis:feature-list-of ds2 ] gis:feature-list-of ds")
      compare("map [ f -> map [ g -> gis:contains? f g ] gis:feature-list-of ds2 ] gis:feature-list-of ds")
      compare("map [ f -> map [ g -> gis:relationship-of f g ] gis:feature-list-of ds2 ] gis:feature-list-of ds")
      compare("gis:intersects? ds ds2")
      compare("count (patches gis:intersecting ds)")
    }
  }

  test("geojson round trip through store-dataset-to-string") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("geojson-round-trip") { run =>
      import run.rng
      setupTransformation(run)
      testCommand(s"""set ds gis:load-dataset-from-string "geojson" "${randomGeoJson(rng)}"""")
      testCommand("""set ds2 gis:load-dataset-from-string "geojson" gis:store-dataset-to-string ds "geojson"""")
      compare("gis:shape-type-of ds2")
      compareNums(s"""map [ f -> (list gis:property-value f "NAME" (precision gis:property-value f "NUM" $digits)) ] gis:feature-list-of ds2""")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of ds2")
    }
  }

  test("shapefile round trip through store-dataset-to-strings") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("shp-round-trip") { run =>
      import run.rng
      setupTransformation(run)
      // Multi- types only: desktop's shp writer class-cast-crashes on the bare
      // LineString/Polygon geometries that GeoJSON loading produces (NLW is more
      // tolerant, so that divergence is untestable).  Rectangles only for polygons:
      // shapefile shells must be clockwise.
      val geomType = Seq("Point", "MultiPoint", "MultiLineString", "MultiPolygon")(rng.nextInt(4))
      testCommand(s"""set ds gis:load-dataset-from-string "geojson" "${randomGeoJson(rng, Some(geomType))}"""")
      testCommand("""set ds2 gis:load-dataset-from-string "shp" gis:store-dataset-to-strings ds "shp"""")
      compare("gis:shape-type-of ds2")
      compare("length gis:feature-list-of ds2")
      compareNums(s"""map [ f -> (list gis:property-value f "NAME" (precision gis:property-value f "NUM" $digits)) ] gis:feature-list-of ds2""")
      compareNums(allVertexLocations.replace("gis:feature-list-of ds", "gis:feature-list-of ds2"))
      // the same round trip through the base64-zip-string form (the zip bytes differ
      // between Java and fflate, so only the reloaded dataset is compared)
      testCommand("""set ds2 gis:load-dataset-from-string "shp" gis:store-dataset-to-string ds "shp"""")
      compare("gis:shape-type-of ds2")
      compare("length gis:feature-list-of ds2")
      compareNums(s"""map [ f -> (list gis:property-value f "NAME" (precision gis:property-value f "NUM" $digits)) ] gis:feature-list-of ds2""")
      compareNums(allVertexLocations.replace("gis:feature-list-of ds", "gis:feature-list-of ds2"))
    }
  }

  // ===== rasters =====================================================================================================

  test("asc loading and raster values") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("asc-load") { run =>
      import run.rng
      setupTransformation(run)
      testCommand(s"""set ds gis:load-dataset-from-string "asc" "${randomAsc(rng)}"""")
      compare("(list gis:width-of ds gis:height-of ds)")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of ds")
      compareNums("(list precision gis:minimum-of ds 6 precision gis:maximum-of ds 6)")
      compareNums("map [ r -> map [ c -> gis:raster-value ds c r ] range gis:width-of ds ] range gis:height-of ds")
      compareNums("gis:raster-world-envelope ds 0 0")
    }
  }

  test("convolve") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("convolve") { run =>
      import run.rng
      setupTransformation(run)
      // integer cell values and kernel elements: products and sums stay exact whole
      // numbers, so RAW full-precision compares are safe regardless of the engines'
      // summation order (see the `precision` note in the sampling test)
      val gridCols = 3 + rng.nextInt(5)
      val gridRows = 3 + rng.nextInt(5)
      val rowsData = Seq.fill(gridRows)(Seq.fill(gridCols)(rng.nextInt(2001) - 1000).mkString(" ")).mkString("\\n")
      testCommand(s"""set ds gis:load-dataset-from-string "asc" "ncols $gridCols\\nnrows $gridRows\\nxllcorner 0\\nyllcorner 0\\ncellsize 1\\n$rowsData\\n"""")
      val kernelRows = 1 + rng.nextInt(3)
      val kernelCols = 1 + rng.nextInt(3)
      val keyRow     = rng.nextInt(kernelRows)
      val keyCol     = rng.nextInt(kernelCols)
      val elements   = Seq.fill(kernelRows * kernelCols)(rng.nextInt(11) - 5).mkString(" ")
      testCommand(s"set ds2 gis:convolve ds $kernelRows $kernelCols [ $elements ] $keyRow $keyCol")
      compare("(list gis:width-of ds2 gis:height-of ds2)")
      compareNums("map [ x -> precision x 6 ] gis:envelope-of ds2")
      // border cells whose kernel reaches outside the raster are NaN, which `precision`
      // errors on desktop-side; compare only the interior where the kernel fits
      val xOrigin = keyCol
      val yOrigin = kernelRows - keyRow - 1
      val (minCol, maxCol) = (kernelCols - 1 - xOrigin, gridCols - 1 - xOrigin)
      val (minRow, maxRow) = (kernelRows - 1 - yOrigin, gridRows - 1 - yOrigin)
      compareNums(s"map [ r -> map [ c -> gis:raster-value ds2 c r ] (range $minCol ${maxCol + 1}) ] (range $minRow ${maxRow + 1})")
    }
  }

  test("raster sampling: nearest and bilinear") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("raster-sample") { run =>
      import run.rng
      testCommand("clear-all")
      testCommand(s"random-seed ${rng.nextInt()}")
      val asc = randomAsc(rng)
      testCommand(s"""set ds gis:load-dataset-from-string "asc" "$asc"""")
      // frame the world inside the raster so samples mostly land in-bounds
      testCommand("gis:set-world-envelope-ds gis:envelope-of ds")
      for (method <- Seq("NEAREST_NEIGHBOR", "BILINEAR")) {
        testCommand(s"""gis:set-sampling-method ds "$method"""")
        compare("gis:sampling-method-of ds")
        // Raster arithmetic is expected to be bit-identical across the engines, so these
        // compare raw full-precision dumps rather than going through `precision`:
        // NetLogo 7's `precision` rounds via BigDecimal while Tortoise still uses the
        // floor(n*10^p + 0.5) formula, and they disagree on doubles that sit within an
        // ulp of a rounding boundary (which averages routinely produce).
        //
        // Sample only within the raster's bottom-left quadrant (world x/y in
        // [-5.4, -0.1] maps to axis fractions within [0, 0.5)): a bilinear kernel in the
        // top or right edge cell pokes outside the grid and produces NaN.  Grids can be
        // as small as 2x2, so an edge cell can span half of each axis.
        for (_ <- 1 to 5) {
          val x = num(rng, -5.4, -0.1)
          val y = num(rng, -5.4, -0.1)
          compareNums(s"""gis:raster-sample ds (list $x $y)""")
        }
        compareNums("map [ p -> gis:raster-sample ds p ] sort patches")
      }
      compareNums("map [ t -> [ gis:raster-sample ds self ] of t ] sort turtles")
    }
  }

  // ===== agent integration ===========================================================================================

  test("patch-dataset round trip and apply-raster") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("patch-dataset") { run =>
      setupTransformation(run)
      testCommand("ask patches [ set elev precision random-float 100 6 ]")
      testCommand("set ds gis:patch-dataset elev")
      compare("(list gis:width-of ds gis:height-of ds)")
      compareNums("map [ r -> map [ c -> precision gis:raster-value ds c r 6 ] range gis:width-of ds ] range gis:height-of ds")
      // apply-raster back into another patch variable; grid matches the world exactly, so
      // no resampling happens on either engine
      testCommand("gis:apply-raster ds cov")
      compareNums("map [ p -> [ precision cov 6 ] of p ] sort patches")
    }
  }

  test("create-turtles-from-points docks world and RNG") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    fuzz("create-turtles-from-points") { run =>
      import run.rng
      setupTransformation(run)
      // points spread around the GIS envelope; some may fall outside it and be skipped
      testCommand(s"""set ds gis:load-dataset-from-string "geojson" "${randomGeoJson(rng, Some("Point"))}"""")
      testCommand("gis:set-world-envelope-ds gis:envelope-of ds")
      testCommand("gis:create-turtles-from-points ds turtles [ set size 2 ]")
      compare("count turtles")
      compareNums("map [ t -> [ (list precision xcor 6 precision ycor 6 color heading) ] of t ] sort turtles")
    }
  }

  // ===== projections =================================================================================================

  test("project-lat-lon under WGS84 and projected systems") { implicit fixture => import fixture._
    openModel(gisModel, shouldAutoInstallLibs = true)
    val wgs84 = """GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137,298.257223563]],PRIMEM[\"primem\",0.0],UNIT[\"Degree\",0.017453292519943295]]"""
    val lambert = """PROJCS[\"Europe_Lambert_Conformal_Conic\",GEOGCS[\"ED50\",DATUM[\"European_Datum_1950\",SPHEROID[\"International 1924\",6378388,297]],PRIMEM[\"Greenwich\",0],UNIT[\"degree\",0.0174532925199433]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"False_Easting\",0.0],PARAMETER[\"False_Northing\",0.0],PARAMETER[\"Central_Meridian\",10.0],PARAMETER[\"Standard_Parallel_1\",43.0],PARAMETER[\"Standard_Parallel_2\",62.0],PARAMETER[\"Latitude_Of_Origin\",30.0],UNIT[\"Meter\",1.0]]"""
    val utm = """PROJCS[\"NAD_1983_UTM_Zone_18N\",GEOGCS[\"GCS_North_American_1983\",DATUM[\"D_North_American_1983\",SPHEROID[\"GRS_1980\",6378137,298.257222101]],PRIMEM[\"Greenwich\",0],UNIT[\"Degree\",0.017453292519943295]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"False_Easting\",500000],PARAMETER[\"False_Northing\",0],PARAMETER[\"Central_Meridian\",-75],PARAMETER[\"Scale_Factor\",0.9996],PARAMETER[\"Latitude_Of_Origin\",0],UNIT[\"Meter\",1]]"""
    fuzz("project-lat-lon") { run =>
      import run.rng
      testCommand("clear-all")
      for ((wkt, envelope) <- Seq((wgs84,   "[-180 180 -90 90]"),
                                  (lambert, "[-3000000 3000000 -3000000 3000000]"),
                                  (utm,     "[-1000000 2000000 -10000000 10000000]"))) {
        testCommand(s"""gis:set-coordinate-system "$wkt"""")
        testCommand(s"gis:set-transformation-ds $envelope [-5 5 -5 5]")
        for (_ <- 1 to 8) {
          val lat = num(rng, -85, 85)
          val lon = num(rng, -180, 180)
          compareNums(s"map [ x -> precision x $digits ] gis:project-lat-lon $lat $lon")
        }
      }
    }
  }
}
