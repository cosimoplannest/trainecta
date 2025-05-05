
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ClientData } from "../../types/client-types";
import { ClientActionsDropdownTrigger } from "./ClientActionsDropdownTrigger";
import { ClientActionsDropdownContent } from "./ClientActionsDropdownContent";

interface ClientActionMenuProps {
  client: ClientData;
}

export function ClientActionMenu({ client }: ClientActionMenuProps) {
  return (
    <DropdownMenu>
      <ClientActionsDropdownTrigger />
      <ClientActionsDropdownContent client={client} />
    </DropdownMenu>
  );
}
