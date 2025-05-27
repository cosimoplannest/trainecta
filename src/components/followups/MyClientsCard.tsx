
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  subscription_type?: string;
  joined_at?: string;
}

interface MyClientsCardProps {
  filter?: 'first_meeting' | 'followup';
}

export function MyClientsCard({ filter }: MyClientsCardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyClients = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let query = supabase
          .from("clients")
          .select("id, first_name, last_name, subscription_type, joined_at")
          .eq("assigned_to", user.id);
          
        // If filter is provided, apply additional filtering
        if (filter === 'first_meeting') {
          // Filter for clients needing first meeting
          query = query.is('joined_at', null);
        } else if (filter === 'followup') {
          // Filter for clients needing followup (joined but recent)
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          query = query
            .not('joined_at', 'is', null)
            .gte('joined_at', twoWeeksAgo.toISOString());
        }
          
        const { data, error } = await query.order("last_name").limit(5);
          
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching assigned clients:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyClients();
  }, [user, filter]);
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get the title based on the filter
  const getCardTitle = () => {
    if (filter === 'first_meeting') return "Clienti Primo Incontro";
    if (filter === 'followup') return "Clienti Follow-up";
    return "I Miei Clienti";
  };

  // Get the description based on the filter
  const getCardDescription = () => {
    if (filter === 'first_meeting') return "Clienti che devono ancora effettuare il primo incontro";
    if (filter === 'followup') return "Clienti che necessitano di un follow-up";
    return "Clienti a te assegnati";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getCardTitle()}</CardTitle>
        <CardDescription>{getCardDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-2 opacity-20" />
            <p>Non hai clienti {filter === 'first_meeting' ? 'per il primo incontro' : filter === 'followup' ? 'per il follow-up' : 'assegnati'}</p>
            <p className="text-sm">I clienti che ti verranno assegnati appariranno qui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.first_name} {client.last_name}</p>
                    {client.subscription_type && (
                      <Badge variant="outline" className="font-normal text-xs">
                        {client.subscription_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/client/${client.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/clients">
            Vedi tutti i clienti
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
