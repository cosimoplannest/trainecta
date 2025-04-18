
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardHeader>
        <CardTitle>Informazioni Personali</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Stato</p>
            <p className="text-sm">
              {trainer.status === 'active' ? 'Attivo' : 'Inattivo'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Ruolo</p>
            <p className="text-sm capitalize">{trainer.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm">{trainer.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Data di registrazione</p>
            <p className="text-sm">
              {new Date(trainer.registration_date).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
