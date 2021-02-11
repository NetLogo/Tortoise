import { expect } from "chai";
import java from "java";
import Engine from "./engine";

// const { expect } = require("chai");
// const java = require("java");
// const { Engine } = require("./engine");

java.classpath.push("jars/CompilerJVM-assembly-1.0.jar");
java.classpath.push("jars/netlogoheadless-6.2.0-50a3068-tests.jar");

const nlogoCore = "org.nlogo.core";
const nlogoHeadlessTest = "org.nlogo.headless.test";

const _HeadlessWorkspace = java.import("org.nlogo.headless.HeadlessWorkspace");
const _Fixture = java.import(`org.nlogo.headless.lang.Fixture`);
const _ActionBuffer = java.import(`org.nlogo.api.ActionBuffer`);

export class Fixture {
  workspace: any;
  drawingActionBuffer: any;
  constructor(name: string) {
    this.workspace = _HeadlessWorkspace.newInstanceSync();
    this.workspace.silent_$eqSync(true);
    this.drawingActionBuffer = _ActionBuffer(
      this.workspace.drawingActionBrokerSync()
    );
    this.drawingActionBuffer.activateSync();
  }
  declare(model: any): any {
    this.workspace.openModelSync(model, false);
  }
  declareWithCode(code = ""): any {
    return Model(code);
  }
}

const _Compiler = java.import("org.nlogo.tortoise.compiler.Compiler");
const _WidgetCompiler = java.import(
  "org.nlogo.tortoise.compiler.WidgetCompiler"
);

const _CompilerFlags = java.import("org.nlogo.tortoise.compiler.CompilerFlags");

const _Optimizations = java.import("org.nlogo.nvm.Optimizations");
const _OCommand = _Optimizations.Command$();
const _OReporter = _Optimizations.Reporter$();

const _Command = java.import(`${nlogoHeadlessTest}.Command`);
const _Reporter = java.import(`${nlogoHeadlessTest}.Reporter`);
const _Success = java.import(`${nlogoHeadlessTest}.Success`);
const _RuntimeError = java.import(`${nlogoHeadlessTest}.RuntimeError`);
const _TestMode = java.import(`${nlogoHeadlessTest}.TestMode`);
const _Model = java.import(`${nlogoCore}.Model`);
const _Dump = java.import(`org.nlogo.api.Dump`);
const _Mirrorables = java.import(`org.nlogo.mirror.Mirrorables`);
const _Mirroring = java.import(`org.nlogo.mirror.Mirroring`);
const _JsonSerializer = java.import(
  "org.nlogo.tortoise.compiler.json.JsonSerializer"
);
const _NormalMode = java.import(`${nlogoHeadlessTest}.NormalMode`);

function Model(code = "") {
  return _Model(
    code || _Model.apply$default$1Sync(),
    _Model.apply$default$2Sync(),
    _Model.apply$default$3Sync(),
    _Model.apply$default$4Sync(),
    _Model.apply$default$5Sync(),
    _Model.apply$default$6Sync(),
    _Model.apply$default$7Sync()
  );
}

const _AgentKind = java.import(`${nlogoCore}.AgentKind`);
enum AgentKind {
  Link = _AgentKind.Link$,
  Observer = _AgentKind.Observer$,
  Patch = _AgentKind.Patch$,
  Turtle = _AgentKind.Turtle$,
}

export class Command {
  kind: AgentKind;
  result: any;
  command: string;
  constructor(command: string, kind?: AgentKind, result?: any) {
    this.command = command;
    this.kind = kind || AgentKind.Observer;
    this.result = result || _Success("");
  }
}

const _View = java.import(`${nlogoCore}.View`);
const _nvmCompilerFlags = java.import("org.nlogo.nvm.CompilerFlags");
const _Tuple2 = java.import("scala.Tuple2");
const _MutSeq = java.import("scala.collection.mutable.Seq");
const _Seq = java.import("scala.collection.immutable.Seq");
const _immutableMap = java.import("scala.collection.immutable.Map");

class TestFailedError extends Error {
  constructor(msg?: string | Error) {
    if (msg instanceof Error) {
      super(msg.message);
    } else {
      super(msg);
    }
  }
}

function reportTestError(msg: string | Error) {
  throw new TestFailedError(msg);
}

class DockingFixture extends Fixture {
  state: any;
  private tortoiseCompiler: any;
  opened: boolean;
  netLogoCode: string;
  implementedOptimizations: any; //[any, string][];
  defaultView: any;
  compilerFlags: any;

  engine: Engine;

  private constructor(name: string, engine: Engine) {
    super(name);
    this.tortoiseCompiler = _Compiler();
    this.state = _immutableMap.EmptyMap$();
    this.opened = false;
    this.netLogoCode = "";
    this.implementedOptimizations = (function (): any {
      const commands = [
        "CroFast",
        "CrtFast",
        "Fd1",
        "FdLessThan1",
        "HatchFast",
        "SproutFast",
      ];
      const reporters = [
        "AnyOther",
        "AnyOtherWith",
        "AnyWith1",
        "AnyWith2",
        "AnyWith3",
        "AnyWith4",
        "AnyWith5",
        "CountOther",
        "CountOtherWith",
        "CountWith",
        "HasEqual",
        "HasGreaterThan",
        "HasLessThan",
        "HasNotEqual",
        "Nsum",
        "Nsum4",
        "OneOfWith",
        "OtherWith",
        "PatchAt",
        "PatchVariableDouble",
        "RandomConst",
        "TurtleVariableDouble",
        "With",
        "WithOther",
        // "Constants",
      ];

      let commandSeq: [any, string][] = commands.map((name) => [
        _OCommand,
        `org.nlogo.compile.middle.optimize.${name}`,
      ]);
      let reporterSeq: [any, string][] = reporters.map((name) => [
        _OReporter,
        `org.nlogo.compile.middle.optimize.${name}`,
      ]);
      reporterSeq.push([_OReporter, `org.nlogo.compile.optimize.Constants`]);

      const ops = commandSeq.concat(reporterSeq);
      const scalaSeq = _MutSeq.emptySync();
      ops.forEach(([type, name]) => {
        scalaSeq.$plus$eqSync(_Tuple2(type, name));
      });

      return scalaSeq.toIndexedSeqSync();
    })();
    this.engine = engine;

    this.workspace.flags_$eqSync(
      _nvmCompilerFlags(
        true, // foldConstants
        false, // useGenerator
        true, // useOptimizer
        this.implementedOptimizations // optimizations
      )
    );

    let runMonitors = `
    function() {
      widgets.forEach(function(w) {
        if (w.type == "monitor") {
          try { w.reporter(); }
          catch (error) { } // Shhh, no errors here.  What would give you that impression?  --JAB (2/22/16)
        }
      });
    }`;

    let de = _CompilerFlags.DefaultSync();
    this.compilerFlags = de.copySync(
      de.copy$default$1Sync(),
      runMonitors,
      de.copy$default$3Sync(),
      de.copy$default$4Sync()
    );

    this.defaultView = _View.squareSync(0);
    // this.engine = new Engine();
  }

  static async init(name: string): Promise<DockingFixture> {
    const engine = await Engine.init();
    return new DockingFixture(name, engine);
  }

  id<T>(a: T): T {
    return a;
  }

  get mirrorables() {
    return _Mirrorables.allMirrorablesSync(this.workspace.worldSync());
  }

  compare(reporter: string) {
    this.compareMunged(reporter, this.id, this.id);
  }
  compareMunged(
    reporter: string,
    mungeExpected: (s: string) => string,
    mungeActual: (s: string) => string
  ) {
    let result;
    try {
      let expected: string;
      let obj = this.workspace.reportSync(reporter);
      // This is to prevent headless from throwing error. I believe it doesn't throw in Scala/Java b/c definition in here https://github.com/NetLogo/NetLogo/blob/hexy/netlogo-core/src/main/api/Dump.scala#L33
      // will treat obj as Java Object. However, when it's converted to JS and back again to Java, it's treated as Integer, which gets passed to super class, which throws error on Integer. https://github.com/NetLogo/NetLogo/blob/1dc4331cfcacc3fcdfa8beb97ca5e58e018c040f/parser-core/src/main/core/Dump.scala#L18
      if (typeof obj === "number") {
        expected = obj.toString();
      } else {
        expected = _Dump.logoObjectSync(obj);
      }
      let munged: string = mungeExpected(expected);
      result = _Success(munged);
    } catch (e) {
      result = _RuntimeError(e);
    }
    this.runReporterMunged(
      _Reporter(reporter, result),
      _NormalMode,
      mungeActual
    );
  }

  runReporter(reporter: any, mode: any = {}) {
    this.runReporterMunged(reporter, this.id, this.id);
  }

  runReporterMunged(
    reporter: any,
    mode: any,
    mungeActual: (s: string) => string
  ) {
    debugger;
    if (!this.opened) this.declare(Model());
    this.netLogoCode += `${reporter.reporterSync()}`;
    const compiledJS =
      "var letVars = { };" +
      this.tortoiseCompiler.compileReporterSync(
        reporter.reporterSync(),
        this.workspace.proceduresSync(),
        this.workspace.worldSync().programSync(),
        this.compilerFlags
      );
    // Scala's enum match
    let result = reporter.resultSync();
    let variant: string = result.productPrefixSync();
    if (variant === "Success") {
      let expected = result.productElementSync(0);
      expect(mungeActual(this.engine.evalAndDump(compiledJS))).to.equal(
        expected
      );
    } else if (variant === "RuntimeError") {
      try {
        this.engine.eval(compiledJS);
        // throw new Error()
        reportTestError(`Error in headless, not in JS`);
      } catch (e) {
        if (e instanceof TestFailedError) {
          // let variant = e.cause.productPrefixSync();
          // if (variant === "TestFailedException") {
          // throw
          reportTestError(e);
        } else {
          // ignore
        }
      }
    } else {
      // throw
      reportTestError(
        "TestFailedException: UnexpectedError: " +
          variant +
          result.productElementSync(0)
      );
    }
  }

  viewResult(reporter: string) {
    console.log(
      `[View Result] ${_Dump.logoObjectSync(
        this.workspace.reportSync(reporter)
      )}`
    );
  }

  runDocked(
    nldOp: (workspace: any) => void,
    nlwOp: (e: Engine) => [string, string]
  ) {
    if (!this.opened) this.declare(Model());
    this.drawingActionBuffer.clearSync();
    let headlessException: string | null = null;
    try {
      nldOp(this.workspace);
    } catch (e) {
      headlessException = e.cause.getMessageSync() || "";
    }
    let result = _Mirroring.diffsSync(this.state, this.mirrorables);
    this.state = result._1;
    let update = result._2;
    let expectedJson = `[${_JsonSerializer.serializeWithViewUpdatesSync(
      update,
      this.drawingActionBuffer.grabSync()
    )}]`;
    let expectedOutput = this.workspace.outputAreaBufferSync().toStringSync();
    let jsException = null;
    let actualOutput = "",
      actualJson = "";
    try {
      [actualOutput, actualJson] = nlwOp(this.engine);
    } catch (e) {
      if (!headlessException) {
        reportTestError(e.stack);
        jsException = e;
      }
    }
    if (headlessException && !jsException) {
      // maybe fail fast here
      // throw new Error(`Exception in headless but not in JS: ${headlessException}`);
      reportTestError(
        `Exception in headless but not in JS: ${headlessException}`
      );
    } else if (!headlessException && jsException) {
      reportTestError(`Exception in JS but not in headless: ${jsException}`);
    } else if (!this.errorMessagesMatch(headlessException, jsException)) {
      reportTestError(
        `Exception in JS was "${jsException}", but in headless was "${headlessException}"`
      );
    } else {
      expect(expectedOutput).to.deep.equal(
        this.engine.eval("world._getOutput()")
      );
      const removeB64 = (str: string) =>
        str.replace(/`("imageBase64":\s*").*?"/g, "$1");
      const [expectedModel, actualModel] = this.updatedJsonModels(
        removeB64(expectedJson),
        removeB64(actualJson)
      );
      const headlessRNGState: string = this.workspace
        .worldSync()
        .mainRNGSync()
        .saveSync();
      const engineRNGState: string = this.engine.eval("Random.save();");
      expect(engineRNGState).to.equal(headlessRNGState, "divergent RNG state");

      expect(JSON.parse(actualModel)).to.deep.equal(JSON.parse(expectedModel));
    }
  }

  errorMessagesMatch(expected: string, actual: string): boolean {
    // NetLogo desktop prepends "Runtime error: " to some errors that happen at runtime, but not all.  I do not think
    // that information is particularly important, I think it's obvious when an error happens while the model is
    // running.  If it turns out other people really care about it, we can work to recreate the logic that desktop
    // uses to prepend the extra text. -Jeremy B November 2020

    // console.log(`expected: ${expected}\nactual: ${actual}`);
    return (
      expected == actual ||
      (expected.startsWith("Runtime error: ") &&
        expected.substring(15) == actual)
    );
  }

  runCommand(command: Command, mode: any = {}) {
    const logo = command.command;
    this.netLogoCode += `${logo}\n`;
    const compiledJS = `var letVars = { }; ${this.tortoiseCompiler.compileRawCommandsSync(
      logo,
      this.workspace.proceduresSync(),
      this.workspace.worldSync().programSync(),
      this.compilerFlags
    )}`;
    this.runDocked(
      // Remember to run commandSync! Sync is important, otherwise the Java code doesn't run immediately and RNG states get out of sync.
      (workspace) => workspace.commandSync(logo),
      (engine) => engine.run(compiledJS)
    );
  }

  updatedJsonModels(
    expectedJson: string,
    actualJson: string
  ): [string, string] {
    // TODO waiting for proper engine impl
    // /*
    // const processJSON = ((x: String) => Json.parse(x))// andThen render andThen compact
    this.engine.vm.sandbox.expectedUpdates = JSON.parse(expectedJson);
    this.engine.vm.sandbox.actualUpdates = JSON.parse(actualJson);
    // this.engine.eval(s"expectedUpdates = JSON.parse('${processJSON(expectedJson)}');")
    // this.engine.eval(s"actualUpdates   = JSON.parse('${processJSON(actualJson)}');")
    this.engine.eval("expectedUpdates = globalThis.expectedUpdates");
    this.engine.eval("actualUpdates = this.actualUpdates");
    this.engine.eval("expectedModel.updates(expectedUpdates);");
    this.engine.eval("actualModel.updates(actualUpdates);");
    const expectedModel = JSON.stringify(this.engine.eval("expectedModel"));
    const actualModel = JSON.stringify(this.engine.eval("actualModel"));
    return [expectedModel, actualModel];
    // */
  }

  declare(model: any) {
    expect(this.opened).to.be.false;
    super.declare(model);
    this.declareHelper(model);
  }
  declareHelper(model: any) {
    this.netLogoCode += `${model.codeSync()}\n`;
    const result = this.tortoiseCompiler.compileProceduresSync(
      model,
      this.compilerFlags
    );
    let js: string = this.tortoiseCompiler.toJSSync(result, this.compilerFlags);
    js = js.replace("../test/polyfills.js\n", "");
    this.engine.eval(js);
    this.engine.eval(
      `var widgets = ${_WidgetCompiler.formatWidgetsSync(
        result.widgetsSync()
      )};`
    );
    this.state = _immutableMap.EmptyMap$();
    this.engine.eval("expectedModel = new AgentModel;");
    this.engine.eval("actualModel = new AgentModel;");
    this.opened = true;
    this.runCommand(new Command("clear-all random-seed 0"));
  }

  testCommand(command: string, result: any = _Success("")) {
    this.runCommand(new Command(command, AgentKind.Observer, result));
  }

  testReporter(reporter: string, result: string) {
    this.runReporter(_Reporter(reporter, _Success(result)));
  }
}

export default DockingFixture;
