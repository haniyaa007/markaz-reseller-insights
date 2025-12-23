import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 45000, orders: 120 },
  { name: "Feb", sales: 52000, orders: 145 },
  { name: "Mar", sales: 48000, orders: 132 },
  { name: "Apr", sales: 61000, orders: 178 },
  { name: "May", sales: 55000, orders: 160 },
  { name: "Jun", sales: 67000, orders: 195 },
  { name: "Jul", sales: 72000, orders: 210 },
  { name: "Aug", sales: 69000, orders: 198 },
  { name: "Sep", sales: 78000, orders: 225 },
  { name: "Oct", sales: 85000, orders: 248 },
  { name: "Nov", sales: 92000, orders: 275 },
  { name: "Dec", sales: 98000, orders: 295 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Sales: <span className="font-semibold text-primary">Rs {payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Orders: <span className="font-semibold text-info">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue and orders trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info"></div>
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(145, 76%, 43%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(145, 76%, 43%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="hsl(145, 76%, 43%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="hsl(200, 80%, 50%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
