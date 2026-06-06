"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, DEFAULT_ROLE } from "./types";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isCore: boolean;
  isVolunteer: boolean;
  isDonor: boolean;
  canEdit: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = "the-hub-role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(DEFAULT_ROLE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Role | null;
    if (saved && ["core_team", "volunteer", "donor"].includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY, newRole);
  };

  const isCore = role === "core_team";
  const isVolunteer = role === "volunteer";
  const isDonor = role === "donor";
  const canEdit = isCore;

  return (
    <RoleContext.Provider value={{ role, setRole, isCore, isVolunteer, isDonor, canEdit }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
