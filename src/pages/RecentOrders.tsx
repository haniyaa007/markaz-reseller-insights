import { useState } from "react";
import { Header } from "@/components/dashboard/Header";

const RecentOrders = () => {
  const [dateRange, setDateRange] = useState("30days");

  return (
    <div className="min-h-screen bg-background">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">🚧 Coming Soon 🚧</h1>
            <p className="text-xl text-muted-foreground">Recent Orders page is under construction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;

