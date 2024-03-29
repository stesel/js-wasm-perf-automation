import { addAttach } from "jest-html-reporters/helper";
import { createChart } from "./chart/createChart";

import { measureCPU } from "./measures/cpu";
import { measureFPS } from "./measures/fps";
import { measureMemory } from "./measures/memory";

describe("js-wasm-performance", () => {
  describe.each([
    ["cpu", measureCPU],
    ["fps", measureFPS],
    ["memory", measureMemory],
  ])("%s", (measureName, measure) => {
    it.each(["js", "wasm", "webgpu"] as const)("%s", async (version) => {
      const measurement = await measure(version);

      const chartName = await createChart(measurement);

      addAttach({
        attach: `${chartName}`,
        description: `${measureName} dependency on number of particles for ${version}`,
      });

      expect(measurement).toBeDefined();
    });
  });
});
