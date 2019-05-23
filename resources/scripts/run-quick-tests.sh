#!/bin/bash

# This script runs a (hopefully) quick(-ish)-running subset of tests across NetLogo Web functionality.
# The goal is ~10 minutes or less on a modern CPU, not including compile time. -Jeremy B May 2019

# Note: running as a single `sbt.sh` command keeps sbt startup time to a minimum.

# Usage: From the root of the Tortoise repository, run `./resources/scripts/run-quick-tests.sh`

time ./sbt.sh \
  netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle \
  compilerJS/test:compile \
  compilerJS/test:test \
  compilerJVM/test:compile \
  compilerJVM/test:test \
  netLogoWeb/test:compile \
  "netLogoWeb/testOnly *TestEngine *TestEngineType *TestMersenneTwister *TestAgents *TestBasics *TestBooleans *TestBreeds *TestColors *TestControl *TestLabels *TestLists *TestMath *TestProcedures" \
  "netLogoWeb/testOnly *TestReporters -- -z List -z Number -z String" \
  "netLogoWeb/testOnly *TestCommands -- -z Agentset -z ControlStructures" \
  "netLogoWeb/testOnly *ModelDumpTests -- -z \"Wolf Sheep Predation\"" \
  "netLogoWeb/testOnly *TestModels -- -z \"Wolf Sheep Predation\""
