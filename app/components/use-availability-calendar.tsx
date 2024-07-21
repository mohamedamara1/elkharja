import { useEffect, useState } from "react";
import { getSheetData } from "../api/events/get-event.action";
import {
  Availability,
  AvailabilityStatus,
  DayAvailability,
  Member,
} from "../../types/event";
import { sheetTransformer } from "../services/sheet-to-json-transformer";
import { useAuth } from "../context/auth-context";
import { updateUserAvailability } from "../api/events/update-user-availability.action";
import { set } from "date-fns";

const useAvailabilityCalendar = (eventReference: string) => {
  const { username } = useAuth();
  const [clientUsername, setClientUsername] = useState<string | null>(null);
  const [chosenAvailability, setChosenAvailability] = useState<
    AvailabilityStatus | undefined
  >(undefined);
  const [availability, setAvailability] = useState<Availability | undefined>(
    undefined,
  );
  const [originalAvailability, setOriginalAvailability] = useState<
    Availability | undefined
  >(undefined);
  const [changes, setChanges] = useState<Availability | undefined>(undefined);
  const [members, setMembers] = useState<Member[]>([]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventReference) return;

    const fetchData = async () => {
      const data = await getSheetData(eventReference);
      const transformedData = sheetTransformer(data.data as any);
      setMembers(transformedData);
      const userAvailability = transformedData.find(
        (member) => member.name === username,
      )?.availability;
      setAvailability(userAvailability);
      setOriginalAvailability(userAvailability);
      dirty && setDirty(false);
    };

    fetchData();
  }, [eventReference, username, dirty]);

  useEffect(() => {
    if (availability) {
      setMembers((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((member) => {
          if (member.name === username) {
            return { ...member, availability };
          }
          return member;
        });
      });
    }
  }, [availability, username]);

  useEffect(() => {
    if (username) {
      setClientUsername(username);
    }
  }, [username]);

  const handleCellClick = (
    day: keyof Availability,
    time: keyof DayAvailability,
    value: AvailabilityStatus,
  ) => {
    const newAvailability = {
      ...(availability as any),
      [day]: {
        ...availability?.[day],
        [time]: value,
      },
    };
    setAvailability(newAvailability);
    setMembers((prev: any) => {
      if (prev.length === 0) return prev;
      const member = prev.find((member: any) => member.name === username);

      if (member) {
        return prev.map((m: Member) => {
          if (m.name === username) {
            return { ...m, availability: newAvailability };
          }
          return m;
        });
      } else {
        return [...prev, { name: username, availability: newAvailability }];
      }
    });
    setChanges((prev) => ({
      ...(prev as any),
      [day]: {
        ...prev?.[day],
        [time]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    await updateUserAvailability(
      eventReference,
      clientUsername as string,
      changes,
    );
    setLoading(false);
    setChanges(undefined);
  };

  const handleCancelChanges = () => {
    setAvailability(originalAvailability);
    setChanges(undefined);
  };

  const swapAvailabilityStatus = (
    oldDay: any,
    oldTime: any,
    newDay: any,
    newTime: any,
    status: any,
  ) => {
    setAvailability((oldAvailability) => {
      const newAvailability: any = { ...oldAvailability };

      // Clear the old cell
      newAvailability[oldDay] = {
        ...newAvailability[oldDay],
        [oldTime]: AvailabilityStatus.unknown, // Assuming Unavailable is the default empty state
      };

      // Set the new cell
      newAvailability[newDay] = {
        ...newAvailability[newDay],
        [newTime]: status,
      };
      setChanges(newAvailability);

      if (oldAvailability) {
        return newAvailability;
      }
      return oldAvailability;
    });
  };

  return {
    clientUsername,
    chosenAvailability,
    setChosenAvailability,
    availability,
    members,
    changes,
    handleCellClick,
    handleSaveChanges,
    handleCancelChanges,
    swapAvailabilityStatus,
    loading,
  };
};

export default useAvailabilityCalendar;
