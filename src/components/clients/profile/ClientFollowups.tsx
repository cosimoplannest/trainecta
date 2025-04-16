
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ClientFollowup {
  id: string;
  created_at: string;
  sent_at: string;
  type: string;
  notes: string | null;
  trainer?: { full_name: string } | null;
  outcome: string | null;
}

interface ClientFollowupsProps {
  followups: ClientFollowup[];
}

const ClientFollowups = ({ followups }: ClientFollowupsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Followup Programmati</CardTitle>
        <CardDescription>Contatti programmati con il cliente</CardDescription>
      </CardHeader>
      <CardContent>
        {followups.length > 0 ? (
          <div className="space-y-4">
            {followups.map((followup) => (
              <div key={followup.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Followup via {followup.type === "whatsapp" 
                          ? "WhatsApp" 
                          : followup.type === "call" 
                          ? "Chiamata"
                          : followup.type === "email"
                          ? "Email"
                          : followup.type === "in_app"
                          ? "App"
                          : followup.type}
                      </p>
                      {followup.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{followup.notes}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(followup.sent_at), "d MMM yyyy", { locale: it })}
                    </p>
                  </div>
                  {followup.trainer && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Da: {followup.trainer.full_name}
                    </p>
                  )}
                  {followup.outcome && (
                    <p className="text-sm font-medium mt-2">
                      Esito: {followup.outcome}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nessun followup registrato per questo cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFollowups;
