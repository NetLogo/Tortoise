// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise

trait EveryIDProvider {

  private var everyIDComponents = (0, "")

  private[tortoise] def nextEveryID(): String = {
    val (num, str) = everyIDComponents
    everyIDComponents = (num + 1, str)
    s"$str-$num"
  }

  private[tortoise] def resetEveryID(owner: String): Unit =
    everyIDComponents = (0, owner)

}
