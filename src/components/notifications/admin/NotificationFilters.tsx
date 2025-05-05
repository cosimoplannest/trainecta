
import { useState, useEffect } from "react";
import { Notification } from "@/types/notification-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Search, 
  RefreshCw, 
  CalendarIcon, 
  Filter, 
  X 
} from "lucide-react";

interface NotificationFiltersProps {
  notifications: Notification[];
  onFilter: (filtered: Notification[]) => void;
  onRefresh: () => void;
}

export function NotificationFilters({ notifications, onFilter, onRefresh }: NotificationFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, typeFilter, readFilter, dateFrom, dateTo, notifications]);

  const applyFilters = () => {
    const filtered = notifications.filter(notification => {
      // Text search
      const matchesSearch = 
        searchTerm === "" || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = 
        typeFilter === "all" || 
        notification.notification_type === typeFilter;
      
      // Read status filter
      const matchesRead = 
        readFilter === "all" || 
        (readFilter === "read" ? notification.read : !notification.read);
      
      // Date filter
      const notificationDate = new Date(notification.created_at);
      const matchesDateFrom = !dateFrom || notificationDate >= dateFrom;
      const matchesDateTo = !dateTo || notificationDate <= dateTo;
      
      return matchesSearch && matchesType && matchesRead && matchesDateFrom && matchesDateTo;
    });

    onFilter(filtered);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh();
    setLoading(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setReadFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca notifiche..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo di notifica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i tipi</SelectItem>
            <SelectItem value="app">Solo app</SelectItem>
            <SelectItem value="email">Solo email</SelectItem>
            <SelectItem value="both">App & Email</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stato lettura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="read">Letti</SelectItem>
            <SelectItem value="unread">Non letti</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Data inizio'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                locale={it}
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Data fine'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-2">
          {(searchTerm || typeFilter !== "all" || readFilter !== "all" || dateFrom || dateTo) && (
            <Button variant="ghost" onClick={resetFilters} className="flex gap-2">
              <X className="h-4 w-4" />
              Cancella filtri
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Aggiorna
          </Button>
        </div>
      </div>
    </div>
  );
}
