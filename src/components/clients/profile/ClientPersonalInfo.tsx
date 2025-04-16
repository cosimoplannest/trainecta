import { User, Calendar, Phone, Mail, Users, Clock, Edit, Info } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssignTrainer } from "../AssignTrainer";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  joined_at: string;
  internal_notes: string | null;
  assigned_to: string | null;
  user?: { full_name: string } | null;
}

interface ClientPersonalInfoProps {
  client: ClientData;
  onRefresh: () => void;
}

const ClientPersonalInfo = ({ client, onRefresh }: ClientPersonalInfoProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Personali</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">{client.first_name} {client.last_name}</p>
                <p className="text-sm text-muted-foreground">{client.gender || "Genere non specificato"}</p>
              </div>
            </div>
            
            {client.birth_date && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Data di nascita</p>
                  <p className="font-medium">{format(new Date(client.birth_date), "d MMMM yyyy", { locale: it })}</p>
                </div>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Telefono</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
            )}
            
            {client.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm">Trainer Assegnato</p>
                <p className="font-medium">{client.user?.full_name || "Nessun trainer assegnato"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm">Data iscrizione</p>
                <p className="font-medium">{format(new Date(client.joined_at), "d MMMM yyyy", { locale: it })}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex flex-col gap-2">
            <AssignTrainer 
              clientId={client.id} 
              currentTrainerId={client.assigned_to}
              onAssigned={onRefresh}
            />
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Modifica Dati
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {client.internal_notes && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Note Interne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{client.internal_notes}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ClientPersonalInfo;
