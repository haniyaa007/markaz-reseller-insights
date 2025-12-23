import { Bell, Search, RefreshCw, Menu } from "lucide-react";
import { AccountDropdown } from "./AccountDropdown";
import { DateRangePicker } from "./DateRangePicker";

interface HeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function Header({ dateRange, onDateRangeChange }: HeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border/60 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-extrabold text-xl">M</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground leading-tight">Markaz</h1>
            <p className="text-xs text-muted-foreground font-medium">Reseller Analytics</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search products, orders..."
            className="pl-11 pr-5 py-2.5 w-72 rounded-full border border-border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Refresh */}
        <button className="p-2.5 rounded-xl border border-border bg-background/80 hover:bg-muted transition-all hidden md:flex">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Date Range Picker */}
        <DateRangePicker 
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
        />

        {/* Account Dropdown */}
        <div className="hidden sm:block">
          <AccountDropdown />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl border border-border bg-background/80 hover:bg-muted transition-all">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-5 h-5 gradient-hero rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-glow">
            3
          </span>
        </button>

        {/* Mobile Menu */}
        <button className="p-2.5 rounded-xl border border-border bg-background/80 hover:bg-muted transition-all sm:hidden">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
