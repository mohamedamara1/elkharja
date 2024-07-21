import React, { useEffect } from "react";
import { GhostIcon } from "lucide-react";
import {
  Member,
  AvailabilityStatus,
  Availability,
  DayAvailability,
} from "../../types/event";
import MemberAvailability from "./member-availability";
import { useDrop } from "react-dnd";
import useAvailabilityCalendar from "./use-availability-calendar";
import { useParams } from "next/navigation";

const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  yes: "bg-green-500 text-green-50",
  no: "bg-red-500 text-red-50",
  maybe: "bg-yellow-500 text-yellow-50",
  unknown: "bg-gray-500 text-gray-50",
};

interface CalendarCellProps {
  availability: Availability;
  day: keyof Availability;
  time: keyof DayAvailability;
  chosenAvailability: AvailabilityStatus | undefined;
  members: Member[];
  clientUsername: string | null;
  handleCellClick: (
    day: keyof Availability,
    time: keyof DayAvailability,
    availabilityStatus: AvailabilityStatus,
  ) => void;
  swapAvailabilityStatus: (
    oldDay: keyof Availability,
    oldTime: keyof DayAvailability,
    newDay: keyof Availability,
    newTime: keyof DayAvailability,
    status: AvailabilityStatus,
  ) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  availability,
  chosenAvailability,
  members,
  clientUsername,
  day,
  time,
  handleCellClick,
  swapAvailabilityStatus,
}) => {
  const handleDropMemberAvailability = (item: {
    status: AvailabilityStatus;
    member: Member;
    oldCell: { day: keyof Availability; time: keyof DayAvailability };
  }) => {
    const { status, member, oldCell } = item;
    swapAvailabilityStatus(oldCell.day, oldCell.time, day, time, status);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "item",
    drop: (item: any) => handleDropMemberAvailability(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className="flex flex-row flex-wrap gap-2 min-h-28 border rounded-md p-2"
      onClick={() => {
        if (!chosenAvailability) return;
        handleCellClick(day, time, chosenAvailability);
      }}
    >
      {/* Extract availability statuses at the specific day and time */}
      {members &&
        members.length > 0 &&
        members.map((member, index) => {
          const availabilityStatus = member.availability?.[day]?.[time];

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
          (member) => member.availability?.[day]?.[time] === "unknown",
        ) && (
          <div className="flex items-center justify-center w-full h-12 m-auto">
            <GhostIcon className="w-6 h-6 text-gray-300" />
            <span className="text-gray-300 text-sm ml-2">
              No members available
            </span>
          </div>
        ))}
    </div>
  );
};

export default CalendarCell;
