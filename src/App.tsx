import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SchoolProvider } from "@/contexts/SchoolContext";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { StaffPage } from "./pages/StaffPage";
import { StudentsPage } from "./pages/StudentsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { SalaryReportPage } from "./pages/SalaryReportPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => 
    isAuthenticated ? <DashboardLayout onLogout={handleLogout}>{children}</DashboardLayout> : <Navigate to="/login" replace />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SchoolProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
              <Route path="/salary" element={<ProtectedRoute><SalaryReportPage /></ProtectedRoute>} />
              <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SchoolProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
