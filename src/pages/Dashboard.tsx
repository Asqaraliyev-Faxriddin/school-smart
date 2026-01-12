import { useSchool } from "@/contexts/SchoolContext";
import { StatCard } from "@/components/ui/stat-card";
import {
  Users,
  GraduationCap,
  Clock,
  AlertTriangle,
  Banknote,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export function Dashboard() {
  const { data, isLoading } = useSchool();

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  // Staff statistics
  const totalStaff = data.staff.length;
  const staffPresentToday = data.staff.filter((s) => {
    const todayAttendance = s.attendance.find((a) => a.date === today);
    return todayAttendance?.status === "keldi" || todayAttendance?.status === "kech_qoldi";
  }).length;
  const staffLateToday = data.staff.filter((s) => {
    const todayAttendance = s.attendance.find((a) => a.date === today);
    return todayAttendance?.status === "kech_qoldi";
  }).length;

  // Student statistics
  const totalStudents = data.students.length;
  const studentsPresentToday = data.students.filter((s) => {
    const todayAttendance = s.attendance.find((a) => a.date === today);
    return todayAttendance?.present === true;
  }).length;

  // Average salary
  const averageSalary =
    data.staff.filter((s) => s.salaryActive).reduce((sum, s) => sum + s.salary, 0) /
    Math.max(data.staff.filter((s) => s.salaryActive).length, 1);

  // Average grade
  const allGrades = data.students.flatMap((s) => s.grades.map((g) => g.grade));
  const averageGrade = allGrades.length > 0 
    ? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length 
    : 0;

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Boshqaruv paneli</h1>
        <p className="mt-2 text-muted-foreground">
          Xush kelibsiz! Maktab statistikasi quyida ko'rsatilgan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jami xodimlar"
          value={totalStaff}
          icon={<Users className="h-6 w-6" />}
          variant="primary"
        />
        <StatCard
          title="Bugun kelgan xodimlar"
          value={staffPresentToday}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="Kech qolgan xodimlar"
          value={staffLateToday}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <StatCard
          title="Jami o'quvchilar"
          value={totalStudents}
          icon={<GraduationCap className="h-6 w-6" />}
          variant="primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Bugun kelgan o'quvchilar"
          value={studentsPresentToday}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="O'rtacha oylik"
          value={formatSalary(averageSalary)}
          icon={<Banknote className="h-6 w-6" />}
        />
        <StatCard
          title="O'rtacha baho"
          value={averageGrade.toFixed(1)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Announcements */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">
            So'nggi e'lonlar
          </h2>
          <div className="space-y-4">
            {data.announcements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg bg-muted/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-card-foreground">
                    {announcement.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(announcement.date).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {announcement.content}
                </p>
              </div>
            ))}
            {data.announcements.length === 0 && (
              <p className="text-muted-foreground">Hozircha e'lonlar yo'q</p>
            )}
          </div>
        </div>

        {/* Staff Attendance Today */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-sm" style={{ animationDelay: "0.1s" }}>
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">
            Bugungi xodimlar davomati
          </h2>
          <div className="space-y-3">
            {data.staff.map((staff) => {
              const todayAttendance = staff.attendance.find((a) => a.date === today);
              const status = todayAttendance?.status || "kelmadi";
              const arrivalTime = todayAttendance?.arrivalTime;

              return (
                <div
                  key={staff.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        status === "keldi"
                          ? "bg-success"
                          : status === "kech_qoldi"
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {staff.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staff.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {arrivalTime ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {arrivalTime}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Kelmagan
                      </span>
                    )}
                    {status === "kech_qoldi" && todayAttendance?.lateMinutes && (
                      <p className="text-xs text-warning">
                        +{todayAttendance.lateMinutes} daqiqa
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
