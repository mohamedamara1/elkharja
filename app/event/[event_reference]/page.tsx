"use client";
import { useParams } from "next/navigation";
import { AvailabilityCalendar } from "../../components/availability-calendar";
import { useAuth } from "../../context/auth-context";
import useLoginDialog from "../../../components/hooks/use-login";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import MobileCalendar from "../../components/mobile-calendar";
import { useScreenDetector } from "../../components/useScreenDetector";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function EventPage() {
  const params = useParams();
  const [myEvents, setMyEvents] = useLocalStorage<any[]>("myEvents", []);
  const { isMobile, isTablet, isDesktop } = useScreenDetector();

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
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-100/50">
        {isMobile ? (
          <MobileCalendar eventReference={params?.event_reference as string} />
        ) : (
          <AvailabilityCalendar
            eventReference={params?.event_reference as string}
          />
        )}
      </div>
    </DndProvider>
  );
}
