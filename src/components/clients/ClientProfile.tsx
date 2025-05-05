
import { useParams } from "react-router-dom";
import { useClientData } from "./profile/hooks/useClientData";
import { LoadingState } from "./profile/LoadingState";
import { NotFoundState } from "./profile/NotFoundState";
import ClientProfileHeader from "./profile/ClientProfileHeader";
import { ClientPersonalInfo } from "./profile/personal-info";
import ClientTabs from "./profile/ClientTabs";
import { useIsMobile } from "@/hooks/use-mobile";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { client, activities, templates, followups, loading, handleRefresh } = useClientData(id);
  const isMobile = useIsMobile();

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
      
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-4'}`}>
        <div className={isMobile ? 'order-2' : 'lg:col-span-1'}>
          <ClientPersonalInfo client={client} onRefresh={handleRefresh} />
        </div>
        
        <div className={isMobile ? 'order-1' : 'lg:col-span-3'}>
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
