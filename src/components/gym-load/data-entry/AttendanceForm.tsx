
import { useState, useEffect } from "react";
import { useClasses } from "../hooks/useClasses";
import { useAttendance } from "../hooks/useAttendance";
import { format, parse } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Calendar as CalendarIcon, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClassAttendance } from "../types";
import { useToast } from "@/hooks/use-toast";

export function AttendanceForm() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const { classes, loading: loadingClasses } = useClasses();
  const { getAttendanceByDate, saveAttendance } = useAttendance();
  const { toast } = useToast();

  // Get the classes for the selected day of week
  const dayOfWeek = date.getDay();
  const relevantClasses = classes.filter(c => c.day_of_week === dayOfWeek);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      const dateString = format(date, "yyyy-MM-dd");
      const data = await getAttendanceByDate(dateString);
      
      // Create a map of class ID to attendance data
      const attendanceMap = new Map();
      data.forEach(item => {
        attendanceMap.set(item.class_id, item);
      });
      
      // Create attendance data for all classes on the selected day
      const newAttendanceData = relevantClasses.map(gymClass => {
        const existingAttendance = attendanceMap.get(gymClass.id);
        
        return {
          class_id: gymClass.id,
          date: dateString,
          participants: existingAttendance?.participants || 0,
          className: gymClass.name,
          roomName: gymClass.room?.name || "",
          startTime: gymClass.start_time.substring(0, 5),
          endTime: gymClass.end_time.substring(0, 5),
          maxCapacity: gymClass.max_capacity,
          id: existingAttendance?.id,
        };
      });
      
      setAttendanceData(newAttendanceData);
      setLoading(false);
    };
    
    if (relevantClasses.length > 0) {
      fetchAttendance();
    } else {
      setAttendanceData([]);
    }
  }, [date, relevantClasses]);

  const handleParticipantsChange = (index: number, value: number) => {
    const newData = [...attendanceData];
    newData[index].participants = value;
    setAttendanceData(newData);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    
    try {
      // Save each attendance record
      for (const attendance of attendanceData) {
        await saveAttendance({
          class_id: attendance.class_id,
          date: attendance.date,
          participants: attendance.participants,
        });
      }
      
      toast({
        title: "Presenze salvate",
        description: `Dati salvati per ${format(date, "EEEE d MMMM", { locale: it })}`,
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingClasses) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presenze corsi</CardTitle>
        <CardDescription>
          Registra le presenze ai corsi per la data selezionata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto pl-3 text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "EEEE d MMMM yyyy", { locale: it })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  locale={it}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : relevantClasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nessun corso programmato per {format(date, "EEEE", { locale: it })}
              </p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orario</TableHead>
                    <TableHead>Corso</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Presenze</TableHead>
                    <TableHead>Capacità</TableHead>
                    <TableHead>Riempimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((attendance, index) => {
                    const fillPercentage = attendance.maxCapacity > 0
                      ? (attendance.participants / attendance.maxCapacity) * 100
                      : 0;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {attendance.startTime} - {attendance.endTime}
                        </TableCell>
                        <TableCell className="font-medium">
                          {attendance.className}
                        </TableCell>
                        <TableCell>
                          {attendance.roomName}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={attendance.maxCapacity}
                            value={attendance.participants || 0}
                            onChange={(e) => handleParticipantsChange(index, parseInt(e.target.value, 10) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          {attendance.maxCapacity}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  fillPercentage >= 90 ? 'bg-red-500' :
                                  fillPercentage >= 70 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(100, fillPercentage)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs ml-2">
                              {Math.round(fillPercentage)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      {relevantClasses.length > 0 && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveAll} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salva presenze
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
