import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Truck, XCircle, AlertCircle, MoreHorizontal, Eye, Copy, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const orders = [
  { id: "ORD-7829", customer: "Ahmed Khan", phone: "+92 300 1234567", product: "Pink Heart Necklace", amount: 880, profit: 88, status: "delivered", date: "Dec 20, 2024" },
  { id: "ORD-7828", customer: "Fatima Ali", phone: "+92 321 9876543", product: "Summer Sunscreen Shirt", amount: 1455, profit: 145, status: "transit", date: "Dec 19, 2024" },
  { id: "ORD-7827", customer: "Usman Sheikh", phone: "+92 333 4567890", product: "Quilted Cotton Jacket", amount: 3758, profit: 376, status: "in-progress", date: "Dec 18, 2024" },
  { id: "ORD-7826", customer: "Zainab Hassan", phone: "+92 345 6789012", product: "Coral Fleece Pajamas", amount: 2152, profit: 215, status: "delivered", date: "Dec 17, 2024" },
  { id: "ORD-7825", customer: "Bilal Ahmed", phone: "+92 312 3456789", product: "Wax Carving Knife Set", amount: 927, profit: 93, status: "cancelled", date: "Dec 16, 2024" },
  { id: "ORD-7824", customer: "Ayesha Malik", phone: "+92 301 2345678", product: "Titanium Steel Necklace", amount: 1280, profit: 128, status: "returned", date: "Dec 15, 2024" },
];

const statusConfig = {
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
  transit: { label: "In Transit", icon: Truck, className: "bg-info/10 text-info border-info/20" },
  "in-progress": { label: "In-progress", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  returned: { label: "Returned", icon: AlertCircle, className: "bg-muted text-muted-foreground border-border" },
};

function ActionDropdown({ orderId }: { orderId: string }) {
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
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Eye className="w-4 h-4" /> View Details
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Copy className="w-4 h-4" /> Copy ID
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <MessageSquare className="w-4 h-4" /> Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersTable() {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 animate-fade-in overflow-hidden" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Orders Overview</h3>
          <p className="text-sm text-muted-foreground">Manage and track your orders</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text"
            placeholder="Order ID, Customer Name/Address..."
            className="px-4 py-2 w-64 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profit</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <tr 
                  key={order.id} 
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-primary">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground text-sm">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground line-clamp-1">{order.product}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-foreground">Rs {order.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-success">Rs {order.profit}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", status.className)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <ActionDropdown orderId={order.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 6 of 370 orders</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Previous</button>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">1</button>
          <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">2</button>
          <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">3</button>
          <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
