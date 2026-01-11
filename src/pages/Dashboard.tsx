import { GraduationCap, Users, TrendingUp, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { students, teachers } from "@/data/mockData";

export function Dashboard() {
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  // Calculate average attendance
  const studentAttendance = students.reduce((acc, student) => {
    const presentDays = student.attendance.filter(a => a.present).length;
    return acc + (presentDays / student.attendance.length) * 100;
  }, 0) / students.length;

  const teacherAttendance = teachers.reduce((acc, teacher) => {
    const presentDays = teacher.attendance.filter(a => a.present).length;
    return acc + (presentDays / teacher.attendance.length) * 100;
  }, 0) / teachers.length;

  // Calculate average grade
  const averageGrade = students.reduce((acc, student) => {
    const avg = student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length;
    return acc + avg;
  }, 0) / students.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Bosh sahifa</h1>
        <p className="mt-2 text-muted-foreground">
          Xush kelibsiz! Maktab statistikasi quyida ko'rsatilgan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jami o'quvchilar"
          value={totalStudents}
          icon={<GraduationCap className="h-6 w-6" />}
          variant="primary"
        />
        <StatCard
          title="O'qituvchilar"
          value={totalTeachers}
          icon={<Users className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="O'rtacha baho"
          value={averageGrade.toFixed(1)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Davomat"
          value={`${studentAttendance.toFixed(0)}%`}
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Students */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">
            Eng yaxshi o'quvchilar
          </h2>
          <div className="space-y-4">
            {students
              .map(s => ({
                ...s,
                avg: s.grades.reduce((sum, g) => sum + g.grade, 0) / s.grades.length
              }))
              .sort((a, b) => b.avg - a.avg)
              .slice(0, 3)
              .map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      index === 0 ? 'bg-warning text-warning-foreground' :
                      index === 1 ? 'bg-muted-foreground/20 text-muted-foreground' :
                      'bg-warning/30 text-warning'
                    } font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{student.avg.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">o'rtacha</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Teacher Attendance */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "0.1s" }}>
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">
            O'qituvchilar davomati
          </h2>
          <div className="space-y-4">
            {teachers.map((teacher) => {
              const presentDays = teacher.attendance.filter(a => a.present).length;
              const totalDays = teacher.attendance.length;
              const percentage = (presentDays / totalDays) * 100;
              
              return (
                <div key={teacher.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
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
