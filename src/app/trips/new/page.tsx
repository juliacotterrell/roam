"use client";

import { useState } from "react";
import Link from "next/link";
import { createTrip } from "@/features/travel/travel_service";

export default function NewTripPage() {
  const [saving, setSaving] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/journey"
          className="text-sm text-[#788477] hover:underline"
        >
          ← Back to Journey
        </Link>

        <h1 className="mt-6 text-3xl font-semibold text-[#263b2d]">
          Plan a new trip
        </h1>

        <p className="mt-2 text-sm text-[#788477]">
          Add a new trip to your travel history.
        </p>
      </div>
      <form
  onSubmit={async (event) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      await createTrip({
        name: String(formData.get("name")).trim(),
        startDate: String(formData.get("startDate")),
        endDate: String(formData.get("endDate")),
        homeCurrency: String(formData.get("homeCurrency")),
        budget: formData.get("budget")
          ? Number(formData.get("budget"))
          : undefined,
      });

      window.location.href = "/journey";
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Could not create trip."
      );
    } finally {
      setSaving(false);
    }
  }}
  className="mt-8 space-y-5"
>
  <div>
    <label className="mb-1 block text-sm font-medium text-[#263b2d]">
      Trip name
    </label>
    <input
      name="name"
      required
      placeholder="e.g. South America 2027"
      className="w-full rounded-lg border border-[#dce2d8] bg-white p-3 text-sm"
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="mb-1 block text-sm font-medium text-[#263b2d]">
        Start date
      </label>
      <input
        name="startDate"
        type="date"
        required
        className="w-full rounded-lg border border-[#dce2d8] bg-white p-3 text-sm"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-[#263b2d]">
        End date
      </label>
      <input
        name="endDate"
        type="date"
        required
        className="w-full rounded-lg border border-[#dce2d8] bg-white p-3 text-sm"
      />
    </div>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium text-[#263b2d]">
      Home currency
    </label>
    <select
      name="homeCurrency"
      defaultValue="ZAR"
      className="w-full rounded-lg border border-[#dce2d8] bg-white p-3 text-sm"
    >
      <option value="ZAR">ZAR — South African Rand</option>
      <option value="USD">USD — US Dollar</option>
      <option value="GBP">GBP — British Pound</option>
      <option value="EUR">EUR — Euro</option>
    </select>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium text-[#263b2d]">
      Budget (optional)
    </label>
    <input
      name="budget"
      type="number"
      min="0"
      step="0.01"
      placeholder="e.g. 25000"
      className="w-full rounded-lg border border-[#dce2d8] bg-white p-3 text-sm"
    />
  </div>

  <button
    type="submit"
    disabled={saving}
    className="rounded-lg bg-[#365442] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
  >
    {saving ? "Creating trip..." : "Create trip"}
  </button>
</form>
    </main>
  );
}