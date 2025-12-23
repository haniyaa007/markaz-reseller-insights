import { useState, useRef, useEffect } from "react";
import { ChevronDown, Wallet, FileText, CreditCard, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Wallet, label: "Profit Account", description: "View your earnings" },
  { icon: FileText, label: "Payment Summary", description: "Transaction history" },
  { icon: CreditCard, label: "Withdrawal", description: "Cash out funds" },
  { icon: Download, label: "Export Report", description: "Download CSV" },
];

export function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
          isOpen 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
        )}
      >
        <Wallet className="w-4 h-4" />
        Account
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
