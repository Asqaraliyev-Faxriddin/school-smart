import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { students, teachers, subjects } from "@/data/mockData";

export function Statistics() {
  // Grade distribution data
  const gradeDistribution = [
    { grade: "5 (A'lo)", count: 0, color: "hsl(142, 76%, 36%)" },
    { grade: "4 (Yaxshi)", count: 0, color: "hsl(221, 83%, 53%)" },
    { grade: "3 (Qoniqarli)", count: 0, color: "hsl(38, 92%, 50%)" },
    { grade: "2 (Yomon)", count: 0, color: "hsl(0, 84%, 60%)" },
    { grade: "1", count: 0, color: "hsl(0, 84%, 40%)" },
  ];

  students.forEach((student) => {
    student.grades.forEach((g) => {
      gradeDistribution[5 - g.grade].count++;
    });
  });

  // Subject average grades
  const subjectAverages = subjects.slice(0, 5).map((subject) => {
    const grades = students.flatMap((s) =>
      s.grades.filter((g) => g.subject === subject).map((g) => g.grade)
    );
    const avg = grades.length > 0
      ? grades.reduce((a, b) => a + b, 0) / grades.length
      : 0;
    return { subject, average: parseFloat(avg.toFixed(2)) };
  });

  // Attendance trend
  const attendanceTrend = ["2024-01-10", "2024-01-11", "2024-01-12", "2024-01-13", "2024-01-14"].map(
    (date) => {
      const present = students.filter((s) =>
        s.attendance.find((a) => a.date === date)?.present
      ).length;
      return {
        date: date.slice(5),
        davomat: Math.round((present / students.length) * 100),
      };
    }
  );

  // Class distribution
  const classDistribution = [
    { name: "9-A", students: students.filter((s) => s.class === "9-A").length },
    { name: "9-B", students: students.filter((s) => s.class === "9-B").length },
    { name: "10-A", students: students.filter((s) => s.class === "10-A").length },
    { name: "10-B", students: students.filter((s) => s.class === "10-B").length },
  ];

  const COLORS = ["hsl(221, 83%, 53%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)", "hsl(280, 83%, 53%)"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Statistika</h1>
        <p className="mt-1 text-muted-foreground">
          Maktab statistikasi va tahlillari
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Baholar taqsimoti</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Averages */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "0.1s" }}>
          <h2 className="mb-4 text-lg font-semibold">Fanlar bo'yicha o'rtacha</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectAverages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="subject" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="average" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "0.2s" }}>
          <h2 className="mb-4 text-lg font-semibold">Davomat dinamikasi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value}%`, "Davomat"]}
              />
              <Line
                type="monotone"
                dataKey="davomat"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={3}
                dot={{ fill: "hsl(221, 83%, 53%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution */}
        <div className="animate-slide-up rounded-xl bg-card p-6 shadow-card" style={{ animationDelay: "0.3s" }}>
          <h2 className="mb-4 text-lg font-semibold">Sinflar bo'yicha o'quvchilar</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="students"
                  label={({ name, students }) => `${name}: ${students}`}
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-sm font-medium text-primary">Jami baholar</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {students.reduce((acc, s) => acc + s.grades.length, 0)}
          </p>
        </div>
        <div className="rounded-xl bg-success/10 p-4">
          <p className="text-sm font-medium text-success">A'lo baholar</p>
          <p className="mt-1 text-2xl font-bold text-success">
            {gradeDistribution[0].count}
          </p>
        </div>
        <div className="rounded-xl bg-warning/10 p-4">
          <p className="text-sm font-medium text-warning">O'rtacha davomat</p>
          <p className="mt-1 text-2xl font-bold text-warning">
            {Math.round(
              attendanceTrend.reduce((acc, t) => acc + t.davomat, 0) /
                attendanceTrend.length
            )}%
          </p>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm font-medium text-muted-foreground">O'qituvchilar</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{teachers.length}</p>
        </div>
      </div>
    </div>
  );
}
