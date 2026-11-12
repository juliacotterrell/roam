
"use client";

import { useEffect, useState } from "react";
import {
  getAllTrips,
  getTripStops,
  getAllPlaces,
} from "@/features/travel/travel_service";
import type { Trip, TripStop, Place } from "@/features/travel/types";

type JourneyStop = TripStop & {
  place?: Place;
  accommodation?: Place;
};

export default function JourneyPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [stops, setStops] = useState<JourneyStop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJourney() {
      const [tripData, placeData] = await Promise.all([
        getAllTrips(),
        getAllPlaces(),
      ]);

      const stopData = await Promise.all(
        tripData.map((trip) => getTripStops(trip.id))
      );

      const allStops = stopData.flat().map((stop) => ({
        ...stop,
        place: placeData.find((place) => place.id === stop.placeId),
        accommodation: stop.accommodationId
          ? placeData.find((place) => place.id === stop.accommodationId)
          : undefined,
      }));

      setTrips(
        tripData.sort((a, b) =>
          a.startDate.localeCompare(b.startDate)
        )
      );
      setPlaces(placeData);
      setStops(allStops);
      setLoading(false);
    }

    loadJourney();
  }, []);

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return <main className="p-8">Loading journey...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] p-8 text-[#24382d]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#788477]">
            Your travels
          </p>
          <h1 className="text-4xl font-semibold">Journey</h1>
          <p className="mt-3 text-[#788477]">
            Everywhere you've been, and everywhere you're going.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5">
            <p className="text-3xl font-semibold">{trips.length}</p>
            <p className="text-sm text-[#788477]">Trips</p>
          </div>
          <div className="rounded-xl bg-white p-5">
            <p className="text-3xl font-semibold">{stops.length}</p>
            <p className="text-sm text-[#788477]">Destinations visited</p>
          </div>
          <div className="rounded-xl bg-white p-5">
            <p className="text-3xl font-semibold">
              {places.filter((place) => place.type === "country").length}
            </p>
            <p className="text-sm text-[#788477]">Countries</p>
          </div>
        </div>

        <div className="space-y-6">
          {trips.map((trip) => {
            const tripStops = stops
              .filter((stop) => stop.tripId === trip.id)
              .sort((a, b) => a.order - b.order);

            return (
              <section
                key={trip.id}
                className="rounded-xl border border-[#e5e5dc] bg-white p-6"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold">{trip.name}</h2>
                    <p className="mt-1 text-sm text-[#788477]">
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#edf1eb] px-3 py-1 text-sm text-[#435d49]">
                    {trip.homeCurrency}
                  </span>
                </div>

                <div className="space-y-0">
                  {tripStops.map((stop, index) => (
                    <div key={stop.id} className="relative flex gap-4 pb-7">
                      <div className="flex flex-col items-center">
                        <div className="mt-1 h-3 w-3 rounded-full bg-[#54745a]" />
                        {index !== tripStops.length - 1 && (
                          <div className="mt-2 w-px flex-1 bg-[#dce3da]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-medium">
                            {stop.place?.name ?? "Unknown place"}
                          </h3>
                          <span className="text-sm text-[#788477]">
                            {formatDate(stop.arrivalDate)} –{" "}
                            {formatDate(stop.departureDate)}
                          </span>
                        </div>

                        {stop.accommodation && (
                          <p className="mt-2 text-sm text-[#788477]">
                            Staying at: {stop.accommodation.name}
                          </p>
                        )}

                        {stop.notes && (
                          <p className="mt-2 text-sm text-[#54745a]">
                            {stop.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
