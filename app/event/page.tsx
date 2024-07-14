"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "../components/create-event-dialog";
import useLoginDialog from "../../components/hooks/use-login";
import LoginDialog from "../components/login-dialog";
import { useAuth } from "../context/auth-context";
import { useLocalStorage } from "react-use";
import { useRouter } from "next/navigation";

const EventsPage: React.FC = () => {
  const router = useRouter();

  const [openCreateEvent, setOpenCreateEvent] = useState(false);
  const [dirty, setDirty] = useState(false);

  const { open, setOpen, inputValue, setInputValue, handleLogin } =
    useLoginDialog();
  const { username } = useAuth();
  const [myEvents, setMyEvents] = useLocalStorage<any[]>("myEvents", []);

  useEffect(() => {
    const updatedEvents = JSON.parse(localStorage.getItem("myEvents") || "[]");
    setMyEvents(updatedEvents);
  }, [dirty, setMyEvents]);

  return (
    <div className="container flex flex-col gap-2">
      <div className="flex flex-row justify-between align-middle items-center p-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          My events
        </h1>
        <Button
          size={"lg"}
          onClick={() => {
            setOpenCreateEvent(true);
            open ? setOpen(false) : !username ? setOpen(true) : setOpen(false);
          }}
        >
          Create Event
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {myEvents?.map((event: any, index) => (
          <Card
            className="hover:cursor-pointer"
            key={index}
            onClick={() => router.push(`/event/${event.title}`)}
          >
            <CardHeader>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {event.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p>{event.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateEventDialog
        open={openCreateEvent}
        setOpen={setOpenCreateEvent}
        setDirty={setDirty}
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
};

export default EventsPage;
