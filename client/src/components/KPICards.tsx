import { BoxIcon, RocketIcon, CubeIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { commonAPI } from "../lib/services";

export default function KPICards() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const response = await commonAPI<KPIData>("kpi");
        setKpiData(response.data.data as KPIData);
        setError(null);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        setError("Failed to load KPI data");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  const kpiCards = kpiData
    ? [
        {
          title: "Total Products",
          value: formatNumber(kpiData.totalProducts),
          icon: <BoxIcon className="w-5 h-5 text-blue-600" />,
        },
        {
          title: "Total Value",
          value: formatCurrency(kpiData.totalValue),
          icon: <RocketIcon className="w-5 h-5 text-green-600" />,
        },
        {
          title: "Total Units",
          value: formatNumber(kpiData.totalUnits),
          icon: <CubeIcon className="w-5 h-5 text-purple-600" />,
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
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

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

const formatCurrency = (num: number): string => {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  } else {
    return `₹${num.toLocaleString()}`;
  }
};

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface KPIData {
  totalProducts: number;
  totalValue: number;
  totalUnits: number;
}
