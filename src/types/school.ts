// Types for School Management System

export type StaffPosition = 
  | "zavuch" 
  | "o'qituvchi" 
  | "psixolog" 
  | "hamshira" 
  | "qo'riqchi" 
  | "texnik xodim";

export type AttendanceStatus = "keldi" | "kelmadi" | "kech_qoldi";

export interface StaffAttendance {
  date: string;
  arrivalTime: string | null;
  status: AttendanceStatus;
  lateMinutes: number;
  note: string;
}

export interface Staff {
  id: string;
  fullName: string;
  position: StaffPosition;
  phone: string;
  salary: number;
  salaryActive: boolean;
  attendance: StaffAttendance[];
}

export interface StudentAttendance {
  date: string;
  present: boolean;
}

export interface Grade {
  id: string;
  subject: string;
  date: string;
  grade: number;
  note: string;
}

export interface Student {
  id: string;
  fullName: string;
  class: string;
  parentPhone: string;
  attendance: StudentAttendance[];
  grades: Grade[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface SchoolSettings {
  openingTime: string; // "08:00"
  latenessPenaltyPerMinute: number;
}

export interface SchoolData {
  staff: Staff[];
  students: Student[];
  announcements: Announcement[];
  settings: SchoolSettings;
}
