
import { useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientData } from "../types/client-types";
import { ClientActions } from "./ClientActions";
import { SortConfig } from "../hooks/useClientList";
import { TableLoadingState } from './components/TableLoadingState';
import { TableEmptyState } from './components/TableEmptyState';
import { ClientNameCell } from './components/ClientNameCell';
import { ClientContactCell } from './components/ClientContactCell';
import { ClientStatusCell } from './components/ClientStatusCell';
import { TrainerCell } from './components/TrainerCell';
import { MeetingStatusCell } from './components/MeetingStatusCell';
import { PurchaseTypeCell } from './components/PurchaseTypeCell';
import { SortableColumnHeader } from './components/SortableColumnHeader';

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
  const columns: ColumnDef<ClientData>[] = [
    columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
      id: 'fullName',
      header: () => (
        <SortableColumnHeader
          label="Cliente"
          column="last_name"
          sortConfig={sortConfig}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => <ClientNameCell client={row.original} />
    }),
    
    columnHelper.accessor('email', {
      id: 'contact',
      header: 'Contatto',
      cell: ({ row }) => <ClientContactCell client={row.original} />
    }),
    
    columnHelper.accessor('next_confirmation_due', {
      id: 'status',
      header: 'Stato',
      cell: ({ row }) => <ClientStatusCell client={row.original} />
    }),
    
    columnHelper.accessor(row => row.users?.full_name, {
      id: 'trainer',
      header: () => (
        <SortableColumnHeader
          label="Trainer"
          column="users.full_name"
          sortConfig={sortConfig}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => <TrainerCell client={row.original} />
    }),
    
    columnHelper.accessor('first_meeting_completed', {
      id: 'firstMeeting',
      header: 'Primo Incontro',
      cell: ({ row }) => <MeetingStatusCell client={row.original} />
    }),
    
    columnHelper.accessor('purchase_type', {
      id: 'purchase',
      header: 'Acquisto',
      cell: ({ row }) => <PurchaseTypeCell client={row.original} />
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

  // Show loading state or empty results message
  if (loading) {
    return <TableLoadingState />;
  }

  if (clients.length === 0) {
    return <TableEmptyState searchQuery={searchQuery} />;
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
