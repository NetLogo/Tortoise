#!/bin/sh

# The JSON readers and writers are written by macro every time you do a `compilerJS/compile`.  The shared/JVM ones are
# also written on `compilerJVM/compile`, but this script expects to replace both, so better to just use the JS version
# when replacing.  The generated Scala files are sent to `target/gen-shared` and `target/gen-js` folders. This script
# should enable easy replacing when it's necessary.

# Unfortunately the dependencies are messy and a mistake when generating or replacing files can leave you in a situation
# where you cannot regenerate them.  For that there is the `StubGenerator`, which you can run with `macrosJVM/runMain
# org.nlogo.tortoise.compiler.macros.StubGenerator`.  Then re-run this script to get the stubs in place, then you should
# be able to re-run the actual generator after fixing whatever caused the problem in the first place.

rm compiler/shared/src/main/scala/json/generated/*Writer.scala
rm compiler/shared/src/main/scala/json/generated/*Reader.scala
mv target/gen-shared/*Writer.scala compiler/shared/src/main/scala/json/generated/
mv target/gen-shared/*Reader.scala compiler/shared/src/main/scala/json/generated/

rm compiler/js/src/main/scala/json/generated/*Writer.scala
rm compiler/js/src/main/scala/json/generated/*Reader.scala
mv target/gen-js/*Writer.scala compiler/js/src/main/scala/json/generated/
mv target/gen-js/*Reader.scala compiler/js/src/main/scala/json/generated/
