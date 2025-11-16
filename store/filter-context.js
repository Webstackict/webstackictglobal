"use client";

import { createContext, useState } from "react";

export const FilterContext = createContext();

export default function FilterContextProvider({ children }) {
  const [filterValue, setFilterValue] = useState({
    eventName: "",
    categoryName: "",
  });

  const value = {
    filterValue,
    setFilterValue,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}
