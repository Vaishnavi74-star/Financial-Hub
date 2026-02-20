import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-6 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-border group animate-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === "up" ? "bg-green-100 text-green-700" : 
            trend === "down" ? "bg-red-100 text-red-700" : 
            "bg-gray-100 text-gray-700"
          )}>
            {trend === "up" ? "+2.5%" : trend === "down" ? "-1.4%" : "0%"}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">{value}</h3>
      </div>
    </div>
  );
}
