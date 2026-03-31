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
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import { Button } from "@/components/ui/button";
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

type RangeKey = "1m" | "3m" | "6m" | "1y" | "all";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "1m", label: "1 month" },
  { key: "3m", label: "3 months" },
  { key: "6m", label: "6 months" },
  { key: "1y", label: "1 year" },
  { key: "all", label: "All time" },
];

const getRangeStartDate = (range: RangeKey, now: Date) => {
  if (range === "all") {
    return null;
  }

  const base = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (range) {
    case "1m":
      return base;
    case "3m":
      return new Date(base.getFullYear(), base.getMonth() - 2, 1);
    case "6m":
      return new Date(base.getFullYear(), base.getMonth() - 5, 1);
    case "1y":
      return new Date(base.getFullYear(), base.getMonth() - 11, 1);
    default:
      return null;
  }
};

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const toDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRangeLabels = (start: Date, end: Date) => {
  const labels: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    labels.push(toDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return labels;
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
  const [selectedRange, setSelectedRange] = useState<RangeKey>("1m");

  const { labels, netData } = useMemo(() => {
    const today = startOfDay(new Date());
    const parsedTransactions = transactions
      .map((transaction) => {
        const transactionDate = new Date(transaction.date);
        return Number.isNaN(transactionDate.getTime())
          ? null
          : {
              ...transaction,
              parsedDate: startOfDay(transactionDate),
            };
      })
      .filter(
        (transaction): transaction is Transaction & { parsedDate: Date } =>
          transaction !== null,
      );

    const earliestDate = parsedTransactions[0]
      ? parsedTransactions
          .map((transaction) => transaction.parsedDate.getTime())
          .reduce((minValue, value) => Math.min(minValue, value), Infinity)
      : null;

    const rangeStartDate = getRangeStartDate(selectedRange, today);
    const startDate =
      selectedRange === "all"
        ? earliestDate !== null
          ? new Date(earliestDate)
          : new Date(today.getFullYear(), today.getMonth(), 1)
        : (rangeStartDate ??
          new Date(today.getFullYear(), today.getMonth(), 1));

    const endDate = today;
    const labelsInRange = getDateRangeLabels(startDate, endDate);

    const netByDate = new Map<string, number>();

    for (const transaction of parsedTransactions) {
      if (
        transaction.parsedDate < startDate ||
        transaction.parsedDate > endDate
      ) {
        continue;
      }

      const key = toDateKey(transaction.parsedDate);
      const currentValue = netByDate.get(key) ?? 0;
      const delta =
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;

      netByDate.set(key, currentValue + delta);
    }

    const values = labelsInRange.map((label) =>
      netByDate.has(label) ? (netByDate.get(label) as number) : null,
    );

    return { labels: labelsInRange, netData: values };
  }, [selectedRange, transactions]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Net Flow",
        data: netData,
        spanGaps: true,
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
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
    },
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-[350px]">
        <Line data={data} options={options} plugins={[whiteBackgroundPlugin]} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((range) => (
          <Button
            key={range.key}
            type="button"
            variant={selectedRange === range.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRange(range.key)}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
