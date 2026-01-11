import { useState } from "react";
import { Search, Plus, Clock, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { teachers as initialTeachers, Teacher } from "@/data/mockData";

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<{
    date: string;
    arrivalTime: string;
    present: boolean;
  } | null>(null);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getAttendancePercentage = (teacher: Teacher) => {
    const presentDays = teacher.attendance.filter((a) => a.present).length;
    return (presentDays / teacher.attendance.length) * 100;
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("uz-UZ").format(salary) + " so'm";
  };

  const handleUpdateAttendance = (teacherId: string, date: string, newTime: string, present: boolean) => {
    setTeachers(teachers.map(t => {
      if (t.id === teacherId) {
        return {
          ...t,
          attendance: t.attendance.map(a => {
            if (a.date === date) {
              return { ...a, arrivalTime: present ? newTime : "-", present };
            }
            return a;
          })
        };
      }
      return t;
    }));
    setEditingAttendance(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">O'qituvchilar</h1>
          <p className="mt-1 text-muted-foreground">
            O'qituvchilar ro'yxati, oylik va davomat ma'lumotlari
          </p>
        </div>
        <Button className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Yangi o'qituvchi
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md animate-fade-in">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="O'qituvchi qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teachers Table */}
      <div className="animate-slide-up rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Ism familiya</TableHead>
              <TableHead>Fan</TableHead>
              <TableHead>Oylik</TableHead>
              <TableHead>Davomat</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => {
              const attendancePercentage = getAttendancePercentage(teacher);
              return (
                <TableRow key={teacher.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 font-semibold text-success">
                        {teacher.name.charAt(0)}
                      </div>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {teacher.subject}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatSalary(teacher.salary)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            attendancePercentage >= 80
                              ? "bg-success"
                              : attendancePercentage >= 60
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${attendancePercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {attendancePercentage.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog 
                      open={attendanceDialogOpen && selectedTeacher?.id === teacher.id} 
                      onOpenChange={(open) => {
                        setAttendanceDialogOpen(open);
                        if (open) setSelectedTeacher(teacher);
                        else setEditingAttendance(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Clock className="mr-1 h-4 w-4" />
                          Davomat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Davomat - {teacher.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm text-muted-foreground">Fan: {teacher.subject}</p>
                            <p className="text-sm text-muted-foreground">Oylik: {formatSalary(teacher.salary)}</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Kunlik davomat</Label>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                              {teacher.attendance.map((att) => (
                                <div
                                  key={att.date}
                                  className="flex items-center justify-between rounded-lg border p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                      att.present ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                                    }`}>
                                      {att.present ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    </div>
                                    <div>
                                      <p className="font-medium">{att.date}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {att.present ? `Keldi: ${att.arrivalTime}` : "Kelmadi"}
                                      </p>
                                    </div>
                                  </div>
                                  {editingAttendance?.date === att.date ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="time"
                                        value={editingAttendance.arrivalTime}
                                        onChange={(e) => setEditingAttendance({
                                          ...editingAttendance,
                                          arrivalTime: e.target.value
                                        })}
                                        className="w-28"
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => handleUpdateAttendance(
                                          teacher.id,
                                          att.date,
                                          editingAttendance.arrivalTime,
                                          true
                                        )}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleUpdateAttendance(
                                          teacher.id,
                                          att.date,
                                          "-",
                                          false
                                        )}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingAttendance({
                                        date: att.date,
                                        arrivalTime: att.arrivalTime === "-" ? "08:00" : att.arrivalTime,
                                        present: att.present
                                      })}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
