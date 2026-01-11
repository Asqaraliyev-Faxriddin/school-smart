import { useState } from "react";
import { Calendar, Check, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { students as initialStudents, classes, Student } from "@/data/mockData";

export function Attendance() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("2024-01-10");

  const dates = ["2024-01-10", "2024-01-11", "2024-01-12", "2024-01-13", "2024-01-14"];

  const filteredStudents = selectedClass === "all"
    ? students
    : students.filter((s) => s.class === selectedClass);

  const toggleAttendance = (studentId: string, date: string) => {
    setStudents(students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          attendance: s.attendance.map((a) => {
            if (a.date === date) {
              return { ...a, present: !a.present };
            }
            return a;
          }),
        };
      }
      return s;
    }));
  };

  const getAttendanceForDate = (student: Student, date: string) => {
    return student.attendance.find((a) => a.date === date);
  };

  // Calculate stats
  const presentCount = filteredStudents.filter(
    (s) => getAttendanceForDate(s, selectedDate)?.present
  ).length;
  const absentCount = filteredStudents.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Davomat</h1>
        <p className="mt-1 text-muted-foreground">
          O'quvchilar kunlik davomati
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sinf" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sana" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
        <div className="rounded-xl bg-card p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Jami o'quvchilar</p>
          <p className="text-2xl font-bold text-foreground">{filteredStudents.length}</p>
        </div>
        <div className="rounded-xl bg-success/10 p-4">
          <p className="text-sm text-success">Kelganlar</p>
          <p className="text-2xl font-bold text-success">{presentCount}</p>
        </div>
        <div className="rounded-xl bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Kelmaganlar</p>
          <p className="text-2xl font-bold text-destructive">{absentCount}</p>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">
          {selectedDate} - {selectedClass === "all" ? "Barcha sinflar" : selectedClass}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const attendance = getAttendanceForDate(student, selectedDate);
            const isPresent = attendance?.present ?? false;

            return (
              <div
                key={student.id}
                className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                  isPresent
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isPresent
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {isPresent ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isPresent ? "outline" : "default"}
                  onClick={() => toggleAttendance(student.id, selectedDate)}
                  className={isPresent ? "" : "gradient-primary"}
                >
                  {isPresent ? "O'zgartirish" : "Keldi"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
