import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Wallet, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Package, label: "Products", active: false },
  { icon: ShoppingCart, label: "Orders", active: false },
  { icon: BarChart3, label: "Analytics", active: true },
  { icon: Wallet, label: "Earnings", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Help & Support", active: false },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-sidebar-foreground">Markaz</span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-6 h-6 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
            collapsed && "absolute -right-3 top-7 bg-primary text-primary-foreground shadow-lg"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              item.active 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </a>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-primary-foreground font-semibold text-sm">AK</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-medium text-sm text-sidebar-foreground truncate">Ahmed Khan</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Reseller</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
