import { BoxIcon, RocketIcon, CubeIcon } from "@radix-ui/react-icons";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

function KPICard({ title, value, icon, trend }: KPICardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function KPICards() {
  // Dummy data - replace with real data from your API
  const kpiData = [
    {
      title: "Total Products",
      value: "1,247",
      icon: <BoxIcon className="w-5 h-5 text-blue-600" />,
      trend: { value: "12%", isPositive: true },
    },
    {
      title: "Total Value",
      value: "₹2.4M",
      icon: <RocketIcon className="w-5 h-5 text-green-600" />,
      trend: { value: "8%", isPositive: true },
    },
    {
      title: "Total Units",
      value: "15,892",
      icon: <CubeIcon className="w-5 h-5 text-purple-600" />,
      trend: { value: "3%", isPositive: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
}
