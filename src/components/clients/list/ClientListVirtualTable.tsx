
import { useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, UserCheck, Calendar, ShoppingBag, Search, Phone, Mail, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ClientData } from "../types/client-types";
import { ClientActions } from "./ClientActions";
import { Button } from "@/components/ui/button";
import { SortConfig } from "../hooks/useClientList";

interface ClientListVirtualTableProps {
  clients: ClientData[];
  loading: boolean;
  handleViewProfile: (clientId: string) => void;
  searchQuery?: string;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function ClientListVirtualTable({
  clients,
  loading,
  handleViewProfile,
  searchQuery = "",
  sortConfig,
  onSort
}: ClientListVirtualTableProps) {
  // Reference to the table container element
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Column helper for type safety
  const columnHelper = createColumnHelper<ClientData>();

  // Define columns
  const columns = [
    columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
      id: 'fullName',
      header: () => (
        <Button variant="ghost" onClick={() => onSort('last_name')} className="p-0 h-auto font-medium">
          Cliente
          {sortConfig.column === 'last_name' && (
            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const client = row.original;
        const initials = getInitials(client.first_name, client.last_name);
        const avatarColor = getAvatarColor(`${client.first_name} ${client.last_name}`);
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className={avatarColor}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {client.first_name} {client.last_name}
              </div>
              {client.joined_at && (
                <div className="text-xs text-muted-foreground">
                  Cliente dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
                </div>
              )}
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('email', {
      id: 'contact',
      header: 'Contatto',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="space-y-1">
            {client.email && (
              <div className="flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate max-w-[180px]">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-1.5 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor('next_confirmation_due', {
      id: 'status',
      header: 'Stato',
      cell: ({ row }) => {
        const client = row.original;
        return client.next_confirmation_due ? (
          <Badge variant={new Date(client.next_confirmation_due) < new Date() ? "destructive" : "outline"} 
                 className="text-xs font-normal flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Conferma: {format(new Date(client.next_confirmation_due), "dd/MM/yy")}
          </Badge>
        ) : null;
      }
    }),
    columnHelper.accessor(row => row.users?.full_name, {
      id: 'trainer',
      header: () => (
        <Button variant="ghost" onClick={() => onSort('users.full_name')} className="p-0 h-auto font-medium">
          Trainer
          {sortConfig.column === 'users.full_name' && (
            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            {client.users?.full_name ? (
              <>
                <UserCheck className="h-4 w-4 text-green-500" />
                <span>{client.users.full_name}</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Non assegnato</span>
              </>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor('first_meeting_completed', {
      id: 'firstMeeting',
      header: 'Primo Incontro',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            {client.first_meeting_completed ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {client.first_meeting_date 
                    ? format(new Date(client.first_meeting_date), "dd/MM/yyyy")
                    : "Completato"}
                </span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Da programmare</span>
              </Badge>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor('purchase_type', {
      id: 'purchase',
      header: 'Acquisto',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            {getPurchaseStatusBadge(client.purchase_type)}
          </div>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ClientActions 
              client={row.original} 
              handleViewProfile={handleViewProfile} 
            />
          </div>
        </div>
      )
    })
  ];

  // React Table instance
  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Set up virtualization
  const { rows } = table.getRowModel();
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 72, // estimated row height
    overscan: 10,
  });

  // Helper functions
  const getPurchaseStatusBadge = (purchaseType: string | null) => {
    if (!purchaseType || purchaseType === 'none') {
      return <Badge variant="outline" className="bg-yellow-50">In attesa</Badge>;
    }
    const variants: {[key: string]: string} = {
      'package': 'bg-green-50 text-green-700 border-green-200',
      'custom_plan': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    const labels: {[key: string]: string} = {
      'package': 'Pacchetto',
      'custom_plan': 'Scheda personalizzata'
    };
    return (
      <Badge 
        variant="outline" 
        className={variants[purchaseType]}
      >
        {labels[purchaseType]}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600', 
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600', 
      'bg-amber-100 text-amber-600', 
      'bg-rose-100 text-rose-600',
      'bg-sky-100 text-sky-600',
      'bg-emerald-100 text-emerald-600',
      'bg-indigo-100 text-indigo-600'
    ];
    
    // Simple hash function to determine color based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Show loading state or empty results message
  if (loading) {
    return (
      <div className="rounded-md border mt-4 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <span className="text-muted-foreground">Caricamento clienti...</span>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-md border mt-4 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-10">
          {searchQuery.trim().length > 0 ? (
            <>
              <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <span className="text-muted-foreground font-medium mb-1">Nessun risultato per "{searchQuery}"</span>
              <span className="text-xs text-muted-foreground">Prova a cercare con un altro nome, email o numero di telefono</span>
            </>
          ) : (
            <>
              <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <span className="text-muted-foreground">Nessun cliente trovato</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <div
        ref={tableContainerRef}
        className="relative w-full overflow-auto"
        style={{ height: 'calc(100vh - 400px)', minHeight: '300px', maxHeight: '600px' }}
      >
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead 
                    key={header.id} 
                    className="font-medium"
                  >
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const row = rows[virtualRow.index];
              return (
                <TableRow 
                  key={row.id} 
                  className="hover:bg-slate-50/50 group"
                  data-index={virtualRow.index}
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
