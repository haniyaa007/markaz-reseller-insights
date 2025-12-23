import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Mon", value: 42 },
  { name: "Tue", value: 35 },
  { name: "Wed", value: 58 },
  { name: "Thu", value: 45 },
  { name: "Fri", value: 62 },
  { name: "Sat", value: 78 },
  { name: "Sun", value: 55 },
];

export function ConversionCard() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Conversion Rate</h3>
          <p className="text-sm text-muted-foreground">Orders vs product views</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">4.8%</p>
          <p className="text-xs text-success font-medium">+0.6% this week</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 11 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 2 ? "hsl(145, 76%, 43%)" : "hsl(145, 30%, 85%)"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
