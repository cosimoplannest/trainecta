
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientData } from "@/components/clients/types/client-types";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientsModalProps {
  title: string;
  clients: ClientData[];
  isOpen: boolean;
  onClose: () => void;
}

export const ClientsModal = ({ title, clients, isOpen, onClose }: ClientsModalProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-4xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        {clients.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Nessun cliente in questa categoria
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            <Table className="border-collapse">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  {!isMobile && <TableHead>Email</TableHead>}
                  <TableHead>Telefono</TableHead>
                  {!isMobile && <TableHead>Trainer</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link 
                        to={`/client/${client.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {client.first_name} {client.last_name}
                      </Link>
                    </TableCell>
                    {!isMobile && <TableCell>{client.email || '-'}</TableCell>}
                    <TableCell>{client.phone || '-'}</TableCell>
                    {!isMobile && <TableCell>{client.users?.full_name || '-'}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
