// const { Mt } = require("../../rust/pkg/netlogo_rs");
import { Mt } from "../../rust/pkg/netlogo_rs";

class Random {
  // rng: typeof Mt;
  rng: Mt;
  constructor(seed?: number | Mt) {
    if (seed instanceof Mt) {
      this.rng = seed;
    } else {
      this.rng = new Mt(seed);
    }
  }

  save = (): string => this.rng.save();

  load = (s: string) => this.rng.load(s);

  nextGaussian = (): number => this.rng.next_gaussian();

  nextInt = (limit: number): number => this.rng.next_int_range(limit);

  nextLong = (limit: number): number => this.rng.next_long_range(limit);

  nextDouble = (): number => this.rng.next_double();

  setSeed = (seed: number) => this.rng.set_seed(seed);

  clone = (): Random => new Random(this.rng.clone());

  /**
   * Free internal rng. Useful when used as a one-time clone.
   *
   * Maybe impl check on freeing later. For now this is good enough.
   */
  free = () => this.rng.free();
}

const random = new Random(0);
const auxRandom = new Random(0);
export { random, auxRandom, Random };
// module.exports = Random;
// module.exports.random = new Random(0);
// module.exports.auxRandom = new Random(0);
