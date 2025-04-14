
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Clipboard, 
  ClipboardCheck, 
  Loader2, 
  RotateCcw, 
  RefreshCcw, 
  Trash2 
} from "lucide-react";
import type { RegistrationCode } from "./use-registration-codes";

interface RegistrationCodesListProps {
  registrationCodes: RegistrationCode[];
  copyCode: string | null;
  setCopyCode: (code: string | null) => void;
  toggleCodeStatus: (id: string, active: boolean) => Promise<void>;
  refreshCode: (id: string) => Promise<void>;
  deleteCode: (id: string) => Promise<void>;
  processingIds: string[];
}

export function RegistrationCodesList({
  registrationCodes,
  copyCode,
  setCopyCode,
  toggleCodeStatus,
  refreshCode,
  deleteCode,
  processingIds
}: RegistrationCodesListProps) {
  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyCode(code);
    
    setTimeout(() => {
      setCopyCode(null);
    }, 2000);
  };

  const getRegistrationLink = (code: string, role: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${role}-registration/${code}`;
  };

  const roleLabels: Record<string, string> = {
    admin: "Amministratore",
    operator: "Operatore",
    trainer: "Trainer",
    assistant: "Assistente",
    instructor: "Istruttore",
  };
  
  const roleBadgeColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    operator: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    trainer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    assistant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    instructor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Codice</TableHead>
            <TableHead>Ruolo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Scadenza</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrationCodes.map((code) => (
            <TableRow key={code.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    {code.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyCodeToClipboard(code.code)}
                  >
                    {copyCode === code.code ? (
                      <ClipboardCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Clipboard className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={roleBadgeColors[code.role] || ''}>
                  {roleLabels[code.role] || code.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={code.active ? "default" : "secondary"}>
                  {code.active ? "Attivo" : "Disattivato"}
                </Badge>
              </TableCell>
              <TableCell>
                {code.expires_at ? (
                  format(new Date(code.expires_at), "d MMM yyyy", { locale: it })
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Non scade
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      const link = getRegistrationLink(code.code, code.role);
                      navigator.clipboard.writeText(link);
                      toast({
                        title: "Link copiato",
                        description: "Link di registrazione copiato negli appunti",
                      });
                    }}
                  >
                    <Clipboard className="h-3.5 w-3.5 mr-1" />
                    Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => toggleCodeStatus(code.id, code.active)}
                    disabled={processingIds.includes(code.id)}
                  >
                    {processingIds.includes(code.id) ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        {code.active ? "Disattiva" : "Attiva"}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => refreshCode(code.id)}
                    disabled={processingIds.includes(code.id)}
                  >
                    {processingIds.includes(code.id) ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                        Rinnova
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-destructive"
                    onClick={() => deleteCode(code.id)}
                    disabled={processingIds.includes(code.id)}
                  >
                    {processingIds.includes(code.id) ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
