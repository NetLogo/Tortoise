#!/bin/bash

export JAVA_HOME=$GRAAL_HOME

export PATH=$JAVA_HOME/bin:$PATH

if [ ! -z $JENKINS_URL ] ; then
  export SBT_OPTS="-Dsbt.log.noformat=true"
  echo $JAVA_HOME
  which java
  java -version
  which javac
  javac -version
fi

sbt "$@"
