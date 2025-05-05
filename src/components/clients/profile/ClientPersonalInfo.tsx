
import { useState } from "react";
import { User, Calendar, Phone, Mail, Users, Clock, Edit, Info, MessageSquare, Bell, Clock4 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssignTrainer } from "../trainer-assignment";
import EditClientDialog from "./EditClientDialog";
import { Badge } from "@/components/ui/badge";
import { fitnessGoals, workoutTimePreferences } from "../constants/clientFormData";

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
  // Additional client fields
  subscription_type?: string | null;
  preferred_time?: string | null;
  primary_goal?: string | null;
  contact_method?: string | null;
  contact_time?: string | null;
  fitness_level?: string | null;
}

interface ClientPersonalInfoProps {
  client: ClientData;
  onRefresh: () => void;
}

const ClientPersonalInfo = ({ client, onRefresh }: ClientPersonalInfoProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const openWhatsApp = () => {
    if (client.phone) {
      // Remove any non-digit characters from phone
      const phoneDigits = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneDigits}`, '_blank');
    }
  };
  
  const getPreferredTimeLabel = (timeId: string | null) => {
    if (!timeId) return null;
    const timeObj = workoutTimePreferences.find(t => t.id === timeId);
    return timeObj ? timeObj.label : timeId;
  };
  
  const getGoalLabel = (goalId: string | null) => {
    if (!goalId) return null;
    const goalObj = fitnessGoals.find(g => g.id === goalId);
    return goalObj ? goalObj.label : goalId;
  };

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="text-xl">Informazioni Personali</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {/* Dati Anagrafici */}
          <div className="py-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Dati Anagrafici</h3>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-lg">{client.first_name} {client.last_name}</p>
                <p className="text-sm text-gray-600">{client.gender === 'male' ? 'Uomo' : client.gender === 'female' ? 'Donna' : client.gender || "Genere non specificato"}</p>
              </div>
            </div>
            
            {client.birth_date && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Data di nascita:</span>{' '}
                  <span className="font-medium">{format(new Date(client.birth_date), "d MMMM yyyy", { locale: it })}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Contatti */}
          <div className="py-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contatti</h3>
            
            {client.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{client.phone}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={openWhatsApp}
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            )}
            
            {client.email && (
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{client.email}</span>
              </div>
            )}
            
            {/* Preferenze di Contatto */}
            <div className="mt-2 grid grid-cols-1 gap-2">
              {client.contact_time && (
                <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-md">
                  <Bell className="h-4 w-4 text-amber-600" />
                  <div>
                    <span className="text-gray-600">Preferisce essere contattato:</span>{' '}
                    <span className="font-medium">{client.contact_time === 'morning' ? 'Mattina' : 
                      client.contact_time === 'afternoon' ? 'Pomeriggio' : 
                      client.contact_time === 'evening' ? 'Sera' : client.contact_time}</span>
                  </div>
                </div>
              )}
              
              {client.contact_method && (
                <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-md">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="text-gray-600">Modalità preferita:</span>{' '}
                    <span className="font-medium">{client.contact_method === 'phone' ? 'Telefonata' : 
                      client.contact_method === 'message' ? 'Messaggio' : client.contact_method}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Preferenze Allenamento */}
          <div className="py-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Preferenze Allenamento</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {client.preferred_time && (
                <div className="flex items-start space-x-2 bg-purple-50 p-3 rounded-md">
                  <Clock4 className="h-5 w-5 text-purple-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Orario Preferito</p>
                    <p className="text-sm text-purple-800">{getPreferredTimeLabel(client.preferred_time)}</p>
                  </div>
                </div>
              )}
              
              {client.primary_goal && (
                <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-md">
                  <Clock className="h-5 w-5 text-blue-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Obiettivo</p>
                    <p className="text-sm text-blue-800">{getGoalLabel(client.primary_goal)}</p>
                  </div>
                </div>
              )}
              
              {client.fitness_level && (
                <div className="flex items-start space-x-2 bg-green-50 p-3 rounded-md">
                  <Info className="h-5 w-5 text-green-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Livello</p>
                    <p className="text-sm text-green-800">
                      {client.fitness_level === 'beginner' ? 'Base' :
                       client.fitness_level === 'intermediate' ? 'Intermedio' :
                       client.fitness_level === 'advanced' ? 'Avanzato' : client.fitness_level}
                    </p>
                  </div>
                </div>
              )}
              
              {client.subscription_type && (
                <div className="flex items-start space-x-2 bg-amber-50 p-3 rounded-md">
                  <Users className="h-5 w-5 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Abbonamento</p>
                    <p className="text-sm text-amber-800">{client.subscription_type}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informazioni Palestra */}
          <div className="py-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Informazioni Palestra</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Trainer:</span>{' '}
                  <span className="font-medium">{client.user?.full_name || "Nessun trainer assegnato"}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Iscrizione:</span>{' '}
                  <span className="font-medium">{format(new Date(client.joined_at), "d MMMM yyyy", { locale: it })}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 flex flex-col sm:flex-row gap-2">
              <AssignTrainer 
                clientId={client.id} 
                currentTrainerId={client.assigned_to}
                onAssigned={onRefresh}
              />
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Modifica Dati
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {client.internal_notes && (
        <Card className="mt-4 bg-white shadow-md">
          <CardHeader className="bg-gray-50 rounded-t-lg border-b">
            <CardTitle className="text-xl flex items-center gap-1">
              <Info className="h-5 w-5" />
              Note Interne
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <p className="text-sm whitespace-pre-line">{client.internal_notes}</p>
          </CardContent>
        </Card>
      )}
      
      {isEditDialogOpen && (
        <EditClientDialog
          client={client}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default ClientPersonalInfo;
