import React from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Availability, DayAvailability } from "../../types/event";
import { cn } from "../../lib/utils";
import { useDrag } from "react-dnd";

const MemberAvailability = ({
  member,
  clientUsername,
  day,
  time,
  availabilityStatus,
  AVAILABILITY_COLORS,
  handleCellClick,
  index,
}: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={drag as any}
      key={index}
      className={cn(
        member.name === clientUsername &&
          "static hover:scale-110 transition duration-500 transform",
        `flex flex-col items-center w-20 h-12 p-2 min-w-20 rounded-md gap-2 ${AVAILABILITY_COLORS[availabilityStatus]}`,
      )}
    >
      <div className={cn("flex flex-row gap-2")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar
                className="w-6 h-6"
                onClick={() => {
                  if (member.name === clientUsername) {
                    handleCellClick(
                      day as keyof Availability,
                      time as keyof DayAvailability,
                      "unknown",
                    );
                  }
                }}
              >
                <AvatarImage
                  src="/placeholder-user.jpg"
                  className="bg-slate-500"
                />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {member.name === clientUsername && (
              <TooltipContent>Click to delete</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm">{member.name}</span>
      </div>
    </div>
  );
};

export default MemberAvailability;
