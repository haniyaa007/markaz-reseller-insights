import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { ConversionCard } from "@/components/dashboard/ConversionCard";
import { OrderFilters } from "@/components/dashboard/OrderFilters";
import { FavoriteProductsBar } from "@/components/dashboard/FavoriteProductsBar";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { DollarSign, ShoppingBag, TrendingUp, Clock, Wallet, Users } from "lucide-react";

const Index = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [orderFilter, setOrderFilter] = useState("all");

  // Data changes based on date range (simulated)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <Header 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <main className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Order Filters at Top */}
        <OrderFilters 
          activeFilter={orderFilter}
          onFilterChange={setOrderFilter}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Total Revenue"
            value={`Rs ${data.revenue.toLocaleString()}`}
            change={{ value: "+12.5%", type: "positive" }}
            icon={DollarSign}
            iconColor="text-primary"
            delay={0}
          />
          <KPICard
            title="Total Orders"
            value={data.orders.toLocaleString()}
            change={{ value: "+8.2%", type: "positive" }}
            icon={ShoppingBag}
            iconColor="text-info"
            delay={50}
          />
          <KPICard
            title="Profit Earned"
            value={`Rs ${data.profit.toLocaleString()}`}
            change={{ value: "+15.3%", type: "positive" }}
            icon={TrendingUp}
            iconColor="text-success"
            delay={100}
          />
          <KPICard
            title="Pending Orders"
            value={data.pending.toString()}
            change={{ value: "-5.1%", type: "positive" }}
            icon={Clock}
            iconColor="text-warning"
            delay={150}
          />
          <KPICard
            title="Commission"
            value={`Rs ${data.commission.toLocaleString()}`}
            change={{ value: "+9.8%", type: "positive" }}
            icon={Wallet}
            iconColor="text-primary"
            delay={200}
          />
          <KPICard
            title="New Customers"
            value={data.customers.toLocaleString()}
            change={{ value: "+22.4%", type: "positive" }}
            icon={Users}
            iconColor="text-info"
            delay={250}
          />
        </div>

        {/* Favorites Bar - Horizontal Scroll */}
        <FavoriteProductsBar />

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SalesChart />
          </div>
          <div className="space-y-6">
            <OrderStatusChart />
            <ConversionCard />
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable />

        {/* Top Products */}
        <TopProductsTable />
      </main>
    </div>
  );
};

export default Index;
