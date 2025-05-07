
export interface Room {
  id: string;
  gym_id: string;
  name: string;
  capacity: number;
  is_bookable: boolean;
  type?: string;
  created_at: string;
  updated_at: string;
}

export interface GymClass {
  id: string;
  gym_id: string;
  room_id: string;
  name: string;
  instructor_id?: string;
  instructor?: {
    full_name: string;
  };
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  max_capacity: number;
  requires_booking: boolean;
  created_at: string;
  updated_at: string;
  room?: Room;
}

export interface ClassAttendance {
  id: string;
  class_id: string;
  date: string;
  participants: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface GymAccessLog {
  id: string;
  gym_id: string;
  date: string;
  hour: number;
  minute: number;
  entries: number;
  created_at: string;
  updated_at: string;
}

export interface LoadData {
  timeSlot: string;
  totalEntries: number;
  classParticipants: number;
  percentageInClasses: number;
  classes: Array<{
    name: string;
    participants: number;
    capacity: number;
    fillPercentage: number;
  }>;
}

export interface DateRange {
  from: Date;
  to?: Date;
}
