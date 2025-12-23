import { Bell, Search, RefreshCw } from "lucide-react";
import { AccountDropdown } from "./AccountDropdown";
import { DateRangePicker } from "./DateRangePicker";

interface HeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function Header({ dateRange, onDateRangeChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:block">Markaz</span>
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-foreground">Reseller Analytics</h1>
          <p className="text-xs text-muted-foreground">Track your performance</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search products, orders..."
            className="pl-10 pr-4 py-2 w-64 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Refresh */}
        <button className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors hidden sm:flex">
          <RefreshCw className="w-4 h-4 text-foreground" />
        </button>

        {/* Date Range Picker */}
        <DateRangePicker 
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
        />

        {/* Account Dropdown */}
        <AccountDropdown />

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
