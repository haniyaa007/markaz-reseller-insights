import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty & Fashion" },
  { id: "electronics", label: "Tech & Auto" },
  { id: "home", label: "Home" },
  { id: "kids", label: "Kids" },
];

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex items-center gap-1 border-b border-border bg-card px-4 animate-fade-in">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveTab(category.id)}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-all duration-200 relative",
            activeTab === category.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {category.label}
          {activeTab === category.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
