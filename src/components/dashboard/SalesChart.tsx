import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 125000, orders: 85 },
  { name: "Feb", sales: 148000, orders: 102 },
  { name: "Mar", sales: 132000, orders: 91 },
  { name: "Apr", sales: 189000, orders: 128 },
  { name: "May", sales: 167000, orders: 115 },
  { name: "Jun", sales: 215000, orders: 147 },
  { name: "Jul", sales: 243000, orders: 168 },
  { name: "Aug", sales: 228000, orders: 156 },
  { name: "Sep", sales: 276000, orders: 189 },
  { name: "Oct", sales: 312000, orders: 215 },
  { name: "Nov", sales: 358000, orders: 246 },
  { name: "Dec", sales: 402000, orders: 278 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-elevated">
        <p className="text-sm font-bold text-foreground mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Revenue:</span>
            <span className="text-sm font-bold text-foreground ml-auto">Rs {payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-sm text-muted-foreground">Orders:</span>
            <span className="text-sm font-bold text-foreground ml-auto">{payload[1].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/60 animate-fade-in h-full" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly revenue and orders trend</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info"></div>
            <span className="text-sm text-muted-foreground font-medium">Orders</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => `${value / 1000}k`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="hsl(152, 69%, 45%)"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="hsl(210, 90%, 55%)"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
