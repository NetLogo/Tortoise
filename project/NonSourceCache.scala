import sbt.util.{ CacheStore, Difference }
import sbt.{ File, FileInfo }

object NonSourceCache {

  // The basic solution is taken from here:  https://stackoverflow.com/a/23745968/1246011
  // It has been modified to work with the newer sbt, as well as to handle multiple files
  // for the extensions' JSON.  -Jeremy B August 2020
  def cached(cache: sbt.util.CacheStore, inStyle: FileInfo.Style)(action: () => Unit): Set[File] => Unit = {
    lazy val inCache = Difference.inputs(cache, inStyle)
    inputs => {
      inCache(inputs) {
        inReport => {
          if (!inReport.modified.isEmpty) {
            action()
          }
        }
      }
    }
  }

}
