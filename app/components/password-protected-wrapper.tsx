// components/PasswordProtectedWrapper.js
"use client";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { AuthProvider } from "../context/auth-context";
import { WebsitePasswordDialog } from "./website-password-dialog";

export const PasswordProtectedWrapper = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [storedPassword, setStoredPassword] = useLocalStorage("app_password");

  const handlePasswordSubmit = (enteredPassword: any) => {
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD;

    if (enteredPassword === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      setStoredPassword(enteredPassword);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  return (
    <>
      {showPasswordPrompt && (
        <WebsitePasswordDialog onPasswordSubmit={handlePasswordSubmit} />
      )}
      {isAuthenticated && <AuthProvider>{children}</AuthProvider>}
    </>
  );
};
