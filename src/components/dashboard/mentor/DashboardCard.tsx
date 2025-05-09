
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "outline" | "secondary" | "destructive";
    className?: string;
  };
  isLoading?: boolean;
}

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  badge, 
  isLoading = false 
}: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold">{isLoading ? '...' : value}</h3>
          {badge && (
            <Badge 
              variant={badge.variant} 
              className={badge.className}
            >
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
