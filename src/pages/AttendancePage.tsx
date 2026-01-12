import { useState } from "react";
import { useSchool } from "@/contexts/SchoolContext";
import { AttendanceStatus } from "@/types/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pencil,
  Calendar,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function AttendancePage() {
  const { data, isLoading, updateStaffAttendance, updateStudentAttendance } = useSchool();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    arrivalTime: "",
    status: "keldi" as AttendanceStatus,
    note: "",
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  const openingTime = data.settings.openingTime;
  const [openingHour, openingMinute] = openingTime.split(":").map(Number);

  const calculateLateMinutes = (arrivalTime: string): number => {
    if (!arrivalTime) return 0;
    const [arrHour, arrMinute] = arrivalTime.split(":").map(Number);
    const arrivalMinutes = arrHour * 60 + arrMinute;
    const openingMinutes = openingHour * 60 + openingMinute;
    return Math.max(0, arrivalMinutes - openingMinutes);
  };

  const getStatusFromTime = (arrivalTime: string): AttendanceStatus => {
    if (!arrivalTime) return "kelmadi";
    const lateMinutes = calculateLateMinutes(arrivalTime);
    return lateMinutes > 0 ? "kech_qoldi" : "keldi";
  };

  const handleEditStaff = (staffId: string) => {
    const staff = data.staff.find((s) => s.id === staffId);
    if (!staff) return;

    const attendance = staff.attendance.find((a) => a.date === selectedDate);
    setEditForm({
      arrivalTime: attendance?.arrivalTime || "",
      status: attendance?.status || "keldi",
      note: attendance?.note || "",
    });
    setEditingId(staffId);
  };

  const saveStaffAttendance = () => {
    if (!editingId) return;

    const lateMinutes = calculateLateMinutes(editForm.arrivalTime);
    const status = editForm.arrivalTime ? getStatusFromTime(editForm.arrivalTime) : "kelmadi";

    updateStaffAttendance(editingId, selectedDate, {
      arrivalTime: editForm.arrivalTime || null,
      status,
      lateMinutes,
      note: editForm.note,
    });

    setEditingId(null);
    toast({ title: "Davomat yangilandi" });
  };

  const toggleStudentAttendance = (studentId: string, currentPresent: boolean | undefined) => {
    updateStudentAttendance(studentId, selectedDate, !currentPresent);
    toast({
      title: !currentPresent ? "O'quvchi keldi deb belgilandi" : "O'quvchi kelmadi deb belgilandi",
    });
  };

  const getStatusBadge = (status: AttendanceStatus | undefined, lateMinutes?: number) => {
    if (!status || status === "kelmadi") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
          <XCircle className="h-4 w-4" />
          Kelmadi
        </span>
      );
    }
    if (status === "kech_qoldi") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
          <AlertTriangle className="h-4 w-4" />
          Kech qoldi (+{lateMinutes} daqiqa)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
        <CheckCircle className="h-4 w-4" />
        Keldi
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Davomat</h1>
          <p className="mt-1 text-muted-foreground">
            Maktab ochilish vaqti: <strong>{openingTime}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Xodimlar davomati</TabsTrigger>
          <TabsTrigger value="students">O'quvchilar davomati</TabsTrigger>
        </TabsList>

        {/* Staff Attendance */}
        <TabsContent value="staff" className="mt-6">
          <div className="rounded-xl bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Lavozimi</TableHead>
                  <TableHead>Kelgan vaqti</TableHead>
                  <TableHead>Holati</TableHead>
                  <TableHead>Izoh</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.staff.map((staff) => {
                  const attendance = staff.attendance.find(
                    (a) => a.date === selectedDate
                  );

                  return (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {staff.fullName}
                      </TableCell>
                      <TableCell className="capitalize">
                        {staff.position}
                      </TableCell>
                      <TableCell>
                        {attendance?.arrivalTime ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {attendance.arrivalTime}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(attendance?.status, attendance?.lateMinutes)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {attendance?.note || "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStaff(staff.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Student Attendance */}
        <TabsContent value="students" className="mt-6">
          <div className="rounded-xl bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Sinfi</TableHead>
                  <TableHead>Holati</TableHead>
                  <TableHead className="w-[120px]">Amal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.students.map((student) => {
                  const attendance = student.attendance.find(
                    (a) => a.date === selectedDate
                  );
                  const isPresent = attendance?.present;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.fullName}
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                            <CheckCircle className="h-4 w-4" />
                            Keldi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                            <XCircle className="h-4 w-4" />
                            Kelmadi
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={isPresent ? "outline" : "default"}
                          size="sm"
                          onClick={() =>
                            toggleStudentAttendance(student.id, isPresent)
                          }
                        >
                          {isPresent ? "Kelmadi" : "Keldi"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Staff Attendance Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Davomatni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Kelgan vaqti</Label>
              <Input
                type="time"
                value={editForm.arrivalTime}
                onChange={(e) =>
                  setEditForm({ ...editForm, arrivalTime: e.target.value })
                }
              />
              {editForm.arrivalTime && calculateLateMinutes(editForm.arrivalTime) > 0 && (
                <p className="mt-1 text-sm text-warning">
                  {calculateLateMinutes(editForm.arrivalTime)} daqiqa kech qoldi
                </p>
              )}
            </div>
            <div>
              <Label>Izoh</Label>
              <Textarea
                value={editForm.note}
                onChange={(e) =>
                  setEditForm({ ...editForm, note: e.target.value })
                }
                placeholder="Masalan: Kasal, ta'tilda..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditForm({ ...editForm, arrivalTime: "" });
                }}
              >
                Kelmadi
              </Button>
              <Button onClick={saveStaffAttendance} className="flex-1">
                Saqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
