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

    stage('ScalaStyle') {
      steps {
        sh "./sbt compilerCore/scalastyle"
        sh "./sbt compilerJVM/scalastyle"
        sh "./sbt compilerJS/scalastyle"
        sh "./sbt macrosCore/scalastyle"
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
