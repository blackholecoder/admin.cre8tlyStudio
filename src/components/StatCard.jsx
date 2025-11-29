export default function StatCard({ title, value, icon, trend }) {
  // trend = { label: "Up 8% this week", positive: true }

  return (
    <div className="p-5 bg-gray-800 rounded-xl border border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 lead-text">{title}</p>
          <h3 className="text-3xl font-semibold text-white mt-1 lead-text">{value}</h3>
          {trend && (
            <p
              className={`text-xs mt-1 lead-text ${
                trend.positive ? "text-teal-400" : "text-yellow"
              }`}
            >
              {trend.label}
            </p>
          )}
        </div>
        <div className="text-teal-400 bg-teal-900/20 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
