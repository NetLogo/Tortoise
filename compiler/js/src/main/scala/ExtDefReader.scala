// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

object ExtDefReader {
  // scalastyle:off line.size.limit
  def getAll(): Seq[String] = Seq(
    """{
      "name": "codap",
      "prims": [
        {
          "name":       "init",
          "actionName": "init",
          "argTypes":   ["command"]
        }, {
          "name":       "call",
          "actionName": "call",
          "argTypes":   ["wildcard"]
        }
      ]
    }""",
    """{
      "name": "http-req",
      "prims": [
        {
          "name":       "get",
          "actionName": "get",
          "argTypes":   ["string"],
          "returnType": "list"
        }, {
          "name":       "post",
          "actionName": "post",
          "argTypes":   ["string", "string", "string"],
          "returnType": "list"
        }
      ]
    }""",
    """{
      "name": "logging",
      "prims": [
        {
          "name":       "all-logs",
          "actionName": "all-logs",
          "argTypes":   [],
          "returnType": "list"
        }, {
          "name":       "clear-logs",
          "actionName": "clear-logs",
          "argTypes":   [],
          "returnType": "unit"
        }, {
          "name":       "log-globals",
          "actionName": "log-globals",
          "argTypes":   [{ "type": "string", "isRepeatable": true }],
          "returnType": "unit"
        }, {
          "name":       "log-message",
          "actionName": "log-message",
          "argTypes":   ["string"],
          "returnType": "unit"
        }
      ]
    }""",
    """{
      "name": "mini-csv",
      "prims": [
        {
          "name":       "from-string",
          "actionName": "from-string",
          "argTypes":   [{ "type": "string", "isRepeatable": true }],
          "defaultOption": 1,
          "returnType": "list"
        }, {
          "name":       "from-row",
          "actionName": "from-row",
          "argTypes":   [{ "type": "string", "isRepeatable": true }],
          "defaultOption": 1,
          "returnType": "list"
        }, {
          "name":       "to-string",
          "actionName": "to-string",
          "argTypes":   ["list", { "type": "string", "isRepeatable": true }],
          "defaultOption": 1,
          "returnType": "string"
        }, {
          "name":       "to-row",
          "actionName": "to-row",
          "argTypes":   ["list", { "type": "string", "isRepeatable": true }],
          "defaultOption": 1,
          "returnType": "string"
        }
      ]
    }""",
    """{
      "name": "nlmap",
      "prims": [
        {
          "name":       "from-list",
          "actionName": "from-list",
          "argTypes":   ["list"],
          "returnType": "wildcard"
        }, {
          "name":       "to-list",
          "actionName": "to-list",
          "argTypes":   ["wildcard"],
          "returnType": "list"
        }, {
          "name":       "is-map?",
          "actionName": "is-map?",
          "argTypes":   ["wildcard"],
          "returnType": "boolean"
        }, {
          "name":       "get",
          "actionName": "get",
          "argTypes":   ["wildcard", "string"],
          "returnType": "wildcard"
        }, {
          "name":       "remove",
          "actionName": "remove",
          "argTypes":   ["wildcard", "string"],
          "returnType": "wildcard"
        }, {
          "name":       "add",
          "actionName": "add",
          "argTypes":   ["wildcard", "string", "wildcard"],
          "returnType": "wildcard"
        }, {
          "name":       "to-json",
          "actionName": "to-json",
          "argTypes":   ["wildcard"],
          "returnType": "string"
        }, {
          "name":       "to-urlenc",
          "actionName": "to-urlenc",
          "argTypes":   ["wildcard"],
          "returnType": "string"
        }, {
          "name":       "from-json",
          "actionName": "from-json",
          "argTypes":   ["string"],
          "returnType": "wildcard"
        }
      ]
    }"""
  )
}
