
import Dexie, { type Table } from "dexie";

import type {
  Place,
  Trip,
  TripStop,
  DiaryEntry,
  Expense,
} from "@/features/travel/types";

export type MigrationRecord = {
  id: string;
  completedAt: string;
};

class RoamDatabase extends Dexie {
  places!: Table<Place, string>;
  trips!: Table<Trip, string>;
  tripStops!: Table<TripStop, string>;
  diaryEntries!: Table<DiaryEntry, string>;
  expenses!: Table<Expense, string>;
  migrations!: Table<MigrationRecord, string>;

  constructor() {
    super("roam-database");

    // Initial database structure
    this.version(1).stores({
      places: "&id, name, type, parentPlaceId",
      trips: "&id, name, startDate, endDate",
      tripStops:
        "&id, tripId, placeId, arrivalDate, departureDate, order, [tripId+order], [tripId+placeId]",
      diaryEntries:
        "&id, tripStopId, placeId, date, type, [tripStopId+date]",
      expenses:
        "&id, tripId, tripStopId, placeId, date, category, currency, [tripId+date], [tripStopId+date]",
    });

    // Version 2 adds migration tracking
    this.version(2).stores({
      places: "&id, name, type, parentPlaceId",
      trips: "&id, name, startDate, endDate",
      tripStops:
        "&id, tripId, placeId, arrivalDate, departureDate, order, [tripId+order], [tripId+placeId]",
      diaryEntries:
        "&id, tripStopId, placeId, date, type, [tripStopId+date]",
      expenses:
        "&id, tripId, tripStopId, placeId, date, category, currency, [tripId+date], [tripStopId+date]",
      migrations: "&id, completedAt",
    });
  }
}

export const db = new RoamDatabase();
