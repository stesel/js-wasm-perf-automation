import { mkdir, writeFile } from "fs/promises";

import { Measurement } from "../measures/types";

export async function writeToCSV(measurement: Measurement) {
  let csv = `Particles,${measurement.units}\n`;

  measurement.metrics.forEach(metric => {
    csv += `${metric.particles},${metric.value}\n`;;
  });

  await mkdir("./dist", {}).catch(() => {});
  await writeFile(`./dist/${measurement.name}-${measurement.version}.csv`, csv);
}
