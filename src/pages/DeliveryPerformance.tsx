import { useState, useEffect } from "react";
import { 
  Truck, Download, ChevronDown, Check, RefreshCw, Info, TrendingUp, TrendingDown, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";
import { fetchDeliveryPerformanceData, DeliveryPerformanceData } from "@/lib/googlesheet";

// Delivery Performance Data - By Cities (fallback data)
const deliveryByCities = [
  { name: "Karachi", delivered: 389, total: 420, percentage: 92.6, color: "hsl(152, 69%, 45%)" },
  { name: "Lahore", delivered: 312, total: 350, percentage: 89.1, color: "hsl(210, 90%, 55%)" },
  { name: "Islamabad", delivered: 198, total: 225, percentage: 88.0, color: "hsl(38, 92%, 50%)" },
  { name: "Faisalabad", delivered: 154, total: 200, percentage: 77.0, color: "hsl(280, 65%, 55%)" },
  { name: "Rawalpindi", delivered: 142, total: 180, percentage: 78.9, color: "hsl(340, 75%, 55%)" },
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

// Delivery Definitions
const deliveryDefinitions: Record<string, { title: string; description: string }> = {
  partners: {
    title: "Delivery Partners",
    description: "Performance metrics for different shipping companies and delivery partners."
  },
  cities: {
    title: "Delivery by Cities",
    description: "Success rates broken down by destination cities and geographic regions."
  },
  success: {
    title: "Delivery Success Rate",
    description: "Percentage of orders successfully delivered compared to total orders shipped."
  },
  avg: {
    title: "Average Performance",
    description: "The overall average delivery success rate across all partners or cities."
  }
};

// Delivery Info Popover Component
const DeliveryInfoPopover = ({ metricKey, children }: { metricKey: string; children: React.ReactNode }) => {
  const metric = deliveryDefinitions[metricKey];
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

// Custom Tooltip
const DeliveryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
        <p className="text-sm font-bold text-foreground">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.color }}>{data.percentage}%</p>
        <div className="text-xs text-muted-foreground mt-1">
          <p>{data.delivered} of {data.total} delivered</p>
          <p>{data.total - data.delivered} failed</p>
        </div>
      </div>
    );
  }
  return null;
};

const DeliveryPerformance = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [deliveryView, setDeliveryView] = useState<"partners" | "cities">("partners");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [deliveryData, setDeliveryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  useEffect(() => {
    const loadDeliveryData = async () => {
      try {
        setLoading(true);
        const data = await fetchDeliveryPerformanceData();
        
        if (data && data.length > 0) {
          // Transform Google Sheets data to match our format
          const transformedData = data.map((item: DeliveryPerformanceData) => ({
            name: item.Partner,
            delivered: item.Delivered,
            total: item.Total,
            percentage: item.Percentage,
            color: getColorForPartner(item.Partner)
          }));
          setDeliveryData(transformedData);
        } else {
          // Use fallback data if no data from Google Sheets
          setDeliveryData(deliveryByCities);
        }
      } catch (error) {
        console.error('Error loading delivery data:', error);
        // Use fallback data on error
        setDeliveryData(deliveryByCities);
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryData();
  }, []);

  const getColorForPartner = (partner: string): string => {
    const colors: Record<string, string> = {
      "TCS": "hsl(152, 69%, 45%)",
      "PostEx": "hsl(210, 90%, 55%)",
      "Leopards": "hsl(38, 92%, 50%)",
      "M&P": "hsl(280, 65%, 55%)",
      "Karachi": "hsl(152, 69%, 45%)",
      "Lahore": "hsl(210, 90%, 55%)",
      "Islamabad": "hsl(38, 92%, 50%)",
      "Faisalabad": "hsl(280, 65%, 55%)",
      "Rawalpindi": "hsl(340, 75%, 55%)"
    };
    return colors[partner] || "hsl(0, 72%, 51%)";
  };

  const currentData = deliveryView === "partners" && deliveryData.some(d => ["TCS", "PostEx", "Leopards", "M&P"].includes(d.name))
    ? deliveryData.filter(d => ["TCS", "PostEx", "Leopards", "M&P"].includes(d.name))
    : deliveryView === "cities" && deliveryData.some(d => ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"].includes(d.name))
    ? deliveryData.filter(d => ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"].includes(d.name))
    : deliveryData;

  const avgDelivery = currentData.length > 0 
    ? (currentData.reduce((sum, d) => sum + d.percentage, 0) / currentData.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Delivery Performance</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Monitor delivery success rates and partner performance</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <DeliveryInfoPopover metricKey="avg">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Average Success Rate
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{avgDelivery}%</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+2.3%</span>
              </div>
            </div>
          </DeliveryInfoPopover>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Deliveries</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
              {currentData.reduce((sum, d) => sum + d.delivered, 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
              <span className="text-[10px] sm:text-xs font-semibold text-success">+12.4%</span>
            </div>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Failed Deliveries</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-destructive/10"><Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">
              {currentData.reduce((sum, d) => sum + (d.total - d.delivered), 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
              <span className="text-[10px] sm:text-xs font-semibold text-success">-5.2%</span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" />
                  Delivery Performance
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Success rate by {deliveryView}</p>
              </div>
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
          
          {loading ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="text-muted-foreground">Loading delivery data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={currentData} layout="vertical" barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 45%)", fontWeight: 500 }} width={deliveryView === "partners" ? 80 : 100} interval={0} />
                <Tooltip content={<DeliveryTooltip />} cursor={false} />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {currentData.map((entry, i) => (
                    <Bar key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Detailed Performance Table */}
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Performance Details</h3>
              <span className="text-xs text-muted-foreground">By {deliveryView}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="text-left py-3 px-4">{deliveryView === "partners" ? "Partner" : "City"}</th>
                  <th className="text-center py-3 px-4">Success Rate</th>
                  <th className="text-right py-3 px-4">Delivered</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-right py-3 px-4">Failed</th>
                  <th className="text-center py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {currentData.map((item, index) => (
                  <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-sm text-foreground">{item.name}</span>
                        {deliveryView === "cities" && <MapPin className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-sm" style={{ color: item.color }}>{item.percentage}%</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-sm">{item.delivered.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-sm">{item.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-sm text-destructive">
                      {(item.total - item.delivered).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold",
                        item.percentage >= 90 ? "bg-success/10 text-success" : 
                        item.percentage >= 80 ? "bg-warning/10 text-warning" : 
                        "bg-destructive/10 text-destructive"
                      )}>
                        {item.percentage >= 90 ? "Excellent" : item.percentage >= 80 ? "Good" : "Needs Improvement"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPerformance;