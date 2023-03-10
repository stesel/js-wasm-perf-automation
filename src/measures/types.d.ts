export type Version = "js" | "wasm";
export type MeasureName = "cpu" | "fps" | "memory";
export type MeasureUnits = "CPU(%)" | "FPS" | "HEAP(kB)";

export interface Metric {
  particles: number;
  value: number;
}

export interface Measurement {
  version: Version;
  name: MeasureName;
  units: MeasureUnits;
  metrics: Metric[];
}
