
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useClientList } from "./hooks/useClientList";
import { 
  ClientListHeader, 
  ClientListSearchBar, 
  ClientListTable,
  ClientListPagination
} from "./list";

const ClientList = () => {
  const navigate = useNavigate();
  const { 
    loading, 
    searchQuery, 
    setSearchQuery, 
    paginatedClients, 
    handleRefreshClients,
    userRole,
    filteredClients,
    // Pagination
    currentPage,
    totalPages,
    handlePageChange,
    totalItems
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
          totalResults={filteredClients.length}
          totalItems={totalItems}
        />

        <ClientListTable 
          clients={[]}
          loading={loading}
          filteredClients={paginatedClients}
          handleViewProfile={handleViewProfile}
          searchQuery={searchQuery}
        />
        
        {!loading && (
          <div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Mostrati {paginatedClients.length} di {totalItems} clienti
            </p>
            <ClientListPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientList;
