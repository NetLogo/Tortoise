#!/bin/bash

SDKMAN_DIR="${SDKMAN_DIR:-$HOME/.sdkman}"
GRAAL_VERSION="25.0.2-graalce"

if [ -f "$SDKMAN_DIR/bin/sdkman-init.sh" ]; then
  source "$SDKMAN_DIR/bin/sdkman-init.sh"
  sdk use java "$GRAAL_VERSION"
fi
# else: leave JAVA_HOME as-is (e.g. set by CI via graalvm/setup-graalvm)

# GraalVM includes binaries for node and npm that would supercede
# any installed on the system, which we do not want. -Jeremy B 2/2019
export NODE=`which node`
export NODE_HOME=${NODE%/node}

if [ ! -d "node_links" ] ; then
  mkdir node_links
fi

# Remove existing links in case they've changed since last run
if [ -f "node_links/node" ] ; then
  rm node_links/node
fi

if [ -f "node_links/npm" ] ; then
  rm node_links/npm
fi

ln -s "$NODE_HOME/node" "node_links/node"
ln -s "$NODE_HOME/npm" "node_links/npm"

export PATH=$PWD/node_links:$JAVA_HOME/bin:$PATH

sbt "$@"
