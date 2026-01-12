import { useState, useEffect, useCallback } from "react";
import { SchoolData, Staff, Student, Announcement, StaffAttendance, StudentAttendance, Grade } from "@/types/school";

const STORAGE_KEY = "school_management_data";

const getInitialMockData = (): SchoolData => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split("T")[0];

  return {
    staff: [
      {
        id: "1",
        fullName: "Abror Boboyev",
        position: "zavuch",
        phone: "+998 90 123 45 67",
        salary: 5000000,
        salaryActive: true,
        attendance: [
          { date: today, arrivalTime: "07:55", status: "keldi", lateMinutes: 0, note: "" },
          { date: yesterday, arrivalTime: "08:05", status: "kech_qoldi", lateMinutes: 5, note: "" },
          { date: twoDaysAgo, arrivalTime: "07:50", status: "keldi", lateMinutes: 0, note: "" },
        ],
      },
      {
        id: "2",
        fullName: "Dilnoza Pirmatova",
        position: "o'qituvchi",
        phone: "+998 91 234 56 78",
        salary: 3500000,
        salaryActive: true,
        attendance: [
          { date: today, arrivalTime: "08:12", status: "kech_qoldi", lateMinutes: 12, note: "" },
          { date: yesterday, arrivalTime: "07:58", status: "keldi", lateMinutes: 0, note: "" },
          { date: twoDaysAgo, arrivalTime: null, status: "kelmadi", lateMinutes: 0, note: "Kasal" },
        ],
      },
      {
        id: "3",
        fullName: "Go'zal Husanova",
        position: "o'qituvchi",
        phone: "+998 93 345 67 89",
        salary: 3500000,
        salaryActive: true,
        attendance: [
          { date: today, arrivalTime: "07:45", status: "keldi", lateMinutes: 0, note: "" },
          { date: yesterday, arrivalTime: "07:55", status: "keldi", lateMinutes: 0, note: "" },
          { date: twoDaysAgo, arrivalTime: "08:15", status: "kech_qoldi", lateMinutes: 15, note: "" },
        ],
      },
      {
        id: "4",
        fullName: "Rashida Nursaidova",
        position: "o'qituvchi",
        phone: "+998 94 456 78 90",
        salary: 3500000,
        salaryActive: true,
        attendance: [
          { date: today, arrivalTime: null, status: "kelmadi", lateMinutes: 0, note: "Ta'tilda" },
          { date: yesterday, arrivalTime: "07:50", status: "keldi", lateMinutes: 0, note: "" },
          { date: twoDaysAgo, arrivalTime: "07:55", status: "keldi", lateMinutes: 0, note: "" },
        ],
      },
      {
        id: "5",
        fullName: "Muattarxon Mamadaliyev",
        position: "o'qituvchi",
        phone: "+998 95 567 89 01",
        salary: 3500000,
        salaryActive: true,
        attendance: [
          { date: today, arrivalTime: "08:00", status: "keldi", lateMinutes: 0, note: "" },
          { date: yesterday, arrivalTime: "08:10", status: "kech_qoldi", lateMinutes: 10, note: "" },
          { date: twoDaysAgo, arrivalTime: "07:58", status: "keldi", lateMinutes: 0, note: "" },
        ],
      },
    ],
    students: [
      {
        id: "1",
        fullName: "Madina Husayeva",
        class: "9-A",
        parentPhone: "+998 90 111 22 33",
        attendance: [
          { date: today, present: true },
          { date: yesterday, present: true },
          { date: twoDaysAgo, present: false },
        ],
        grades: [
          { id: "g1", subject: "Matematika", date: today, grade: 5, note: "A'lo javob" },
          { id: "g2", subject: "Ona tili", date: yesterday, grade: 4, note: "" },
          { id: "g3", subject: "Ingliz tili", date: twoDaysAgo, grade: 5, note: "" },
        ],
      },
      {
        id: "2",
        fullName: "Jo'rayev Husayn",
        class: "9-A",
        parentPhone: "+998 91 222 33 44",
        attendance: [
          { date: today, present: true },
          { date: yesterday, present: false },
          { date: twoDaysAgo, present: true },
        ],
        grades: [
          { id: "g4", subject: "Matematika", date: today, grade: 4, note: "" },
          { id: "g5", subject: "Fizika", date: yesterday, grade: 3, note: "Uyga vazifa yo'q" },
          { id: "g6", subject: "Kimyo", date: twoDaysAgo, grade: 4, note: "" },
        ],
      },
      {
        id: "3",
        fullName: "Kimsanova Imona",
        class: "9-B",
        parentPhone: "+998 93 333 44 55",
        attendance: [
          { date: today, present: true },
          { date: yesterday, present: true },
          { date: twoDaysAgo, present: true },
        ],
        grades: [
          { id: "g7", subject: "Matematika", date: today, grade: 5, note: "" },
          { id: "g8", subject: "Biologiya", date: yesterday, grade: 5, note: "Ajoyib!" },
          { id: "g9", subject: "Tarix", date: twoDaysAgo, grade: 5, note: "" },
        ],
      },
    ],
    announcements: [
      {
        id: "a1",
        title: "Ota-onalar yig'ilishi",
        content: "Hurmatli ota-onalar! 15-yanvar kuni soat 18:00 da umumiy yig'ilish bo'lib o'tadi. Barchangizni kutamiz!",
        date: today,
      },
      {
        id: "a2",
        title: "Qishki ta'til",
        content: "25-dekabrdan 5-yanvargacha maktabda qishki ta'til e'lon qilinadi.",
        date: yesterday,
      },
    ],
    settings: {
      openingTime: "08:00",
      latenessPenaltyPerMinute: 1000,
    },
  };
};

export function useSchoolData() {
  const [data, setData] = useState<SchoolData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage or initialize with mock data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(getInitialMockData());
      }
    } else {
      const initialData = getInitialMockData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      setData(initialData);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback((newData: SchoolData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  // Staff operations
  const updateStaff = useCallback((staffId: string, updates: Partial<Staff>) => {
    if (!data) return;
    const newData = {
      ...data,
      staff: data.staff.map((s) => (s.id === staffId ? { ...s, ...updates } : s)),
    };
    saveData(newData);
  }, [data, saveData]);

  const addStaff = useCallback((staff: Staff) => {
    if (!data) return;
    saveData({ ...data, staff: [...data.staff, staff] });
  }, [data, saveData]);

  const removeStaff = useCallback((staffId: string) => {
    if (!data) return;
    saveData({ ...data, staff: data.staff.filter((s) => s.id !== staffId) });
  }, [data, saveData]);

  const updateStaffAttendance = useCallback((staffId: string, date: string, attendance: Partial<StaffAttendance>) => {
    if (!data) return;
    const newData = {
      ...data,
      staff: data.staff.map((s) => {
        if (s.id !== staffId) return s;
        const existingIndex = s.attendance.findIndex((a) => a.date === date);
        if (existingIndex >= 0) {
          const newAttendance = [...s.attendance];
          newAttendance[existingIndex] = { ...newAttendance[existingIndex], ...attendance };
          return { ...s, attendance: newAttendance };
        } else {
          return {
            ...s,
            attendance: [
              ...s.attendance,
              {
                date,
                arrivalTime: attendance.arrivalTime || null,
                status: attendance.status || "kelmadi",
                lateMinutes: attendance.lateMinutes || 0,
                note: attendance.note || "",
              },
            ],
          };
        }
      }),
    };
    saveData(newData);
  }, [data, saveData]);

  // Student operations
  const updateStudent = useCallback((studentId: string, updates: Partial<Student>) => {
    if (!data) return;
    const newData = {
      ...data,
      students: data.students.map((s) => (s.id === studentId ? { ...s, ...updates } : s)),
    };
    saveData(newData);
  }, [data, saveData]);

  const addStudent = useCallback((student: Student) => {
    if (!data) return;
    saveData({ ...data, students: [...data.students, student] });
  }, [data, saveData]);

  const removeStudent = useCallback((studentId: string) => {
    if (!data) return;
    saveData({ ...data, students: data.students.filter((s) => s.id !== studentId) });
  }, [data, saveData]);

  const updateStudentAttendance = useCallback((studentId: string, date: string, present: boolean) => {
    if (!data) return;
    const newData = {
      ...data,
      students: data.students.map((s) => {
        if (s.id !== studentId) return s;
        const existingIndex = s.attendance.findIndex((a) => a.date === date);
        if (existingIndex >= 0) {
          const newAttendance = [...s.attendance];
          newAttendance[existingIndex] = { ...newAttendance[existingIndex], present };
          return { ...s, attendance: newAttendance };
        } else {
          return {
            ...s,
            attendance: [...s.attendance, { date, present }],
          };
        }
      }),
    };
    saveData(newData);
  }, [data, saveData]);

  const addGrade = useCallback((studentId: string, grade: Grade) => {
    if (!data) return;
    const newData = {
      ...data,
      students: data.students.map((s) => {
        if (s.id !== studentId) return s;
        return { ...s, grades: [...s.grades, grade] };
      }),
    };
    saveData(newData);
  }, [data, saveData]);

  const updateGrade = useCallback((studentId: string, gradeId: string, updates: Partial<Grade>) => {
    if (!data) return;
    const newData = {
      ...data,
      students: data.students.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          grades: s.grades.map((g) => (g.id === gradeId ? { ...g, ...updates } : g)),
        };
      }),
    };
    saveData(newData);
  }, [data, saveData]);

  const removeGrade = useCallback((studentId: string, gradeId: string) => {
    if (!data) return;
    const newData = {
      ...data,
      students: data.students.map((s) => {
        if (s.id !== studentId) return s;
        return { ...s, grades: s.grades.filter((g) => g.id !== gradeId) };
      }),
    };
    saveData(newData);
  }, [data, saveData]);

  // Announcement operations
  const addAnnouncement = useCallback((announcement: Announcement) => {
    if (!data) return;
    saveData({ ...data, announcements: [announcement, ...data.announcements] });
  }, [data, saveData]);

  const updateAnnouncement = useCallback((announcementId: string, updates: Partial<Announcement>) => {
    if (!data) return;
    const newData = {
      ...data,
      announcements: data.announcements.map((a) =>
        a.id === announcementId ? { ...a, ...updates } : a
      ),
    };
    saveData(newData);
  }, [data, saveData]);

  const removeAnnouncement = useCallback((announcementId: string) => {
    if (!data) return;
    saveData({ ...data, announcements: data.announcements.filter((a) => a.id !== announcementId) });
  }, [data, saveData]);

  // Settings operations
  const updateSettings = useCallback((settings: Partial<SchoolData["settings"]>) => {
    if (!data) return;
    saveData({ ...data, settings: { ...data.settings, ...settings } });
  }, [data, saveData]);

  // Reset data
  const resetData = useCallback(() => {
    const initialData = getInitialMockData();
    saveData(initialData);
  }, [saveData]);

  return {
    data,
    isLoading,
    // Staff
    updateStaff,
    addStaff,
    removeStaff,
    updateStaffAttendance,
    // Students
    updateStudent,
    addStudent,
    removeStudent,
    updateStudentAttendance,
    addGrade,
    updateGrade,
    removeGrade,
    // Announcements
    addAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
    // Settings
    updateSettings,
    // Utils
    resetData,
  };
}
