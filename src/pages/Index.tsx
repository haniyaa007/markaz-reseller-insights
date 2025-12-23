import { useState } from "react";
import { 
  Wallet, TrendingUp, Clock, BadgePercent, ShoppingBag, Users,
  Download, ArrowUpRight, ArrowDownRight, Star, TrendingDown,
  CheckCircle2, Truck, XCircle, Package, ChevronDown, Check, RefreshCw, ExternalLink, AlertCircle, Info, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Metric Definitions
const metricDefinitions: Record<string, { title: string; description: string }> = {
  revenue: {
    title: "Total Revenue",
    description: "The total amount of money generated from all sales before any deductions like costs, commissions, or returns."
  },
  profit: {
    title: "Profit Earned",
    description: "Your net earnings after deducting product costs and platform fees from total revenue."
  },
  commission: {
    title: "Commission",
    description: "The fee earned by the platform from your sales. This is typically a percentage of each transaction."
  },
  pending: {
    title: "Pending Orders",
    description: "Orders that have been placed but not yet shipped or processed. Lower numbers indicate efficient order fulfillment."
  },
  orders: {
    title: "Total Orders",
    description: "The complete count of all orders placed within the selected time period, regardless of status."
  },
  customers: {
    title: "Customers",
    description: "Unique buyers who have made at least one purchase. Higher numbers indicate growing market reach."
  },
  conversion: {
    title: "Conversion Rate",
    description: "Percentage of impressions (product views) that resulted in actual purchases. Calculated as (Orders ÷ Impressions) × 100."
  }
};

// Date Range Data
const dateRanges = [
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "3months", label: "3 Months" },
  { id: "6months", label: "6 Months" },
  { id: "1year", label: "1 Year" },
  { id: "lifetime", label: "All Time" },
];

// Order Filters - ALL RESTORED
const orderFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "in-progress", label: "In-progress", count: 186 },
  { id: "shippers-advice", label: "Shipper's Advice", count: 74 },
  { id: "delivered", label: "Delivered", count: 892 },
  { id: "returned", label: "Returned", count: 52 },
  { id: "cancelled", label: "Cancelled", count: 43 },
];

// Product Sort Options
const productSortOptions = [
  { id: "profit", label: "Profit" },
  { id: "revenue", label: "Revenue" },
  { id: "sold", label: "Units Sold" },
  { id: "rating", label: "Rating" },
  { id: "trend", label: "Trend" },
];

// Sales Chart Data
const salesData = [
  { name: "Jan", sales: 145000, orders: 89 },
  { name: "Feb", sales: 198000, orders: 124 },
  { name: "Mar", sales: 167000, orders: 98 },
  { name: "Apr", sales: 234000, orders: 156 },
  { name: "May", sales: 189000, orders: 132 },
  { name: "Jun", sales: 267000, orders: 178 },
  { name: "Jul", sales: 298000, orders: 195 },
  { name: "Aug", sales: 245000, orders: 167 },
  { name: "Sep", sales: 312000, orders: 208 },
  { name: "Oct", sales: 356000, orders: 234 },
  { name: "Nov", sales: 389000, orders: 258 },
  { name: "Dec", sales: 423000, orders: 289 },
];

// Order Status Data
const orderStatusData = [
  { name: "Delivered", value: 892, color: "hsl(152, 69%, 45%)", description: "Successfully completed orders" },
  { name: "In Transit", value: 186, color: "hsl(210, 90%, 55%)", description: "Orders currently being shipped" },
  { name: "Pending", value: 74, color: "hsl(38, 92%, 50%)", description: "Orders awaiting processing" },
  { name: "Cancelled", value: 43, color: "hsl(0, 72%, 51%)", description: "Orders that were cancelled" },
];

// Conversion Data
const conversionData = [
  { name: "Mon", value: 42, orders: 15, impressions: 357 },
  { name: "Tue", value: 35, orders: 12, impressions: 343 },
  { name: "Wed", value: 58, orders: 21, impressions: 362 },
  { name: "Thu", value: 45, orders: 16, impressions: 356 },
  { name: "Fri", value: 62, orders: 23, impressions: 371 },
  { name: "Sat", value: 78, orders: 28, impressions: 359 },
  { name: "Sun", value: 55, orders: 20, impressions: 364 },
];

// Top Products with ALL metrics
const topProducts = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", category: "Fashion", sold: 420, revenue: 611100, profit: 61110, trend: 12, rating: 4.8, reviews: 156 },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", category: "Jewelry", sold: 385, revenue: 338800, profit: 33880, trend: 8, rating: 4.9, reviews: 203 },
  { id: 3, name: "Boys & Girls Quilted Cotton Jacket", category: "Kids", sold: 312, revenue: 1172496, profit: 117250, trend: 15, rating: 4.7, reviews: 89 },
  { id: 4, name: "Kulomi Pajamas Women's Coral Fleece", category: "Sleepwear", sold: 289, revenue: 621928, profit: 62193, trend: -3, rating: 4.6, reviews: 124 },
  { id: 5, name: "Double-headed Wax Carving Knife Set", category: "Tools", sold: 245, revenue: 227115, profit: 22712, trend: 5, rating: 4.5, reviews: 67 },
  { id: 6, name: "Premium Wireless Earbuds Pro", category: "Electronics", sold: 198, revenue: 495000, profit: 49500, trend: 22, rating: 4.4, reviews: 312 },
  { id: 7, name: "Organic Face Serum Collection", category: "Beauty", sold: 456, revenue: 182400, profit: 54720, trend: 18, rating: 4.85, reviews: 278 },
];

// Recent Orders - ALL STATUSES
const allOrders = [
  { id: "ORD-7829", customer: "Ahmed K.", amount: 880, profit: 88, status: "delivered", date: "Dec 20" },
  { id: "ORD-7828", customer: "Fatima A.", amount: 1455, profit: 145, status: "in-progress", date: "Dec 19" },
  { id: "ORD-7827", customer: "Usman S.", amount: 3758, profit: 376, status: "shippers-advice", date: "Dec 18" },
  { id: "ORD-7826", customer: "Zainab H.", amount: 2152, profit: 215, status: "delivered", date: "Dec 17" },
  { id: "ORD-7825", customer: "Bilal A.", amount: 927, profit: 93, status: "cancelled", date: "Dec 16" },
  { id: "ORD-7824", customer: "Ayesha M.", amount: 1280, profit: 128, status: "returned", date: "Dec 15" },
  { id: "ORD-7823", customer: "Hassan R.", amount: 650, profit: 65, status: "delivered", date: "Dec 14" },
  { id: "ORD-7822", customer: "Sana T.", amount: 2890, profit: 289, status: "in-progress", date: "Dec 13" },
  { id: "ORD-7821", customer: "Omar K.", amount: 1750, profit: 175, status: "shippers-advice", date: "Dec 12" },
  { id: "ORD-7820", customer: "Nadia S.", amount: 3200, profit: 320, status: "delivered", date: "Dec 11" },
];

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  delivered: { icon: CheckCircle2, color: "text-success", label: "Delivered" },
  "in-progress": { icon: Clock, color: "text-warning", label: "In Progress" },
  "shippers-advice": { icon: Package, color: "text-info", label: "Shipping" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
  returned: { icon: AlertCircle, color: "text-muted-foreground", label: "Returned" },
};

// Metric Info Popover Component
const MetricInfoPopover = ({ metricKey, children }: { metricKey: string; children: React.ReactNode }) => {
  const metric = metricDefinitions[metricKey];
  if (!metric) return <>{children}</>;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer hover:opacity-80 transition-opacity w-full text-left">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" side="bottom" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-foreground">{metric.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom Tooltips
const SalesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
        <p className="text-sm font-bold text-foreground mb-2">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Revenue:</span>
            <span className="text-xs font-bold text-foreground ml-auto">Rs {payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-info" />
            <span className="text-xs text-muted-foreground">Orders:</span>
            <span className="text-xs font-bold text-foreground ml-auto">{payload[1].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ConversionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">{payload[0].value}%</p>
        <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
          <p>{payload[0].payload.orders} orders</p>
          <p className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {payload[0].payload.impressions} impressions
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Index = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");
  const [productSort, setProductSort] = useState("profit");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;
  const avgConversion = (conversionData.reduce((sum, d) => sum + d.value, 0) / conversionData.length).toFixed(1);

  // Sort products based on selected option
  const sortedProducts = [...topProducts].sort((a, b) => {
    switch (productSort) {
      case "profit": return b.profit - a.profit;
      case "revenue": return b.revenue - a.revenue;
      case "sold": return b.sold - a.sold;
      case "rating": return b.rating - a.rating;
      case "trend": return b.trend - a.trend;
      default: return b.profit - a.profit;
    }
  }).slice(0, 5);

  // Filter orders based on selected filter
  const filteredOrders = orderFilter === "all" 
    ? allOrders 
    : allOrders.filter(order => order.status === orderFilter);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-5">
        
        {/* Header */}
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
                  showDateDropdown ? "bg-foreground text-background" : "bg-card border border-border hover:border-primary/40"
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

        {/* PRIMARY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricInfoPopover metricKey="revenue">
            <div className="col-span-2 lg:col-span-1 gradient-hero rounded-2xl p-5 text-primary-foreground shadow-glow relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium opacity-80 flex items-center gap-1.5">
                    Total Revenue
                    <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <Wallet className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-extrabold mt-2">Rs 2,847,560</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+18.2% vs last period</span>
                </div>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="profit">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  Profit Earned
                  <Info className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </p>
                <div className="p-2 rounded-xl bg-success/10"><TrendingUp className="w-4 h-4 text-success" /></div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">Rs 456,780</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success">+15.3%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="orders">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  Total Orders
                  <Info className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </p>
                <div className="p-2 rounded-xl bg-info/10"><ShoppingBag className="w-4 h-4 text-info" /></div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">1,247</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success">+8.2%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="pending">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  Pending Orders
                  <Info className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </p>
                <div className="p-2 rounded-xl bg-warning/10"><Clock className="w-4 h-4 text-warning" /></div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">74</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success">-8.5% (good)</span>
              </div>
            </div>
          </MetricInfoPopover>
        </div>

        {/* ROW 2-4: Revenue Overview (left) + Customers/Order Status/Conversion (right) */}
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT - Revenue Overview (spans rows 2-4) */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-card h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Revenue Overview</h3>
                  <p className="text-xs text-muted-foreground">Monthly revenue and orders trend</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-info" /> Orders</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} dy={8} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(210, 90%, 55%)" }} />
                  <Tooltip content={<SalesTooltip />} />
                  <Area yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(152, 69%, 45%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  <Area yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(210, 90%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT - Customers → Order Status → Conversion Rate (stacked) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            {/* Customers Card */}
            <MetricInfoPopover metricKey="customers">
              <div className="bg-card rounded-xl p-4 border border-border group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Customers
                      <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-semibold text-success">+22.4%</span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">486</p>
              </div>
            </MetricInfoPopover>

            {/* Order Status */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
              <h3 className="font-bold text-foreground text-sm mb-3">Order Status</h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {orderStatusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: data.color }} />
                                  <span className="text-xs font-semibold text-foreground">{data.name}</span>
                                  <span className="text-sm font-bold" style={{ color: data.color }}>{data.value}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xl font-bold">1,195</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1">
                  {orderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                      <span className="text-xs font-bold text-foreground ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <MetricInfoPopover metricKey="conversion">
              <div className="bg-card rounded-2xl p-4 border border-border shadow-card group">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      Conversion Rate
                      <Info className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                      <Eye className="w-3 h-3" />
                      <span>Based on 2,512 impressions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{avgConversion}%</p>
                    <p className="text-[10px] text-success font-semibold">+0.6% this week</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={conversionData} barCategoryGap="15%">
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} dy={5} />
                    <Tooltip content={<ConversionTooltip />} cursor={false} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {conversionData.map((_, i) => (
                        <Cell key={i} fill={i === 5 ? "hsl(152, 69%, 45%)" : "hsl(152, 40%, 85%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </MetricInfoPopover>
          </div>
        </div>

        {/* ROW 5: TOP SELLING PRODUCTS */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-foreground">Top Selling Products</h3>
                <p className="text-xs text-muted-foreground">Sorted by {productSortOptions.find(o => o.id === productSort)?.label}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {productSortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setProductSort(option.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      productSort === option.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-center py-3 px-4">Rating</th>
                  <th className="text-right py-3 px-4">Sold</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Profit</th>
                  <th className="text-right py-3 px-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {sortedProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                        index === 1 && "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
                        index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-sm text-foreground">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.category}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{product.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-sm">{product.sold}</td>
                    <td className="py-3 px-4 text-right font-semibold text-sm">Rs {product.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-sm text-primary">Rs {product.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className={cn(
                        "inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold",
                        product.trend > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                        {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {product.trend > 0 ? "+" : ""}{product.trend}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 6: RECENT ORDERS - Full Width at Bottom */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground">Recent Orders</h3>
              <span className="text-xs text-muted-foreground">{filteredOrders.length} orders</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {orderFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setOrderFilter(filter.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all",
                    orderFilter === filter.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter.label} <span className="opacity-70">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status?.icon || CheckCircle2;
                return (
                  <div key={order.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{order.customer[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{order.customer}</p>
                        <span className={cn("flex items-center gap-0.5 text-[10px] font-medium", status?.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {status?.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.id} · {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">Rs {order.amount.toLocaleString()}</p>
                      <span className="text-xs font-semibold text-primary">+Rs {order.profit}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-3 border-t border-border bg-muted/30">
            <button className="w-full py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
              View All Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
