#!/bin/bash

export JAVA_HOME=$GRAAL_HOME

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

if [ ! -z $JENKINS_URL ] ; then
  export SBT_OPTS="-Dsbt.log.noformat=true"
  echo $NODE_HOME
  node --version
  echo $JAVA_HOME
  which java
  java -version
  which javac
  javac -version
fi

sbt "$@"
