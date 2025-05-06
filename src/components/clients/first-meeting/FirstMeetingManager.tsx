
import { useState } from "react";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useFirstMeeting } from "./useFirstMeeting";
import { ClientData } from "../types/client-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";

interface FirstMeetingManagerProps {
  client: ClientData;
  onUpdate: () => void;
}

export const FirstMeetingManager = ({ client, onUpdate }: FirstMeetingManagerProps) => {
  const isMobile = useIsMobile();
  const { userRole } = useAuth();
  const isTrainer = userRole === 'trainer';
  const isClientAssignedToCurrentUser = client.assigned_to === useAuth().user?.id;
  
  // Pass onUpdate to the client object
  const clientWithCallback = { ...client, onRefresh: onUpdate };
  
  const {
    meetingDate,
    setMeetingDate,
    meetingCompleted,
    isUpdating,
    updateFirstMeetingDate,
    markFirstMeetingCompleted,
  } = useFirstMeeting(clientWithCallback);
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Check if current user can edit the meeting
  const canEdit = isTrainer ? isClientAssignedToCurrentUser : true;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Primo Incontro
        </CardTitle>
        <CardDescription>
          Gestione del primo incontro con il cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {client.first_meeting_completed ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Primo incontro completato il {client.first_meeting_date ? 
                format(new Date(client.first_meeting_date), "d MMMM yyyy", { locale: it }) : 
                "data non registrata"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span>Primo incontro non ancora completato</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto flex justify-center items-center gap-2"
                  disabled={!canEdit}
                >
                  <Calendar className="h-4 w-4" />
                  {meetingDate ? format(meetingDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={meetingDate}
                  onSelect={(date) => {
                    setMeetingDate(date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={() => updateFirstMeetingDate()} 
              disabled={!meetingDate || isUpdating || !canEdit}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Salvataggio..." : client.first_meeting_date ? "Aggiorna Data" : "Imposta Data"}
            </Button>
            
            <Button 
              variant="default" 
              onClick={() => markFirstMeetingCompleted()}
              disabled={isUpdating || client.first_meeting_completed || !canEdit}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Salvataggio..." : "Segna come Completato"}
            </Button>
          </div>
          
          {!canEdit && isTrainer && (
            <div className="mt-4 p-3 bg-orange-50 text-orange-800 rounded-md text-sm">
              <p>Non puoi modificare i dati di questo cliente perché non ti è stato assegnato.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
