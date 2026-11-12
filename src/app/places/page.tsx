"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import WorldMap from "@/components/world_map";
import type { CountryStatus } from "@/components/world_map";
import {
  createPlace,
  getAllPlaces,
  getAllTrips,
  getTripStops,
} from "@/features/travel/travel_service";
import type { Place, PlaceType, TripStop } from "@/features/travel/types";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [tripStops, setTripStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<PlaceType>("city");
  const [parentPlaceId, setParentPlaceId] = useState("");
  
  const [today, setToday] = useState("");
  

  useEffect(() => {
    async function loadPlaces() {
        const now = new Date();
const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
setToday(localToday);
      try {
        const [placeData, tripData] = await Promise.all([
          getAllPlaces(),
          getAllTrips(),
        ]);

        const stopData = await Promise.all(
          tripData.map((trip) => getTripStops(trip.id))
        );

        setPlaces(placeData);
        setTripStops(stopData.flat());
      } catch (error) {
        console.error("Failed to load places and trips:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, []);

  async function handleCreatePlace() {
    if (!name.trim()) return;

    await createPlace({
      name: name.trim(),
      type,
      parentPlaceId: parentPlaceId || undefined,
    });

    const data = await getAllPlaces();
    setPlaces(data);
    setName("");
    setType("city");
    setParentPlaceId("");
    setShowForm(false);
  }

  const countries = places.filter((place) => place.type === "country");

  const countryStatuses: Record<string, CountryStatus> = {};

  tripStops.forEach((stop) => {
    const place = places.find((p) => p.id === stop.placeId);
    if (!place) return;

    let currentPlace: Place | undefined = place;

    while (currentPlace && currentPlace.type !== "country") {
      const parentId: string | undefined = currentPlace.parentPlaceId;
      currentPlace = parentId
        ? places.find((p) => p.id === parentId)
        : undefined;
    }

    if (!currentPlace) return;

    const status: CountryStatus =
      stop.arrivalDate > today ? "planned" : "visited";
    const existingStatus = countryStatuses[currentPlace.name];

    // A visited country takes priority over a planned visit.
    if (existingStatus !== "visited") {
      countryStatuses[currentPlace.name] = status;
    }
  });

  if (loading) {
    return <main className="p-8">Loading places...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] p-8 text-[#24382d]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#788477]">
            Your travel library
          </p>
           <Link
  href="/"
  className="inline-flex items-center gap-2 text-sm text-[#788477] hover:text-[#365442] transition"
>
  ← Back to Home
</Link>
          <h1 className="text-4xl font-semibold">Places</h1>
          <p className="mt-3 text-[#788477]">
            Every country, destination and place you&apos;ve collected along the way.
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-[#24382d] px-5 py-3 text-sm text-white"
          >
            {showForm ? "Cancel" : "+ Add a place"}
          </button>

          {showForm && (
            <div className="mt-4 rounded-xl border border-[#e5e5dc] bg-white p-5">
              <h2 className="mb-4 font-medium">Add a new place</h2>
              <div className="space-y-4">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Place name"
                  className="w-full rounded-lg border p-3"
                />

                <select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value as PlaceType);
                    setParentPlaceId("");
                  }}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="country">Country</option>
                  <option value="region">Region</option>
                  <option value="city">City</option>
                  <option value="town">Town</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="attraction">Attraction</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="other">Other</option>
                </select>

                {type !== "country" && (
                  <select
                    value={parentPlaceId}
                    onChange={(event) => setParentPlaceId(event.target.value)}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select a parent place</option>
                    {places
                      .filter((place) => {
                        if (
                          type === "region" ||
                          type === "city" ||
                          type === "town"
                        ) {
                          return (
                            place.type === "country" || place.type === "region"
                          );
                        }
                        return place.type === "city" || place.type === "town";
                      })
                      .map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                  </select>
                )}

                <button
                  onClick={handleCreatePlace}
                  disabled={!name.trim() || (type !== "country" && !parentPlaceId)}
                  className="rounded-lg bg-[#24382d] px-5 py-3 text-sm text-white disabled:opacity-40"
                >
                  Save place
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 flex gap-8">
          <div>
            <p className="text-3xl font-semibold">{countries.length}</p>
            <p className="text-sm text-[#788477]">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">
              {places.filter((place) => place.type !== "country").length}
            </p>
            <p className="text-sm text-[#788477]">Places</p>
          </div>
        </div>

        <section className="mb-8 rounded-xl border border-[#e5e5dc] bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-medium">Your world</h2>
            <div className="flex flex-wrap gap-4 text-sm text-[#788477]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#365442]" /> Visited
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#a8c5ad]" /> Planned
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#e5e5dc]" /> Not yet visited
              </span>
            </div>
          </div>
          <WorldMap countryStatuses={countryStatuses} />
        </section>

        <div className="space-y-3">
          {countries.map((country) => {
            const destinations = places.filter(
              (place) => place.parentPlaceId === country.id
            );

            return (
              <details
                key={country.id}
                className="rounded-xl border border-[#e5e5dc] bg-white p-5"
              >
                <summary className="cursor-pointer list-none">
                  <span className="text-lg font-medium">{country.name}</span>
                  <span className="ml-3 text-sm text-[#788477]">
                    {destinations.length} destinations
                  </span>
                </summary>

                <div className="mt-5 space-y-3 border-t border-[#eeeeea] pt-4">
                  {destinations.map((destination) => {
                    const children = places.filter(
                      (place) => place.parentPlaceId === destination.id
                    );

                    return (
                      <div
                        key={destination.id}
                        className="rounded-lg bg-[#f8f7f3] p-4"
                      >
                        <div className="font-medium">{destination.name}</div>
                        <div className="mt-1 text-sm text-[#788477]">
                          {destination.type}
                        </div>

                        {children.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4">
                            {children.map((child) => (
                              <div
                                key={child.id}
                                className="flex justify-between text-sm"
                              >
                                <span>{child.name}</span>
                                <span className="text-[#788477]">
                                  {child.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </main>
  );
}
