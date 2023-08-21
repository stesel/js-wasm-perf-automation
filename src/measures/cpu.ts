import puppeteer from "puppeteer";
import {
  CPU_TIMEOUT,
  HEADLESS_MODE,
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
import { Measurement, Metric, Version } from "./types";

export async function measureCPU(version: Version): Promise<Measurement> {
  const metrics: Metric[] = [];

  for (
    let particles = MIN_PARTICLES;
    particles <= MAX_PARTICLES;
    particles += PARTICLES_STEP
  ) {
    const browser = await puppeteer.launch({ headless: HEADLESS_MODE });
    const page = await browser.newPage();
    await page.goto(getUrl(version, particles));

    const cdp = await page.target().createCDPSession();

    await cdp.send("Performance.enable", {
      timeDomain: "timeTicks",
    });

    const { timestamp: initialTimestamp, activeTime: initialActiveTime } =
      getActiveTime(await cdp.send("Performance.getMetrics"));

    await waitFor(CPU_TIMEOUT);

    const { timestamp, activeTime } = getActiveTime(
      await cdp.send("Performance.getMetrics")
    );

    const cpu = calculateCPUPercentage(
      Math.min(
        (activeTime - initialActiveTime) / (timestamp - initialTimestamp),
        1
      )
    );

    metrics.push({ particles: particles, value: cpu });

    await browser.close();
  }

  return {
    version: version,
    name: "cpu",
    units: "CPU(%)",
    metrics: metrics,
  };
}
