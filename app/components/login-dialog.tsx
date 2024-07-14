import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  setOpen,
  inputValue,
  setInputValue,
  handleSubmit,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter username</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your username to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Login
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginDialog;
