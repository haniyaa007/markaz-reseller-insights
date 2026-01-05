import { useState } from "react";
import { 
  CheckCircle2, Clock, Package, XCircle, AlertCircle, Download, ChevronDown, Check, RefreshCw, Info, Search, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";

// Recent Orders - ALL STATUSES
const allOrders = [
  { id: "ORD-7829", customer: "Ahmed K.", amount: 880, profit: 88, status: "delivered", date: "Dec 20", time: "14:30", items: 2 },
  { id: "ORD-7828", customer: "Fatima A.", amount: 1455, profit: 145, status: "in-progress", date: "Dec 19", time: "10:15", items: 3 },
  { id: "ORD-7827", customer: "Usman S.", amount: 3758, profit: 376, status: "shippers-advice", date: "Dec 18", time: "16:45", items: 5 },
  { id: "ORD-7826", customer: "Zainab H.", amount: 2152, profit: 215, status: "delivered", date: "Dec 17", time: "09:20", items: 4 },
  { id: "ORD-7825", customer: "Bilal A.", amount: 927, profit: 93, status: "cancelled", date: "Dec 16", time: "11:30", items: 1 },
  { id: "ORD-7824", customer: "Ayesha M.", amount: 1280, profit: 128, status: "returned", date: "Dec 15", time: "13:10", items: 2 },
  { id: "ORD-7823", customer: "Hassan R.", amount: 650, profit: 65, status: "delivered", date: "Dec 14", time: "15:25", items: 1 },
  { id: "ORD-7822", customer: "Sana T.", amount: 2890, profit: 289, status: "in-progress", date: "Dec 13", time: "12:40", items: 6 },
  { id: "ORD-7821", customer: "Omar K.", amount: 1750, profit: 175, status: "shippers-advice", date: "Dec 12", time: "10:55", items: 3 },
  { id: "ORD-7820", customer: "Nadia S.", amount: 3200, profit: 320, status: "delivered", date: "Dec 11", time: "14:15", items: 4 },
  { id: "ORD-7819", customer: "Ali R.", amount: 567, profit: 57, status: "delivered", date: "Dec 10", time: "16:30", items: 2 },
  { id: "ORD-7818", customer: "Sara K.", amount: 1890, profit: 189, status: "in-progress", date: "Dec 9", time: "09:45", items: 3 },
  { id: "ORD-7817", customer: "Fahad M.", amount: 432, profit: 43, status: "cancelled", date: "Dec 8", time: "11:20", items: 1 },
  { id: "ORD-7816", customer: "Mariam S.", amount: 2340, profit: 234, status: "delivered", date: "Dec 7", time: "13:50", items: 5 },
  { id: "ORD-7815", customer: "Zahid H.", amount: 890, profit: 89, status: "returned", date: "Dec 6", time: "15:10", items: 2 },
];

// Order Filters
const orderFilters = [
  { id: "all", label: "All", count: 1247 },
  { id: "delivered", label: "Delivered", count: 892 },
  { id: "in-progress", label: "In Progress", count: 186 },
  { id: "shippers-advice", label: "Shipping", count: 74 },
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

// Status Config
const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  delivered: { icon: CheckCircle2, color: "text-success", label: "Delivered" },
  "in-progress": { icon: Clock, color: "text-warning", label: "In Progress" },
  "shippers-advice": { icon: Package, color: "text-info", label: "Shipping" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
  returned: { icon: AlertCircle, color: "text-muted-foreground", label: "Returned" },
};

// Order Definitions
const orderDefinitions: Record<string, { title: string; description: string }> = {
  delivered: {
    title: "Delivered Orders",
    description: "Orders that have been successfully delivered to customers."
  },
  "in-progress": {
    title: "In Progress Orders",
    description: "Orders that are currently being processed or prepared for shipment."
  },
  "shippers-advice": {
    title: "Shipping Orders",
    description: "Orders that have been handed over to shipping partners and are in transit."
  },
  cancelled: {
    title: "Cancelled Orders",
    description: "Orders that were cancelled by customers or the seller."
  },
  returned: {
    title: "Returned Orders",
    description: "Orders that were delivered but subsequently returned by customers."
  }
};

// Order Info Popover Component
const OrderInfoPopover = ({ statusKey, children }: { statusKey: string; children: React.ReactNode }) => {
  const definition = orderDefinitions[statusKey];
  if (!definition) return <>{children}</>;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" side="bottom" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-foreground">{definition.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{definition.description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const RecentOrders = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  // Filter orders based on selected filter and search
  const filteredOrders = allOrders.filter(order => {
    const matchesFilter = orderFilter === "all" || order.status === orderFilter;
    const matchesSearch = searchQuery === "" || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate summary stats
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalProfit = filteredOrders.reduce((sum, order) => sum + order.profit, 0);
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Recent Orders</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Latest customer orders and their status</p>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Orders</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{filteredOrders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">In selected period</p>
          </div>
          
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">From filtered orders</p>
          </div>
          
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Profit</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-info/10"><Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {totalProfit.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Net earnings</p>
          </div>
          
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/10"><Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" /></div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {avgOrderValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Per order average</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 border border-border shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search orders by ID, customer, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
              />
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
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Order List</h3>
              <span className="text-xs text-muted-foreground">{filteredOrders.length} orders found</span>
            </div>
          </div>
          
          <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No orders found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search query</p>
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
                        <OrderInfoPopover statusKey={order.status}>
                          <span className={cn("flex items-center gap-0.5 text-[10px] font-medium", status?.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status?.label}
                          </span>
                        </OrderInfoPopover>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.id} · {order.date} at {order.time} · {order.items} items</p>
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
          
          {filteredOrders.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/30">
              <button className="w-full py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                View All Orders →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
