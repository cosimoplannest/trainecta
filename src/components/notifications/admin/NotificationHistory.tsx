
import { useState, useEffect } from "react";
import { Notification } from "@/types/notification-types";
import { fetchAllNotifications } from "@/services/admin-notification-service";
import { useToast } from "@/hooks/use-toast";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationTable } from "./NotificationTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'created_at',
    direction: 'desc'
  });
  const { toast } = useToast();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchAllNotifications();
      setNotifications(data);
      setFilteredNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare lo storico notifiche",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleFilter = (filtered: Notification[]) => {
    setFilteredNotifications(filtered);
  };

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storico Notifiche</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationFilters 
          notifications={notifications} 
          onFilter={handleFilter} 
          onRefresh={loadNotifications}
        />
        <NotificationTable 
          notifications={filteredNotifications}
          loading={loading}
          sorting={sorting}
          onSort={handleSort}
        />
      </CardContent>
    </Card>
  );
}
