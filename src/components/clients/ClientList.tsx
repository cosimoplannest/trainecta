
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useClientList } from "./hooks/useClientList";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ClientListHeader, 
  ClientListSearchBar,
  ClientListVirtualTable,
  ClientListPagination,
  ClientListMobileView
} from "./list";

const ClientList = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    loading, 
    searchQuery, 
    setSearchQuery,
    displaySearchQuery,
    setDisplaySearchQuery,
    handleSearch,
    // Pagination
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    totalPages,
    totalItems,
    // Clients data
    clients,
    // Sorting
    sortConfig,
    handleSortChange,
    // Refresh
    handleRefreshClients,
    userRole,
  } = useClientList();

  const handleViewProfile = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <Card className="shadow-sm">
      <ClientListHeader userRole={userRole} />
      <CardContent className="p-6">
        <ClientListSearchBar 
          displaySearchQuery={displaySearchQuery}
          setDisplaySearchQuery={setDisplaySearchQuery}
          handleSearch={handleSearch}
          handleRefreshClients={handleRefreshClients}
          loading={loading}
          totalItems={totalItems}
          searchQuery={searchQuery}
        />

        {isMobile ? (
          <ClientListMobileView 
            clients={clients}
            loading={loading}
            handleViewProfile={handleViewProfile}
          />
        ) : (
          <ClientListVirtualTable 
            clients={clients}
            loading={loading}
            handleViewProfile={handleViewProfile}
            searchQuery={searchQuery}
            sortConfig={sortConfig}
            onSort={handleSortChange}
          />
        )}
        
        {!loading && clients.length > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrati {clients.length} di {totalItems} clienti
              </span>
              {!isMobile && (
                <select 
                  className="h-8 rounded border border-input bg-background px-2 text-xs"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10 per pagina</option>
                  <option value={20}>20 per pagina</option>
                  <option value={50}>50 per pagina</option>
                  <option value={100}>100 per pagina</option>
                </select>
              )}
            </div>
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
