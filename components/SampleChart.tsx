"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type SampleChartProps = {
    title?: string;
};

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const dataValues1 = [12, 19, 3, 5, 2, 3];

const whiteBackgroundPlugin: Plugin<"line"> = {
    id: "whiteBackground",
    beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        ctx.save();
        ctx.fillStyle = "white"; // 👈 background color
        ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
        ctx.restore();
    },
};

export default function SampleChart({ title = "Demo Chart" }: SampleChartProps) {
    const data: ChartData<"line"> = {
        labels,
        datasets: [
            {
                label: "Series A",
                data: dataValues1,
                borderColor: "#4F46E5", // Indigo
                backgroundColor: "rgba(79,70,229,0.3)",
                tension: 0.3,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#1F2937", // Tailwind gray-800
                    font: { size: 14 },
                },
            },
            title: {
                display: true,
                text: title,
                color: "#111827",
                font: { size: 18, weight: "bold" },
            },
        },
        scales: {
            x: {
                ticks: { color: "#6B7280" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                ticks: { color: "#6B7280" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
    };

    return (
        <div className="h-[350px] bg-white rounded-lg shadow p-4">
            <Line data={data} options={options} plugins={[whiteBackgroundPlugin]} />
        </div>
    );
}
