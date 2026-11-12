
/* =========================================
   PLACES
   A reusable library of real-world locations
========================================= */

export type PlaceType =
  | "country"
  | "region"
  | "city"
  | "town"
  | "accommodation"
  | "attraction"
  | "restaurant"
  | "other";

export type Place = {
  id: string;
  name: string;
  type: PlaceType;

  // Links a place to its parent.
  // Example: Hanoi -> Vietnam
  parentPlaceId?: string;

  description?: string;
  address?: string;

  // Optional geographical information
  latitude?: number;
  longitude?: number;

  website?: string;

  createdAt: string;
  updatedAt: string;
};


/* =========================================
   TRIPS
   A complete journey containing multiple stops
========================================= */

export type Trip = {
  id: string;
  name: string;

  startDate: string;
  endDate: string;

  homeCurrency: string;
  budget?: number;

  createdAt: string;
  updatedAt: string;
};


/* =========================================
   TRIP STOPS
   A visit to a place during a particular trip
========================================= */

export type TransportMode =
  | "flight"
  | "bus"
  | "train"
  | "car"
  | "ferry"
  | "other";

export type TripStop = {
  id: string;
  tripId: string;

  // References a city, town or other destination
  placeId: string;

  arrivalDate: string;
  departureDate: string;

  // References an accommodation in the Places library
  accommodationId?: string;

  // Controls chronological itinerary order
  order: number;

  transportFromPrevious?: {
    mode: TransportMode;
    provider?: string;
    bookingReference?: string;
    notes?: string;
  };

  notes?: string;

  createdAt: string;
  updatedAt: string;
};


/* =========================================
   DIARY ENTRIES
   Entries belong to a particular visit
========================================= */

export type DiaryEntryType =
  | "diary"
  | "memory"
  | "recommendation"
  | "tip";

export type DiaryEntry = {
  id: string;
  tripStopId: string;

  // Optional link to a more specific place
  // e.g. a restaurant or attraction
  placeId?: string;

  date: string;
  title: string;
  content: string;
  type: DiaryEntryType;

  createdAt: string;
  updatedAt: string;
};


/* =========================================
   EXPENSES
   Expenses belong to a trip and optionally
   to a specific visit or place
========================================= */

export type ExpenseCategory =
  | "accommodation"
  | "transport"
  | "food"
  | "activities"
  | "shopping"
  | "essentials"
  | "other";

export type Expense = {
  id: string;
  tripId: string;

  // Optional location associations
  tripStopId?: string;
  placeId?: string;

  date: string;
  description: string;
  category: ExpenseCategory;

  // Original amount and currency
  amount: number;
  currency: string;

  // Converted amount in the trip's home currency.
  // Store the conversion used at the time of the expense.
  homeAmount?: number;
  exchangeRate?: number;

  createdAt: string;
  updatedAt: string;
};
