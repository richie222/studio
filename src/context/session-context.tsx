"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
  isSessionActive: boolean;
  setIsSessionActive: (isActive: boolean) => void;
  // Add other user-related state here if needed
  // userData: UserData | null;
  // setUserData: (data: UserData | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  // const [userData, setUserData] = useState<UserData | null>(null); // Example for other user data

  return (
    <SessionContext.Provider
      value={{
        isSessionActive,
        setIsSessionActive,
        // userData,
        // setUserData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};