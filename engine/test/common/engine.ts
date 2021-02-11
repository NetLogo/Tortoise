/**
 * Impl of Tortoise's test engine implemetned in Node
 */

import { VM } from "vm2";
import fs from "fs";
import os from "os";
// const { NodeVm } = require("vm2");
// const fs = require("fs");
// import "../../dist/tortoise-engine";
// import "../../dist/tortoise-compiler";
// let tortoise_engine = fs.readFileSync("./dist/tortoise-engine.js", {
//   encoding: "utf-8",
// });
// let init = fs.readFileSync("./script-0.js", { encoding: "utf-8" });
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
  vm: VM;
  private constructor() {
    this.vm = new VM({
      sandbox: {
        tortoise_require: globalThis.tortoise_require,
      },
      //   require: {
      //     external: {
      //       transitive: true,
      //       modules: ["*"]
      //     },
      //     context: "sandbox",
      //     builtin: ["*"],
      //   },
      //   wrapper: "none",
    });
    // this.vm.run("let window = { }");

    // this.vm.run(tortoise_engine);
    // this.vm.runFile("./dist/tortoise-engine.js");
    // const lines = fs.readFileSync('./script-0.js', {encoding: 'utf-8'}).split(os.EOL);
    // lines.forEach((code, n) => {
    //   try {

    //     this.vm.run(code);
    //   }
    //   catch (e)  {
    //     console.error(`error on line: ${n}: ${code}. ${e}`);
    //   }
    // })
    // this.vm.runFile("./script-0.js");
    // this.vm.run("const tortoise_require = globalThis.tortoise_require");

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
    fs.writeFileSync(`./errlog/eval-script-${counter++}.js`, src);
    return this.vm.run(src);
  }
  run(src: string): [string, string] {
    fs.writeFileSync(`./errlog/run-script-${counter++}.js`, src);
    const runResult = this.vm.run(`${src}`);

    return [
      // this.vm.run(`(function() {${src}})()`).toString(),
      runResult ? runResult.toString() : "",
      JSON.stringify(this.vm.run("Updater.collectUpdates()")),
    ];
  }
  evalAndDump(src: string): string {
    let result = this.vm.run(src);
    return this.vm.run(`workspace.dump(${result})`);
  }
}

// module.exports.Engine = Engine;
export default Engine;
