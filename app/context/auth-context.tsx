// auth-context.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { login } from "../api/users/login.action";
import { useParams } from "next/navigation";

interface AuthContextType {
  username: string | null;
  setUsername: (username: string) => void;
  password: string | null;
  setPassword: (password: string) => void;
  performLogin: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const [storedUsername, setStoredUsername] = useLocalStorage<string | null>(
    "username",
    null,
  );
  const [storedPassword, setStoredPassword] = useLocalStorage<string | null>(
    "password",
    null,
  );

  useEffect(() => {
    setUsernameState(storedUsername as string);
  }, []);

  const [usernameState, setUsernameState] = useState<string | null>(
    storedUsername as string,
  );
  const [passwordState, setPasswordState] = useState<string | null>(
    storedPassword as string,
  );

  const setUsername = (username: string) => {
    setStoredUsername(username);
    setUsernameState(username);
  };
  const setPassword = (password: string) => {
    setStoredPassword(password);
    setPasswordState(password);
  };

  const performLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const response = await login(
      username,
      password,
      params?.event_reference as string,
    );
    if (response.authenticated == true) {
      setUsername(username);
      setPassword(password);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        username: usernameState,
        setUsername,
        password: passwordState,
        setPassword,
        performLogin,
      }}
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
