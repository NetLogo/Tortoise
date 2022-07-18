#!/bin/bash

# This script runs a (hopefully) quick(-ish)-running subset of tests across NetLogo Web functionality.
# The goal is ~10 minutes or less on a modern CPU, not including compile time. -Jeremy B May 2019

# Note: running as a few `sbt.sh` commands keeps sbt startup time to a minimum.  I had issues with
# hangs and out-of-memory errors trying to run everything :-/

# Usage: From the root of the Tortoise repository, run `./resources/scripts/run-quick-tests.sh`

time ./sbt.sh \
  netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle \
  "compilerJS  / Test / compile" \
  "compilerJS  / Test / test" \
  "compilerJVM / Test / compile" \
  "compilerJVM / Test / test" \
  "netLogoWeb  / Test / compile"
time ./sbt.sh \
  "netLogoWeb / testOnly *TestEngine *TestEngineType *TestMersenneTwister" \
  "netLogoWeb / testOnly *TestAgents *TestBasics *TestBooleans" \
  "netLogoWeb / testOnly *TestBreeds *TestColors *TestControl"
time ./sbt.sh \
  "netLogoWeb / testOnly *TestLabels *TestLists *TestMath *TestProcedures" \
  "netLogoWeb / testOnly *TestReporters" \
  "netLogoWeb / testOnly *TestCommands -- -z Agentset -z ControlStructures -z Matrix"
time ./sbt.sh \
  "netLogoWeb / testOnly *ModelDumpTests -- -z \"Wolf Sheep Predation\"" \
  "netLogoWeb / testOnly *TestModels -- -z \"Wolf Sheep Predation\""
