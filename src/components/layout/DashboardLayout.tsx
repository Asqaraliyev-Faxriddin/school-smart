import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={onLogout} />
      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
