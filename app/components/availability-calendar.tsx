"use client";
import { Cross, CrossIcon, GhostIcon, Loader2Icon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getSheetData } from "../api/events/get-event.action";
import {
  Availability,
  AvailabilityStatus,
  DayAvailability,
  Member,
} from "../../types/event";
import { sheetTransformer } from "../services/sheet-to-json-transformer";
import { useAuth } from "../context/auth-context";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { updateUserAvailability } from "../api/events/update-user-availability.action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAvailabilityCalendar from "./use-availability-calendar";
import MemberAvailability from "./member-availability";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  yes: "bg-green-500 text-green-50",
  no: "bg-red-500 text-red-50",
  maybe: "bg-yellow-500 text-yellow-50",
  unknown: "bg-gray-500 text-gray-50",
};

interface AvailabilityCalendarProps {
  eventReference: string;
}
export function AvailabilityCalendar({
  eventReference,
}: AvailabilityCalendarProps) {
  const {
    clientUsername,
    chosenAvailability,
    setChosenAvailability,
    availability,
    members,
    changes,
    handleCellClick,
    handleSaveChanges,
    handleCancelChanges,
    loading,
  } = useAvailabilityCalendar(eventReference);
  const handleDropMemberAvailability = (item: any) => {
    console.log("dropped item", item);
  };
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "item",
    drop: (item) => handleDropMemberAvailability(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  useEffect(() => {
    console.log("isOver", isOver);
  }, [isOver]);
  return (
    <div className="pt-4 flex flex-col gap-2">
      <div ref={drop as any} className="w-40 h-40 bg-black"></div>
      <div className="flex flex-col gap-8 m-auto w-fit p-4 align-middle items-center">
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
                key={status}
                className={cn(
                  chosenAvailability === status && "scale-150 mx-4",
                  chosenAvailability == undefined && "scale-100",
                  AVAILABILITY_COLORS[
                    status as keyof Record<AvailabilityStatus, string>
                  ],
                )}
                onClick={() => {
                  setChosenAvailability((prev) => {
                    if (prev === status) {
                      return undefined;
                    }
                    return status;
                  });
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
      <div className="bg-slate-100/20 text-foreground p-6 rounded-lg shadow-lg h-full">
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
                      ref={drop as any}
                      key={day}
                      className="flex flex-row flex-wrap gap-2 min-h-28 border rounded-md p-2  "
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
                            <MemberAvailability
                              key={index}
                              member={member}
                              clientUsername={clientUsername}
                              day={day}
                              time={time}
                              availabilityStatus={availabilityStatus}
                              AVAILABILITY_COLORS={AVAILABILITY_COLORS}
                              handleCellClick={handleCellClick}
                              index={index}
                            />
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
