import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DailyVisitorTrendChart({ data }) {
  const labels = data.map(d => d.date);
  const counts = data.map(d => d.count);

  return (
    <Line
      data={{
        labels,
        datasets: [{
          data: counts,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.45,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }}
    />
  );
}
