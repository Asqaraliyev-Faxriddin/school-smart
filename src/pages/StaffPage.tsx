import { useState } from "react";
import { useSchool } from "@/contexts/SchoolContext";
import { Staff, StaffPosition } from "@/types/school";
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
  Pause,
  Play,
  Search,
  Phone,
  Banknote,
} from "lucide-react";

const positions: { value: StaffPosition; label: string }[] = [
  { value: "zavuch", label: "Zavuch" },
  { value: "o'qituvchi", label: "O'qituvchi" },
  { value: "psixolog", label: "Psixolog" },
  { value: "hamshira", label: "Hamshira" },
  { value: "qo'riqchi", label: "Qo'riqchi" },
  { value: "texnik xodim", label: "Texnik xodim" },
];

export function StaffPage() {
  const { data, isLoading, addStaff, updateStaff, removeStaff } = useSchool();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    position: "o'qituvchi" as StaffPosition,
    phone: "",
    salary: "",
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  const filteredStaff = data.staff.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount);
  };

  const handleAdd = () => {
    if (!formData.fullName || !formData.phone || !formData.salary) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    const newStaff: Staff = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      position: formData.position,
      phone: formData.phone,
      salary: parseInt(formData.salary),
      salaryActive: true,
      attendance: [],
    };

    addStaff(newStaff);
    setIsAddOpen(false);
    setFormData({ fullName: "", position: "o'qituvchi", phone: "", salary: "" });
    toast({ title: "Muvaffaqiyat", description: "Xodim qo'shildi" });
  };

  const handleEdit = () => {
    if (!editingStaff) return;

    updateStaff(editingStaff.id, {
      fullName: formData.fullName,
      position: formData.position,
      phone: formData.phone,
      salary: parseInt(formData.salary),
    });

    setIsEditOpen(false);
    setEditingStaff(null);
    toast({ title: "Muvaffaqiyat", description: "Xodim ma'lumotlari yangilandi" });
  };

  const openEditDialog = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName,
      position: staff.position,
      phone: staff.phone,
      salary: staff.salary.toString(),
    });
    setIsEditOpen(true);
  };

  const toggleSalary = (staff: Staff) => {
    updateStaff(staff.id, { salaryActive: !staff.salaryActive });
    toast({
      title: staff.salaryActive ? "Oylik to'xtatildi" : "Oylik faollashtirildi",
      description: `${staff.fullName} uchun oylik ${staff.salaryActive ? "to'xtatildi" : "faollashtirildi"}`,
    });
  };

  const handleRemove = (staff: Staff) => {
    if (confirm(`${staff.fullName}ni ro'yxatdan o'chirmoqchimisiz?`)) {
      removeStaff(staff.id);
      toast({ title: "Xodim o'chirildi", variant: "destructive" });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Xodimlar</h1>
          <p className="mt-1 text-muted-foreground">
            Jami {data.staff.length} ta xodim
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Xodim qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi xodim qo'shish</DialogTitle>
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
                <Label>Lavozimi</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value: StaffPosition) =>
                    setFormData({ ...formData, position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Telefon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <Label>Oylik (so'm)</Label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="3500000"
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Qo'shish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Xodim izlash..."
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>F.I.SH</TableHead>
              <TableHead>Lavozimi</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Oylik</TableHead>
              <TableHead>Bugungi holati</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => {
              const todayAttendance = staff.attendance.find((a) => a.date === today);
              const status = todayAttendance?.status;

              return (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.fullName}</TableCell>
                  <TableCell className="capitalize">{staff.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {staff.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      <span className={!staff.salaryActive ? "line-through text-muted-foreground" : ""}>
                        {formatSalary(staff.salary)} so'm
                      </span>
                      {!staff.salaryActive && (
                        <span className="text-xs text-destructive">(to'xtatilgan)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {status === "keldi" && (
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        Keldi ({todayAttendance?.arrivalTime})
                      </span>
                    )}
                    {status === "kech_qoldi" && (
                      <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                        Kech qoldi +{todayAttendance?.lateMinutes}min
                      </span>
                    )}
                    {status === "kelmadi" && (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                        Kelmadi
                      </span>
                    )}
                    {!status && (
                      <span className="text-xs text-muted-foreground">Belgilanmagan</span>
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
                        <DropdownMenuItem onClick={() => openEditDialog(staff)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleSalary(staff)}>
                          {staff.salaryActive ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Oylikni to'xtatish
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Oylikni faollashtirish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(staff)}
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
            <DialogTitle>Xodimni tahrirlash</DialogTitle>
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
              <Label>Lavozimi</Label>
              <Select
                value={formData.position}
                onValueChange={(value: StaffPosition) =>
                  setFormData({ ...formData, position: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Telefon</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Oylik (so'm)</Label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Saqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
