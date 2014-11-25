import sbt._
import Keys._

// check whether the code is secretly engaging in forbidden dependencies!
// and rat on it if it is!

object Depend {

  val depend = taskKey[Unit](
    "use Classycle to ferret out forbidden dependencies")

  val settings = Seq(dependTask)

  // perhaps this voodoo will make intermittent failures-for-no-apparent-
  // reason stop. sigh - ST 8/12/12
  private val lock = new AnyRef

  private lazy val dependTask =
    depend := {
      val _ = (compile in Test).value
      val s = streams.value
      lock.synchronized {
        val classes = (classDirectory in Compile).value.toString
        val testClasses = (classDirectory in Test).value.toString
        s.log.info("begin depend: " + thisProject.value.id)
        IO.write(file(".") / "target" / "depend.ddf", ddfContents)
        import classycle.dependency.DependencyChecker
        def main() = TrapExit(
          DependencyChecker.main(Array("-dependencies=@target/depend.ddf",
                                       classes)),
          s.log)
        def test() = TrapExit(
          DependencyChecker.main(Array("-dependencies=@target/depend.ddf",
                                       testClasses)),
          s.log)
        s.log.info("depend: " + classes)
        main() match {
          case 0 =>
            s.log.info("depend: " + testClasses)
            test() match {
              case 0 =>
              case fail =>
                s.log.info("depend failed: " + testClasses)
                sys.error(fail.toString) }
          case fail =>
            s.log.info("depend failed: " + classes)
            sys.error(fail.toString)
        }
        s.log.info("end depend: " + thisProject.value.id)
      }
    }

  private def ddfContents: String = {
    val buf = new StringBuilder
    def println(s: String) { buf ++= s + "\n" }

    // this needs to be manually kept in sync with dist/depend.graffle
    val packageDefs = Map(
      "" -> Nil,
      "util" -> Nil,
      "core" -> Nil,
      "core/prim" -> List("core"),
      "core/prim/etc" -> List("core"),
      "api" -> List("core", "util"),
      "api/model" -> List("api"),
      "nvm" -> List("agent"),
      "mirror" -> List("shape"),
      "shape" -> List("api"),
      "agent" -> List("api"),
      "prim" -> List("nvm"),
      "prim/etc" -> List("nvm"),
      "compile" -> List("nvm", "prim"),
      "workspace" -> List("nvm"),
      "headless" -> List("workspace"),
      "headless/lang" -> List("headless"),
      "parse" -> List("api", "core/prim", "core/prim/etc"),
      "tortoise" -> List("api/model", "parse", "tortoise/json", "tortoise/jsengine"),
      "tortoise/jsengine" -> List("api"),
      "tortoise/json" -> List("mirror")
    )
    case class Package(val dir: String, var depends: Set[Package]) {
      def ancestors:Set[Package] = depends ++ depends.flatMap(_.ancestors)
    }
    val allPackages: Set[Package] = Set() ++ packageDefs.keys.map(Package(_,Set()))
    for(p <- allPackages)
      p.depends = allPackages.filter(p2 => packageDefs(p.dir).contains(p2.dir))
    def generate(p: Package) {
      val name = p.dir.replaceAll("/",".")
      println("[" + name + "] = org.nlogo." + name + ".* excluding org.nlogo." + name + ".*.*")
      println("[" + name + "+] = [" + name + "]" + p.depends.map(p2 => "[" + p2.dir.replaceAll("/",".") + "+]").mkString(" "," ","") + " [libs]")
      println("check [" + name + "] dependentOnlyOn [" + name + "+]")
      println("")
    }
    def generateHeader() {
      println("""
check absenceOfPackageCycles > 1 in org.nlogo.tortoise.*

[headless-AWT] = java.awt.geom.* java.awt.image.* java.awt.Color java.awt.Image java.awt.Shape java.awt.Graphics2D java.awt.Graphics java.awt.Stroke java.awt.Composite java.awt.BasicStroke java.awt.Point java.awt.Font java.awt.AlphaComposite java.awt.RenderingHints java.awt.Rectangle java.awt.FontMetrics java.awt.color.ColorSpace java.awt.Polygon java.awt.RenderingHints$Key javax.imageio.* javax.swing.tree.MutableTreeNode javax.swing.tree.DefaultMutableTreeNode

[stdlib-j] = java.lang.* java.util.* java.io.* java.nio.* java.text.* java.net.* java.security.*

[stdlib-s] = scala.App* scala.Serializable scala.Predef* scala.collection.* scala.reflect.* scala.Function* scala.UninitializedFieldError scala.util.control.Exception* scala.Array* scala.LowPriorityImplicits scala.package$ scala.util.Properties$ scala.Option* scala.Tuple* scala.Product* scala.util.DynamicVariable scala.runtime.* scala.math.* scala.None* scala.Some* scala.MatchError scala.util.Left* scala.util.Right* scala.util.Either* scala.io.* scala.sys.package* scala.sys.process* scala.Console* scala.PartialFunction* scala.util.matching.Regex* scala.Enumeration* scala.Proxy* scala.FallbackArrayBuilding scala.util.Sorting* scala.StringContext scala.text.Document scala.util.Try*

[json4s] = org.json4s.*

[nashorn] = javax.script.* jdk.nashorn.api.scripting.*

[scalaz] = scalaz.*

[testing] = org.scalatest.* org.scalautils.* org.scalacheck.* org.jmock.* org.hamcrest.*

[libs] = [stdlib-j] [stdlib-s] [headless-AWT] [json4s] [nashorn] [scalaz] [testing]
""")
    }

    generateHeader()
    var done = List(allPackages.find(_.dir == "").get)
    def eligible(p:Package) = !done.contains(p) && p.ancestors.forall(done.contains(_))
    while(true) {
      allPackages.filter(!_.dir.isEmpty).find(eligible) match {
        case None =>
          return buf.toString
        case Some(p) =>
          generate(p)
          done = p :: done
      }
    }
    throw new IllegalStateException  // unreachable
  }
}
