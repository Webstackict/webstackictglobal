"use client";

import { createContext, useState } from "react";

export const MainSidebarContext = createContext();

export default function MainSidebarContextProvider({ children }) {
  const [isMainSidebar, setIsMainSidebar] = useState(false);

  const value = {
    isMainSidebar,
    setIsMainSidebar,
  };

  return (
    <MainSidebarContext.Provider value={value}>
      {children}
    </MainSidebarContext.Provider>
  );
}
