// import { Mt } from "../../rust/pkg/netlogo_rs";

// import { Mt } from "../wasm-bootstrap";
// const { Mt } = await import("../../rust/pkg/netlogo_rs");

import { random, auxRandom } from "../shim/random";
import type { Random } from "../shim/random";

const mainRNG = random;
const auxRNG = auxRandom;
export default class RNG {
  currentRNG: Random;
  mainRNG: Random;

  constructor() {
    this.mainRNG = random;
    this.currentRNG = this.mainRNG;
    console.log(`mainRNG: ${mainRNG.rng.id}, auxRNG: ${auxRNG.rng.id}`);
  }

  exportState = (): string => this.mainRNG.save();

  importState = (state: string) => this.mainRNG.load(state);

  nextGaussian = (): number => this.currentRNG.nextGaussian();

  nextInt = (limit: number): number => this.currentRNG.nextInt(limit);

  nextLong = (limit: number): number => this.currentRNG.nextLong(limit);

  nextDouble = (): number => this.currentRNG.nextDouble();

  setSeed = (seed: number) => {
    console.log(`rng ts setseed: ${seed}`);
    this.currentRNG.setSeed(seed);
  };

  withAux<F extends () => T, T>(fn: F): T {
    return fn.call({ currentRNG: auxRNG });
  }

  withClone<F extends () => T, T>(fn: F): T {
    const clone = mainRNG.clone();
    const result = fn.call({ currentRNG: clone });

    clone.free();

    return result;
  }
}
