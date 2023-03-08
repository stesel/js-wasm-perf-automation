import puppeteer from "puppeteer";
import * as fs from "fs/promises";
import {
  CPU_TIMEOUT,
  MAX_PARTICLES,
  MIN_PARTICLES,
  PARTICLES_STEP,
} from "./consts";
import {
  calculateCPUPercentage,
  getActiveTime,
  getUrl,
  waitFor,
} from "./utils";

export async function measureCPU(version: "js" | "wasm") {
  let csv = "Particles,CPU(%)\n";

  async function runBrowser() {
    for (
      let particles = MIN_PARTICLES;
      particles <= MAX_PARTICLES;
      particles += PARTICLES_STEP
    ) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(getUrl(version, particles));

      const cdp = await page.target().createCDPSession();

      await cdp.send("Performance.enable", {
        timeDomain: "timeTicks",
      });

      const { timestamp: initialTimestamp } = getActiveTime(
        await cdp.send("Performance.getMetrics")
      );

      await waitFor(CPU_TIMEOUT);

      const { timestamp, activeTime } = getActiveTime(
        await cdp.send("Performance.getMetrics")
      );

      const cpu = calculateCPUPercentage(
        Math.min(activeTime / (timestamp - initialTimestamp), 1)
      );

      csv += `${particles},${cpu}\n`;

      await browser.close();
    }
  }

  await runBrowser();

  await fs.mkdir("./dist", {}).catch(() => {});
  await fs.writeFile(`./dist/${version}-cpu.csv`, csv);

  return csv;
}
