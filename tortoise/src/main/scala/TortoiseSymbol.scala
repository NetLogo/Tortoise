// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

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

  case class WorkspaceInit(args: Seq[Seq[String]], argumentDependencies: Seq[String] = Seq())
    extends TortoiseSymbol {
    val dependencies: Seq[String] =
      Seq("modelConfig", "modelConfig.plots", "modelConfig.output") ++ argumentDependencies
    val provides:     String      = "workspace"
    val toJS:         String      =
      s"var workspace = tortoise_require('engine/workspace')(modelConfig)${args.map(_.mkString("(", ", ", ")")).mkString("")};"
  }

  implicit def componentOrdering: Ordering[TortoiseSymbol] =
    new Ordering[TortoiseSymbol] {
      // this ordering is designed to put requires first and statements last
      // (regardless of alphabetic order), and to alphabetically order otherwise
      def compare(a: TortoiseSymbol, b: TortoiseSymbol): Int = {
        lazy val defaultComparison = Ordering.String.compare(a.provides, b.provides)
        (a, b) match {
          case (r1: JsRequire, r2: JsRequire)     => defaultComparison
          case (r: JsRequire, o)                  => -1
          case (o, r: JsRequire)                  => 1
          case (s1: JsStatement, s2: JsStatement) => defaultComparison
          case (s: JsStatement, o)                => 1
          case (o, s: JsStatement)                => -1
          case _                                  => defaultComparison
        }
      }
    }
}
