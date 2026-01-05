import { useState } from "react";
import { 
  TrendingUp, Download, ChevronDown, Check, RefreshCw, Info, ArrowUpRight, ArrowDownRight, DollarSign, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";

// Sales Chart Data
const salesData = [
  { name: "Jan", sales: 145000, orders: 89, profit: 29000, growth: 5.2 },
  { name: "Feb", sales: 198000, orders: 124, profit: 39600, growth: 36.6 },
  { name: "Mar", sales: 167000, orders: 98, profit: 33400, growth: -15.7 },
  { name: "Apr", sales: 234000, orders: 156, profit: 46800, growth: 40.1 },
  { name: "May", sales: 189000, orders: 132, profit: 37800, growth: -19.2 },
  { name: "Jun", sales: 267000, orders: 178, profit: 53400, growth: 41.3 },
  { name: "Jul", sales: 298000, orders: 195, profit: 59600, growth: 11.6 },
  { name: "Aug", sales: 245000, orders: 167, profit: 49000, growth: -17.8 },
  { name: "Sep", sales: 312000, orders: 208, profit: 62400, growth: 27.3 },
  { name: "Oct", sales: 356000, orders: 234, profit: 71200, growth: 14.1 },
  { name: "Nov", sales: 389000, orders: 258, profit: 77800, growth: 9.3 },
  { name: "Dec", sales: 423000, orders: 289, profit: 84600, growth: 8.7 },
];

// Quarterly Data
const quarterlyData = [
  { quarter: "Q1", revenue: 510000, profit: 102000, orders: 311, growth: 12.3 },
  { quarter: "Q2", revenue: 690000, profit: 138000, orders: 466, growth: 35.3 },
  { quarter: "Q3", revenue: 855000, profit: 171000, orders: 570, growth: 23.9 },
  { quarter: "Q4", revenue: 1168000, profit: 233600, orders: 781, growth: 36.6 },
];

// Category Revenue
const categoryRevenue = [
  { category: "Fashion", revenue: 890000, percentage: 31.2, color: "hsl(152, 69%, 45%)" },
  { category: "Electronics", revenue: 678000, percentage: 23.8, color: "hsl(210, 90%, 55%)" },
  { category: "Beauty", revenue: 456000, percentage: 16.0, color: "hsl(38, 92%, 50%)" },
  { category: "Home", revenue: 345000, percentage: 12.1, color: "hsl(280, 65%, 55%)" },
  { category: "Kids", revenue: 289000, percentage: 10.1, color: "hsl(340, 75%, 55%)" },
  { category: "Others", revenue: 191560, percentage: 6.8, color: "hsl(0, 72%, 51%)" },
];

// Date Range Data
const dateRanges = [
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "3months", label: "3 Months" },
  { id: "6months", label: "6 Months" },
  { id: "1year", label: "1 Year" },
  { id: "lifetime", label: "All Time" },
];

// Revenue Definitions
const revenueDefinitions: Record<string, { title: string; description: string }> = {
  total: {
    title: "Total Revenue",
    description: "The total amount of money generated from all sales before any deductions."
  },
  profit: {
    title: "Net Profit",
    description: "Your earnings after deducting all costs, fees, and expenses from revenue."
  },
  growth: {
    title: "Revenue Growth",
    description: "The percentage change in revenue compared to the previous period."
  },
  avg: {
    title: "Average Order Value",
    description: "The average amount spent per order, calculated as total revenue divided by number of orders."
  }
};

// Revenue Info Popover Component
const RevenueInfoPopover = ({ metricKey, children }: { metricKey: string; children: React.ReactNode }) => {
  const metric = revenueDefinitions[metricKey];
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
          {payload[1] && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-info" />
              <span className="text-xs text-muted-foreground">Orders:</span>
              <span className="text-xs font-bold text-foreground ml-auto">{payload[1].value}</span>
            </div>
          )}
          {payload[2] && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Profit:</span>
              <span className="text-xs font-bold text-foreground ml-auto">Rs {payload[2].value.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-bold text-foreground">{data.category}</p>
        <p className="text-lg font-bold" style={{ color: data.color }}>Rs {data.revenue.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const RevenueOverview = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [chartView, setChartView] = useState<"monthly" | "quarterly">("monthly");

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;
  const chartData = chartView === "monthly" ? salesData : quarterlyData;
  const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || item.sales || 0), 0);
  const totalProfit = chartData.reduce((sum, item) => sum + (item.profit || 0), 0);
  const totalOrders = chartData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Revenue Overview</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Comprehensive revenue analysis and trends</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <RevenueInfoPopover metricKey="total">
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
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-1.5 sm:mt-2">Rs {totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">+28.4%</span>
                </div>
              </div>
            </div>
          </RevenueInfoPopover>

          <RevenueInfoPopover metricKey="profit">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Net Profit
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {totalProfit.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+32.1%</span>
              </div>
            </div>
          </RevenueInfoPopover>

          <RevenueInfoPopover metricKey="avg">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Avg Order Value
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-info/10"><DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {avgOrderValue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+8.7%</span>
              </div>
            </div>
          </RevenueInfoPopover>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Orders</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{totalOrders.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
              <span className="text-[10px] sm:text-xs font-semibold text-success">+18.2%</span>
            </div>
          </div>
        </div>

        {/* Main Revenue Chart */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Revenue Trends</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Revenue, orders, and profit over time</p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setChartView("monthly")}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                  chartView === "monthly" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartView("quarterly")}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                  chartView === "quarterly" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                Quarterly
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs mb-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-info" /> Orders</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-success" /> Profit</span>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" vertical={false} />
              <XAxis dataKey={chartView === "monthly" ? "name" : "quarter"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} dy={8} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v/1000}k`} width={35} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(210, 90%, 55%)" }} width={30} />
              <Tooltip content={<SalesTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey={chartView === "monthly" ? "sales" : "revenue"} stroke="hsl(152, 69%, 45%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(210, 90%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
              <Area yAxisId="left" type="monotone" dataKey="profit" stroke="hsl(38, 92%, 50%)" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground">Revenue by Category</h3>
              <span className="text-xs text-muted-foreground">Top performers</span>
            </div>
            <div className="space-y-3">
              {categoryRevenue.map((category, index) => (
                <div key={category.category} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: category.color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">{category.category}</span>
                      <span className="text-sm font-bold" style={{ color: category.color }}>Rs {category.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{category.percentage}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground">Growth Metrics</h3>
              <span className="text-xs text-muted-foreground">Period over period</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-success/10">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Revenue Growth</p>
                    <p className="text-xs text-muted-foreground">Year over year</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">+28.4%</p>
                  <p className="text-xs text-muted-foreground">vs last year</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-info/5 border border-info/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-info/10">
                    <ArrowUpRight className="w-4 h-4 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Profit Margin</p>
                    <p className="text-xs text-muted-foreground">Current period</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-info">16.5%</p>
                  <p className="text-xs text-muted-foreground">+2.3% vs target</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-warning/10">
                    <Calendar className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Order Growth</p>
                    <p className="text-xs text-muted-foreground">Monthly average</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-warning">+18.2%</p>
                  <p className="text-xs text-muted-foreground">Steady increase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
