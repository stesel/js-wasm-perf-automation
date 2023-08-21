import puppeteer from "puppeteer";
import { getUrl, waitFor } from "./utils";
import {
  BYTES_IN_KBYTE,
  HEADLESS_MODE,
  MAX_PARTICLES,
  MEMORY_TIMEOUT,
  MIN_PARTICLES,
  PARTICLES_STEP,
} from "./consts";
import { Metric, Measurement, Version } from "./types";

export async function measureMemory(version: Version): Promise<Measurement> {
  const metrics: Metric[] = [];

  for (
    let particles = MIN_PARTICLES;
    particles <= MAX_PARTICLES;
    particles += PARTICLES_STEP
  ) {
    const browser = await puppeteer.launch({ headless: HEADLESS_MODE });
    const page = await browser.newPage();
    await page.goto(getUrl(version, particles));
    await waitFor(MEMORY_TIMEOUT);
    const { JSHeapUsedSize = 0 } = await page.metrics();

    metrics.push({
      particles: particles,
      value: Math.round(JSHeapUsedSize / BYTES_IN_KBYTE),
    });

    await browser.close();
  }

  return {
    version: version,
    name: "memory",
    units: "HEAP(kB)",
    metrics: metrics,
  };
}
