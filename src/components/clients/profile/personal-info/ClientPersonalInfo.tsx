
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditClientDialog from "../EditClientDialog";
import { PersonalDataSection } from "./PersonalDataSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { TrainingPreferencesSection } from "./TrainingPreferencesSection";
import { GymInfoSection } from "./GymInfoSection";
import { ClientNotesCard } from "./ClientNotesCard";

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

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="text-xl">Informazioni Personali</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <PersonalDataSection 
            firstName={client.first_name}
            lastName={client.last_name}
            gender={client.gender}
            birthDate={client.birth_date}
          />
          
          <ContactInfoSection 
            phone={client.phone}
            email={client.email}
            contactTime={client.contact_time}
            contactMethod={client.contact_method}
          />
          
          <TrainingPreferencesSection 
            preferredTime={client.preferred_time}
            primaryGoal={client.primary_goal}
            fitnessLevel={client.fitness_level}
            subscriptionType={client.subscription_type}
          />

          <GymInfoSection 
            trainerName={client.user?.full_name}
            joinedAt={client.joined_at}
            clientId={client.id}
            trainerId={client.assigned_to}
            onRefresh={onRefresh}
            onEditClick={() => setIsEditDialogOpen(true)}
          />
        </CardContent>
      </Card>
      
      <ClientNotesCard notes={client.internal_notes || ""} />
      
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
