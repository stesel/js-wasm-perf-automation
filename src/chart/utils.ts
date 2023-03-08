import { createCanvas } from "canvas";
import Chart from "chart.js/auto";
import { writeFile } from "fs/promises";

export async function createChart({
  measureName,
  version,
  csv,
}: {
  measureName: string;
  version: string;
  csv: string;
}) {
  const rows = csv.split("\n").map((row) => row.split(","));
  const labels = rows.slice(0, 1).at(0);
  const values = rows.slice(1).filter((value) => value.length > 1);

  const labelX = labels?.at(0);
  const labelY = labels?.at(1);

  const chart = new Chart(
    createCanvas(500, 500, "svg").getContext(
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
        labels: values.map((value) => value.at(0)),
        datasets: [
          {
            label: version.toUpperCase(),
            data: values.map((value) => value.at(1)),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
    }
  );

  const name = `${measureName}-${version}-${Date.now()}.svg`;

  await writeFile(
    `./html-report/${name}`,
    chart.toBase64Image().replace("data:image/png;base64,", ""),
    { encoding: "base64" }
  );

  return name;
}
