
import { format } from "date-fns";
import { it } from "date-fns/locale";
import FollowupStatusBadge from "./FollowupStatusBadge";

interface ClientFollowup {
  id: string;
  created_at: string;
  sent_at: string;
  type: string;
  notes: string | null;
  trainer?: { full_name: string } | null;
  outcome: string | null;
}

interface FollowupItemProps {
  followup: ClientFollowup;
}

const FollowupItem = ({ followup }: FollowupItemProps) => {
  return (
    <div className="flex items-start gap-4 pb-4 border-b last:border-0">
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

        <FollowupStatusBadge 
          type={followup.type}
          outcome={followup.outcome}
        />
        
        {followup.trainer && (
          <p className="text-sm text-muted-foreground mt-1">
            Da: {followup.trainer.full_name}
          </p>
        )}
      </div>
    </div>
  );
};

export default FollowupItem;
