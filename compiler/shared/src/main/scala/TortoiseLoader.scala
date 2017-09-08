// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import TortoiseSymbol._

// TortoiseLoader lays out ("integrates") Tortoise javascript bits ("symbols")
// in dependency order, using a stable sort. RG 6/18/2015
object TortoiseLoader {
  def integrateSymbols(components: Seq[TortoiseSymbol]): String = {
    val nonProvidedDeps = unsatisfiableDependencies(components)
    if (nonProvidedDeps.isEmpty)
      dependencySorted(components).map(_.toJS).mkString("", "\n", "\n")
    else
      throw new IllegalArgumentException(s"Please provide the following dependencies: ${nonProvidedDeps.mkString(", ")}")
  }

  def dependencySorted(components: Seq[TortoiseSymbol]): Seq[TortoiseSymbol] = {
    import scala.annotation.tailrec

    type Edge    = (String, String)
    type NodeSet = Set[String]

    implicit class RichEdge(e: Edge) {
      def dependency: String = e._1
      def client: String = e._2
    }

    @tailrec
    def topologicalSort(sortedNodes: Seq[NodeSet],
                        edges:       Set[Edge]): Seq[NodeSet] =
      if (edges.nonEmpty) {
        val (satisfiedEdges, unsatisfiedEdges) = edges.partition(e => sortedNodes.last.contains(e.dependency))
        val independentNodes = satisfiedEdges.map(_.client) -- unsatisfiedEdges.map(_.client)
        if (independentNodes.nonEmpty)
          topologicalSort(sortedNodes :+ independentNodes, unsatisfiedEdges)
        else {
          val formattedEdges =
            edges.map(t => s"from ${t._2} to ${t._1}").mkString(",\n")
          throw new IllegalArgumentException(s"unable to satisfy dependencies: $formattedEdges")
        }
      } else
        sortedNodes

    val componentMap = (components.map(_.provides) zip components).toMap

    val reverseDependencyEdges =
      components.flatMap(c => c.dependencies.map(dep => dep -> c.provides)).toSet

    val independentNodes =
      componentMap.keySet -- reverseDependencyEdges.map(_.client)

    topologicalSort(Seq[NodeSet](independentNodes), reverseDependencyEdges)
      .flatMap(_.map(componentMap).toSeq.sorted)
  }

  private def unsatisfiableDependencies(components: Seq[TortoiseSymbol]): Set[String] = {
    val allProvided = components.map(_.provides)
    val allDependencies = components.flatMap(_.dependencies)
    allDependencies.toSet -- allProvided.toSet
  }
}
