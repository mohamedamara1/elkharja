export enum AvailabilityStatus {
  yes = "yes",
  maybe = "maybe",
  no = "no",
  unknown = "unknown",
}

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
