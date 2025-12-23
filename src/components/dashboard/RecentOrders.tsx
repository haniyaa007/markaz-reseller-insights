import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

const orders = [
  { id: "ORD-7829", customer: "Ahmed Khan", product: "Pink Heart Necklace", amount: 880, status: "delivered", time: "2 hours ago" },
  { id: "ORD-7828", customer: "Fatima Ali", product: "Summer Sunscreen Shirt", amount: 1455, status: "transit", time: "3 hours ago" },
  { id: "ORD-7827", customer: "Usman Sheikh", product: "Quilted Cotton Jacket", amount: 3758, status: "pending", time: "5 hours ago" },
  { id: "ORD-7826", customer: "Zainab Hassan", product: "Coral Fleece Pajamas", amount: 2152, status: "delivered", time: "6 hours ago" },
  { id: "ORD-7825", customer: "Bilal Ahmed", product: "Wax Carving Knife Set", amount: 927, status: "cancelled", time: "8 hours ago" },
];

const statusConfig = {
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-success/10 text-success" },
  transit: { label: "In Transit", icon: Truck, className: "bg-info/10 text-info" },
  pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

export function RecentOrders() {
  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: "350ms" }}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest customer orders</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      <div className="divide-y divide-border/50">
        {orders.map((order) => {
          const status = statusConfig[order.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          
          return (
            <div key={order.id} className="p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {order.customer.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id} · {order.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">Rs {order.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.className)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
