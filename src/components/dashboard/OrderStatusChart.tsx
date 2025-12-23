import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Delivered", value: 245, color: "hsl(152, 69%, 45%)" },
  { name: "In Transit", value: 68, color: "hsl(210, 90%, 55%)" },
  { name: "Pending", value: 42, color: "hsl(38, 92%, 50%)" },
  { name: "Cancelled", value: 15, color: "hsl(0, 72%, 51%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const percentage = ((payload[0].value / 370) * 100).toFixed(1);
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].name}
        </p>
        <p className="text-lg font-bold text-foreground mt-1">{payload[0].value} orders</p>
        <p className="text-xs text-muted-foreground">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

export function OrderStatusChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/60 animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Order Status</h3>
        <p className="text-sm text-muted-foreground">Distribution overview</p>
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground font-medium">Total</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
            <span className="text-xs font-bold text-foreground ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
