import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleLogin: (inputUsername: string, inputPassword: string) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  setOpen,
  handleLogin,
}) => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter credentials</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your username and password to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && (
            <div className="text-red-500" role="alert">
              {error}
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <Button
            type="button"
            onClick={() => handleLogin(inputUsername, inputPassword)}
          >
            Login
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginDialog;
