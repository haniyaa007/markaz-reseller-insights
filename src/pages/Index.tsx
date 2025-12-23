import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { ConversionCard } from "@/components/dashboard/ConversionCard";
import { DollarSign, ShoppingBag, TrendingUp, Clock, Wallet, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        <Header />

        <main className="p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              title="Total Revenue"
              value="Rs 822,430"
              change={{ value: "+12.5%", type: "positive" }}
              icon={DollarSign}
              iconColor="text-primary"
              delay={0}
            />
            <KPICard
              title="Total Orders"
              value="370"
              change={{ value: "+8.2%", type: "positive" }}
              icon={ShoppingBag}
              iconColor="text-info"
              delay={50}
            />
            <KPICard
              title="Profit Earned"
              value="Rs 124,560"
              change={{ value: "+15.3%", type: "positive" }}
              icon={TrendingUp}
              iconColor="text-success"
              delay={100}
            />
            <KPICard
              title="Pending Orders"
              value="42"
              change={{ value: "-5.1%", type: "positive" }}
              icon={Clock}
              iconColor="text-warning"
              delay={150}
            />
            <KPICard
              title="Commission"
              value="Rs 41,120"
              change={{ value: "+9.8%", type: "positive" }}
              icon={Wallet}
              iconColor="text-primary"
              delay={200}
            />
            <KPICard
              title="New Customers"
              value="156"
              change={{ value: "+22.4%", type: "positive" }}
              icon={Users}
              iconColor="text-info"
              delay={250}
            />
          </div>

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

          {/* Tables Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TopProductsTable />
            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
