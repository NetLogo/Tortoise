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
        sh "./sbt netLogoWeb/clean compilerCore/clean compilerJVM/clean compilerJS/clean macrosCore/clean engine/clean"
      }
    }

    stage('LintAndStyle') {
      steps {
        sh "./sbt netLogoWeb/scalastyle compilerCore/scalastyle compilerJVM/scalastyle compilerJS/scalastyle macrosCore/scalastyle"
        sh "cd engine; yarn install; grunt coffeelint"
      }
    }

    stage('TestJVM') {
      steps {
        sh 'git submodule update --init --recursive'
        sh "./sbt compilerJVM/test:compile"
        sh "./sbt compilerJVM/test:test"
        sh "./sbt compilerJVM/depend"
        junit 'compiler/jvm/target/test-reports/*.xml'
      }
    }

    stage('TestJS') {
      steps {
        sh "./sbt compilerJS/test:compile"
        sh "./sbt compilerJS/test:test"
        junit 'compiler/js/target/test-reports/*.xml'
      }
    }

    stage('NetLogoWeb') {
      steps {
        sh "./sbt netLogoWeb/test:compile"
        sh "./sbt netLogoWeb/test:fast"
        sh "./sbt netLogoWeb/test:language"
        sh "./sbt netLogoWeb/test:crawl"
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
