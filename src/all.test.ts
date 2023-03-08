import { addAttach } from "jest-html-reporters/helper";
import { createChart } from "./chart/utils";

import { measureCPU } from "./measures/cpu";
import { measureFPS } from "./measures/fps";
import { measureMemory } from "./measures/memory";

describe("js-wasm-performance", () => {
  describe.each([
    ["cpu", measureCPU],
    ["fps", measureFPS],
    ["memory", measureMemory],
  ])("%s", (measureName, measure) => {
    it.each(["js", "wasm"] as const)(
      "%s",
      async (version) => {
        const csv = await measure(version);

        const chartName = await createChart({measureName, version, csv});

        addAttach({
          attach: `${chartName}`,
          description: `${measureName} dependency on number of particles for ${version}`,
        });

        expect(csv).toBeDefined();
      }
    );
  });
});
