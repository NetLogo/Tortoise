/**
 * Impl of Tortoise's test engine implemetned in Node
 */

// import fs from "fs";
// import os from "os";
import vm from "vm";
// const fs = require("fs");
// import "../../dist/tortoise-engine";
// import "../../dist/tortoise-compiler";
// const vm = require("vm");
// require("../../dist/tortoise-engine");
// require("../../dist/tortoise-compiler");
declare global {
  var tortoise_require: any;
}

let counter = 0;
// to make the tests run
// const window = {};

(async () => {
  // @ts-ignore
  await import("../../dist/tortoise-engine");
})();

// @ts-ignore
globalThis.window = {};

process.on("uncaughtException", (err) => {
  console.error("Asynchronous error caught.", err);
});

function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

class Engine {
  // vm: VM;
  nodeVm: vm.Context;
  private constructor() {
    this.nodeVm = vm.createContext({
      tortoise_require: globalThis.tortoise_require,
    });
    // this.vm = new VM({
    //   sandbox: {
    //     tortoise_require: globalThis.tortoise_require,
    //   },
    // });

    // this.vm.runFile("./script-0.js");
    // vm.runInContext(
    //   fs.readFileSync("./script-0.js", { encoding: "utf-8" }),
    //   this.nodeVm,
    //   "./script-0-.js"
    // );

    // this.context.tortoise = { ...globalThis.tortoise };
    // this.context.run(
    //   "tortoise_require = (mod) => this.tortoise[mod]",
    //   this.context
    // );

    // mimic setupTortoise
    // this.context.window = {};
    // this.context.javax = {};
    // this.vm.run(init);
  }

  static async init(): Promise<Engine> {
    // @ts-ignore
    while (!globalThis.tortoise) {
      console.log("waiting for tortoise");
      await sleep(100);
    }
    return new Engine();
  }
  eval(src: string): any {
    // fs.writeFileSync(`./errlog/eval-script-${counter++}.js`, src);
    // return this.vm.run(src);
    return vm.runInContext(src, this.nodeVm);
  }
  run(src: string): [string, string] {
    // fs.writeFileSync(`./errlog/run-script-${counter++}.js`, src);
    // const runResult = this.vm.run(`${src}`);
    const runResult = vm.runInContext(src, this.nodeVm);

    return [
      // this.vm.run(`(function() {${src}})()`).toString(),
      runResult ? runResult.toString() : "",
      // JSON.stringify(this.vm.run("Updater.collectUpdates()")),
      JSON.stringify(vm.runInContext("Updater.collectUpdates()", this.nodeVm)),
    ];
  }
  evalAndDump(src: string): string {
    // let result = this.vm.run(src);
    // return this.vm.run(`workspace.dump(${result})`);
    let result = vm.runInContext(src, this.nodeVm);
    return vm.runInContext(`workspace.dump(${result})`, this.nodeVm);
  }
}

// module.exports.Engine = Engine;
export default Engine;
