import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function VisitorStatusPieChart({ data }) {
  if (!data) return null;

  const labels = Array.isArray(data) ? data.map(d => d.status) : Object.keys(data);
  const values = Array.isArray(data) ? data.map(d => d.count) : Object.values(data);

  return (
    <Pie
      data={{
        labels,
        datasets: [{
          data: values,
          backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 12, padding: 16 }
          }
        }
      }}
    />
  );
}
