#!/bin/bash -ev

# -e makes the whole thing die with an error if any command does
# -v lets you see the commands as they happen

if [ ! -f "models/.git" ] ; then
  git submodule update --init
fi

if [[ "$1" == "--clean" ]] ; then
  git clean -fdX
  git submodule foreach git clean -fdX
fi

dashize(){
  echo `echo $1 | sed 's/:/-/g' | sed 's;/;-;g'`
}

sbt_task(){
  mkdir -p tmp/nightly
  ./sbt $1 "$2" 2>&1 | tee tmp/nightly/$(dashize $1).txt
  if [ ${PIPESTATUS[0]} -ne 0 ] ; then echo "*** FAILED: $1"; exit 1; fi
  echo "*** done: $1"
}

sbt_test(){
  # here we're using pipes so "-e" isn't enough to stop when something fails.
  # maybe there's an easier way, than I've done it below, I don't know.
  # I suck at shell scripting - ST 2/15/11
  ./sbt $1/test:$2 2>&1 | tee tmp/nightly/test-$1-$2.txt
  if [ ${PIPESTATUS[0]} -ne 0 ] ; then echo "*** FAILED: $1/test:$2"; exit 1; fi
  echo "*** done: $1/test:$2"
}

if [[ "$@" == "" ||  "$@" == "--clean" ]] ; then
  rm -rf tmp/nightly
  mkdir -p tmp/nightly
  sbt_task tortoiseJVM/test:compile "ensime generate"
  sbt_task tortoiseJS/test:compile
  sbt_test tortoiseJVM fast
  sbt_test tortoiseJVM language
  sbt_test tortoiseJS test
  sbt_test tortoiseJVM crawl
  sbt_test netLogoWeb test
  sbt_task tortoiseCore/scalastyle
  sbt_task tortoiseJVM/scalastyle
  sbt_task tortoiseJS/scalastyle
  sbt_task macrosCore/scalastyle
  sbt_task tortoiseJVM/depend
  echo "****** all done!"
else
  $@
fi
