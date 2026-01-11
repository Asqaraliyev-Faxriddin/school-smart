import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Teachers } from "./pages/Teachers";
import { Attendance } from "./pages/Attendance";
import { Statistics } from "./pages/Statistics";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Dashboard />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/students"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Students />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/teachers"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Teachers />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/attendance"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Attendance />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/statistics"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Statistics />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
