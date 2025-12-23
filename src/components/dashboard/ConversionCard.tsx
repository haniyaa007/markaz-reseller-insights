import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const data = [
  { name: "Mon", value: 42, orders: 15 },
  { name: "Tue", value: 35, orders: 12 },
  { name: "Wed", value: 58, orders: 21 },
  { name: "Thu", value: 45, orders: 16 },
  { name: "Fri", value: 62, orders: 23 },
  { name: "Sat", value: 78, orders: 28 },
  { name: "Sun", value: 55, orders: 20 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{payload[0].value}%</p>
        <p className="text-xs text-muted-foreground">{payload[0].payload.orders} conversions</p>
      </div>
    );
  }
  return null;
};

export function ConversionCard() {
  const avgConversion = (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/60 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Conversion Rate</h3>
          <p className="text-sm text-muted-foreground">Views to orders</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{avgConversion}%</p>
          <p className="text-xs text-success font-semibold mt-1">+0.6% this week</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 5 ? "hsl(152, 69%, 45%)" : "hsl(152, 40%, 85%)"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
