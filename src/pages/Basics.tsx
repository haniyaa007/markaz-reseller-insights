import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, Clock, ShoppingBag, Users,
  Download, ArrowUpRight, ArrowDownRight, Info, ChevronDown, Check, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";
import { fetchBasicsData, BasicsData } from "@/lib/googlesheet";

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

const Basics = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [data, setData] = useState<BasicsData | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchBasicsData();
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Refresh data handler
  const handleRefresh = async () => {
    setLoading(true);
    const fetchedData = await fetchBasicsData();
    setData(fetchedData);
    setLoading(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString('en-PK')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Basics</h1>
    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Key business metrics overview</p>
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
      onClick={handleRefresh}
      disabled={loading}
      className="p-2 sm:p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all disabled:opacity-50"
    >
      <RefreshCw className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground", loading && "animate-spin")} />
    </button>
    
    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl gradient-hero text-primary-foreground text-xs sm:text-sm font-semibold shadow-glow hover:opacity-90 transition-all">
      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Export</span>
    </button>
  </div>
</div>

{/* DEBUG INFO - Remove later */}
<div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-xl">
  <p className="font-bold text-black">DEBUG INFO:</p>
  <p className="text-black">Loading: {loading ? "YES" : "NO"}</p>
  <p className="text-black">Data: {data ? JSON.stringify(data) : "NULL"}</p>
  <p className="text-black">Revenue: {data?.total_revenue || "NOT FOUND"}</p>
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
                  {loading ? "Loading..." : data ? formatCurrency(data.total_revenue) : "Rs 0"}
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
                {loading ? "Loading..." : data ? formatCurrency(data.total_profit) : "Rs 0"}
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
                {loading ? "Loading..." : data ? data.total_orders.toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+8.2%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="customers">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Customers
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
                {loading ? "Loading..." : data ? data.customers.toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+22.4%</span>
              </div>
            </div>
          </MetricInfoPopover>
        </div>

        {/* SECONDARY METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <MetricInfoPopover metricKey="pending">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Pending Orders
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/10"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
                {loading ? "Loading..." : data ? data.pending_inprogress_orders.toLocaleString() : "0"}
              </p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">-8.5%</span>
              </div>
            </div>
          </MetricInfoPopover>

          <MetricInfoPopover metricKey="conversion">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Conversion Rate
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">3.2%</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+0.4%</span>
              </div>
            </div>
          </MetricInfoPopover>
        </div>
      </div>
    </div>
  );
};

export default Basics;

