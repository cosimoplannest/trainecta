
import { useParams } from "react-router-dom";
import { useClientData } from "./profile/hooks/useClientData";
import { LoadingState } from "./profile/LoadingState";
import { NotFoundState } from "./profile/NotFoundState";
import ClientProfileHeader from "./profile/ClientProfileHeader";
import ClientPersonalInfo from "./profile/ClientPersonalInfo";
import ClientTabs from "./profile/ClientTabs";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { client, activities, templates, followups, loading, handleRefresh } = useClientData(id);

  if (loading) {
    return <LoadingState />;
  }

  if (!client) {
    return <NotFoundState />;
  }

  return (
    <div className="space-y-6">
      <ClientProfileHeader 
        firstName={client.first_name}
        lastName={client.last_name}
        joinedAt={client.joined_at}
      />
      
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ClientPersonalInfo client={client} onRefresh={handleRefresh} />
        </div>
        
        <div className="lg:col-span-3">
          <ClientTabs 
            templates={templates} 
            activities={activities} 
            followups={followups}
            clientPhone={client.phone}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
