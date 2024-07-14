// hooks/useLoginDialog.tsx

import React, { useState } from "react";
import LoginDialog from "../../app/components/login-dialog";
import { useAuth } from "../../app/context/auth-context";
import { toast } from "sonner";

const useLoginDialog = () => {
  const { performLogin, username, password } = useAuth();

  const [open, setOpen] = useState((!username || !password) as boolean);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (inputUsername: string, inputPassword: string) => {
    if (!inputUsername || !inputPassword) {
      toast.error("Please enter a username and password");
      return;
    }
    const authenticated = await performLogin(inputUsername, inputPassword);
    if (authenticated) {
      setOpen(false);
      toast.success("Login successful");
    } else {
      toast.error("Login failed");
    }
  };

  const openDialog = () => {
    setOpen(true);
    setError(null);
  };

  const closeDialog = () => {
    setOpen(false);
    setError(null);
  };

  const LoginDialogComponent = () => (
    <LoginDialog open={open} setOpen={setOpen} handleLogin={handleLogin} />
  );

  return {
    LoginDialogComponent,
    openDialog,
    closeDialog,
  };
};

export default useLoginDialog;
