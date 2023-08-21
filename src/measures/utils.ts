import type { Protocol } from "puppeteer";
import { BASE_URL } from "./consts";
import { Version } from "./types";

export function getUrl(version: Version, particles: number) {
  return `${BASE_URL}${version}/?particles=${particles}`;
}

export function waitFor(ms: number) {
  return new Promise((_) => setTimeout(_, ms));
}

export function roundNumber(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateCPUPercentage(cpu: number) {
  return roundNumber(cpu * 100);
}

export function calculateFPS(results: number[]) {
  const sum = results.reduce((acc, fps) => acc + fps, 0);
  return roundNumber(sum / results.length);
}

export function getActiveTime(
  metrics: Protocol.Performance.GetMetricsResponse
): {
  timestamp: number;
  activeTime: number;
  } {
  return {
    timestamp: metrics.metrics.find((metric) => metric.name === "Timestamp")?.value || 0,
    activeTime: metrics.metrics.find((metric) => metric.name === "TaskDuration")?.value || 0,
  };
}
