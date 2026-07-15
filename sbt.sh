#!/bin/bash

SDKMAN_DIR="${SDKMAN_DIR:-$HOME/.sdkman}"

# Note: the GraalVM version lives in `.sdkmanrc`, we use `sdk env` to pick it up.

cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

if [ -f "$SDKMAN_DIR/bin/sdkman-init.sh" ]; then
  source "$SDKMAN_DIR/bin/sdkman-init.sh"
  if ! sdk env; then
    echo "sbt.sh: could not activate the JDK pinned in .sdkmanrc." >&2
    echo "sbt.sh: run 'sdk env install' to install it, then try again." >&2
    exit 1
  fi
fi

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
