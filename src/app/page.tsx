
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAllTrips,
  getAllPlaces,
  getTripExpenses,
} from "@/features/travel/travel_service";
import type { Trip, Place } from "@/features/travel/types";

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const [tripData, placeData] = await Promise.all([
        getAllTrips(),
        getAllPlaces(),
      ]);

      const expenseData = await Promise.all(
        tripData.map((trip) => getTripExpenses(trip.id))
      );

      const spent = expenseData
        .flat()
        .reduce((total, expense) => total + (expense.homeAmount ?? expense.amount), 0);

      setTrips(tripData.sort((a, b) => a.startDate.localeCompare(b.startDate)));
      setPlaces(placeData);
      setTotalSpent(spent);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const destinationCount = places.filter(
    (place) => place.type === "city" || place.type === "town" || place.type === "region"
  ).length;

  const countryCount = places.filter(
    (place) => place.type === "country"
  ).length;

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return <main className="p-8">Loading Roam...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] p-6 text-[#24382d] sm:p-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#788477]">
              Your personal travel companion
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Roam<span className="text-[#8a9a82]">.</span>
            </h1>
            <p className="mt-3 text-[#788477]">
              Keep track of where you've been, where you're going and what it costs.
            </p>
          </div>
          <Link
            href="/places"
            className="rounded-lg border border-[#dce3da] px-5 py-3 text-sm hover:bg-white"
          >
            Explore places →
          </Link>
        </header>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-medium">Your travels at a glance</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-5">
              <p className="text-3xl font-semibold">{trips.length}</p>
              <p className="mt-1 text-sm text-[#788477]">Trips</p>
            </div>
            <div className="rounded-xl bg-white p-5">
              <p className="text-3xl font-semibold">{countryCount}</p>
              <p className="mt-1 text-sm text-[#788477]">Countries</p>
            </div>
            <div className="rounded-xl bg-white p-5">
              <p className="text-3xl font-semibold">{destinationCount}</p>
              <p className="mt-1 text-sm text-[#788477]">Destinations</p>
            </div>
            <div className="rounded-xl bg-white p-5">
              <p className="text-3xl font-semibold">
                R{totalSpent.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-1 text-sm text-[#788477]">Total recorded spend</p>
            </div>
          </div>
        </section>

        {/* Main navigation */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-medium">Your travel workspace</h2>
          <div className="grid gap-4 sm:grid-cols-3">

            <Link
              href="/journey"
              className="group rounded-xl bg-[#e8eee6] p-6 transition hover:bg-[#dce6d9]"
            >
              <p className="mb-8 text-2xl">↗</p>
              <h3 className="text-xl font-semibold">Journey</h3>
              <p className="mt-2 text-sm text-[#647568]">
                Plan your route, organise destinations and keep track of bookings.
              </p>
              <p className="mt-5 text-sm font-medium">View your journey →</p>
            </Link>

            <Link
              href="/places"
              className="group rounded-xl bg-[#eeeae0] p-6 transition hover:bg-[#e5dfd1]"
            >
              <p className="mb-8 text-2xl">⌖</p>
              <h3 className="text-xl font-semibold">Places</h3>
              <p className="mt-2 text-sm text-[#777365]">
                Your library of countries, destinations, accommodation and places.
              </p>
              <p className="mt-5 text-sm font-medium">Explore places →</p>
            </Link>

            <Link
              href="/diary"
              className="group rounded-xl bg-[#eae8ed] p-6 transition hover:bg-[#dedbe5]"
            >
              <p className="mb-8 text-2xl">✎</p>
              <h3 className="text-xl font-semibold">Travel diary</h3>
              <p className="mt-2 text-sm text-[#777181]">
                Record memories, recommendations and the stories behind your travels.
              </p>
              <p className="mt-5 text-sm font-medium">Open your diary →</p>
            </Link>
          </div>
        </section>

        {/* Trips */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your trips</h2>
            <Link
              href="/journey"
              className="text-sm text-[#788477] hover:text-[#24382d]"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-[#e5e5dc] rounded-xl border border-[#e5e5dc] bg-white px-5">
            {trips.map((trip) => (
              <Link
                href="/journey"
                key={trip.id}
                className="flex flex-wrap items-center justify-between gap-3 py-5"
              >
                <div>
                  <h3 className="font-medium">{trip.name}</h3>
                  <p className="mt-1 text-sm text-[#788477]">
                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  </p>
                </div>
                <span className="text-sm text-[#788477]">
                  {places.filter((place) => place.parentPlaceId ===
                    places.find((country) => country.name === trip.name)?.id
                  ).length} destinations
                  <span className="ml-3">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-[#e5e5dc] pt-6 text-sm text-[#92978e]">
          Roam · Made for the journey.
        </footer>
      </div>
    </main>
  );
}
