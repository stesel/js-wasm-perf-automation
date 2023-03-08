import puppeteer from "puppeteer";
import * as fs from "fs/promises";
import { getUrl, waitFor } from "./utils";
import {
  BYTES_IN_KBYTE,
  MAX_PARTICLES,
  MEMORY_TIMEOUT,
  MIN_PARTICLES,
  PARTICLES_STEP,
} from "./consts";

export async function measureMemory(version: "js" | "wasm") {
  let csv = "Particles,Used(kB),Total(kB)\n";

  async function runBrowser() {
    for (
      let particles = MIN_PARTICLES;
      particles <= MAX_PARTICLES;
      particles += PARTICLES_STEP
    ) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(getUrl(version, particles));
      await waitFor(MEMORY_TIMEOUT);
      const { JSHeapUsedSize = 0, JSHeapTotalSize = 0 } = await page.metrics();
      csv += `${particles},${Math.round(
        JSHeapUsedSize / BYTES_IN_KBYTE
      )},${Math.round(JSHeapTotalSize / BYTES_IN_KBYTE)}\n`;
      await browser.close();
    }
  }

  await runBrowser();

  await fs.mkdir("./dist", {}).catch(() => {});
  await fs.writeFile(`./dist/${version}-memory.csv`, csv);

  return csv;
}
