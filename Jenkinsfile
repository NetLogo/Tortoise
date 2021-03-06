#!/usr/bin/env groovy

def buildNumber = BUILD_NUMBER as int
if (buildNumber > 1) milestone(buildNumber - 1)
milestone(buildNumber)

pipeline {

  agent any

  stages {
    stage('Start') {
      steps {
        library 'netlogo-shared'
        sendNotifications('NetLogo/Tortoise', 'STARTED')
      }
    }

    stage('Clean') {
      steps {
        sh "./sbt.sh netLogoWeb/clean compilerCore/clean compilerJVM/clean compilerJS/clean macrosJVM/clean macrosJS/clean engine/clean"
      }
    }

    stage('LintAndStyle') {
      steps {
        sh "./sbt.sh netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle"
        sh "cd engine; yarn install; yarn run prebuild:prod"
      }
    }

    stage('TestJVM') {
      steps {
        sh 'git submodule update --init --recursive'
        sh "./sbt.sh compilerJVM/test:compile"
        sh "./sbt.sh compilerJVM/test:test"
        sh "./sbt.sh compilerJVM/depend"
        junit 'compiler/jvm/target/test-reports/*.xml'
      }
    }

    stage('TestJS') {
      steps {
        sh "./sbt.sh compilerJS/test:compile"
        sh "./sbt.sh compilerJS/test:test"
        junit 'compiler/js/target/test-reports/*.xml'
      }
    }

    stage('NetLogoWeb Tests') {
      steps {
        sh "./sbt.sh netLogoWeb/test:compile"
        sh "./sbt.sh \"netLogoWeb/test:runMain org.nlogo.tortoise.nlw.ExtensionsUpdater\""
        sh "./sbt.sh netLogoWeb/test:fast"
        sh "./sbt.sh netLogoWeb/test:language"
        junit 'netlogo-web/target/test-reports/*.xml'
      }
    }

    stage('NetLogoWeb Model Dumps') {
      steps {
        sh "./sbt.sh \"netLogoWeb/testOnly *ModelDumpTests\""
        junit 'netlogo-web/target/test-reports/*.xml'
      }
    }

    stage('NetLogoWeb Test Models') {
      steps {
        // Running all the `TestModels` tests at once causes Jenkins to bog down and take over 20 hours to run on GraalVM.
        // When run in smaller chunks things go fine.  As it's only for testing, this isn't a big concern.
        // -JMB 11/18.
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 0 -z 1\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 2\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 3\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 4\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 5\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 6\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 7\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 8\""
        sh "./sbt.sh \"netLogoWeb/testOnly *TestModels -- -z 9 \""
        junit 'netlogo-web/target/test-reports/*.xml'
      }
    }
  }

  post {
    failure {
      library 'netlogo-shared'
      sendNotifications('NetLogo/Tortoise', 'FAILURE')
    }
    success {
      library 'netlogo-shared'
      sendNotifications('NetLogo/Tortoise', 'SUCCESS')
    }
    unstable {
      library 'netlogo-shared'
      sendNotifications('NetLogo/Tortoise', 'UNSTABLE')
    }
  }
}
