import { TrendingUp, TrendingDown, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", category: "Fashion", sold: 420, revenue: 611100, profit: 61110, trend: "up", change: "+12%", rating: 4.8 },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", category: "Jewelry", sold: 385, revenue: 338800, profit: 33880, trend: "up", change: "+8%", rating: 4.9 },
  { id: 3, name: "Boys & Girls Quilted Cotton Jacket", category: "Kids", sold: 312, revenue: 1172496, profit: 117250, trend: "up", change: "+15%", rating: 4.7 },
  { id: 4, name: "Kulomi Pajamas Women's Coral Fleece", category: "Sleepwear", sold: 289, revenue: 621928, profit: 62193, trend: "down", change: "-3%", rating: 4.6 },
  { id: 5, name: "Double-headed Wax Carving Knife Set", category: "Tools", sold: 245, revenue: 227115, profit: 22712, trend: "up", change: "+5%", rating: 4.5 },
];

export function TopProductsTable() {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Top Selling Products</h3>
            <p className="text-sm text-muted-foreground mt-1">Your best performers this period</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all">
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Units Sold</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Profit</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                    index === 1 && "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
                    index === 2 && "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">{product.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-semibold text-foreground">{product.sold.toLocaleString()}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-semibold text-foreground">Rs {product.revenue.toLocaleString()}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-bold text-primary">Rs {product.profit.toLocaleString()}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                    product.trend === "up" 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {product.trend === "up" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {product.change}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
