"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GhostIcon, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getSheetData } from "../app/api/events/get-event.action";
import {
  Availability,
  AVAILABILITY_COLORS,
  AvailabilityStatus,
  DayAvailability,
  Member,
} from "../types/event";
import { sheetTransformer } from "../app/services/sheet-to-json-transformer";
import { useAuth } from "../app/context/auth-context";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { updateUserAvailability } from "../app/api/events/update-user-availability.action";
const defaultAvailability: Availability = {
  monday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  tuesday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  wednesday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  thursday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  friday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  saturday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
  sunday: {
    morning: "unknown",
    afternoon: "unknown",
    evening: "unknown",
    night: "unknown",
  },
};

interface AvailabilityCalendarProps {
  eventReference: string;
}
export function AvailabilityCalendar({
  eventReference,
}: AvailabilityCalendarProps) {
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
      setOriginalAvailability(userAvailability); // Set original availability
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
  }, [availability]);

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
    setAvailability((prev) => newAvailability);
    setMembers((prev: any) => {
      if (prev.length === 0) return prev;
      const member = prev.find((member: any) => member.name === username);

      if (member) {
        return prev.map((m: any) => {
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
    // Call the server action to update the availability
    setLoading(true);
    await updateUserAvailability(
      eventReference,
      clientUsername as string,
      changes,
    );
    // Clear changes after saving
    setLoading(false);
    setChanges(undefined);
  };
  const handleCancelChanges = async () => {
    setAvailability(originalAvailability);
    setChanges(undefined);
  };
  return (
    <div className="pt-4">
      <div className="flex flex-col gap-2 m-auto w-fit p-4 align-middle items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Hello{" "}
          <span className="text-3xl text-blue-500">
            {" "}
            {clientUsername || "Guest"}
          </span>{" "}
          ! Choose your availability then click on a calendar cell
        </h3>
        <div className="flex flex-row gap-4 justify-around w-fit">
          {(["yes", "maybe", "no"] as AvailabilityStatus[]).map(
            (status: AvailabilityStatus) => (
              <Button
                className={cn(
                  chosenAvailability === status && "scale-150 mx-4",
                  chosenAvailability == undefined && "scale-100",
                  AVAILABILITY_COLORS[
                    status as keyof Record<AvailabilityStatus, string>
                  ],
                )}
                onClick={() => {
                  if (chosenAvailability == status) {
                    console.log("reset");
                    setChosenAvailability(undefined);
                  }
                  setChosenAvailability(status as AvailabilityStatus);
                }}
              >
                {status}
              </Button>
            ),
          )}
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full justify-end px-4">
        {changes && (
          <div className="flex flex-row gap-2">
            <Button onClick={handleSaveChanges}>
              {loading ?? <Loader2Icon className="h-4 w-4" />} Save changes
            </Button>
            <Button variant={"destructive"} onClick={handleCancelChanges}>
              Cancel changes
            </Button>
          </div>
        )}
      </div>
      <div className="bg-background text-foreground p-6 rounded-lg shadow-lg h-full">
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-1 font-medium">Time</div>
          <div className="col-span-7 grid grid-cols-7 gap-4">
            <div className="font-medium">Mon</div>
            <div className="font-medium">Tue</div>
            <div className="font-medium">Wed</div>
            <div className="font-medium">Thu</div>
            <div className="font-medium">Fri</div>
            <div className="font-medium">Sat</div>
            <div className="font-medium">Sun</div>
          </div>
          {(["morning", "afternoon", "evening", "night"] as const).map(
            (time) => (
              <React.Fragment key={time}>
                <div className="col-span-1 font-medium capitalize">{time}</div>
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div
                      key={day}
                      className="flex flex-row flex-wrap gap-2 min-h-28 border rounded-md p-2  hover:bg-stone-500 transition duration-500 hover:scale-110 transform"
                      onClick={() => {
                        if (!chosenAvailability) return;
                        handleCellClick(
                          day as keyof Availability,
                          time as keyof DayAvailability,
                          chosenAvailability as AvailabilityStatus,
                        );
                      }}
                    >
                      {/* Extract availability statuses at the specific day and time */}
                      {members &&
                        members.length > 0 &&
                        members.map((member, index) => {
                          const availabilityStatus =
                            member.availability?.[day as keyof Availability]?.[
                              time as keyof DayAvailability
                            ];

                          if (availabilityStatus === "unknown") {
                            return null;
                          }

                          return (
                            <div
                              key={index}
                              className={`px-2 py-1 rounded-md flex items-center gap-2  ${AVAILABILITY_COLORS[availabilityStatus]} h-12 w-fit`}
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>
                                  {(member.name as string).charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{member.name}</span>
                            </div>
                          );
                        })}

                      {!members ||
                        members.length === 0 ||
                        (members.every(
                          (member) =>
                            member.availability?.[day as keyof Availability]?.[
                              time as keyof DayAvailability
                            ] === "unknown",
                        ) && (
                          <div className="flex items-center justify-center w-full h-12 m-auto">
                            <GhostIcon className="w-6 h-6 text-gray-300" />
                            <span className="text-gray-300 text-sm ml-2">
                              No members available
                            </span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
