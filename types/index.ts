export interface Passenger {
  name: string;
  surname: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  isOccupied: boolean;
  isExitRow?: boolean;
  isEntryRow?: boolean;  // Add new property
  occupiedBy?: {
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
}
