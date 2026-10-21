import { metricsData, tickerTechnologies } from "@/data/portfolio-data";

// Deliberately still: this is the quiet beat before the Work section's graph.
export const MetricsSection = () => {
  return (
    <section id="metrics" className="relative w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((item) => (
            <div
              key={item.label}
              className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0c1220]/70 p-6 backdrop-blur-xs"
            >
              <div>
                <span className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-cream">
                  {item.number}
                </span>
                <p className="mt-3 text-sm font-medium text-cream/90 leading-snug">
                  {item.label}
                </p>
              </div>
              <p className="mt-6 text-xs text-white/45">{item.source}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-white/40">
          Selected outcomes reported in my resume.
        </p>
      </div>

      {/* Ticker marquee */}
      <div
        aria-hidden="true"
        className="mt-14 w-full overflow-hidden border-y border-white/10 bg-black/40 py-3 backdrop-blur-xs"
      >
        <div className="flex w-max animate-ticker">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center gap-8 whitespace-nowrap px-4 font-mono text-xs text-cream/70 sm:text-sm"
            >
              {tickerTechnologies.map((tech) => (
                <li key={`${copy}-${tech}`} className="flex items-center gap-8">
                  <span>{tech}</span>
                  <span className="text-accent/40">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};
