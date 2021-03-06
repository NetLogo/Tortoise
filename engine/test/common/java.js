const java = require("java");

java.classpath.push("jars/CompilerJVM-assembly-1.0.jar");
java.classpath.push("jars/netlogoheadless-6.2.0-50a3068-tests.jar");
const nlogoCore = "org.nlogo.core";
const nlogoHeadlessTest = "org.nlogo.headless.test";
const _HeadlessWorkspace = java.import("org.nlogo.headless.HeadlessWorkspace");
const _Compiler = java.import("org.nlogo.tortoise.compiler.Compiler");
const _WidgetCompiler = java.import(
  "org.nlogo.tortoise.compiler.WidgetCompiler"
);
const _Command = java.import(`${nlogoHeadlessTest}.Command`);
const _Reporter = java.import(`${nlogoHeadlessTest}.Reporter`);
const _Success = java.import(`${nlogoHeadlessTest}.Success`);
const _RuntimeError = java.import(`${nlogoHeadlessTest}.RuntimeError`);
const _TestMode = java.import(`${nlogoHeadlessTest}.TestMode`);
const _Model = java.import(`${nlogoCore}.Model`);
const _Dump = java.import(`org.nlogo.api.Dump`);
const _nvmCompilerFlags = java.import("org.nlogo.nvm.CompilerFlags");


const t = {
  java,
  nlogoCore,
  nlogoHeadlessTest,
  _HeadlessWorkspace,
  _nvmCompilerFlags,
  _Model
};

globalThis = {...globalThis, ...t};
global = {...global, ...t};

module.exports = t;