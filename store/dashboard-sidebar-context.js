"use client";

import { createContext, useState } from "react";

export const DashboardSidebarContext = createContext();

export default function DashboardSidebarContextProvider({ children }) {
  const [isDashboardSidebar, setIsDashboardSidebar] = useState(false);

  const value = {
    isDashboardSidebar,
    setIsDashboardSidebar,
  };

  return (
    <DashboardSidebarContext.Provider value={value}>
      {children}
    </DashboardSidebarContext.Provider>
  );
}
