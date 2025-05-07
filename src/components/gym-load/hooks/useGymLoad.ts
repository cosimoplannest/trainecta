
import { useState } from "react";
import { format, parse, addMinutes } from "date-fns";
import { useClasses } from "./useClasses";
import { useAttendance } from "./useAttendance";
import { useAccessLogs } from "./useAccessLogs";
import { LoadData } from "../types";
import { it } from "date-fns/locale";

export const useGymLoad = () => {
  const [loading, setLoading] = useState(false);
  const { classes } = useClasses();
  const { getAttendanceByDate } = useAttendance();
  const { getAccessLogsByDate } = useAccessLogs();
  
  const calculateLoadData = async (date: string) => {
    setLoading(true);
    
    try {
      // Get attendance data for the selected date
      const attendanceData = await getAttendanceByDate(date);
      
      // Get access logs for the selected date
      const accessLogs = await getAccessLogsByDate(date);
      
      // Find all classes for the selected day of week
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      const relevantClasses = classes.filter(c => c.day_of_week === dayOfWeek);
      
      // Calculate load data for each 30-minute slot from 6:00 to 22:00
      const loadData: LoadData[] = [];
      
      for (let hour = 6; hour < 22; hour++) {
        for (let minute of [0, 30]) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const timeSlotEnd = format(addMinutes(parse(`${timeSlot}`, 'HH:mm', new Date()), 30), 'HH:mm');
          
          // Find access logs for this time slot
          const logForSlot = accessLogs.find(log => log.hour === hour && log.minute === minute);
          const totalEntries = logForSlot?.entries || 0;
          
          // Find classes that are active during this time slot
          const activeClasses = relevantClasses.filter(c => {
            const startTime = c.start_time.substring(0, 5); // HH:MM format
            const endTime = c.end_time.substring(0, 5); // HH:MM format
            return startTime <= timeSlot && endTime > timeSlot;
          });
          
          // Calculate class participants and details
          let classParticipants = 0;
          const classDetails = activeClasses.map(c => {
            const attendance = attendanceData.find(a => a.class_id === c.id);
            const participants = attendance?.participants || 0;
            classParticipants += participants;
            
            return {
              name: c.name,
              participants,
              capacity: c.max_capacity,
              fillPercentage: c.max_capacity > 0 ? (participants / c.max_capacity) * 100 : 0
            };
          });
          
          // Calculate percentage of people in classes
          const percentageInClasses = totalEntries > 0 ? (classParticipants / totalEntries) * 100 : 0;
          
          loadData.push({
            timeSlot: `${timeSlot}-${timeSlotEnd}`,
            totalEntries,
            classParticipants,
            percentageInClasses,
            classes: classDetails
          });
        }
      }
      
      return loadData;
    } catch (error) {
      console.error("Error calculating gym load:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    calculateLoadData
  };
};
