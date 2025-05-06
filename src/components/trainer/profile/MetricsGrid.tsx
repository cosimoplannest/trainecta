
import { Calendar, User, UserCheck, ClipboardList } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { ClientsModal } from "./ClientsModal";
import { ClientData } from "@/components/clients/types/client-types";

interface MetricsGridProps {
  metrics: {
    awaitingFirstMeeting: number;
    awaitingFollowup: number;
    personalPackageClients: number;
    customPlanClients: number;
  };
  clientsData?: {
    awaitingFirstMeeting: ClientData[];
    awaitingFollowup: ClientData[];
    personalPackageClients: ClientData[];
    customPlanClients: ClientData[];
  };
}

export const MetricsGrid = ({ metrics, clientsData }: MetricsGridProps) => {
  const [modalType, setModalType] = useState<string | null>(null);
  
  const handleOpenModal = (type: string) => {
    // Only open if we have client data
    if (clientsData) {
      setModalType(type);
    }
  };
  
  const handleCloseModal = () => {
    setModalType(null);
  };
  
  const getClientsForType = (): { title: string; clients: ClientData[] } => {
    if (!clientsData || !modalType) {
      return { title: "", clients: [] };
    }
    
    switch (modalType) {
      case "awaitingFirstMeeting":
        return { 
          title: "Clienti in attesa di primo incontro", 
          clients: clientsData.awaitingFirstMeeting 
        };
      case "awaitingFollowup":
        return { 
          title: "Clienti in attesa di follow-up", 
          clients: clientsData.awaitingFollowup 
        };
      case "personalPackageClients":
        return { 
          title: "Clienti Personal", 
          clients: clientsData.personalPackageClients 
        };
      case "customPlanClients":
        return { 
          title: "Clienti con Scheda Personalizzata", 
          clients: clientsData.customPlanClients 
        };
      default:
        return { title: "", clients: [] };
    }
  };

  const { title, clients } = getClientsForType();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Dialog>
          <MetricsCard
            title="In attesa primo incontro"
            value={metrics.awaitingFirstMeeting}
            Icon={User}
            onClick={clientsData ? () => handleOpenModal("awaitingFirstMeeting") : undefined}
          />
        </Dialog>
        
        <Dialog>
          <MetricsCard
            title="In attesa follow-up"
            value={metrics.awaitingFollowup}
            Icon={Calendar}
            onClick={clientsData ? () => handleOpenModal("awaitingFollowup") : undefined}
          />
        </Dialog>
        
        <Dialog>
          <MetricsCard
            title="Clienti Personal"
            value={metrics.personalPackageClients}
            Icon={UserCheck}
            onClick={clientsData ? () => handleOpenModal("personalPackageClients") : undefined}
          />
        </Dialog>
        
        <Dialog>
          <MetricsCard
            title="Clienti Scheda Personalizzata"
            value={metrics.customPlanClients}
            Icon={ClipboardList}
            onClick={clientsData ? () => handleOpenModal("customPlanClients") : undefined}
          />
        </Dialog>
      </div>
      
      {modalType && (
        <ClientsModal 
          title={title}
          clients={clients}
          isOpen={!!modalType}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
