
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FollowupItem from "./followup/FollowupItem";
import EmptyFollowups from "./followup/EmptyFollowups";

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
              <FollowupItem key={followup.id} followup={followup} />
            ))}
          </div>
        ) : (
          <EmptyFollowups />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFollowups;
