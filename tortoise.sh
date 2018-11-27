#!/bin/sh

rlwrap ./sbt \
  -Djline.terminal=jline.UnsupportedTerminal \
  --warn \
  'netLogoWeb/runMain org.nlogo.TortoiseShell'
