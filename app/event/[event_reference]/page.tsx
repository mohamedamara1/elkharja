"use client";
import { useParams } from "next/navigation";
import { AvailabilityCalendar } from "../../components/availability-calendar";
import { useAuth } from "../../context/auth-context";
import useLoginDialog from "../../../components/hooks/use-login";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";

export default function EventPage() {
  const params = useParams();
  const [myEvents, setMyEvents] = useLocalStorage<any[]>("myEvents", []);

  useEffect(() => {
    if (params?.event_reference) {
      const eventExists = myEvents?.find(
        (event) => event.title === params?.event_reference,
      );
      !eventExists &&
        setMyEvents([...(myEvents as any), { title: params?.event_reference }]);
    }
  }, []);
  return (
    <div className="h-screen bg-gray-100/50">
      <AvailabilityCalendar
        eventReference={params?.event_reference as string}
      />
    </div>
  );
}
