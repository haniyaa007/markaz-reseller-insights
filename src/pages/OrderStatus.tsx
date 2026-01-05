import { useState } from "react";
import { 
  CheckCircle2, Clock, Package, XCircle, AlertCircle, Truck, Download, ChevronDown, Check, RefreshCw, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";

// Order Status Data
const orderStatusData = [
  { name: "Delivered", value: 892, color: "hsl(152, 69%, 45%)", description: "Successfully completed orders" },
  { name: "In Transit", value: 186, color: "hsl(210, 90%, 55%)", description: "Orders currently being shipped" },
  { name: "Pending", value: 74, color: "hsl(38, 92%, 50%)", description: "Orders awaiting processing" },
  { name: "Cancelled", value: 43, color: "hsl(0, 72%, 51%)", description: "Orders that were cancelled" },
  { name: "Returned", value: 52, color: "hsl(280, 65%, 55%)", description: "Orders that were returned" },
];

// Order Filters
const orderFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "delivered", label: "Delivered", count: 892 },
  { id: "in-progress", label: "In Transit", count: 186 },
  { id: "pending", label: "Pending", count: 74 },
  { id: "cancelled", label: "Cancelled", count: 43 },
  { id: "returned", label: "Returned", count: 52 },
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

// Status Definitions
const statusDefinitions: Record<string, { title: string; description: string }> = {
  delivered: {
    title: "Delivered Orders",
    description: "Orders that have been successfully delivered to customers. This is the ideal outcome for all orders."
  },
  "in-progress": {
    title: "In Transit Orders",
    description: "Orders that are currently being shipped and are on their way to the customer."
  },
  pending: {
    title: "Pending Orders",
    description: "Orders that have been placed but not yet processed or shipped. These orders require attention."
  },
  cancelled: {
    title: "Cancelled Orders",
    description: "Orders that were cancelled by either the customer or the seller before shipping."
  },
  returned: {
    title: "Returned Orders",
    description: "Orders that were delivered but subsequently returned by the customer for various reasons."
  }
};

// Status Config
const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  delivered: { icon: CheckCircle2, color: "text-success", label: "Delivered" },
  "in-progress": { icon: Clock, color: "text-warning", label: "In Transit" },
  pending: { icon: Package, color: "text-info", label: "Pending" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
  returned: { icon: AlertCircle, color: "text-muted-foreground", label: "Returned" },
};

// Status Info Popover Component
const StatusInfoPopover = ({ statusKey, children }: { statusKey: string; children: React.ReactNode }) => {
  const status = statusDefinitions[statusKey];
  if (!status) return <>{children}</>;
  
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
            <h4 className="font-bold text-foreground">{status.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{status.description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom Tooltip
const StatusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: data.color }} />
          <span className="text-xs font-semibold text-foreground">{data.name}</span>
          <span className="text-sm font-bold" style={{ color: data.color }}>{data.value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      </div>
    );
  }
  return null;
};

const OrderStatus = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;
  const filteredStatusData = orderFilter === "all" 
    ? orderStatusData 
    : orderStatusData.filter(status => status.name.toLowerCase().replace(' ', '-') === orderFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Order Status</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Track order fulfillment and delivery status</p>
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

        {/* Status Filters */}
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Pie Chart */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Status Distribution</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Order status breakdown</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{filteredStatusData.reduce((sum, item) => sum + item.value, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={filteredStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {filteredStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Cards */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground">Status Details</h3>
              <p className="text-xs text-muted-foreground">Click for details</p>
            </div>
            <div className="space-y-3">
              {filteredStatusData.map((item, index) => {
                const statusKey = item.name.toLowerCase().replace(' ', '-');
                const StatusIcon = statusConfig[statusKey]?.icon || Package;
                const statusColor = statusConfig[statusKey]?.color || "text-muted-foreground";
                
                return (
                  <StatusInfoPopover key={item.name} statusKey={statusKey}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + "20" }}>
                        <StatusIcon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-foreground">{item.name}</p>
                          <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </StatusInfoPopover>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Delivery Rate</span>
            </div>
            <p className="text-2xl font-bold text-success">71.5%</p>
            <p className="text-xs text-muted-foreground mt-1">892 of 1,247 delivered</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Processing Time</span>
            </div>
            <p className="text-2xl font-bold text-warning">18h</p>
            <p className="text-xs text-muted-foreground mt-1">From order to shipment</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-muted-foreground">Cancellation Rate</span>
            </div>
            <p className="text-2xl font-bold text-destructive">3.4%</p>
            <p className="text-xs text-muted-foreground mt-1">43 of 1,247 cancelled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
