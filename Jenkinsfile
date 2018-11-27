#!/usr/bin/env groovy

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
        sh "./sbt-graal-home.sh netLogoWeb/clean compilerCore/clean compilerJVM/clean compilerJS/clean macrosCore/clean engine/clean"
      }
    }

    stage('LintAndStyle') {
      steps {
        sh "./sbt-graal-home.sh netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle"
        sh "cd engine; yarn install; grunt coffeelint"
      }
    }

    stage('TestJVM') {
      steps {
        sh 'git submodule update --init --recursive'
        sh "./sbt-graal-home.sh compilerJVM/test:compile"
        sh "./sbt-graal-home.sh compilerJVM/test:test"
        sh "./sbt-graal-home.sh compilerJVM/depend"
        junit 'compiler/jvm/target/test-reports/*.xml'
      }
    }

    stage('TestJS') {
      steps {
        sh "./sbt-graal-home.sh compilerJS/test:compile"
        sh "./sbt-graal-home.sh compilerJS/test:test"
        junit 'compiler/js/target/test-reports/*.xml'
      }
    }

    stage('NetLogoWeb') {
      steps {
        sh "./sbt-graal-home.sh netLogoWeb/test:compile"
        sh "./sbt-graal-home.sh netLogoWeb/test:fast"
        sh "./sbt-graal-home.sh netLogoWeb/test:language"
        sh "./sbt-graal-home.sh \"netLogoWeb/testOnly *ModelDumpTests\""
        sh "./sbt-graal-home.sh \"netLogoWeb/testOnly *TestModels -- -z 0 -z 1\""
        sh "./sbt-graal-home.sh \"netLogoWeb/testOnly *TestModels -- -z 2\""
        sh "./sbt-graal-home.sh \"netLogoWeb/testOnly *TestModels -- -z 3\""
        sh "./sbt-graal-home.sh \"netLogoWeb/testOnly *TestModels -- -z 4\""
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
