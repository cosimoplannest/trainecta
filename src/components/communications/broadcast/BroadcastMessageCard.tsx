
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Megaphone } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { type BroadcastMessage } from "./hooks/useBroadcastMessages";

type BroadcastMessageCardProps = {
  message: BroadcastMessage;
};

export function BroadcastMessageCard({ message }: BroadcastMessageCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{message.title}</CardTitle>
          <Megaphone className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>
          Da: {message.sent_by_user?.full_name || "Utente sconosciuto"} • 
          {format(new Date(message.sent_at), " d MMMM yyyy", { locale: it })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-sm">{message.content}</p>
        {message.target_role && (
          <div className="mt-2">
            <span className="text-xs font-medium text-muted-foreground">
              Inviato a: {message.target_role}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
