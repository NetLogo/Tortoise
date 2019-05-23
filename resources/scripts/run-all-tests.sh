#!/bin/bash

# This script runs all the NetLogo Web tests.  It will take a very long time to complete,
# if it ever completes at all.  It's best to let the CI server run these, if at all possible.
# -Jeremy B May 2019

time ./sbt.sh \
  netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle \
  compilerJS/test:compile \
  compilerJS/test:test \
  compilerJVM/test:compile \
  compilerJVM/test:test \
  netLogoWeb/test:compile \
  netLogoWeb/test:medium \
  "netLogoWeb/testOnly *ModelDumpTests" \
  "netLogoWeb/testOnly *TestModels"
