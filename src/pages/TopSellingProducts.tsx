import { useState } from "react";
import { 
  Star, Truck, Download, ChevronDown, Check, RefreshCw, Info, TrendingUp, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Header } from "@/components/dashboard/Header";

// Top Products with Delivery %
const topProducts = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", category: "Fashion", sold: 420, revenue: 611100, profit: 61110, rating: 4.8, reviews: 156, deliveryRate: 94.5 },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", category: "Jewelry", sold: 385, revenue: 338800, profit: 33880, rating: 4.9, reviews: 203, deliveryRate: 91.2 },
  { id: 3, name: "Boys & Girls Quilted Cotton Jacket", category: "Kids", sold: 312, revenue: 1172496, profit: 117250, rating: 4.7, reviews: 89, deliveryRate: 88.7 },
  { id: 4, name: "Kulomi Pajamas Women's Coral Fleece", category: "Sleepwear", sold: 289, revenue: 621928, profit: 62193, rating: 4.6, reviews: 124, deliveryRate: 86.3 },
  { id: 5, name: "Double-headed Wax Carving Knife Set", category: "Tools", sold: 245, revenue: 227115, profit: 22712, rating: 4.5, reviews: 67, deliveryRate: 82.1 },
  { id: 6, name: "Premium Wireless Earbuds Pro", category: "Electronics", sold: 198, revenue: 495000, profit: 49500, rating: 4.4, reviews: 312, deliveryRate: 79.5 },
  { id: 7, name: "Organic Face Serum Collection", category: "Beauty", sold: 456, revenue: 182400, profit: 54720, rating: 4.85, reviews: 278, deliveryRate: 96.2 },
  { id: 8, name: "Smart Watch Series 5", category: "Electronics", sold: 167, revenue: 668000, profit: 66800, rating: 4.3, reviews: 145, deliveryRate: 85.4 },
  { id: 9, name: "Yoga Mat Premium Quality", category: "Sports", sold: 234, revenue: 93600, profit: 18720, rating: 4.6, reviews: 89, deliveryRate: 90.1 },
  { id: 10, name: "Ceramic Plant Pot Set", category: "Home", sold: 189, revenue: 56700, profit: 11340, rating: 4.2, reviews: 56, deliveryRate: 87.8 },
];

// Product Sort Options
const productSortOptions = [
  { id: "delivery", label: "Delivery %" },
  { id: "profit", label: "Profit" },
  { id: "revenue", label: "Revenue" },
  { id: "sold", label: "Units Sold" },
  { id: "rating", label: "Rating" },
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

// Product Definitions
const productDefinitions: Record<string, { title: string; description: string }> = {
  delivery: {
    title: "Delivery Success Rate",
    description: "Percentage of orders successfully delivered for this product. Higher rates indicate better fulfillment performance."
  },
  profit: {
    title: "Product Profit",
    description: "Total profit earned from this product after deducting costs and fees."
  },
  revenue: {
    title: "Product Revenue",
    description: "Total revenue generated from this product before any deductions."
  },
  sold: {
    title: "Units Sold",
    description: "Total number of units sold for this product."
  },
  rating: {
    title: "Customer Rating",
    description: "Average customer rating based on reviews. Higher ratings indicate better customer satisfaction."
  }
};

// Product Info Popover Component
const ProductInfoPopover = ({ metricKey, children }: { metricKey: string; children: React.ReactNode }) => {
  const metric = productDefinitions[metricKey];
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

const TopSellingProducts = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [productSort, setProductSort] = useState("delivery");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const selectedDateLabel = dateRanges.find(r => r.id === dateRange)?.label;

  // Sort products based on selected option
  const sortedProducts = [...topProducts].sort((a, b) => {
    switch (productSort) {
      case "delivery": return b.deliveryRate - a.deliveryRate;
      case "profit": return b.profit - a.profit;
      case "revenue": return b.revenue - a.revenue;
      case "sold": return b.sold - a.sold;
      case "rating": return b.rating - a.rating;
      default: return b.deliveryRate - a.deliveryRate;
    }
  });

  // Calculate summary stats
  const totalRevenue = sortedProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = sortedProducts.reduce((sum, p) => sum + p.profit, 0);
  const totalSold = sortedProducts.reduce((sum, p) => sum + p.sold, 0);
  const avgRating = (sortedProducts.reduce((sum, p) => sum + p.rating, 0) / sortedProducts.length).toFixed(1);
  const avgDelivery = (sortedProducts.reduce((sum, p) => sum + p.deliveryRate, 0) / sortedProducts.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Top Selling Products</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Best performing products and their metrics</p>
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <ProductInfoPopover metricKey="revenue">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Total Revenue
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+15.3%</span>
              </div>
            </div>
          </ProductInfoPopover>

          <ProductInfoPopover metricKey="profit">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Total Profit
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">Rs {totalProfit.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+12.7%</span>
              </div>
            </div>
          </ProductInfoPopover>

          <ProductInfoPopover metricKey="sold">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Units Sold
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-info/10"><Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{totalSold.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+8.9%</span>
              </div>
            </div>
          </ProductInfoPopover>

          <ProductInfoPopover metricKey="rating">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Avg Rating
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/10"><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{avgRating}</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+0.2</span>
              </div>
            </div>
          </ProductInfoPopover>

          <ProductInfoPopover metricKey="delivery">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border shadow-card hover:shadow-elevated transition-all group">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Avg Delivery
                  <Info className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </p>
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-success/10"><Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /></div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1.5 sm:mt-2">{avgDelivery}%</p>
              <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                <span className="text-[10px] sm:text-xs font-semibold text-success">+1.8%</span>
              </div>
            </div>
          </ProductInfoPopover>
        </div>

        {/* Sort Options */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 border border-border shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-foreground">Product Rankings</h3>
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

        {/* Products List */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3 p-4">
            {sortedProducts.map((product, index) => (
              <div key={product.id} className="bg-muted/30 rounded-xl p-4 border border-border/50">
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
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{product.category}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{product.sold} sold</span>
                      <span className="text-xs font-bold text-primary">Rs {product.profit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                    product.deliveryRate >= 90 ? "bg-success/10 text-success" : product.deliveryRate >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                  )}>
                    <Truck className="w-3 h-3" />
                    {product.deliveryRate}%
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
                  <th className="text-center py-3 px-4">Rating</th>
                  <th className="text-right py-3 px-4">Sold</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Profit</th>
                  <th className="text-right py-3 px-4">Delivery %</th>
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
                        product.deliveryRate >= 90 ? "bg-success/10 text-success" : product.deliveryRate >= 80 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      )}>
                        <Truck className="w-3 h-3" />
                        {product.deliveryRate}%
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

export default TopSellingProducts;
