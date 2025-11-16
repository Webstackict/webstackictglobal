"use client";

import { createContext, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ userDetails, children }) {
  const [user, setUser] = useState({
    id: userDetails?.id || "",
    email: userDetails?.email || "",
    fullName: userDetails?.fullName || "",
    displayName: userDetails?.displayName || "",
    phone: userDetails?.phone || "",
    authProviders: userDetails?.authProviders || "",
  });

  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
