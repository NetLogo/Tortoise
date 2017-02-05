// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

import
  java.util.Collections

import
  org.scalacheck.{ Arbitrary, Gen, Shrink, Prop },
    Arbitrary._,
    Prop._

import
  org.scalatest.{ FunSuite, prop },
    prop.GeneratorDrivenPropertyChecks

import
  scala.collection.JavaConverters._

import
  TortoiseLoader.{ integrateSymbols, dependencySorted }

import
  TortoiseSymbol.{ JsDeclare, JsStatement, JsRequire, WorkspaceInit}

// Two tests?
// The first test gives a feel for the behavior of the class and tests rendering different
// types of symbols. The second is a verifies that dependencies are ordered by dependency
// within the given compilation. -- RG 6/9/2015
class TortoiseLoaderTest extends FunSuite {
  test("renders out a compilation unit with no dependencies") {
    testCompile("var AgentModel = tortoise_require('agentmodel');",
      JsRequire("AgentModel", "agentmodel"))
  }

  test("raises an error a unit does not have its dependencies met") {
    testFails(JsDeclare("foo", "workspace.foo", Seq("workspace")))
  }

  test("compiles multiple units into a single string") {
    testCompile("var a = 2;\nvar foo = 3;",
      JsDeclare("a", "2"), JsDeclare("foo", "3"))
  }

  test("orders units by dependency") {
    testCompile("var foo = {bar: 2};\nvar a = foo.bar;",
      JsDeclare("a", "foo.bar", Seq("foo")),
      JsDeclare("foo", "{bar: 2}"))
  }

  test("raises an error for compilation units with circular dependencies") {
    testFails(JsDeclare("a", "b.d", Seq("b")), JsDeclare("b", "a.c", Seq("a")))
  }

  test("compiles workspace initialization") {
    testCompile("""|var modelConfig = {};
                   |modelConfig.output = function() {};
                   |modelConfig.plots = [];
                   |var workspace = tortoise_require('engine/workspace')(modelConfig)(42)(1, 2, 3);""".stripMargin,
                   JsDeclare("modelConfig", "{}"),
                   JsStatement("modelConfig.output", "modelConfig.output = function() {};", Seq("modelConfig")),
                   JsStatement("modelConfig.plots", "modelConfig.plots = [];", Seq("modelConfig")),
                   WorkspaceInit(Seq(Seq("42"), Seq("1", "2", "3"))))
  }

  def testCompile(expectedCompilation: String, components: TortoiseSymbol*): Unit = {
    assertResult(expectedCompilation)(integrateSymbols(components).dropRight(1)) // drop trailing \n
    ()
  }

  def testFails(components: TortoiseSymbol*): Unit = {
    intercept[IllegalArgumentException] { integrateSymbols(components) }
    ()
  }
}

class TortoiseLoaderPropertyTests extends FunSuite with GeneratorDrivenPropertyChecks {
  test("Sorts simple disjointed dependency sets") {
    forAll(declarationAndRequireSets) { (s) =>
      assertSorted(dependencySorted(s), s)
    }
  }

  test("Sorts tree-shaped dependency sets") {
    forAll(treeCompilation) { (s) =>
      assertSorted(dependencySorted(s), s)
    }
  }

  test("Sorts acyclic dependency sets") {
    forAll(acyclicCompilation) { (s) =>
      assertSorted(dependencySorted(s), s)
    }
  }

  test("Produces a stable sort") {
    forAll(acyclicCompilation) { (s) =>
      val sort1 = dependencySorted(s)
      val sort2 = dependencySorted(shuffle(s))
      assert(sort1 == sort2, s"""|sort order 1:
                                 |${sort1.mkString("\n")}
                                 |sort order 2:
                                 |${sort2.mkString("\n")}""".stripMargin )
    }
  }

  test("fails with an error on cyclic dependency sets") {
    forAll(cyclicCompilation) { (s) =>
      intercept[IllegalArgumentException](dependencySorted(s))
      ()
    }
  }

  type CompilationUnit = Product with Serializable with TortoiseSymbol
  type CompilationList = List[CompilationUnit]

  def allProvidedIDsUnique(compilationList: List[CompilationUnit]) =
    compilationList.map(_.provides).distinct.length == compilationList.length

  def allDependenciesSatisfiable(compilationList: List[CompilationUnit]) =
    compilationList.forall(c =>
        c.dependencies.forall(compilationList.map(_.provides).contains))

  def isValidDependencyTree(compilationList: List[CompilationUnit]) =
    allProvidedIDsUnique(compilationList) && allDependenciesSatisfiable(compilationList)

  val compilationIdent: Gen[String] = Gen.identifier

  val requires =
    for (s <- compilationIdent) yield JsRequire(s, s"tortoise/$s")

  val requireSets = Gen.nonEmptyListOf { requires }

  val declarationAndRequireSets = requireSets.flatMap { (rs) =>
    Gen.listOf {
      decl(Gen.oneOf(rs).map(r => Seq(r.provides)))
    }.map(_ ++ rs).suchThat(isValidDependencyTree)
  }

  val declWithoutDependencies: Gen[CompilationList] =
    decl(Nil).map(List(_))

  val declWithDependencies: Gen[CompilationList] = for {
    provides <- compilationIdent
    deps     <- treeCompilation
  } yield JsDeclare(provides, "", deps.map(_.provides)) :: deps

  def decl(genDeps: Gen[Seq[String]]): Gen[JsDeclare] = for {
    provides <- compilationIdent
    deps     <- genDeps
  } yield JsDeclare(provides, "", deps)

  def treeCompilation: Gen[CompilationList] =
    Gen.oneOf(declWithDependencies, declWithoutDependencies)
      .map(shuffle)
      .suchThat(isValidDependencyTree)

  def acyclicCompilation: Gen[CompilationList] =
    Gen.listOf(treeCompilation).flatMap { trees =>
      val tree = trees.foldLeft(List[CompilationUnit]())(_ ++ _)
      decl(Gen.someOf(tree).map(_.map(_.provides))).map(_ :: tree)
    }.map(shuffle).suchThat(isValidDependencyTree)

  def cyclicCompilation: Gen[CompilationList] =
    acyclicCompilation
      .suchThat(t => t.exists(_.dependencies.nonEmpty))
      .flatMap { tree =>
        val (n1, i1: Int) = tree.find(_.dependencies.nonEmpty).map(n => (n, tree.indexOf(n))).get
        val (n2, i2: Int) = tree.find(_.provides == n1.dependencies.head)
                                .map(n => (n.asInstanceOf[JsDeclare], tree.indexOf(n))).get
        val newNode = JsDeclare("foo", "", Seq(n1.provides))
        tree.updated(i2, n2.copy(dependencies = n2.dependencies :+ "foo")) :+ newNode
      }

  def assertSorted(sorted: Seq[TortoiseSymbol], originals: Seq[TortoiseSymbol]): Unit = {
    val statementOrder = (sorted.map(_.provides) zip (0 until sorted.length)).toMap
    originals.foreach(o => assert(sorted.contains(o)))
    for {
      stmt <- sorted
      dep  <- stmt.dependencies
    } assert(
      statementOrder(dep) < statementOrder(stmt.provides),
      s"- Found $stmt before it's dependency $dep in:\n${sorted.mkString("\n")}")
  }

  def shuffle[T](seq: List[T]): List[T] = {
    val l = seq.toBuffer.asJava
    Collections.shuffle(l)
    l.asScala.toList
  }
}
