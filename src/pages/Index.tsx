import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { ConversionCard } from "@/components/dashboard/ConversionCard";
import { OrderFilters } from "@/components/dashboard/OrderFilters";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Wallet, ShoppingBag, TrendingUp, Clock, BadgePercent, Users } from "lucide-react";

const Index = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");

  // Dynamic data based on date range
  const getDataForRange = (range: string) => {
    const multipliers: Record<string, number> = {
      "7days": 0.25,
      "30days": 1,
      "3months": 2.8,
      "6months": 5.5,
      "1year": 10,
      "lifetime": 15,
    };
    const m = multipliers[range] || 1;
    
    return {
      revenue: Math.round(822430 * m),
      orders: Math.round(370 * m),
      profit: Math.round(124560 * m),
      pending: Math.round(42 * (range === "7days" ? 1 : range === "lifetime" ? 0.3 : 0.6)),
      commission: Math.round(41120 * m),
      customers: Math.round(156 * m),
    };
  };

  const data = getDataForRange(dateRange);

  const orderCounts = {
    all: 370,
    "in-progress": 68,
    "shippers-advice": 25,
    delivered: 245,
    returned: 17,
    cancelled: 15,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <main className="px-4 md:px-8 py-6 space-y-8 max-w-[1600px] mx-auto">
        {/* Order Filters */}
        <OrderFilters 
          activeFilter={orderFilter}
          onFilterChange={setOrderFilter}
          counts={orderCounts}
        />

        {/* KPI Cards - Primary card highlighted */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Total Revenue"
            value={`Rs ${data.revenue.toLocaleString()}`}
            change={{ value: "+12.5%", type: "positive" }}
            icon={Wallet}
            variant="primary"
            delay={0}
          />
          <KPICard
            title="Total Orders"
            value={data.orders.toLocaleString()}
            change={{ value: "+8.2%", type: "positive" }}
            icon={ShoppingBag}
            delay={50}
          />
          <KPICard
            title="Profit Earned"
            value={`Rs ${data.profit.toLocaleString()}`}
            change={{ value: "+15.3%", type: "positive" }}
            icon={TrendingUp}
            delay={100}
          />
          <KPICard
            title="Pending Orders"
            value={data.pending.toString()}
            change={{ value: "-5.1%", type: "positive" }}
            icon={Clock}
            delay={150}
          />
          <KPICard
            title="Commission"
            value={`Rs ${data.commission.toLocaleString()}`}
            change={{ value: "+9.8%", type: "positive" }}
            icon={BadgePercent}
            delay={200}
          />
          <KPICard
            title="New Customers"
            value={data.customers.toLocaleString()}
            change={{ value: "+22.4%", type: "positive" }}
            icon={Users}
            delay={250}
          />
        </div>

        {/* Top Products - Moved Higher */}
        <TopProductsTable />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <OrderStatusChart />
            <ConversionCard />
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable filter={orderFilter} />
      </main>
    </div>
  );
};

export default Index;
