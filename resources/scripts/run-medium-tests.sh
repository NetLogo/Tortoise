#!/bin/bash

# This script runs a subset of tests across NetLogo Web functionality, to check for problems before
# pushing to have the CI run the full set of tests. The goal is ~40 minutes or less on a modern CPU.
# -Jeremy B May 2019

# Usage: From the root of the Tortoise repository, run `./resources/scripts/run-medium-tests.sh`

time ./sbt.sh \
  netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle \
  "compilerJS / Test / compile" \
  "compilerJS / Test / test" \
  "compilerJVM / Test / compile" \
  "compilerJVM / Test / test" \
  "netLogoWeb / Test / compile" \
  "netLogoWeb / Test / medium" \
  "netLogoWeb / testOnly *ModelDumpTests" \
  "netLogoWeb / testOnly *TestModels -- -z 0 -z 1"
