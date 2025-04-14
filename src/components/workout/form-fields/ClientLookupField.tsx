
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

type Client = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email?: string;
  fitness_level?: string;
  primary_goal?: string;
};

interface ClientLookupFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
}

export const ClientLookupField: React.FC<ClientLookupFieldProps> = ({
  value,
  onChange,
  label = "Client",
  placeholder = "Search clients...",
}) => {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, first_name, last_name, email, fitness_level, primary_goal");
        
        if (error) throw error;
        
        const formattedClients = (data || []).map(client => ({
          ...client,
          full_name: `${client.first_name} ${client.last_name}`
        }));
        
        setClients(formattedClients);
        
        // If we have a value, find the selected client
        if (value) {
          const selected = formattedClients.find(c => c.id === value);
          if (selected) {
            setSelectedClient(selected);
          }
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [value]);

  const handleSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    onChange(clientId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {selectedClient
            ? selectedClient.full_name
            : loading 
              ? "Loading clients..." 
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No client found.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.full_name}
                onSelect={() => handleSelect(client.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {client.full_name}
                {client.email && <span className="ml-2 text-muted-foreground text-xs">({client.email})</span>}
                {client.primary_goal && <span className="ml-auto text-xs text-muted-foreground">
                  {client.primary_goal.replace("_", " ")}
                </span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
