
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface MetricsCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
  onClick?: () => void;
}

export const MetricsCard = ({ title, value, Icon, onClick }: MetricsCardProps) => {
  const cardContent = (
    <Card className={onClick ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {onClick && <p className="text-xs text-muted-foreground mt-1">Clicca per dettagli</p>}
      </CardContent>
    </Card>
  );

  if (!onClick) return cardContent;

  return (
    <DialogTrigger asChild onClick={onClick}>
      {cardContent}
    </DialogTrigger>
  );
};
