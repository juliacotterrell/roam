
import { db } from "./database";
import { places, trips, tripStops } from "./seed_data";
import type { DiarySeedEntry } from "./diary_seed_data";

import type {
  Place,
  Trip,
  TripStop,
  DiaryEntry,
  Expense,
} from "./types";

// Shared helper for generating record IDs and timestamps
function createMetadata() {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

/* =========================================
   PLACES
========================================= */

export async function createPlace(
  input: Omit<Place, "id" | "createdAt" | "updatedAt">
) {
  // If this place has a parent, make sure it exists
  if (input.parentPlaceId) {
    const parent = await db.places.get(input.parentPlaceId);

    if (!parent) {
      throw new Error("Parent place does not exist.");
    }
  }

  const place: Place = {
    ...input,
    ...createMetadata(),
  };

  await db.places.add(place);

  return place;
}

export async function getAllPlaces() {
  return db.places.orderBy("name").toArray();
}

export async function getPlaceChildren(parentPlaceId: string) {
  return db.places
    .where("parentPlaceId")
    .equals(parentPlaceId)
    .sortBy("name");
}

export async function getPlace(placeId: string) {
  return db.places.get(placeId);
}

/* =========================================
   TRIPS
========================================= */

export async function createTrip(
  input: Omit<Trip, "id" | "createdAt" | "updatedAt">
) {
  const trip: Trip = {
    ...input,
    ...createMetadata(),
  };

  await db.trips.add(trip);

  return trip;
}

export async function getAllTrips() {
  return db.trips.orderBy("startDate").toArray();
}

export async function getTrip(tripId: string) {
  return db.trips.get(tripId);
}
export async function deleteTrip(tripId: string): Promise<void> {
  await db.transaction(
    "rw",
    db.trips,
    db.tripStops,
    db.diaryEntries,
    db.expenses,
    async () => {
      const trip = await db.trips.get(tripId);

      if (!trip) {
        throw new Error("Trip does not exist.");
      }

      const stops = await db.tripStops
        .where("tripId")
        .equals(tripId)
        .toArray();

      const stopIds = stops.map((stop) => stop.id);

      await db.diaryEntries
        .where("tripStopId")
        .anyOf(stopIds)
        .delete();

      await db.expenses
        .where("tripId")
        .equals(tripId)
        .delete();

      await db.tripStops
        .where("tripId")
        .equals(tripId)
        .delete();

      await db.trips.delete(tripId);
    }
  );
}
/* =========================================
   TRIP STOPS
========================================= */

type CreateTripStopInput = Omit<
  TripStop,
  "id" | "order" | "createdAt" | "updatedAt"
> & {
  order?: number;
};

export async function createTripStop(
  input: CreateTripStopInput
) {
  return db.transaction(
    "rw",
    db.tripStops,
    db.trips,
    db.places,
    async () => {
      const trip = await db.trips.get(input.tripId);
      const place = await db.places.get(input.placeId);

      if (!trip) {
        throw new Error("Trip does not exist.");
      }

      if (!place) {
        throw new Error("Place does not exist.");
      }

      if (input.accommodationId) {
        const accommodation = await db.places.get(
          input.accommodationId
        );

        if (!accommodation) {
          throw new Error("Accommodation does not exist.");
        }

        if (accommodation.type !== "accommodation") {
          throw new Error("Selected place is not an accommodation.");
        }
      }

      const existingStops = await db.tripStops
        .where("tripId")
        .equals(input.tripId)
        .toArray();

      const nextOrder =
        existingStops.length > 0
          ? Math.max(...existingStops.map((stop) => stop.order)) + 1
          : 1;

      const stop: TripStop = {
        ...input,
        order: input.order ?? nextOrder,
        ...createMetadata(),
      };

      await db.tripStops.add(stop);

      return stop;
    }
  );
}
export async function updateTripStop(
  id: string,
  updates: Partial<
    Omit<TripStop, "id" | "tripId" | "createdAt" | "updatedAt">
  >
): Promise<void> {
  await db.tripStops.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getTripStops(tripId: string) {
  return db.tripStops
    .where("tripId")
    .equals(tripId)
    .sortBy("order");
}

/* =========================================
   DIARY
========================================= */

export async function createDiaryEntry(
  input: Omit<
    DiaryEntry,
    "id" | "createdAt" | "updatedAt"
  >
) {
  const stop = await db.tripStops.get(input.tripStopId);

  if (!stop) {
    throw new Error("Trip stop does not exist.");
  }

  if (input.placeId) {
    const place = await db.places.get(input.placeId);

    if (!place) {
      throw new Error("Place does not exist.");
    }
  }

  const entry: DiaryEntry = {
    ...input,
    ...createMetadata(),
  };

  await db.diaryEntries.add(entry);

  return entry;
}

export async function getDiaryEntries(tripStopId: string) {
  return db.diaryEntries
    .where("tripStopId")
    .equals(tripStopId)
    .sortBy("date");
}

/* =========================================
   EXPENSES
========================================= */

export async function createExpense(
  input: Omit<
    Expense,
    "id" | "createdAt" | "updatedAt"
  >
) {
  if (input.tripStopId) {
    const stop = await db.tripStops.get(input.tripStopId);

    if (!stop || stop.tripId !== input.tripId) {
      throw new Error("Invalid trip stop for this expense.");
    }
  }

  if (input.placeId) {
    const place = await db.places.get(input.placeId);

    if (!place) {
      throw new Error("Place does not exist.");
    }
  }

  if (input.amount <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  const expense: Expense = {
    ...input,
    ...createMetadata(),
  };

  await db.expenses.add(expense);

  return expense;
}

export async function getTripExpenses(tripId: string) {
  return db.expenses
    .where("tripId")
    .equals(tripId)
    .sortBy("date");
}

export async function getTripStopExpenses(tripStopId: string) {
  return db.expenses
    .where("tripStopId")
    .equals(tripStopId)
    .sortBy("date");
}

export async function initialiseDatabase(): Promise<void> {
  await db.transaction(
    "rw",
    db.places,
    db.trips,
    db.tripStops,
    async () => {
      // Only seed the database if it has not already been populated.
      if (await db.places.count() > 0) {
        return;
      }

      await db.places.bulkAdd(places);
      await db.trips.bulkAdd(trips);
      await db.tripStops.bulkAdd(tripStops);
    }
  );
}


export async function importDiaryEntries(
  seedEntries: DiarySeedEntry[]
): Promise<number> {
  let importedCount = 0;

  await db.transaction(
    "rw",
    db.trips,
    db.tripStops,
    db.places,
    db.diaryEntries,
    async () => {
      for (const entry of seedEntries) {
        const trip = await db.trips
          .where("name")
          .equals(entry.tripName)
          .first();

        if (!trip) {
          throw new Error(`Trip not found: ${entry.tripName}`);
        }

        const place = await db.places
          .where("name")
          .equals(entry.placeName)
          .first();

        if (!place) {
          throw new Error(`Place not found: ${entry.placeName}`);
        }

        const stop = await db.tripStops
          .where("[tripId+placeId]")
          .equals([trip.id, place.id])
          .first();

        if (!stop) {
          throw new Error(
            `Trip stop not found: ${entry.tripName} - ${entry.placeName}`
          );
        }

        const existingEntry = await db.diaryEntries
          .where("[tripStopId+date]")
          .equals([stop.id, entry.date])
          .filter(
            (item) =>
              item.title === entry.title &&
              item.type === entry.type
          )
          .first();

        if (existingEntry) continue;

        const timestamp = new Date().toISOString();

        await db.diaryEntries.add({
          id: crypto.randomUUID(),
          tripStopId: stop.id,
          placeId: place.id,
          date: entry.date,
          title: entry.title,
          content: entry.content,
          type: entry.type,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        importedCount++;
      }
    }
  );

  return importedCount;

}
