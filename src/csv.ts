import { writeToCSV } from "./csv/writeToCSV";
import { measureCPU } from "./measures/cpu";
import { measureFPS } from "./measures/fps";
import { measureMemory } from "./measures/memory";
import { Version } from "./measures/types";

[measureCPU, measureFPS, measureMemory].forEach((measure) => {
  (["js", "wasm"] as Version[]).forEach(async (version) => {
    const measurement = await measure(version);
    await writeToCSV(measurement);
  });
});
