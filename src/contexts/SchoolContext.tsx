import { createContext, useContext, ReactNode } from "react";
import { useSchoolData } from "@/hooks/useSchoolData";

type SchoolContextType = ReturnType<typeof useSchoolData>;

const SchoolContext = createContext<SchoolContextType | null>(null);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const schoolData = useSchoolData();

  return (
    <SchoolContext.Provider value={schoolData}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}
