import { writeToCSV } from "./csv/writeToCSV";
import { measureCPU } from "./measures/cpu";
import { measureFPS } from "./measures/fps";
import { measureMemory } from "./measures/memory";
import { Version } from "./measures/types";

const measures = [measureCPU, measureFPS, measureMemory];
const versions: Version[] = ["js", "wasm", "webgpu"];

(async function () {
  for (const measure of measures) {
    for (const version of versions) {
      console.log(`${measure.name}, ${version} ...`);
      const measurement = await measure(version);
      await writeToCSV(measurement);
    }
  }
})();
