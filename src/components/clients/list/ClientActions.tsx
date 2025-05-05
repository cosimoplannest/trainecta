
import { ClientData } from "../types/client-types";
import { ProfileButton } from "./actions/ProfileButton";
import { ClientActionMenu } from "./actions/ClientActionMenu";

interface ClientActionsProps {
  client: ClientData;
  handleViewProfile: (clientId: string) => void;
}

export function ClientActions({ client, handleViewProfile }: ClientActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <ProfileButton 
        clientId={client.id} 
        handleViewProfile={handleViewProfile} 
      />
      <ClientActionMenu client={client} />
    </div>
  );
}
