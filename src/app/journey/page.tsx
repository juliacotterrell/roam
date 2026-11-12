
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    createPlace,

    getAllTrips,
    getTripStops,
    getAllPlaces,
    deleteTrip,

    updateTripStop,
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
    const [editingStopId, setEditingStopId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [addingAccommodationStopId, setAddingAccommodationStopId] =
        useState<string | null>(null);
    const [savingAccommodation, setSavingAccommodation] = useState(false);
    const [contextMenuTripId, setContextMenuTripId] = useState<string | null>(null);

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

           const today = new Date().toISOString().split("T")[0];

const getTripPriority = (trip: Trip) => {
  if (trip.startDate <= today && trip.endDate >= today) return 0;
  if (trip.endDate < today) return 1;
  return 2;
};

setTrips(
  tripData.sort((a, b) => {
    const priorityDifference =
      getTripPriority(a) - getTripPriority(b);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return b.startDate.localeCompare(a.startDate);
  })
);
            setPlaces(placeData);
            setStops(allStops);
            setLoading(false);
        }

        loadJourney();
    }, []);
    async function handleSaveStop(
        stopId: string,
        formData: FormData
    ) {
        setSaving(true);

        try {
            await updateTripStop(stopId, {
                arrivalDate: String(formData.get("arrivalDate")),
                departureDate: String(formData.get("departureDate")),
                accommodationId:
                    String(formData.get("accommodationId")) || undefined,
                notes: String(formData.get("notes")) || undefined,
            });

            const updatedStops = await Promise.all(
                trips.map((trip) => getTripStops(trip.id))
            );

            setStops(
                updatedStops.flat().map((stop) => ({
                    ...stop,
                    place: places.find((place) => place.id === stop.placeId),
                    accommodation: stop.accommodationId
                        ? places.find((place) => place.id === stop.accommodationId)
                        : undefined,
                }))
            );

            setEditingStopId(null);
        } catch (error) {
            console.error("Could not update destination:", error);
            alert("There was a problem saving this destination.");
        } finally {
            setSaving(false);
        }
    }
    async function handleAddAccommodation(
        stop: JourneyStop,
        formData: FormData
    ) {
        try {
            setSavingAccommodation(true);

            const name = String(formData.get("name") || "").trim();
            const address = String(formData.get("address") || "").trim();
            const website = String(formData.get("website") || "").trim();

            if (!name) {
                throw new Error("Please enter an accommodation name.");
            }

            const accommodation = await createPlace({
                name,
                type: "accommodation",
                parentPlaceId: stop.placeId,
                address: address || undefined,
                website: website || undefined,
            });

            await updateTripStop(stop.id, {
                accommodationId: accommodation.id,
            });

            const updatedPlaces = await getAllPlaces();
            setPlaces(updatedPlaces);

            const updatedStops = await Promise.all(
                trips.map(async (trip) => getTripStops(trip.id))
            );

            const allStops = updatedStops.flat();

            setStops(
                allStops
                    .map((item) => ({
                        ...item,
                        place: updatedPlaces.find((place) => place.id === item.placeId),
                        accommodation: updatedPlaces.find(
                            (place) => place.id === item.accommodationId
                        ),
                    }))
                    .sort((a, b) => b.order - a.order)
            );

            setAddingAccommodationStopId(null);
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Could not add accommodation."
            );
        } finally {
            setSavingAccommodation(false);
        }
    }
    async function handleDeleteTrip(tripId: string, tripName: string) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${tripName}"? This will also permanently delete its destinations, diary entries and expenses.`
        );

        if (!confirmed) return;

        try {
            await deleteTrip(tripId);

            setTrips((currentTrips) =>
                currentTrips.filter((trip) => trip.id !== tripId)
            );

            setStops((currentStops) =>
                currentStops.filter((stop) => stop.tripId !== tripId)
            );
        } catch (error) {
            alert(
                error instanceof Error ? error.message : "Could not delete trip."
            );
        }
    }

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
    const today = new Date().toISOString().split("T")[0];

    const visitedStops = stops.filter(
        (stop) => stop.departureDate < today
    );

    const visitedCountryIds = new Set(
        visitedStops
            .map((stop) => {
                let place = stop.place;

                while (place && place.type !== "country") {
                    place = places.find(
                        (item) => item.id === place?.parentPlaceId
                    );
                }

                return place?.id;
            })
            .filter(Boolean)
    );

    const countriesVisited = visitedCountryIds.size;


    return (
        <main className="min-h-screen bg-[#f8f7f3] p-8 text-[#24382d]">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    
                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#788477]">
                        Your travels
                    </p>
                    <Link
  href="/"
  className="inline-flex items-center gap-2 text-sm text-[#788477] hover:text-[#365442] transition"
>
  ← Back to Home
</Link>
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
                        <p className="text-3xl font-semibold">{visitedStops.length}</p>
                        <p className="text-sm text-[#788477]">Destinations visited</p>
                    </div>
                    <div className="rounded-xl bg-white p-5">
                        <p className="text-3xl font-semibold">
                            {countriesVisited}
                        </p>
                        <p className="text-sm text-[#788477]">Countries</p>
                    </div>
                </div>

                <div
  className="space-y-6"
  onClick={() => setContextMenuTripId(null)}
>
                    {trips.map((trip) => {
                        const today = new Date().toISOString().split("T")[0];


                        const status =
                            trip.endDate < today
                                ? "Completed"
                                : trip.startDate > today
                                    ? "Upcoming"
                                    : "In progress";
                        const tripStops = stops
                            .filter((stop) => stop.tripId === trip.id)
                            .sort((a, b) => b.order - a.order);

                        const currentStop = tripStops.find(
                            (stop) =>
                                stop.arrivalDate <= today &&
                                stop.departureDate >= today
                        );

                        return (
                            <section
                                key={trip.id}
                                className="relative rounded-xl border border-[#e5e5dc] bg-white p-6"
                                onContextMenu={(event) => {
                                    event.preventDefault();
                                    setContextMenuTripId(trip.id);
                                }}
                                onTouchStart={() => {
                                    const timeout = setTimeout(() => {
                                        setContextMenuTripId(trip.id);
                                    }, 600);

                                    (window as any).__roamLongPress = timeout;
                                }}
                                onTouchEnd={() => {
                                    clearTimeout((window as any).__roamLongPress);
                                }}
                                onTouchMove={() => {
                                    clearTimeout((window as any).__roamLongPress);
                                }}
                            >

                                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-2xl font-semibold">{trip.name}</h2>
                                        <p className="mt-1 text-sm text-[#788477]">
                                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#edf1eb] px-3 py-1 text-sm text-[#435d49]">
                                            {status}
                                        </span>

                                        <span className="rounded-full bg-[#f8f7f3] px-3 py-1 text-sm text-[#788477]">
                                            {trip.homeCurrency}
                                        </span>

                                    </div>

                                </div>

                                <div className="space-y-0">
                                    {tripStops.map((stop, index) => (
                                        <div
                                            key={stop.id}
                                            className={`relative flex gap-4 pb-7 ${stop.departureDate < today ? "opacity-60" : ""
                                                }`}
                                        >
                                            {/* Timeline marker */}
                                            <div className="flex flex-col items-center">
                                                <div className="mt-1 h-3 w-3 rounded-full bg-[#54745a]" />
                                                {index !== tripStops.length - 1 && (
                                                    <div className="mt-2 w-px flex-1 bg-[#dce3da]" />
                                                )}
                                            </div>

                                            {/* Expandable destination */}
                                            <details
                                                className="min-w-0 flex-1"
                                                open={currentStop?.id === stop.id}
                                            >
                                                <summary className="cursor-pointer list-none">
                                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-medium">
                                                                {stop.place?.name ?? "Unknown place"}
                                                            </h3>

                                                            {currentStop?.id === stop.id && (
                                                                <span className="rounded-full bg-[#edf1eb] px-2 py-1 text-xs text-[#435d49]">
                                                                    Current destination
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-sm text-[#788477]">
                                                            {formatDate(stop.arrivalDate)} –{" "}
                                                            {formatDate(stop.departureDate)}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-xs text-[#788477]">
                                                        View details ↓
                                                    </p>
                                                </summary>

                                                <div className="mt-4 space-y-3 border-l border-[#dce3da] pl-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingStopId(
                                                                editingStopId === stop.id ? null : stop.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-[#dce3da] px-3 py-2 text-sm hover:bg-[#f8f7f3]"
                                                    >
                                                        {editingStopId === stop.id ? "Cancel editing" : "Edit destination"}
                                                    </button>

                                                    {editingStopId === stop.id && (
                                                        <form
                                                            onSubmit={async (event) => {
                                                                event.preventDefault();
                                                                await handleSaveStop(
                                                                    stop.id,
                                                                    new FormData(event.currentTarget)
                                                                );
                                                            }}
                                                            className="space-y-3 rounded-xl bg-[#f8f7f3] p-4"
                                                        >
                                                            <div>
                                                                <label className="mb-1 block text-sm">Arrival date</label>
                                                                <input
                                                                    name="arrivalDate"
                                                                    type="date"
                                                                    defaultValue={stop.arrivalDate}
                                                                    required
                                                                    className="w-full rounded-lg border border-[#dce3da] bg-white p-2 text-sm"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-1 block text-sm">Departure date</label>
                                                                <input
                                                                    name="departureDate"
                                                                    type="date"
                                                                    defaultValue={stop.departureDate}
                                                                    required
                                                                    className="w-full rounded-lg border border-[#dce3da] bg-white p-2 text-sm"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-1 block text-sm">Accommodation</label>
                                                                <select
                                                                    name="accommodationId"
                                                                    defaultValue={stop.accommodationId ?? ""}
                                                                    className="w-full rounded-lg border border-[#dce3da] bg-white p-2 text-sm"
                                                                >
                                                                    <option value="">No accommodation selected</option>
                                                                    {places
                                                                        .filter(
                                                                            (place) =>
                                                                                place.type === "accommodation" &&
                                                                                (place.parentPlaceId === stop.placeId ||
                                                                                    place.parentPlaceId === stop.place?.parentPlaceId)
                                                                        )
                                                                        .map((place) => (
                                                                            <option key={place.id} value={place.id}>
                                                                                {place.name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="mb-1 block text-sm">Notes</label>
                                                                <textarea
                                                                    name="notes"
                                                                    defaultValue={stop.notes ?? ""}
                                                                    rows={3}
                                                                    className="w-full rounded-lg border border-[#dce3da] bg-white p-2 text-sm"
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={saving}
                                                                className="rounded-lg bg-[#24382d] px-4 py-2 text-sm text-white disabled:opacity-50"
                                                            >
                                                                {saving ? "Saving..." : "Save changes"}
                                                            </button>
                                                        </form>
                                                    )}
                                                    {stop.accommodation ? (
                                                        <p className="text-sm text-[#788477]">
                                                            {stop.departureDate < today ? "Stayed at:" : "Staying at:"}{" "}
                                                            {stop.accommodation.name}
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <p className="text-sm text-[#788477]">No accommodation added yet.</p>

                                                            {addingAccommodationStopId === stop.id ? (
                                                                <form
                                                                    onSubmit={(event) => {
                                                                        event.preventDefault();
                                                                        handleAddAccommodation(
                                                                            stop,
                                                                            new FormData(event.currentTarget)
                                                                        );
                                                                    }}
                                                                    className="space-y-3 rounded-lg border border-[#dce2d8] p-3"
                                                                >
                                                                    <input
                                                                        name="name"
                                                                        placeholder="Accommodation name"
                                                                        required
                                                                        className="w-full rounded-md border border-[#dce2d8] p-2 text-sm"
                                                                    />

                                                                    <input
                                                                        name="address"
                                                                        placeholder="Address (optional)"
                                                                        className="w-full rounded-md border border-[#dce2d8] p-2 text-sm"
                                                                    />

                                                                    <input
                                                                        name="website"
                                                                        placeholder="Website (optional)"
                                                                        className="w-full rounded-md border border-[#dce2d8] p-2 text-sm"
                                                                    />

                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            type="submit"
                                                                            disabled={savingAccommodation}
                                                                            className="rounded-md bg-[#365442] px-3 py-2 text-sm text-white disabled:opacity-50"
                                                                        >
                                                                            {savingAccommodation ? "Adding..." : "Save accommodation"}
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setAddingAccommodationStopId(null)}
                                                                            className="rounded-md border border-[#dce2d8] px-3 py-2 text-sm"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAddingAccommodationStopId(stop.id)}
                                                                    className="text-sm font-medium text-[#365442] underline"
                                                                >
                                                                    + Add accommodation
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {stop.transportFromPrevious && (
                                                        <div className="rounded-lg bg-[#f8f7f3] p-3">
                                                            <p className="text-xs font-medium uppercase tracking-wider text-[#788477]">
                                                                {stop.departureDate < today
                                                                    ? "Travelled by"
                                                                    : "Getting there by"}
                                                            </p>

                                                            <p className="mt-1 text-sm font-medium capitalize">
                                                                {stop.transportFromPrevious.mode}
                                                                {stop.transportFromPrevious.provider &&
                                                                    ` · ${stop.transportFromPrevious.provider}`}
                                                            </p>

                                                            {stop.transportFromPrevious.bookingReference && (
                                                                <p className="mt-1 text-xs text-[#788477]">
                                                                    Booking reference:{" "}
                                                                    {stop.transportFromPrevious.bookingReference}
                                                                </p>
                                                            )}

                                                            {stop.transportFromPrevious.notes && (
                                                                <p className="mt-1 text-sm text-[#54745a]">
                                                                    {stop.transportFromPrevious.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {stop.notes && (
                                                        <p className="text-sm text-[#54745a]">
                                                            {stop.notes}
                                                        </p>
                                                    )}

                                                    {!stop.accommodation &&
                                                        !stop.transportFromPrevious &&
                                                        !stop.notes && (
                                                            <p className="text-sm text-[#9a9e96]">
                                                                No additional details yet.
                                                            </p>
                                                        )}
                                                </div>
                                                
                                            </details>
                                        </div>
                                        
                                    ))}

                                </div>
                                {contextMenuTripId === trip.id && (
<div
  onClick={(event) => event.stopPropagation()}
  className="absolute right-6 top-16 z-20 w-40 rounded-lg border border-[#e5e5dc] bg-white p-1 shadow-lg"
>    <button
      type="button"
      onClick={() => {
        setContextMenuTripId(null);
        handleDeleteTrip(trip.id, trip.name);
      }}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
    >
      Delete trip
    </button>
  </div>
)}
                                
                            </section>
                        );
                    })}
                </div>
            </div >
        </main >
    );
}
