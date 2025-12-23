import { TrendingUp, TrendingDown } from "lucide-react";

const products = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", category: "Fashion", sold: 420, revenue: 611100, trend: "up", change: "+12%" },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", category: "Jewelry", sold: 385, revenue: 338800, trend: "up", change: "+8%" },
  { id: 3, name: "Boys & Girls Quilted Cotton Jacket", category: "Kids Wear", sold: 312, revenue: 1172496, trend: "up", change: "+15%" },
  { id: 4, name: "Kulomi Pajamas Women's Coral Fleece", category: "Sleepwear", sold: 289, revenue: 621928, trend: "down", change: "-3%" },
  { id: 5, name: "Double-headed Wax Carving Knife Set", category: "Tools", sold: 245, revenue: 227115, trend: "up", change: "+5%" },
];

export function TopProductsTable() {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Top Selling Products</h3>
        <p className="text-sm text-muted-foreground">Your best performing products this month</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Units Sold</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <span className="font-medium text-foreground text-sm line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{product.category}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-semibold text-foreground">{product.sold}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-semibold text-foreground">Rs {product.revenue.toLocaleString()}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {product.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-semibold ${product.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {product.change}
                    </span>
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
