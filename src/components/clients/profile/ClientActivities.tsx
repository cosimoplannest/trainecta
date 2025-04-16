
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ClientActivity {
  id: string;
  action: string;
  created_at: string;
  notes: string | null;
  user?: { full_name: string } | null;
}

interface ClientActivitiesProps {
  activities: ClientActivity[];
}

const ClientActivities = ({ activities }: ClientActivitiesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro Attività</CardTitle>
        <CardDescription>Cronologia delle attività per questo cliente</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium capitalize">
                        {activity.action.replace(/_/g, " ")}
                      </p>
                      {activity.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: it })}
                    </p>
                  </div>
                  {activity.user && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Da: {activity.user.full_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nessuna attività registrata per questo cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientActivities;
