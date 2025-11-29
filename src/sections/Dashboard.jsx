import { useEffect, useState } from "react";
import { Users, FileText, Clock, CheckCircle } from "lucide-react";
import StatCard from "../components/StatCard";
import { api } from "../api/axios";
import RecentMagnets from "../components/RecentMagnets";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_magnets: 0,
    completed_magnets: 0,
    awaiting_magnets: 0,
  });

  const role = localStorage.getItem("role");
  const isSuperAdmin = role === "superadmin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total_users}
          icon={<Users />}
          trend={{ label: "All-time signups", positive: true }}
        />
        <StatCard
          title="Total Lead Magnets"
          value={stats.total_magnets}
          icon={<FileText />}
          trend={{ label: "All created lead magnets", positive: true }}
        />
        <StatCard
          title="Completed"
          value={stats.completed_magnets}
          icon={<CheckCircle />}
          trend={{ label: "Finished PDFs", positive: true }}
        />
        <StatCard
          title="Awaiting"
          value={stats.awaiting_magnets}
          icon={<Clock />}
          trend={{ label: "Awaiting creation", positive: false }}
        />
      </div>

      {/* Optional: Future activity section */}
      {isSuperAdmin && <RecentMagnets />}
    </div>
  );
}
