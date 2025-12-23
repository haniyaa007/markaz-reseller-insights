import { Heart, TrendingUp, Share2 } from "lucide-react";

const favorites = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", price: 1455, commission: 145, sold: 420, image: "👕" },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", price: 880, commission: 88, sold: 385, image: "💎" },
  { id: 3, name: "Kulomi Pajamas Women's Coral Fleece", price: 2152, commission: 215, sold: 289, image: "👗" },
  { id: 4, name: "Boys & Girls Quilted Cotton Jacket", price: 3758, commission: 376, sold: 312, image: "🧥" },
];

export function FavoriteProducts() {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive fill-destructive" />
          <h3 className="text-lg font-semibold text-foreground">My Favorites</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
              {product.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-primary">Rs {product.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">· {product.sold} sold</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success font-medium">Rs {product.commission} commission</span>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-secondary text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
