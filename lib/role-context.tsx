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

const defaultRoleContext: RoleContextType = {
  role: "core_team",
  setRole: () => {},
  isCore: true,
  isVolunteer: false,
  isDonor: false,
  canEdit: true,
};

const RoleContext = createContext<RoleContextType>(defaultRoleContext);

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
  return context;
}
