// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

sealed trait TortoiseSymbol {
  val provides:     String
  def dependencies: Seq[String]
  def toJS:         String
}

object TortoiseSymbol {
  case class JsDeclare(provides: String, body: String, dependencies: Seq[String] = Seq())
    extends TortoiseSymbol {
    val toJS: String = s"var $provides = $body;"
  }

  case class JsStatement(provides: String, body: String, dependencies: Seq[String] = Seq())
    extends TortoiseSymbol {
    def toJS: String = body
  }

  case class JsRequire(provides: String, filePath: String)
    extends TortoiseSymbol {
    val dependencies: Seq[String] = Seq()
    def toJS:         String      = s"var $provides = tortoise_require('$filePath');"
  }

  case class JsDepend(provides: String, filePath: String, projection: String, dependencies: Seq[String], arguments: Seq[String] = Seq())
    extends TortoiseSymbol {
    def toJS: String = {
      val quotedArgs = arguments.map( (arg) => s""""$arg"""" )
      s"var $provides = tortoise_require('$filePath')$projection(${(dependencies ++ quotedArgs).mkString(", ")});"
    }
  }

  case class WorkspaceInit(args: Seq[Seq[String]], argumentDependencies: Seq[String] = Seq())
    extends TortoiseSymbol {
    val dependencies: Seq[String] = Seq("modelConfig", "modelConfig.plots") ++ argumentDependencies
    val provides:     String      = "workspace"
    val toJS:         String      =
      s"var workspace = tortoise_require('engine/workspace')(modelConfig)${args.map(_.mkString("(", ", ", ")")).mkString("")};"
  }

  implicit def componentOrdering: Ordering[TortoiseSymbol] =
    new Ordering[TortoiseSymbol] {
      def compare(a: TortoiseSymbol, b: TortoiseSymbol): Int = {
        val order = Seq(classOf[JsRequire], classOf[JsDepend], classOf[JsStatement], classOf[JsDeclare], classOf[WorkspaceInit])
        val (classA, classB) = (a.getClass(), b.getClass())
        if (classA == classB)
          Ordering.String.compare(a.provides, b.provides)
        else
          order.indexOf(classA) - order.indexOf(classB)
      }
    }

}
