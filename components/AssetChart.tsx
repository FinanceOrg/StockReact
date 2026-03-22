"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Transaction } from "@/types/domain";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

type AssetChartProps = {
  transactions: Transaction[];
  title?: string;
};

const whiteBackgroundPlugin: Plugin<"line"> = {
  id: "whiteBackground",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.width,
      chartArea.height,
    );
    ctx.restore();
  },
};

export default function AssetChart({
  transactions,
  title = "Net Cash Flow",
}: AssetChartProps) {
  // 1️⃣ Sort by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // 2️⃣ Unique dates
  const labels = Array.from(new Set(sorted.map((t) => t.date)));

  // 3️⃣ Calculate net per day (income - expense)
  const netData = labels.map((date) =>
    sorted
      .filter((t) => t.date === date)
      .reduce((sum, t) => {
        return t.type === "income" ? sum + t.amount : sum - t.amount;
      }, 0),
  );

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Net Flow",
        data: netData,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="h-[350px] bg-white rounded-lg shadow p-4">
      <Line data={data} options={options} plugins={[whiteBackgroundPlugin]} />
    </div>
  );
}
