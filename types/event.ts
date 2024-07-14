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
