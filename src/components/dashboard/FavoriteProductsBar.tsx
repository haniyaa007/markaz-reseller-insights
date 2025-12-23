import { Heart, TrendingUp, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const favorites = [
  { id: 1, name: "Summer Ultra-short Sunscreen Shirt", price: 1455, commission: 145, sold: 420, image: "👕" },
  { id: 2, name: "Pink Heart Titanium Steel Necklace", price: 880, commission: 88, sold: 385, image: "💎" },
  { id: 3, name: "Kulomi Pajamas Women's Coral Fleece", price: 2152, commission: 215, sold: 289, image: "👗" },
  { id: 4, name: "Boys & Girls Quilted Cotton Jacket", price: 3758, commission: 376, sold: 312, image: "🧥" },
  { id: 5, name: "Women's Casual Denim Shorts", price: 1299, commission: 130, sold: 198, image: "👖" },
  { id: 6, name: "Kids Cartoon Print T-Shirt", price: 650, commission: 65, sold: 245, image: "👶" },
  { id: 7, name: "Men's Running Sports Shoes", price: 2899, commission: 290, sold: 156, image: "👟" },
  { id: 8, name: "Elegant Pearl Drop Earrings", price: 1120, commission: 112, sold: 178, image: "💍" },
];

export function FavoriteProductsBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive fill-destructive" />
          <h3 className="text-lg font-semibold text-foreground">My Favorites</h3>
          <span className="text-sm text-muted-foreground">({favorites.length} products)</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 p-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {favorites.map((product) => (
          <div 
            key={product.id} 
            className="flex-shrink-0 w-64 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-primary">Rs {product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success font-medium">Rs {product.commission} profit</span>
              </div>
              <span className="text-xs text-muted-foreground">{product.sold} sold</span>
            </div>
            <button className="w-full mt-3 py-2 rounded-lg bg-secondary text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
