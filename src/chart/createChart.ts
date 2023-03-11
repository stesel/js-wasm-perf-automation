import { createCanvas } from "canvas";
import Chart from "chart.js/auto";
import { writeFile } from "fs/promises";
import { Measurement } from "../measures/types";

interface ChartData {
  labels: number[];
  data: number[];
}

export async function createChart({
  version,
  name,
  units,
  metrics,
}: Measurement) {
  const chartData = metrics.reduce<ChartData>((result, metric) => {
    result.labels.push(metric.particles);
    result.data.push(metric.value);
    return result;
  }, { labels: [], data: [] });

  const labelX = "Particles";
  const labelY = units;

  const chart = new Chart(
    createCanvas(1500, 600, "svg").getContext(
      "2d"
    ) as unknown as CanvasRenderingContext2D,
    {
      type: "line",
      options: {
        animation: false,
        scales: {
          x: {
            title: {
              display: true,
              text: labelX,
            },
          },
          y: {
            title: {
              display: true,
              text: labelY,
            },
          },
        },
      },
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: version.toUpperCase(),
            data: chartData.data,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      },
    }
  );

  const chartName = `${name}-${version}-${Date.now()}.svg`;

  await writeFile(
    `./html-report/${chartName}`,
    chart.toBase64Image().replace("data:image/png;base64,", ""),
    { encoding: "base64" }
  );

  return chartName;
}
