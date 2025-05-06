
import { useParams } from "react-router-dom";
import { useClientData } from "./profile/hooks/useClientData";
import { LoadingState } from "./profile/LoadingState";
import { NotFoundState } from "./profile/NotFoundState";
import ClientProfileHeader from "./profile/ClientProfileHeader";
import { ClientPersonalInfo } from "./profile/personal-info";
import ClientTabs from "./profile/ClientTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { FirstMeetingManager } from "./first-meeting/FirstMeetingManager";
import { PurchaseOutcomeManager } from "./first-meeting/PurchaseOutcomeManager";
import { useAuth } from "@/hooks/use-auth";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { client, activities, templates, followups, loading, handleRefresh } = useClientData(id);
  const isMobile = useIsMobile();
  const { user, userRole } = useAuth();
  
  if (loading) {
    return <LoadingState />;
  }

  if (!client) {
    return <NotFoundState />;
  }
  
  const isTrainer = userRole === 'trainer';
  const isAssigned = !!client.assigned_to;
  const isAssignedToCurrentUser = isAssigned && client.assigned_to === user?.id;

  return (
    <div className="space-y-4 pb-16">
      <ClientProfileHeader 
        firstName={client.first_name}
        lastName={client.last_name}
        joinedAt={client.joined_at}
        isAssigned={isAssigned}
        assignedToCurrentUser={isAssignedToCurrentUser}
        purchaseType={client.purchase_type}
        firstMeetingCompleted={client.first_meeting_completed}
      />
      
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-4'}`}>
        {isMobile ? (
          // On mobile, improved layout with clearer hierarchy
          <>
            <div className="sticky top-0 z-10 bg-background pb-2">
              <ClientTabs 
                templates={templates} 
                activities={activities} 
                followups={followups}
                clientPhone={client.phone}
              />
            </div>
            
            <div className="space-y-6 mt-2">
              {isTrainer && (
                <>
                  <FirstMeetingManager client={client} onUpdate={handleRefresh} />
                  <PurchaseOutcomeManager client={client} onUpdate={handleRefresh} />
                </>
              )}
              <ClientPersonalInfo client={client} onRefresh={handleRefresh} />
            </div>
          </>
        ) : (
          // On desktop, show personal info in sidebar, tabs in main area
          <>
            <div className="lg:col-span-1 space-y-6">
              <ClientPersonalInfo client={client} onRefresh={handleRefresh} />
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              {isTrainer && (
                <div className="grid gap-6 md:grid-cols-2">
                  <FirstMeetingManager client={client} onUpdate={handleRefresh} />
                  <PurchaseOutcomeManager client={client} onUpdate={handleRefresh} />
                </div>
              )}
              <ClientTabs 
                templates={templates} 
                activities={activities} 
                followups={followups}
                clientPhone={client.phone}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
