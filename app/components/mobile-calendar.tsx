import React, { useEffect, useState } from "react";
import useAvailabilityCalendar from "./use-availability-calendar";
import { Button } from "../../components/ui/button";
import { GhostIcon, Loader2Icon } from "lucide-react";
import {
  Availability,
  AvailabilityStatus,
  DayAvailability,
} from "../../types/event";
import { cn } from "../../lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useEmblaCarousel from "embla-carousel-react";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  yes: "bg-green-500 text-green-50",
  no: "bg-red-500 text-red-50",
  maybe: "bg-yellow-500 text-yellow-50",
  unknown: "bg-gray-500 text-gray-50",
};
interface MobileCalendarProps {
  eventReference: string;
}

const MobileCalendar: React.FC<MobileCalendarProps> = ({ eventReference }) => {
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

  const [api, setApi] = useState<CarouselApi>();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = daysOfWeek[selectedDayIndex];
  const handleDayClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setSelectedDayIndex(index);
    }
  };

  useEffect(() => {
    if (api) {
      const updateSelectedDayIndex: any = () =>
        setSelectedDayIndex(api.selectedScrollSnap());
      api.on("select", updateSelectedDayIndex);

      // Initial set
      setSelectedDayIndex(api.selectedScrollSnap());

      return () => {
        api.off("select", updateSelectedDayIndex);
      };
    }
  }, [api]);
  return (
    <div className="pt-4 flex flex-col gap-2">
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
      <div className="bg-slate-100/20 text-foreground p-2 rounded-lg shadow-lg h-full">
        <Carousel setApi={setApi} className="w-full">
          <div className="flex bg-white shadow-md justify-start md:justify-center rounded-lg overflow-x-scroll mx-auto py-2 md:mx-12 mb-10 w-full">
            {daysOfWeek.map((day, index) => (
              <DayButton
                key={index}
                day={day}
                isToday={day === selectedDay}
                onClick={() => handleDayClick(index)}
              />
            ))}
          </div>
          <CarouselContent>
            {daysOfWeek.map((day, index) => (
              <CarouselItem key={day} id={`carousel-item-${index}`}>
                <div className="p-1">
                  <Card>
                    <CardContent className="">
                      <div className="mt-4 flex flex-col gap-4">
                        {["morning", "afternoon", "evening", "night"].map(
                          (time) => (
                            <div key={time} className="grid grid-cols-5 ">
                              <div className="font-medium capitalize col-span-1 -rotate-90 h-fit m-auto">
                                {time}
                              </div>
                              <div
                                className="flex flex-row gap-2 flex-wrap min-h-28 border rounded-md p-2 col-span-4"
                                onClick={() => {
                                  if (!chosenAvailability) return;
                                  handleCellClick(
                                    day as any,
                                    time as keyof DayAvailability,
                                    chosenAvailability as AvailabilityStatus,
                                  );
                                }}
                              >
                                {members &&
                                  members.length > 0 &&
                                  members.map((member, index) => {
                                    const availabilityStatus =
                                      member.availability?.[
                                        day as keyof Availability
                                      ]?.[time as keyof DayAvailability];
                                    console.log(
                                      "availabilityStatus",
                                      availabilityStatus,
                                    );
                                    if (availabilityStatus === "unknown") {
                                      return null;
                                    }

                                    return (
                                      <div
                                        key={index}
                                        className={cn(
                                          member.name === clientUsername &&
                                            "static hover:scale-110 transition duration-500 transform",
                                          `flex flex-col items-center w-20 h-12 p-2 min-w-20 rounded-md gap-2 ${AVAILABILITY_COLORS[availabilityStatus]}`,
                                        )}
                                      >
                                        <div className="flex flex-row gap-2">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger>
                                                <Avatar
                                                  className="w-6 h-6"
                                                  onClick={() => {
                                                    if (
                                                      member.name ===
                                                      clientUsername
                                                    ) {
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
                                                  <AvatarFallback>
                                                    {member.name.charAt(0)}
                                                  </AvatarFallback>
                                                </Avatar>
                                              </TooltipTrigger>
                                              {member.name ===
                                                clientUsername && (
                                                <TooltipContent>
                                                  Click to delete
                                                </TooltipContent>
                                              )}
                                            </Tooltip>
                                          </TooltipProvider>
                                          <span className="text-sm">
                                            {member.name}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}

                                {!members ||
                                  members.length === 0 ||
                                  (members.every(
                                    (member) =>
                                      member.availability?.[
                                        day as keyof Availability
                                      ]?.[time as keyof DayAvailability] ===
                                      "unknown",
                                  ) && (
                                    <div className="flex items-center justify-center w-full h-12 m-auto">
                                      <GhostIcon className="w-6 h-6 text-gray-300" />
                                      <span className="text-gray-300 text-sm ml-2">
                                        No members available
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default MobileCalendar;
const DayButton = ({
  day,
  isToday,
  onClick,
}: {
  day: string;
  isToday: boolean;
  onClick: () => void;
}) => (
  <div
    className={`flex group ${
      isToday
        ? "bg-purple-600 shadow-lg dark-shadow"
        : "hover:bg-purple-500 hover:shadow-lg hover-dark-shadow"
    } rounded-full mx-1 transition-all duration-300 cursor-pointer justify-center w-16`}
    onClick={onClick}
  >
    <div className={`flex items-center px-4 py-4 ${isToday ? "relative" : ""}`}>
      {isToday && (
        <span className="flex h-2 w-2 absolute bottom-1.5">
          <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400"></span>
          <span className="relative inline-flex rounded-full h-full w-3 bg-purple-100"></span>
        </span>
      )}
      <div className="text-center">
        <p
          className={`text-sm transition-all duration-300 ${
            isToday
              ? "text-gray-100 font-semibold"
              : "text-gray-900 group-hover:text-gray-100 group-hover:font-semibold"
          }`}
        >
          {day?.charAt(0).toUpperCase()}
        </p>
      </div>
    </div>
  </div>
);
