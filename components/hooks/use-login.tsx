import { useState, useEffect } from "react";
import { useAuth } from "../../app/context/auth-context";

const useLoginDialog = () => {
  const { username, setUsername } = useAuth();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleLogin = () => {
    setUsername(inputValue);
    setOpen(false);
  };

  return {
    open,
    setOpen,
    inputValue,
    setInputValue,
    handleLogin,
  };
};

export default useLoginDialog;
