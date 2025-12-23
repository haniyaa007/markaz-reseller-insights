import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Delivered", value: 245, color: "hsl(145, 76%, 43%)" },
  { name: "In Transit", value: 68, color: "hsl(200, 80%, 50%)" },
  { name: "Pending", value: 42, color: "hsl(38, 92%, 50%)" },
  { name: "Cancelled", value: 15, color: "hsl(0, 72%, 51%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
          {payload[0].name}: {payload[0].value} orders
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-4 mt-4">
    {payload.map((entry: any, index: number) => (
      <div key={index} className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-xs text-muted-foreground">{entry.value}</span>
      </div>
    ))}
  </div>
);

export function OrderStatusChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Order Status</h3>
        <p className="text-sm text-muted-foreground">Distribution of order statuses</p>
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ marginTop: "-20px" }}>
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
      </div>
    </div>
  );
}
