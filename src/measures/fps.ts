import puppeteer from "puppeteer";
import { calculateFPS, getUrl, waitFor } from "./utils";
import {
  FPS_COUNT,
  FPS_TIMEOUT,
  MAX_PARTICLES,
  MIN_PARTICLES,
  PARTICLES_STEP,
} from "./consts";
import { Measurement, Metric, Version } from "./types";

declare global {
  interface Window {
    __FPS__?: number;
  }
}

export async function measureFPS(version: Version): Promise<Measurement> {
  const metrics: Metric[] = [];

  for (
    let particles = MIN_PARTICLES;
    particles <= MAX_PARTICLES;
    particles += PARTICLES_STEP
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(getUrl(version, particles));

    const results: number[] = [];

    while (results.length < FPS_COUNT) {
      await waitFor(FPS_TIMEOUT);
      const fps = await page.evaluate(() => window.__FPS__ || 0);
      results.push(fps);
    }

    metrics.push({ particles, value: calculateFPS(results) });

    await browser.close();
  }

  return {
    version: version,
    name: "fps",
    units: "FPS",
    metrics: metrics,
  };
}
