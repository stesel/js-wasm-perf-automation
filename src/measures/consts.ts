import { BrowserLaunchArgumentOptions } from "puppeteer";

export const BASE_URL = "https://stesel.github.io/wasm-canvas-perf/";

export const HEADLESS_MODE: BrowserLaunchArgumentOptions["headless"] = process
  .env.GITHUB_ACTIONS
  ? "new"
  : false;

export const CPU_TIMEOUT = 5000;
export const CPU_COUNT = 5;

export const FPS_TIMEOUT = 1000;
export const FPS_COUNT = 5;
export const FPS_KEY = "__FPS__";

export const MEMORY_TIMEOUT = 5000;

export const BYTES_IN_KBYTE = 1024;

export const MIN_PARTICLES = 100;
export const MAX_PARTICLES = 30000;
export const PARTICLES_STEP = 100;
