import { useState } from "react";
import { 
  Wallet, TrendingUp, Clock, BadgePercent, ShoppingBag, Users,
  Download, ArrowUpRight, ArrowDownRight, Star, TrendingDown,
  CheckCircle2, Truck, XCircle, Package, AlertCircle, ChevronDown, Check, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

// Date Range Data
const dateRanges = [
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "3months", label: "3 Months" },
  { id: "6months", label: "6 Months" },
  { id: "1year", label: "1 Year" },
  { id: "lifetime", label: "All Time" },
];

// Order Filters
const orderFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "in-progress", label: "In-progress", count: 186 },
  { id: "shippers-advice", label: "Shipper's Advice", count: 74 },
  { id: "delivered", label: "Delivered", count: 892 },
  { id: "returned", label: "Returned", count: 52 },
  { id: "cancelled", label: "Cancelled", count: 43 },
];

// Chart Data
const revenueData = [
  { name: "W1", revenue: 145000, orders: 89 },
  { name: "W2", revenue: 198000, orders: 124 },
  { name: "W3", revenue: 167000, orders: 98 },
  { name: "W4", revenue: 234000, orders: 156 },
];

const orderStatusData = [
  { name: "Delivered", value: 892, color: "hsl(152, 69%, 45%)" },
  { name: "In Transit", value: 186, color: "hsl(210, 90%, 55%)" },
  { name: "Pending", value: 74, color: "hsl(38, 92%, 50%)" },
  { name: "Cancelled", value: 43, color: "hsl(0, 72%, 51%)" },
];

const conversionData = [
  { name: "Mon", value: 4.2 },
  { name: "Tue", value: 3.8 },
  { name: "Wed", value: 5.1 },
  { name: "Thu", value: 4.6 },
  { name: "Fri", value: 5.8 },
  { name: "Sat", value: 6.2 },
  { name: "Sun", value: 5.4 },
];

// Top Products
const topProducts = [
  { rank: 1, name: "Summer Sunscreen Shirt", sold: 420, revenue: 611100, profit: 61110, trend: 12 },
  { rank: 2, name: "Pink Heart Necklace", sold: 385, revenue: 338800, profit: 33880, trend: 8 },
  { rank: 3, name: "Quilted Cotton Jacket", sold: 312, revenue: 1172496, profit: 117250, trend: 15 },
  { rank: 4, name: "Coral Fleece Pajamas", sold: 289, revenue: 621928, profit: 62193, trend: -3 },
];

// Recent Orders
const recentOrders = [
  { id: "ORD-7829", customer: "Ahmed K.", amount: 880, profit: 88, status: "delivered" },
  { id: "ORD-7828", customer: "Fatima A.", amount: 1455, profit: 145, status: "transit" },
  { id: "ORD-7827", customer: "Usman S.", amount: 3758, profit: 376, status: "in-progress" },
  { id: "ORD-7826", customer: "Zainab H.", amount: 2152, profit: 215, status: "delivered" },
  { id: "ORD-7825", customer: "Bilal A.", amount: 927, profit: 93, status: "cancelled" },
];

const statusConfig: Record<string, { icon: any; color: string }> = {
  delivered: { icon: CheckCircle2, color: "text-success" },
  transit: { icon: Truck, color: "text-info" },
  "in-progress": { icon: Clock, color: "text-warning" },
  cancelled: { icon: XCircle, color: "text-destructive" },
};

const Index = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-5">
        
        {/* Header - Minimal */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Real-time business insights</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  showDateDropdown 
                    ? "bg-foreground text-background" 
                    : "bg-card border border-border hover:border-primary/40"
                )}
              >
                {selectedDateLabel}
                <ChevronDown className={cn("w-4 h-4 transition-transform", showDateDropdown && "rotate-180")} />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                  {dateRanges.map((range) => (
                    <button
                      key={range.id}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                        dateRange === range.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                      )}
                      onClick={() => { setDateRange(range.id); setShowDateDropdown(false); }}
                    >
                      {range.label}
                      {dateRange === range.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-hero text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-90 transition-all">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* PRIMARY METRICS - Always visible, most important */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue - Hero Card */}
          <div className="col-span-2 lg:col-span-1 gradient-hero rounded-2xl p-5 text-primary-foreground shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium opacity-80">Total Revenue</p>
                <Wallet className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-extrabold mt-2">Rs 2,847,560</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">+18.2% vs last period</span>
              </div>
            </div>
          </div>

          {/* Profit Earned */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Profit Earned</p>
              <div className="p-2 rounded-xl bg-success/10">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">Rs 456,780</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-semibold text-success">+15.3%</span>
            </div>
          </div>

          {/* Commission */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Commission</p>
              <div className="p-2 rounded-xl bg-primary/10">
                <BadgePercent className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">Rs 142,378</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-semibold text-success">+12.8%</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
              <div className="p-2 rounded-xl bg-warning/10">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">74</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-semibold text-success">-8.5% (good)</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-12 gap-5">
          
          {/* LEFT: Charts + Top Products */}
          <div className="col-span-12 xl:col-span-8 space-y-5">
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Revenue Chart */}
              <div className="md:col-span-2 bg-card rounded-2xl p-5 border border-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground">Revenue Trend</h3>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Revenue</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)" }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)", borderRadius: "12px", fontSize: "12px" }}
                      formatter={(value: number) => [`Rs ${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(152, 69%, 45%)" strokeWidth={2.5} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Donut */}
              <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
                <h3 className="font-bold text-foreground mb-1">Order Status</h3>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {orderStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-lg font-bold">1,195</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {orderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-[10px] text-muted-foreground truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products - Compact */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Top Products</h3>
                <span className="text-xs text-muted-foreground">By revenue</span>
              </div>
              <div className="divide-y divide-border/50">
                {topProducts.map((product) => (
                  <div key={product.rank} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      product.rank === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                      product.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
                      product.rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                      product.rank > 3 && "bg-muted text-muted-foreground"
                    )}>
                      {product.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">Rs {product.profit.toLocaleString()}</p>
                      <div className={cn("flex items-center justify-end gap-0.5 text-xs font-medium", product.trend > 0 ? "text-success" : "text-destructive")}>
                        {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {product.trend > 0 ? "+" : ""}{product.trend}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Orders Section with Filters */}
          <div className="col-span-12 xl:col-span-4 space-y-4">
            
            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-info" />
                  <span className="text-xs text-muted-foreground">Orders</span>
                </div>
                <p className="text-xl font-bold mt-1">1,247</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Customers</span>
                </div>
                <p className="text-xl font-bold mt-1">486</p>
              </div>
            </div>

            {/* Conversion Mini Chart */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Conversion</span>
                <span className="text-lg font-bold text-primary">5.1%</span>
              </div>
              <ResponsiveContainer width="100%" height={50}>
                <BarChart data={conversionData} barCategoryGap="25%">
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="hsl(152, 40%, 80%)">
                    {conversionData.map((_, i) => (
                      <Cell key={i} fill={i === 5 ? "hsl(152, 69%, 45%)" : "hsl(152, 40%, 85%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Section - Filters + List */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-foreground mb-3">Recent Orders</h3>
                {/* Filters - Only here, above what they control */}
                <div className="flex flex-wrap gap-1.5">
                  {orderFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderFilter(filter.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                        orderFilter === filter.id
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {filter.label}
                      <span className="ml-1 opacity-70">{filter.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Orders List */}
              <div className="divide-y divide-border/50 max-h-[280px] overflow-y-auto">
                {recentOrders
                  .filter(o => orderFilter === "all" || o.status === orderFilter || (orderFilter === "in-progress" && o.status === "in-progress"))
                  .map((order) => {
                    const status = statusConfig[order.status] || statusConfig.delivered;
                    const StatusIcon = status.icon;
                    return (
                      <div key={order.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{order.customer.split(" ")[0][0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">Rs {order.amount}</p>
                          <div className="flex items-center justify-end gap-1">
                            <StatusIcon className={cn("w-3 h-3", status.color)} />
                            <span className="text-xs font-medium text-primary">+{order.profit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              <div className="p-3 border-t border-border bg-muted/30">
                <button className="w-full py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  View All Orders →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
