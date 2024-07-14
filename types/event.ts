export type AvailabilityStatus = "yes" | "no" | "maybe" | "unknown";

export interface DayAvailability {
  morning: AvailabilityStatus;
  afternoon: AvailabilityStatus;
  evening: AvailabilityStatus;
  night: AvailabilityStatus;
}

export interface Availability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface Member {
  name: string;
  availability: Availability;
}

export const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  yes: "bg-green-500 text-green-50",
  no: "bg-red-500 text-red-50",
  maybe: "bg-yellow-500 text-yellow-50",
  unknown: "bg-gray-500 text-gray-50",
};
