import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/auth-context";
import { createEventSheet } from "../api/events/add-event.action";
import { useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "react-use";

export function CreateEventDialog({ open, setOpen, setDirty }: any) {
  const [eventName, setEventName] = useState("");
  const { username } = useAuth();
  const [myEvents, setMyEvents] = useLocalStorage<any[]>("myEvents", []);

  const handleSubmit = () => {
    createEventSheet(username as string, eventName).then((response) => {
      setOpen(false);
      setDirty(true);
      setMyEvents([...(myEvents as any), { title: eventName }]);
      toast.success("Event created successfully");
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
          <DialogDescription>
            Please enter the event details to continue
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
