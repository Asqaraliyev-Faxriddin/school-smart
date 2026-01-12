import { useSchool } from "@/contexts/SchoolContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Banknote, AlertTriangle } from "lucide-react";

export function SalaryReportPage() {
  const { data, isLoading } = useSchool();

  if (isLoading || !data) return <div className="flex h-64 items-center justify-center"><div className="text-muted-foreground">Yuklanmoqda...</div></div>;

  const penaltyPerMinute = data.settings.latenessPenaltyPerMinute;

  const staffReport = data.staff.map((staff) => {
    const lateDays = staff.attendance.filter((a) => a.status === "kech_qoldi").length;
    const totalLateMinutes = staff.attendance.reduce((sum, a) => sum + a.lateMinutes, 0);
    const penalty = totalLateMinutes * penaltyPerMinute;
    const finalSalary = staff.salaryActive ? Math.max(0, staff.salary - penalty) : 0;
    return { ...staff, lateDays, totalLateMinutes, penalty, finalSalary };
  });

  const totalSalaryExpense = staffReport.reduce((sum, s) => sum + s.finalSalary, 0);
  const formatMoney = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Oylik hisoboti</h1><p className="mt-1 text-muted-foreground">Jarima: {formatMoney(penaltyPerMinute)} / daqiqa</p></div>
      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Xodim</TableHead>
              <TableHead>Lavozimi</TableHead>
              <TableHead>Oylik</TableHead>
              <TableHead>Kech qolgan kunlar</TableHead>
              <TableHead>Jarima</TableHead>
              <TableHead>Yakuniy oylik</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffReport.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.fullName}</TableCell>
                <TableCell className="capitalize">{s.position}</TableCell>
                <TableCell>{s.salaryActive ? formatMoney(s.salary) : <span className="text-muted-foreground line-through">{formatMoney(s.salary)}</span>}</TableCell>
                <TableCell>{s.lateDays > 0 ? <span className="flex items-center gap-1 text-warning"><AlertTriangle className="h-4 w-4" />{s.lateDays} kun ({s.totalLateMinutes} daqiqa)</span> : "0"}</TableCell>
                <TableCell className="text-destructive">{s.penalty > 0 ? `-${formatMoney(s.penalty)}` : "—"}</TableCell>
                <TableCell className="font-bold text-primary">{formatMoney(s.finalSalary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-3"><Banknote className="h-8 w-8" /><span className="text-lg font-medium">Umumiy oylik xarajat:</span></div>
        <span className="text-3xl font-bold">{formatMoney(totalSalaryExpense)}</span>
      </div>
    </div>
  );
}
