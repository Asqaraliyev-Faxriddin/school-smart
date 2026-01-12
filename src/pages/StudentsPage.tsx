import { useState } from "react";
import { useSchool } from "@/contexts/SchoolContext";
import { Student, Grade } from "@/types/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  Phone,
  GraduationCap,
  Star,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function StudentsPage() {
  const { data, isLoading, addStudent, updateStudent, removeStudent, addGrade } =
    useSchool();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isViewGradesOpen, setIsViewGradesOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    class: "",
    parentPhone: "",
  });

  const [gradeForm, setGradeForm] = useState({
    subject: "",
    grade: "5",
    note: "",
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  const classes = [...new Set(data.students.map((s) => s.class))];

  const filteredStudents = data.students.filter((s) => {
    const matchesSearch = s.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
  };

  const handleAdd = () => {
    if (!formData.fullName || !formData.class || !formData.parentPhone) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      class: formData.class,
      parentPhone: formData.parentPhone,
      attendance: [],
      grades: [],
    };

    addStudent(newStudent);
    setIsAddOpen(false);
    setFormData({ fullName: "", class: "", parentPhone: "" });
    toast({ title: "Muvaffaqiyat", description: "O'quvchi qo'shildi" });
  };

  const handleEdit = () => {
    if (!selectedStudent) return;

    updateStudent(selectedStudent.id, {
      fullName: formData.fullName,
      class: formData.class,
      parentPhone: formData.parentPhone,
    });

    setIsEditOpen(false);
    setSelectedStudent(null);
    toast({ title: "Muvaffaqiyat", description: "O'quvchi ma'lumotlari yangilandi" });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      class: student.class,
      parentPhone: student.parentPhone,
    });
    setIsEditOpen(true);
  };

  const openGradeDialog = (student: Student) => {
    setSelectedStudent(student);
    setGradeForm({ subject: "", grade: "5", note: "" });
    setIsGradeOpen(true);
  };

  const openViewGrades = (student: Student) => {
    setSelectedStudent(student);
    setIsViewGradesOpen(true);
  };

  const handleAddGrade = () => {
    if (!selectedStudent || !gradeForm.subject) {
      toast({
        title: "Xatolik",
        description: "Fan nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    const newGrade: Grade = {
      id: Date.now().toString(),
      subject: gradeForm.subject,
      date: new Date().toISOString().split("T")[0],
      grade: parseInt(gradeForm.grade),
      note: gradeForm.note,
    };

    addGrade(selectedStudent.id, newGrade);
    setIsGradeOpen(false);
    toast({ title: "Baho qo'yildi" });
  };

  const handleRemove = (student: Student) => {
    if (confirm(`${student.fullName}ni o'chirmoqchimisiz?`)) {
      removeStudent(student.id);
      toast({ title: "O'quvchi o'chirildi", variant: "destructive" });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">O'quvchilar</h1>
          <p className="mt-1 text-muted-foreground">
            Jami {data.students.length} ta o'quvchi
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              O'quvchi qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi o'quvchi qo'shish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>F.I.SH</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Ism familiya"
                />
              </div>
              <div>
                <Label>Sinfi</Label>
                <Input
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  placeholder="9-A"
                />
              </div>
              <div>
                <Label>Ota-ona telefoni</Label>
                <Input
                  value={formData.parentPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, parentPhone: e.target.value })
                  }
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Qo'shish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O'quvchi izlash..."
            className="pl-10"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sinf tanlash" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha sinflar</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>F.I.SH</TableHead>
              <TableHead>Sinfi</TableHead>
              <TableHead>Ota-ona telefoni</TableHead>
              <TableHead>O'rtacha baho</TableHead>
              <TableHead>Bugungi davomat</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const average = calculateAverage(student.grades);
              const todayAttendance = student.attendance.find(
                (a) => a.date === today
              );

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      {student.fullName}
                    </div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {student.parentPhone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning" />
                      <span className="font-semibold">{average.toFixed(1)}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => openViewGrades(student)}
                      >
                        ({student.grades.length} ta baho)
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {todayAttendance?.present ? (
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        Keldi
                      </span>
                    ) : todayAttendance?.present === false ? (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                        Kelmadi
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Belgilanmagan
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openGradeDialog(student)}>
                          <Star className="mr-2 h-4 w-4" />
                          Baho qo'yish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(student)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(student)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          O'chirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O'quvchini tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>F.I.SH</Label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Sinfi</Label>
              <Input
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Ota-ona telefoni</Label>
              <Input
                value={formData.parentPhone}
                onChange={(e) =>
                  setFormData({ ...formData, parentPhone: e.target.value })
                }
              />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Saqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Grade Dialog */}
      <Dialog open={isGradeOpen} onOpenChange={setIsGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.fullName} uchun baho qo'yish
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Fan nomi</Label>
              <Input
                value={gradeForm.subject}
                onChange={(e) =>
                  setGradeForm({ ...gradeForm, subject: e.target.value })
                }
                placeholder="Matematika"
              />
            </div>
            <div>
              <Label>Baho</Label>
              <Select
                value={gradeForm.grade}
                onValueChange={(value) =>
                  setGradeForm({ ...gradeForm, grade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Izoh</Label>
              <Textarea
                value={gradeForm.note}
                onChange={(e) =>
                  setGradeForm({ ...gradeForm, note: e.target.value })
                }
                placeholder="Izoh..."
              />
            </div>
            <Button onClick={handleAddGrade} className="w-full">
              Baho qo'yish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Grades Dialog */}
      <Dialog open={isViewGradesOpen} onOpenChange={setIsViewGradesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStudent?.fullName} - Baholar</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fan</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Baho</TableHead>
                  <TableHead>Izoh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedStudent?.grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>
                      {new Date(grade.date).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          grade.grade >= 4
                            ? "bg-success/10 text-success"
                            : grade.grade === 3
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {grade.grade}
                      </span>
                    </TableCell>
                    <TableCell>{grade.note || "—"}</TableCell>
                  </TableRow>
                ))}
                {selectedStudent?.grades.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Baholar yo'q
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {selectedStudent && selectedStudent.grades.length > 0 && (
            <div className="mt-4 flex justify-between rounded-lg bg-muted p-4">
              <span className="font-medium">O'rtacha baho:</span>
              <span className="text-xl font-bold text-primary">
                {calculateAverage(selectedStudent.grades).toFixed(2)}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
