import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { students as initialStudents, subjects, classes, Student } from "@/data/mockData";

export function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ subject: "", grade: 5 });

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddGrade = () => {
    if (!selectedStudent || !newGrade.subject) return;

    setStudents(students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          grades: [
            ...s.grades,
            {
              subject: newGrade.subject,
              grade: newGrade.grade,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return s;
    }));

    setGradeDialogOpen(false);
    setNewGrade({ subject: "", grade: 5 });
  };

  const getAverageGrade = (student: Student) => {
    if (student.grades.length === 0) return 0;
    return student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "text-success";
    if (grade >= 3.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">O'quvchilar</h1>
          <p className="mt-1 text-muted-foreground">
            Barcha o'quvchilar ro'yxati va ularning baholari
          </p>
        </div>
        <Button className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Yangi o'quvchi
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md animate-fade-in">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="O'quvchi qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Table */}
      <div className="animate-slide-up rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Ism familiya</TableHead>
              <TableHead>Sinf</TableHead>
              <TableHead>O'rtacha baho</TableHead>
              <TableHead>So'nggi baholar</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const avg = getAverageGrade(student);
              return (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                      {student.class}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg font-bold ${getGradeColor(avg)}`}>
                      {avg.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {student.grades.slice(-5).map((g, i) => (
                        <span
                          key={i}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                            g.grade >= 4
                              ? "bg-success/10 text-success"
                              : g.grade >= 3
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {g.grade}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={gradeDialogOpen && selectedStudent?.id === student.id} onOpenChange={(open) => {
                        setGradeDialogOpen(open);
                        if (open) setSelectedStudent(student);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="mr-1 h-4 w-4" />
                            Baho
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Baho qo'yish - {student.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Fan</Label>
                              <Select
                                value={newGrade.subject}
                                onValueChange={(value) => setNewGrade({ ...newGrade, subject: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Fanni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Baho</Label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((grade) => (
                                  <button
                                    key={grade}
                                    onClick={() => setNewGrade({ ...newGrade, grade })}
                                    className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold transition-all ${
                                      newGrade.grade === grade
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                                  >
                                    {grade}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <Button onClick={handleAddGrade} className="w-full gradient-primary">
                              Baho qo'yish
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
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
