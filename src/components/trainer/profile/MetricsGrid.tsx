
import { Calendar, User, UserCheck, ClipboardList } from "lucide-react";
import { MetricsCard } from "./MetricsCard";

interface MetricsGridProps {
  metrics: {
    awaitingFirstMeeting: number;
    awaitingFollowup: number;
    personalPackageClients: number;
    customPlanClients: number;
  };
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="In attesa primo incontro"
        value={metrics.awaitingFirstMeeting}
        Icon={User}
      />
      <MetricsCard
        title="In attesa follow-up"
        value={metrics.awaitingFollowup}
        Icon={Calendar}
      />
      <MetricsCard
        title="Clienti Personal"
        value={metrics.personalPackageClients}
        Icon={UserCheck}
      />
      <MetricsCard
        title="Clienti Scheda Personalizzata"
        value={metrics.customPlanClients}
        Icon={ClipboardList}
      />
    </div>
  );
};
