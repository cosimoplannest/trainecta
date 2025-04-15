
import { useState } from "react";
import { Search, CalendarRange, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
  PopoverTrigger,
} from "@/components/ui/popover";
import { Database } from "@/integrations/supabase/types";

type UnavailabilityReason = Database["public"]["Enums"]["unavailability_reason"];

const reasonOptions = [
  { value: "illness" as UnavailabilityReason, label: "Malattia" },
  { value: "injury" as UnavailabilityReason, label: "Infortunio" },
  { value: "vacation" as UnavailabilityReason, label: "Ferie" },
  { value: "personal" as UnavailabilityReason, label: "Motivi personali" },
  { value: "other" as UnavailabilityReason, label: "Altro" },
];

interface UnavailabilitySearchProps {
  onSearch: (filters: UnavailabilityFilters) => void;
}

export interface UnavailabilityFilters {
  reason?: UnavailabilityReason;
  startDate?: Date;
  endDate?: Date;
}

export function UnavailabilitySearch({ onSearch }: UnavailabilitySearchProps) {
  const [reason, setReason] = useState<UnavailabilityReason | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const handleSearch = () => {
    onSearch({
      reason,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
  };

  const resetFilters = () => {
    setReason(undefined);
    setDateRange({});
    onSearch({});
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
      <div>
        <div className="text-sm font-medium mb-2">Motivo</div>
        <Select
          value={reason}
          onValueChange={(value) => setReason(value as UnavailabilityReason)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Seleziona motivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tutti</SelectItem>
            {reasonOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Periodo</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal md:w-[300px]"
            >
              <CalendarRange className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Seleziona date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleSearch} className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          Cerca
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reimposta
        </Button>
      </div>
    </div>
  );
}
