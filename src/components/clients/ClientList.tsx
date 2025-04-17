
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useClientList } from "./hooks/useClientList";
import { ClientListHeader } from "./list/ClientListHeader";
import { ClientListSearchBar } from "./list/ClientListSearchBar";
import { ClientListTable } from "./list/ClientListTable";

const ClientList = () => {
  const navigate = useNavigate();
  const { 
    loading, 
    searchQuery, 
    setSearchQuery, 
    filteredClients, 
    handleRefreshClients,
    userRole
  } = useClientList();

  const handleViewProfile = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <Card>
      <ClientListHeader userRole={userRole} />
      <CardContent>
        <ClientListSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleRefreshClients={handleRefreshClients}
          loading={loading}
        />

        <ClientListTable 
          clients={[]}
          loading={loading}
          filteredClients={filteredClients}
          handleViewProfile={handleViewProfile}
        />
      </CardContent>
    </Card>
  );
};

export default ClientList;
