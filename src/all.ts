import { measureCPU } from "./measures/cpu";
import { measureFPS } from "./measures/fps";
import { measureMemory } from "./measures/memory";

const measures = [measureCPU, measureFPS, measureMemory] as const;
const versions = ["js", "wasm"] as const;

measures.forEach((measure) => {
  versions.forEach((version) => {
    measure(version);
  });
});
