import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Truck, XCircle, AlertCircle, MoreHorizontal, Eye, Copy, MessageSquare, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface OrdersTableProps {
  filter: string;
}

const allOrders = [
  { id: "ORD-7829", customer: "Ahmed Khan", phone: "+92 300 1234567", product: "Pink Heart Necklace", amount: 880, profit: 88, status: "delivered", date: "Dec 20, 2024" },
  { id: "ORD-7828", customer: "Fatima Ali", phone: "+92 321 9876543", product: "Summer Sunscreen Shirt", amount: 1455, profit: 145, status: "transit", date: "Dec 19, 2024" },
  { id: "ORD-7827", customer: "Usman Sheikh", phone: "+92 333 4567890", product: "Quilted Cotton Jacket", amount: 3758, profit: 376, status: "in-progress", date: "Dec 18, 2024" },
  { id: "ORD-7826", customer: "Zainab Hassan", phone: "+92 345 6789012", product: "Coral Fleece Pajamas", amount: 2152, profit: 215, status: "delivered", date: "Dec 17, 2024" },
  { id: "ORD-7825", customer: "Bilal Ahmed", phone: "+92 312 3456789", product: "Wax Carving Knife Set", amount: 927, profit: 93, status: "cancelled", date: "Dec 16, 2024" },
  { id: "ORD-7824", customer: "Ayesha Malik", phone: "+92 301 2345678", product: "Titanium Steel Necklace", amount: 1280, profit: 128, status: "returned", date: "Dec 15, 2024" },
  { id: "ORD-7823", customer: "Hassan Raza", phone: "+92 305 7891234", product: "Kids Cotton T-Shirt", amount: 650, profit: 65, status: "shippers-advice", date: "Dec 14, 2024" },
  { id: "ORD-7822", customer: "Sana Tariq", phone: "+92 308 4567891", product: "Women's Denim Shorts", amount: 1299, profit: 130, status: "delivered", date: "Dec 13, 2024" },
];

const statusConfig = {
  delivered: { label: "Delivered", icon: CheckCircle2, bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  transit: { label: "In Transit", icon: Truck, bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  "in-progress": { label: "In-progress", icon: Clock, bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  "shippers-advice": { label: "Shipper's Advice", icon: Package, bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  cancelled: { label: "Cancelled", icon: XCircle, bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  returned: { label: "Returned", icon: AlertCircle, bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

const statusMap: Record<string, string> = {
  "in-progress": "in-progress",
  "shippers-advice": "shippers-advice",
  "delivered": "delivered",
  "returned": "returned",
  "cancelled": "cancelled",
  "transit": "transit",
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
        className="p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden animate-fade-in">
          <div className="py-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground" /> View Details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
              <Copy className="w-4 h-4 text-muted-foreground" /> Copy ID
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
              <MessageSquare className="w-4 h-4 text-muted-foreground" /> Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersTable({ filter }: OrdersTableProps) {
  const filteredOrders = filter === "all" 
    ? allOrders 
    : allOrders.filter(order => {
        if (filter === "in-progress") return order.status === "in-progress";
        if (filter === "shippers-advice") return order.status === "shippers-advice";
        if (filter === "delivered") return order.status === "delivered";
        if (filter === "returned") return order.status === "returned";
        if (filter === "cancelled") return order.status === "cancelled";
        return true;
      });

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/60 overflow-hidden animate-fade-in" style={{ animationDelay: "350ms" }}>
      <div className="p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your orders</p>
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search orders..."
            className="pl-4 pr-4 py-2.5 w-full sm:w-64 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">Try selecting a different filter</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profit</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                
                return (
                  <tr key={order.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-mono text-sm font-bold text-primary">{order.id}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {order.customer.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground line-clamp-1">{order.product}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-foreground">Rs {order.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-primary">Rs {order.profit}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border", status.bg, status.text, status.border)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
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
      )}
      
      {filteredOrders.length > 0 && (
        <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredOrders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Previous</button>
            <button className="px-4 py-2 rounded-lg gradient-hero text-primary-foreground text-sm font-semibold shadow-glow">1</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">2</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
