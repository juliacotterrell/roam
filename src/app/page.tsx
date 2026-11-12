
const stats = [
  { label: "Total budget", value: "R 30,000", detail: "Your trip allowance" },
  { label: "Spent so far", value: "R 12,450", detail: "41.5% of your budget" },
  { label: "Remaining", value: "R 17,550", detail: "Available to spend" },
  { label: "Daily allowance", value: "R 585", detail: "Based on remaining trip days" },
];

const destinations = [
  { place: "Hanoi", country: "Vietnam", dates: "12–17 November", status: "Current stop" },
  { place: "Luang Prabang", country: "Laos", dates: "18–23 November", status: "Upcoming" },
  { place: "Bangkok", country: "Thailand", dates: "24–29 November", status: "Upcoming" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f0] text-[#243b32]">
      <nav className="flex items-center justify-between border-b border-[#e5e5dc] px-6 py-5 md:px-12">
        <div className="text-2xl font-semibold tracking-tight">roam<span className="text-[#a4a98b]">.</span></div>
        <div className="hidden gap-8 text-sm text-[#65736a] md:flex">
          <a className="text-[#243b32] font-medium" href="/">Overview</a>
          <a href="/expenses">Expenses</a>
          <a href="/journey">Journey</a>
          <a href="/notes">Travel notes</a>
        </div>
        <div className="text-sm text-[#65736a]">My trip ↗</div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-14">
        <section className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a967b]">
            Your travel companion
          </p>
          <h1 className="mb-3 text-4xl font-light tracking-tight md:text-5xl">
            A little further, <span className="font-semibold">every day.</span>
          </h1>
          <p className="max-w-xl text-sm leading-6 text-[#758077]">
            Keep track of where you’re going, what you’re spending and everything
            worth remembering along the way.
          </p>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your finances</h2>
            <a href="/expenses" className="text-sm text-[#71816e] hover:underline">
              View expenses →
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[#e7e6dc] bg-white/70 p-5">
                <p className="mb-4 text-xs text-[#849087]">{stat.label}</p>
                <p className="mb-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-xs text-[#9a9f95]">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">The journey</h2>
              <a href="/journey" className="text-sm text-[#71816e] hover:underline">
                View itinerary →
              </a>
            </div>
            <div className="rounded-xl border border-[#e7e6dc] bg-white/70 p-6">
              {destinations.map((destination, index) => (
                <div key={destination.place} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1 h-3 w-3 rounded-full ${index === 0 ? "bg-[#71876b]" : "border-2 border-[#c8cdbd]"}`} />
                    {index !== destinations.length - 1 && <div className="my-2 min-h-12 w-px bg-[#dfe2d8]" />}
                  </div>
                  <div className="pb-5">
                    <p className="font-medium">{destination.place}</p>
                    <p className="text-sm text-[#849087]">{destination.country} · {destination.dates}</p>
                    <p className="mt-1 text-xs text-[#9a9f95]">{destination.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Travel diary</h2>
            <a href="/diary" className="text-sm text-[#71816e] hover:underline">
              View diary →
            </a>
          </div>
          <div className="flex min-h-48 flex-col justify-between rounded-xl bg-[#e9ecdf] p-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7c8b72]">
                The stories along the way
              </p>
              <p className="text-lg font-medium leading-7">
                Keep the places, people and little moments you'll want to remember.
              </p>
            </div>
            <a href="/diary" className="mt-6 text-sm font-medium text-[#52684e]">
              Explore your diary →
            </a>
          </div>
        </div>
        </section>

        <footer className="mt-16 border-t border-[#e5e5dc] pt-6 text-xs text-[#9a9f95]">
          Made for the journey. Wherever it takes you.
        </footer>
      </div>
    </main>
  );
}
