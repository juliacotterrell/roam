
"use client";

import { useEffect, useState } from "react";
import { getAllPlaces } from "@/features/travel/travel_service";
import type { Place } from "@/features/travel/types";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      const data = await getAllPlaces();
      setPlaces(data);
      setLoading(false);
    }

    loadPlaces();
  }, []);

  const countries = places.filter((place) => place.type === "country");

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
          <h1 className="text-4xl font-semibold">Places</h1>
          <p className="mt-3 text-[#788477]">
            Every country, destination and place you've collected along the way.
          </p>
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
