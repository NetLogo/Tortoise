import { describe, it } from "mocha";
import DockingFixture, { Command } from "./common/fixture";

describe("random", () => {
  it("should work the same way", async () => {
    const f = await DockingFixture.init("fixture");

    f.runCommand(new Command("random-seed 450"));
    debugger;
    f.compare("random 10000");
  });
});
