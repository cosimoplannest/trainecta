
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainerStatusBadge } from "./status/TrainerStatusBadge";
import { InfoItem } from "./info/InfoItem";

interface TrainerInfoProps {
  trainer: {
    status: string;
    role: string;
    email: string;
    registration_date: string;
  };
}

export const TrainerInfo = ({ trainer }: TrainerInfoProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informazioni Personali</CardTitle>
        <TrainerStatusBadge status={trainer.status} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem 
            label="Ruolo"
            value={trainer.role.charAt(0).toUpperCase() + trainer.role.slice(1)}
          />
          <InfoItem 
            label="Email"
            value={trainer.email}
          />
          <InfoItem 
            label="Data di registrazione"
            value={new Date(trainer.registration_date).toLocaleDateString('it-IT')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
