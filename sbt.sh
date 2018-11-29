#!/bin/bash

export JAVA_HOME=$GRAAL_HOME

export PATH=$JAVA_HOME/bin:$PATH
JAVA=$JAVA_HOME/bin/java

# Most of these settings are fine for everyone
XSS=-Xss2m
XMX=-Xmx2048m
XX=
ENCODING=-Dfile.encoding=UTF-8
HEADLESS=-Djava.awt.headless=true
BOOT=xsbt.boot.Boot

SBT_LAUNCH=$HOME/.sbt/sbt-launch-0.13.8.jar
URL='http://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.8/sbt-launch.jar'

if [ ! -f $SBT_LAUNCH ] ; then
  echo "downloading" $URL
  mkdir -p $HOME/.sbt
  curl -s -S -L -f $URL -o $SBT_LAUNCH || exit
fi

if [ -z $JENKINS_URL ] ; then
  JAVA_OPTS="$XSS $XMX $XX"
else
  JAVA_OPTS="$XSS $XMX $XX -Dsbt.log.noformat=true"
fi

"$JAVA" \
    $JAVA_OPTS \
    $ENCODING \
    $HEADLESS \
    -classpath $SBT_LAUNCH \
    $BOOT "$@"
