"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

interface AuthContextType {
  username: string | null;
  setUsername: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setStoredUsername] = useLocalStorage<string | null>(
    "username",
    null,
  );
  const [usernameState, setUsernameState] = useState<string | null>(
    username as any,
  );

  useEffect(() => {
    setUsernameState(username as any);
  }, [username]);

  const setUsername = (username: string) => {
    setStoredUsername(username);
  };

  const logout = () => {
    setStoredUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{ username: usernameState, setUsername, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
