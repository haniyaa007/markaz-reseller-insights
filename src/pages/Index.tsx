import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, Clock, ShoppingBag, Users,
  Download, ArrowUpRight, ArrowDownRight,
  Truck, Package, ChevronDown, Check, RefreshCw, Info,
  CheckCircle2, XCircle, AlertCircle
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, BarChart, Bar, CartesianGrid, PieChart, Pie
 } from "recharts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
 import { fetchSheetDataByPeriod, type SheetData, filterProductsByPeriod } from "@/lib/googlesheet";

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

// Product Period Options (mapped from sheet Period values)
const productPeriodOptions = [
  { id: "7_DAYS", label: "7 Days" },
  { id: "30_DAYS", label: "30 Days" },
  { id: "3_MONTHS", label: "3 Months" },
  { id: "6_MONTHS", label: "6 Months" },
  { id: "1_YEAR", label: "1 Year" },
  { id: "ALL_TIME", label: "All Time" },
];

// Order Status Data (for Coming Soon UI)
const orderStatusData = [
  { name: "Delivered", value: 892, color: "hsl(152, 69%, 45%)", description: "Successfully completed orders" },
  { name: "In Transit", value: 186, color: "hsl(210, 90%, 55%)", description: "Orders currently being shipped" },
  { name: "Pending", value: 74, color: "hsl(38, 92%, 50%)", description: "Orders awaiting processing" },
  { name: "Cancelled", value: 43, color: "hsl(0, 72%, 51%)", description: "Orders that were cancelled" },
  { name: "Returned", value: 52, color: "hsl(280, 65%, 55%)", description: "Orders that were returned" },
];

// Recent Orders Static Data (for Coming Soon UI)
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

const orderFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "in-progress", label: "In-progress", count: 186 },
  { id: "shippers-advice", label: "Shipper's Advice", count: 74 },
  { id: "delivered", label: "Delivered", count: 892 },
  { id: "returned", label: "Returned", count: 52 },
  { id: "cancelled", label: "Cancelled", count: 43 },
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

const DeliveryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
        <p className="text-sm font-bold text-foreground">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.color }}>{data.percentage}%</p>
        <div className="text-xs text-muted-foreground mt-1">
          <p>{data.delivered} of {data.total} delivered</p>
        </div>
      </div>
    );
  }
  return null;
};

const Index = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");
  const [productPeriod, setProductPeriod] = useState("7_DAYS");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [deliveryView, setDeliveryView] = useState<"partners" | "cities">("partners");
  
  // Google Sheets Integration
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;
  
  // Map date range IDs to sheet period names
  const getPeriodFromRange = (rangeId: string): string => {
    const mapping: Record<string, string> = {
      "7days": "7_DAYS",
      "30days": "30_DAYS", 
      "3months": "3_MONTHS",
      "6months": "6_MONTHS",
      "1year": "1_YEAR",
      "lifetime": "ALL_TIME"
    };
    return mapping[rangeId] || "30_DAYS";
  };

  const currentPeriod = getPeriodFromRange(dateRange);
  
  // Fetch data from Google Sheets when component mounts or date range changes
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const data = await fetchSheetDataByPeriod(currentPeriod);
        setSheetData(data);
      } catch (error) {
        console.error('Error loading sheet data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [dateRange]);

  const revenueChartData = (sheetData?.orderRevenueChart || []).map((row: any) => ({
    name: row.month_name ?? row.name ?? row.month ?? row.period ?? "",
    sales: Number(row.total_revenue ?? row.revenue ?? row.sales ?? 0),
    orders: Number(row.total_orders ?? row.orders ?? 0),
  }));

  const deliveryRaw = deliveryView === "partners" ? (sheetData?.deliveryPerformanceCourier || []) : (sheetData?.deliveryPerformanceCity || []);
  const deliveryData = deliveryRaw.map((row: any) => {
    const successRate = Number(row.success_rate ?? row.percentage ?? 0);
    const pct = successRate <= 1 ? successRate * 100 : successRate;
    return {
      name: row.partner ?? row.partner_name ?? row.partnr ?? row.city ?? row.city_name ?? row.name ?? "",
      delivered: Number(row.successful_deliv ?? row.successful_deliveries ?? row.successful_deliveries ?? row.delivered_orders ?? row.delivered ?? 0),
      total: Number(row.total_orders ?? row.total ?? 0),
      percentage: Number.isFinite(pct) ? Number(pct.toFixed(1)) : 0,
      color: "hsl(152, 69%, 45%)",
    };
  });

  const avgDelivery = deliveryData.length
    ? (deliveryData.reduce((sum: number, d: any) => sum + (d.percentage || 0), 0) / deliveryData.length).toFixed(1)
    : "0";

  const filteredProducts = sheetData 
    ? filterProductsByPeriod(sheetData.topProducts, productPeriod)
        .sort((a, b) => b.DeliveryPercentile - a.DeliveryPercentile)
        .slice(0, 5)
    : [];

  const filteredOrders = orderFilter === "all" 
    ? allOrders 
    : allOrders.filter(order => order.status === orderFilter);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Analytics</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Real-time business insights</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date Range */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                  showDateDropdown ? "bg-foreground text-background" : "bg-card border border-border hover:border-primary/40"
                )}
              >
                {selectedDateLabel}
                <ChevronDown className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform", showDateDropdown && "rotate-180")} />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 bg-card border border-border rounded-xl shadow-xl z-50 py-1 animate-fade-in">
                  {dateRanges.map((range) => (
                    <button
                      key={range.id}
                      className={cn(
                        "w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors",
                        dateRange === range.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                      )}
                      onClick={() => { setDateRange(range.id); setShowDateDropdown(false); }}
                    >
                      {range.label}
                      {dateRange === range.id && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="p-2 sm:p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            </button>
            
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl gradient-hero text-primary-foreground text-xs sm:text-sm font-semibold shadow-glow hover:opacity-90 transition-all">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* PRIMARY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricInfoPopover metricKey="revenue">
            <div className="col-span-2 lg:col-span-1 gradient-hero rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground shadow-glow relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-medium opacity-80 flex items-center gap-1.5">
                    Total Revenue
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-1.5 sm:mt-2">
                  {loadingData ? "Loading..." : sheetData ? `Rs ${sheetData.basics.total_revenue.toLocaleString()}` : "Rs 0"}
                </p>
                <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-semibold text-success">+18.2%</span>
                </div>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="profit">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Profit
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
                {loadingData ? "Loading..." : sheetData ? `Rs ${sheetData.basics.total_profit.toLocaleString()}` : "Rs 0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+15.3%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="orders">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Orders
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-info/10"><ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
                {loadingData ? "Loading..." : sheetData ? sheetData.basics.total_orders.toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+8.2%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="pending">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Pending
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/10"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
                {loadingData ? "Loading..." : sheetData ? sheetData.basics.pending_inprogress_orders.toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">-8.5%</span>
              </div>
            </div>
          </MetricInfoPopover>
        </div>

        {/* ROW 2-4: Revenue Overview (left) + Customers/Order Status/Delivery (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* LEFT - Revenue Overview */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Revenue Overview</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Monthly revenue and orders</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-info" /> Orders</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} dy={8} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v/1000}k`} width={35} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(210, 90%, 55%)" }} width={30} />
                  <Tooltip content={<SalesTooltip />} />
                  <Area yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(152, 69%, 45%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  <Area yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(210, 90%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT - Customers → Order Status → Delivery Performance (stacked) */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
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
                <p className="text-2xl font-bold mt-2">
                  {loadingData ? "Loading..." : sheetData ? sheetData.basics.customers.toLocaleString() : "0"}
                </p>
              </div>
            </MetricInfoPopover>

            {/* Order Status - Coming Soon */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card relative overflow-hidden">
              <div className="opacity-20">
                <h3 className="font-bold text-foreground text-sm mb-3">Order Status</h3>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {orderStatusData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
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
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-[1px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground">Coming Soon</p>
                <p className="text-xs text-muted-foreground text-center px-4 mt-1">
                  Order status tracking jald aa raha hai!
                </p>
              </div>
            </div>

            {/* Delivery Performance */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground">Delivery Performance</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Success rate by {deliveryView}</p>
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                  <button
                    onClick={() => setDeliveryView("partners")}
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                      deliveryView === "partners" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Partners
                  </button>
                  <button
                    onClick={() => setDeliveryView("cities")}
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                      deliveryView === "cities" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Cities
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-2xl font-bold text-primary">{avgDelivery}%</p>
                <span className="text-xs text-success font-semibold">Avg. Success</span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={deliveryData} layout="vertical" barCategoryGap="15%">
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} width={80} interval={0} />
                  <Tooltip content={<DeliveryTooltip />} cursor={false} />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                    {deliveryData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 5: TOP SELLING PRODUCTS */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-foreground">Top Selling Products</h3>
                <p className="text-xs text-muted-foreground">Sorted by Delivery % for {productPeriodOptions.find(o => o.id === productPeriod)?.label}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {productPeriodOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setProductPeriod(option.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      productPeriod === option.id
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

          {loadingData ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No products found for this period</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3 p-4">
                {filteredProducts.map((product, index) => (
                  <div key={product.ProductCode} className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                        index === 1 && "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
                        index === 2 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground line-clamp-2">{product.Product}</p>
                        <p className="text-[10px] text-muted-foreground">{product.Category} · {product.Subcategory}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">{product.TotalOrders} orders</span>
                          <span className="text-xs text-success font-semibold">{product.DeliveredOrders} delivered</span>
                        </div>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                        product.DeliveryPercentile >= 90 ? "bg-success/10 text-success" : product.DeliveryPercentile >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      )}>
                        <Truck className="w-3 h-3" />
                        {product.DeliveryPercentile.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Total Orders</th>
                      <th className="text-right py-3 px-4">Delivered</th>
                      <th className="text-right py-3 px-4">Delivery %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredProducts.map((product, index) => (
                      <tr key={product.ProductCode} className="hover:bg-muted/30 transition-colors">
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
                          <p className="font-semibold text-sm text-foreground max-w-xs">{product.Product}</p>
                          <p className="text-[10px] text-muted-foreground">{product.ProductCode}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium">{product.Category}</p>
                          <p className="text-[10px] text-muted-foreground">{product.Subcategory}</p>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-sm">{product.TotalOrders}</td>
                        <td className="py-3 px-4 text-right font-semibold text-sm text-success">{product.DeliveredOrders}</td>
                        <td className="py-3 px-4 text-right">
                          <div className={cn(
                            "inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold",
                            product.DeliveryPercentile >= 90 ? "bg-success/10 text-success" : product.DeliveryPercentile >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                          )}>
                            <Truck className="w-3 h-3" />
                            {product.DeliveryPercentile.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ROW 6: RECENT ORDERS - With Coming Soon Overlay */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden relative">
          {/* Blurred Background Content */}
          <div className="blur-sm pointer-events-none select-none">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Recent Orders</h3>
                <span className="text-xs text-muted-foreground">{filteredOrders.length} orders</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {orderFilters.map((filter) => (
                  <button
                    key={filter.id}
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
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status?.icon || CheckCircle2;
                return (
                  <div key={order.id} className="flex items-center gap-3 px-4 py-3">
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
              })}
            </div>
            
            <div className="p-3 border-t border-border bg-muted/30">
              <button className="w-full py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                View All Orders →
              </button>
            </div>
          </div>

          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Recent orders tracking abhi development mein hai. Jald real-time order updates ke liye wapas aayein!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;