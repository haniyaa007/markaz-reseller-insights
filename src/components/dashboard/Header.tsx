import { Bell, Search, Calendar } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reseller Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your performance and grow your business</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search products, orders..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Date Range */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Last 30 Days</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
