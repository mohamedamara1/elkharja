"use client";
import { useParams } from "next/navigation";
import { AvailabilityCalendar } from "../../../components/availability-calendar";
import LoginDialog from "../../../components/login-dialog";
import { useAuth } from "../../context/auth-context";
import useLoginDialog from "../../../components/hooks/use-login";
import { useEffect } from "react";

export default function EventPage() {
  const params = useParams();
  const { open, setOpen, inputValue, setInputValue, handleLogin } =
    useLoginDialog();
  const { username } = useAuth();
  useEffect(() => {
    if (!username) {
      setOpen(true);
    }
  }, [username]);
  return (
    <div className="h-screen">
      <AvailabilityCalendar
        eventReference={params?.event_reference as string}
      />
      <LoginDialog
        open={open}
        setOpen={setOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleLogin}
      />
    </div>
  );
}
