
"use client";
import { useEffect, useState } from "react";
import {
    getAllTrips,
    getAllPlaces,
    getTripStops,
    getDiaryEntries,
    createDiaryEntry,
} from "@/features/travel/travel_service";
import type {
    Trip,
    TripStop,
    Place,
    DiaryEntry,
    DiaryEntryType,
} from "@/features/travel/types";

type DiaryItem = DiaryEntry & {
    place?: Place;
    trip?: Trip;
};

export default function DiaryPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [stops, setStops] = useState<TripStop[]>([]);
    const [entries, setEntries] = useState<DiaryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedTrip, setSelectedTrip] = useState("all");
    const [selectedStop, setSelectedStop] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<DiaryEntryType>("diary");
    const [tripStopId, setTripStopId] = useState("");

    async function loadDiary() {
        const [tripData, placeData] = await Promise.all([
            getAllTrips(),
            getAllPlaces(),
        ]);

        const stopData = await Promise.all(
            tripData.map((trip) => getTripStops(trip.id))
        );

        const allStops = stopData.flat();

        const entryData = await Promise.all(
            allStops.map((stop) => getDiaryEntries(stop.id))
        );

        const allEntries = entryData.flat().map((entry) => {
            const stop = allStops.find((item) => item.id === entry.tripStopId);

            return {
                ...entry,
                place: placeData.find(
                    (place) => place.id === (entry.placeId ?? stop?.placeId)
                ),
                trip: tripData.find((trip) => trip.id === stop?.tripId),
            };
        });


        setTrips(tripData);
        setPlaces(placeData);
        setStops(allStops);
        setEntries(
            allEntries.sort((a, b) => b.date.localeCompare(a.date))
        );
        setLoading(false);
    }

    useEffect(() => {
        loadDiary();
    }, []);

    async function handleCreateEntry() {
        if (!title.trim() || !content.trim() || !date || !tripStopId) {
            return;
        }

        const stop = stops.find((item) => item.id === tripStopId);
        if (!stop) return;

        await createDiaryEntry({
            tripStopId,
            placeId: stop.placeId,
            date,
            title: title.trim(),
            content: content.trim(),
            type,
        });

        await loadDiary();

        setTitle("");
        setContent("");
        setDate("");
        setType("diary");
        setTripStopId("");
        setShowForm(false);
    }

    const filteredStops = stops.filter((stop) => {
        if (selectedTrip === "all") return true;
        return stop.tripId === selectedTrip;
    });

    const filteredEntries = entries.filter((entry) => {
        const stop = stops.find((item) => item.id === entry.tripStopId);

        const matchesTrip =
            selectedTrip === "all" || stop?.tripId === selectedTrip;

        const matchesStop =
            selectedStop === "all" || entry.tripStopId === selectedStop;

        return matchesTrip && matchesStop;
    });

    function formatDate(value: string) {
        return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    if (loading) {
        return <main className="p-8">Loading diary...</main>;
    }

    return (
        <main className="min-h-screen bg-[#f8f7f3] p-6 text-[#24382d] sm:p-10">
            <div className="mx-auto max-w-5xl">

                <header className="mb-10">
                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#788477]">
                        The stories behind the journey
                    </p>
                    <h1 className="text-4xl font-semibold">Travel diary</h1>
                    <p className="mt-3 text-[#788477]">
                        Memories, experiences and recommendations from your travels.
                    </p>
                </header>

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <select
                            value={selectedTrip}
                            onChange={(event) => {
                                setSelectedTrip(event.target.value);
                                setSelectedStop("all");
                            }}
                            className="rounded-lg border border-[#e5e5dc] bg-white p-3 text-sm"
                        >
                            <option value="all">All trips</option>
                            {trips.map((trip) => (
                                <option key={trip.id} value={trip.id}>
                                    {trip.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStop}
                            onChange={(event) => setSelectedStop(event.target.value)}
                            className="max-w-48 rounded-lg border border-[#e5e5dc] bg-white p-3 text-sm"
                        >
                            <option value="all">All destinations</option>
                            {filteredStops.map((stop) => (
                                <option key={stop.id} value={stop.id}>
                                    {places.find((place) => place.id === stop.placeId)?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-lg bg-[#24382d] px-5 py-3 text-sm text-white"
                    >
                        {showForm ? "Cancel" : "+ New entry"}
                    </button>
                </div>
               

                {showForm && (
                    <section className="mb-8 rounded-xl border border-[#e5e5dc] bg-white p-6">
                        <h2 className="mb-5 text-lg font-medium">Write a new entry</h2>

                        <div className="space-y-4">
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Give your entry a title"
                                className="w-full rounded-lg border p-3"
                            />

                            <select
                                value={type}
                                onChange={(event) =>
                                    setType(event.target.value as DiaryEntryType)
                                }
                                className="w-full rounded-lg border p-3"
                            >
                                <option value="diary">Diary</option>
                                <option value="memory">Memory</option>
                                <option value="recommendation">Recommendation</option>
                                <option value="tip">Travel tip</option>
                            </select>

                            <select
                                value={tripStopId}
                                onChange={(event) => {
                                    setTripStopId(event.target.value);
                                    setDate("");
                                }}
                                className="w-full rounded-lg border p-3"
                            >
                                <option value="">Choose a destination</option>
                                {stops.map((stop) => {
                                    const trip = trips.find(
                                        (item) => item.id === stop.tripId
                                    );
                                    const place = places.find(
                                        (item) => item.id === stop.placeId
                                    );

                                    return (
                                        <option key={stop.id} value={stop.id}>
                                            {trip?.name} — {place?.name}
                                        </option>
                                    );
                                })}
                            </select>

                            <input
                                type="date"
                                value={date}
                                min={stops.find((stop) => stop.id === tripStopId)?.arrivalDate}
                                max={stops.find((stop) => stop.id === tripStopId)?.departureDate}
                                onChange={(event) => setDate(event.target.value)}
                                className="w-full rounded-lg border p-3"
                            />

                            <textarea
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="Write about your experience..."
                                rows={6}
                                className="w-full resize-y rounded-lg border p-3"
                            />

                            <button
                                onClick={handleCreateEntry}
                                disabled={
                                    !title.trim() || !content.trim() || !date || !tripStopId
                                }
                                className="rounded-lg bg-[#24382d] px-5 py-3 text-sm text-white disabled:opacity-40"
                            >
                                Save entry
                            </button>
                        </div>
                    </section>
                )}


                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                        Your entries
                    </h2>
                    <span className="text-sm text-[#788477]">
                        {filteredEntries.length} entries
                    </span>
                </div>

                {filteredEntries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#d9ddd4] bg-white p-12 text-center">
                        <p className="text-lg font-medium">No entries yet</p>
                        <p className="mt-2 text-sm text-[#788477]">
                            Start capturing the moments that make your travels memorable.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEntries.map((entry) => (
                            <article
                                key={entry.id}
                                className="rounded-xl border border-[#e5e5dc] bg-white p-6"
                            >
                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                    <span className="rounded-full bg-[#edf1eb] px-3 py-1 text-xs capitalize text-[#435d49]">
                                        {entry.type}
                                    </span>
                                    <span className="text-sm text-[#788477]">
                                        {entry.trip?.name} · {entry.place?.name}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold">{entry.title}</h3>
                                <p className="mt-1 text-sm text-[#92978e]">
                                    {formatDate(entry.date)}
                                </p>
                                <p className="mt-4 whitespace-pre-wrap leading-7 text-[#536257]">
                                    {entry.content}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
