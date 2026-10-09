"use client"; // Recharts needs the browser

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  todo: number;
  pending: number;
  complete: number;
};

// Props that Recharts gives to a custom tooltip: active, payload, label
type CustomTooltipProps = {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string | number;
};

// Custom tooltip (official pattern: content={<CustomTooltip />})
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const count = payload[0].value ?? 0;
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          {count} {count === 1 ? "task" : "tasks"}
        </p>
      </div>
    );
  }
  return null;
}

export default function TaskStatusChart({ todo, pending, complete }: Props) {
  const data = [
    { name: "To do", tasks: todo },
    { name: "Pending", tasks: pending },
    { name: "Complete", tasks: complete },
  ];

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 font-medium">Task status</h4>

      {/* ResponsiveContainer needs a parent with a fixed height (h-64) */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="tasks" stroke="#b9b9c8" fill="#b9b9c8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}