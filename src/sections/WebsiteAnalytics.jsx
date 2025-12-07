import { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Activity } from "lucide-react";
import { api } from "../api/axios";
import VisitorsCityMap from "../components/VisitorsCityMap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function WebsiteAnalytics() {
  const [loading, setLoading] = useState(true);
  const [visitorsOverTime, setVisitorsOverTime] = useState([]);
  const [visitorsByLocation, setVisitorsByLocation] = useState([]);
  const [devices, setDevices] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [uniqueReturn, setUniqueReturn] = useState({
    unique_visitors: 0,
    returning_visitors: 0,
  });
  const [onlineVisitors, setOnlineVisitors] = useState(0);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [vTime, vLoc, dev, pViews, uniqRet, online] = await Promise.all([
          api.get("/admin/web-analytics/visitors-over-time"),
          api.get("/admin/web-analytics/visitors-by-location"),
          api.get("/admin/web-analytics/devices"),
          api.get("/admin/web-analytics/page-views"),
          api.get("/admin/web-analytics/unique-vs-returning"),
          api.get("/admin/web-analytics/online"),
        ]);

        const visitorsFixed = (vTime.data || []).map((i) => ({
          date: i.date || i.created_at || "Unknown",
          visitors: i.visitors || i.total || 0,
        }));

        const devicesFixed = (Array.isArray(dev.data)
          ? dev.data
          : Object.values(dev.data || [])
        ).map((d) => ({
          device_type: d.device_type || "Unknown",
          total: Number(d.total) || 0,
        }));

        const pageViewsFixed = (Array.isArray(pViews.data)
          ? pViews.data
          : Object.values(pViews.data || [])
        ).map((p) => ({
          page: p.page || "Unknown",
          total: Number(p.total) || 0,
        }));

        setVisitorsOverTime(visitorsFixed);
        setVisitorsByLocation(vLoc.data || []);
        setDevices(devicesFixed);
        setPageViews(pageViewsFixed);
        setUniqueReturn(uniqRet.data || {});
        setOnlineVisitors(online.data?.online || 0);
      } catch (err) {
        console.error("Analytics load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-400 py-20 text-lg">
        Loading website analytics…
      </div>
    );

  // === Chart.js data configs ===
  const visitorsChart = {
    labels: visitorsOverTime.map((v) => v.date),
    datasets: [
      {
        label: "Visitors",
        data: visitorsOverTime.map((v) => v.visitors),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const pageViewsChart = {
    labels: pageViews.map((p) => p.page),
    datasets: [
      {
        label: "Page Views",
        data: pageViews.map((p) => p.total),
        backgroundColor: "#f43f5e",
      },
    ],
  };

  const devicesChart = {
    labels: devices.map((d) => d.device_type),
    datasets: [
      {
        data: devices.map((d) => d.total),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
    },
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-2">
        Website Analytics Dashboard
      </h1>
      <p className="text-gray-400">Real-time visitor & traffic insights</p>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-400 text-sm">Visitors Online Now</h2>
            <Activity className="text-green-400" size={20} />
          </div>
          <p className="text-4xl font-bold text-white mt-2">{onlineVisitors}</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 shadow">
          <h2 className="text-gray-400 text-sm">Unique Visitors</h2>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {uniqueReturn.unique_visitors}
          </p>
        </div>
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 shadow">
          <h2 className="text-gray-400 text-sm">Returning Visitors</h2>
          <p className="text-3xl font-bold text-purple-400 mt-2">
            {uniqueReturn.returning_visitors}
          </p>
        </div>
      </div>

      {/* Visitors Over Time */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-white mb-4">
          Visitors Over Time
        </h2>
        <div className="h-[350px]">
          <Line data={visitorsChart} options={chartOptions} />
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-white mb-4">
          Device Breakdown
        </h2>
        <div className="flex justify-center h-[350px]">
          <Doughnut
            data={devicesChart}
            options={{
              plugins: {
                legend: { labels: { color: "#ccc" } },
              },
            }}
          />
        </div>
      </div>

      {/* Page Views */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Page Views</h2>
        <div className="h-[350px]">
          <Bar data={pageViewsChart} options={chartOptions} />
        </div>
      </div>

      {/* Visitors by Location */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-white mb-4">
          Visitors by Location
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {visitorsByLocation.map((loc, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{loc.country || "—"}</td>
                  <td className="px-4 py-2">{loc.region || "—"}</td>
                  <td className="px-4 py-2">{loc.city || "—"}</td>
                  <td className="px-4 py-2 font-bold text-white">
                    {loc.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <VisitorsCityMap visitors={visitorsByLocation} />

    </div>
  );
}
