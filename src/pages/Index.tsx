// Analytics Dashboard - Updated 2026-01-15
import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, Clock, ShoppingBag, Users,
  Download, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Truck, XCircle, Package, ChevronDown, Check, RefreshCw, AlertCircle, Info
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
import { 
  fetchSheetData, 
  type SheetData, 
  type BasicsData,
  type TopProduct, 
  filterProductsByPeriod,
  findPeriodData,
  periodMapping
} from "@/lib/googlesheet";

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
  orders: {
    title: "Total Orders",
    description: "The complete count of all orders placed within the selected time period, regardless of status."
  },
  pending: {
    title: "Pending Orders",
    description: "Orders that have been placed but not yet shipped or processed. Lower numbers indicate efficient order fulfillment."
  },
  customers: {
    title: "Customers",
    description: "Unique buyers who have made at least one purchase. Higher numbers indicate growing market reach."
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
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [deliveryView, setDeliveryView] = useState<"partners" | "cities">("partners");
  
  // Google Sheets Integration
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  // Map dateRange to topProducts period format
  const getProductPeriod = (range: string): string => {
    const mapping: Record<string, string> = {
      "7days": "7_DAYS",
      "30days": "30_DAYS",
      "3months": "3_MONTHS",
      "6months": "6_MONTHS",
      "1year": "1_YEAR",
      "lifetime": "ALL_TIME"
    };
    return mapping[range] || "30_DAYS";
  };

  // Fetch data from Google Sheets
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const data = await fetchSheetData();
        console.log('Sheet data loaded:', data);
        setSheetData(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Get current period data
  const currentPeriodData = sheetData ? findPeriodData(sheetData.basics, dateRange) : null;

  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
  };

  // Filter and sort products by selected period and delivery percentage
  const productPeriod = getProductPeriod(dateRange);
  const filteredProducts = sheetData 
    ? filterProductsByPeriod(sheetData.topProducts, productPeriod)
        .sort((a, b) => b.DeliveryPercentage - a.DeliveryPercentage)
        .slice(0, 10)
    : [];

  // Prepare delivery data for charts
  const deliveryDataPartners = sheetData?.deliveryPerformanceCourier.map((item, idx) => ({
    name: item.partner,
    delivered: item.successful_deliveries,
    total: item.total_orders,
    percentage: (item.success_rate * 100),
    color: ["hsl(152, 69%, 45%)", "hsl(210, 90%, 55%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 55%)"][idx % 4]
  })) || [];

  const deliveryDataCities = sheetData?.deliveryPerformanceCity.map((item, idx) => ({
    name: item.city,
    delivered: item.successful_deliveries,
    total: item.total_orders,
    percentage: (item.success_rate * 100),
    color: ["hsl(152, 69%, 45%)", "hsl(210, 90%, 55%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 55%)"][idx % 4]
  })) || [];

  const deliveryData = deliveryView === "partners" ? deliveryDataPartners : deliveryDataCities;
  const avgDelivery = deliveryData.length > 0 
    ? (deliveryData.reduce((sum, d) => sum + d.percentage, 0) / deliveryData.length).toFixed(1)
    : "0.0";

  // Prepare order status data (mock for now, can be calculated from sheet data if available)
  const avgOrders = currentPeriodData?.avg_orders ?? 0;
  const orderStatusData = [
    { name: "Delivered", value: Math.round(avgOrders * 0.71) || 0, color: "hsl(152, 69%, 45%)" },
    { name: "In Transit", value: Math.round(avgOrders * 0.15) || 0, color: "hsl(210, 90%, 55%)" },
    { name: "Pending", value: currentPeriodData?.pending_orders ?? 0, color: "hsl(38, 92%, 50%)" },
    { name: "Cancelled", value: Math.round(avgOrders * 0.03) || 0, color: "hsl(0, 72%, 51%)" },
  ];

  const totalOrdersForPie = orderStatusData.reduce((sum, item) => sum + (item.value || 0), 0);

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
            
            <button 
              className="p-2 sm:p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all"
              onClick={() => window.location.reload()}
            >
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
                  {loadingData ? "Loading..." : currentPeriodData ? formatCurrency(currentPeriodData.avg_revenue) : "Rs 0"}
                </p>
                <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">+18.2%</span>
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
                {loadingData ? "Loading..." : currentPeriodData ? formatCurrency(currentPeriodData.avg_profit) : "Rs 0"}
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
                {loadingData ? "Loading..." : currentPeriodData ? Math.round(currentPeriodData.avg_orders).toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+8.2%</span>
              </div>
            </div>
          </MetricInfoPopover>

          {/* Pending Orders - Coming Soon */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card relative overflow-hidden">
            {/* Blurred Content */}
            <div className="blur-sm opacity-50">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/10"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">0</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">-8.5%</span>
              </div>
            </div>
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <div className="text-center">
                <Clock className="w-6 h-6 text-warning mx-auto mb-1" />
                <p className="text-xs font-semibold text-foreground">Jaldi Aa Raha Hai</p>
              </div>
            </div>
          </div>
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
              {loadingData || !sheetData?.orderRevenueChart.length ? (
                <div className="flex items-center justify-center h-[380px]">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={sheetData.orderRevenueChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                    <XAxis dataKey="month_name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} dy={8} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={35} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(210, 90%, 55%)" }} width={30} />
                    <Tooltip content={<SalesTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="total_revenue" stroke="hsl(152, 69%, 45%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                    <Area yAxisId="right" type="monotone" dataKey="total_orders" stroke="hsl(210, 90%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
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
                  {loadingData ? "Loading..." : currentPeriodData ? Math.round(currentPeriodData.avg_customers).toLocaleString() : "0"}
                </p>
              </div>
            </MetricInfoPopover>

            {/* Order Status - Coming Soon */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card relative overflow-hidden">
              {/* Blurred Content */}
              <div className="blur-sm opacity-40">
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
                      <p className="text-xl font-bold">0</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1">
                    {orderStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-bold text-foreground ml-auto">0</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[3px]">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Jaldi Aa Raha Hai</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Order status tracking</p>
                </div>
              </div>
            </div>

            {/* Delivery Performance */}
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    Delivery Performance
                  </h3>
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
              {loadingData || deliveryData.length === 0 ? (
                <div className="flex items-center justify-center h-[140px]">
                  <p className="text-sm text-muted-foreground">Loading delivery data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={deliveryData} layout="vertical" barCategoryGap="15%">
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} width={80} interval={0} />
                    <Tooltip content={<DeliveryTooltip />} cursor={false} />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                      {deliveryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* ROW 5: PROFIT BANDS ANALYSIS */}
        {sheetData && sheetData.profitBand.length > 0 && (
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Profit Bands Analysis</h3>
              <p className="text-xs text-muted-foreground">Performance by profit margin for {selectedDateLabel}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    <th className="text-left py-3 px-4">Profit Band</th>
                    <th className="text-right py-3 px-4">Reseller Pay</th>
                    <th className="text-right py-3 px-4">Money Earned</th>
                    <th className="text-right py-3 px-4">Potential Earnings</th>
                    <th className="text-right py-3 px-4">Delivered</th>
                    <th className="text-right py-3 px-4">Returned & Lost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {sheetData.profitBand.map((band, index) => {
                    // Get data based on selected date range
                    const getProfitBandData = () => {
                      switch (dateRange) {
                        case "7days":
                          return {
                            resellerPay: band.reseller_pay_7d,
                            moneyEarned: band.money_earned_7d,
                            potentialEarnings: band.potential_earnings_7d,
                            delivered: band.delivered_7d,
                            returnedLost: band.returned_lost_7d
                          };
                        case "30days":
                          return {
                            resellerPay: band.reseller_pay_30d,
                            moneyEarned: band.money_earned_30d,
                            potentialEarnings: band.potential_earnings_30d,
                            delivered: band.delivered_30d,
                            returnedLost: band.returned_lost_30d
                          };
                        case "3months":
                          return {
                            resellerPay: band.reseller_pay_3m,
                            moneyEarned: band.money_earned_3m,
                            potentialEarnings: band.potential_earnings_3m,
                            delivered: band.delivered_3m,
                            returnedLost: band.returned_lost_3m
                          };
                        case "6months":
                          return {
                            resellerPay: band.reseller_pay_6m,
                            moneyEarned: band.money_earned_6m,
                            potentialEarnings: band.potential_earnings_6m,
                            delivered: band.delivered_6m,
                            returnedLost: band.returned_lost_6m
                          };
                        case "1year":
                          return {
                            resellerPay: band.reseller_pay_1y,
                            moneyEarned: band.money_earned_1y,
                            potentialEarnings: band.potential_earnings_1y,
                            delivered: band.delivered_1y,
                            returnedLost: band.returned_lost_1y
                          };
                        case "lifetime":
                          return {
                            resellerPay: band.reseller_pay_all,
                            moneyEarned: band.money_earned_all,
                            potentialEarnings: band.potential_earnings_all,
                            delivered: band.delivered_all,
                            returnedLost: band.returned_lost_all
                          };
                        default:
                          return {
                            resellerPay: band.reseller_pay_30d,
                            moneyEarned: band.money_earned_30d,
                            potentialEarnings: band.potential_earnings_30d,
                            delivered: band.delivered_30d,
                            returnedLost: band.returned_lost_30d
                          };
                      }
                    };
                    const data = getProfitBandData();
                    
                    return (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 w-12">
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-xs font-semibold",
                            band.profit_band === "0-40%" && "bg-destructive/10 text-destructive",
                            band.profit_band === "40-80%" && "bg-warning/10 text-warning",
                            band.profit_band === "80-100%" && "bg-info/10 text-info",
                            band.profit_band === "100-150%" && "bg-success/10 text-success"
                          )}>
                            {band.profit_band}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(data.resellerPay || 0)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-success">{formatCurrency(data.moneyEarned || 0)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-primary">{formatCurrency(data.potentialEarnings || 0)}</td>
                        <td className="py-3 px-4 text-right font-semibold">{(data.delivered || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-destructive">{(data.returnedLost || 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROW 6: TOP SELLING PRODUCTS */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground">Top Selling Products</h3>
              <p className="text-xs text-muted-foreground">Sorted by Delivery % for {selectedDateLabel}</p>
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
                        product.DeliveryPercentage >= 90 ? "bg-success/10 text-success" : product.DeliveryPercentage >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      )}>
                        <Truck className="w-3 h-3" />
                        {product.DeliveryPercentage.toFixed(1)}%
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
                        <td className="py-3 px-4 pr-6">
                          <p className="font-semibold text-sm text-foreground">{product.Product}</p>
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
                            product.DeliveryPercentage >= 90 ? "bg-success/10 text-success" : product.DeliveryPercentage >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                          )}>
                            <Truck className="w-3 h-3" />
                            {product.DeliveryPercentage.toFixed(1)}%
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

        {/* ROW 7: RECENT ORDERS - With Coming Soon Overlay */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden relative">
          {/* Coming Soon Overlay */}
          <div className="flex items-center justify-center bg-background/80 backdrop-blur-sm py-20">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Recent orders tracking is currently under development. Check back soon for real-time order updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;