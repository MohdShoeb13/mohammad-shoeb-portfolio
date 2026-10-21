import { motion } from "framer-motion";
import { metricsData, tickerTechnologies } from "@/data/portfolio-data";

export const MetricsSection = () => {
  return (
    <section id="facts" className="relative w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0c1220]/70 p-6 backdrop-blur-xs transition-colors hover:border-accent/40"
            >
              <div>
                <span className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-cream">
                  {item.number}
                </span>
                <p className="mt-3 text-sm font-medium text-cream/90 leading-snug">
                  {item.label}
                </p>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-white/40">
                {item.source}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-xs text-white/40">
          Selected outcomes reported in my resume.
        </p>
      </div>

      {/* Ticker marquee */}
      <div className="mt-14 w-full overflow-hidden border-y border-white/10 bg-black/40 py-3 backdrop-blur-xs">
        <div className="flex w-max animate-ticker">
          <ul className="flex items-center gap-8 whitespace-nowrap px-4 font-mono text-xs text-cream/70 sm:text-sm">
            {tickerTechnologies.map((tech, i) => (
              <li key={`tick1-${i}`} className="flex items-center gap-8">
                <span>{tech}</span>
                <span className="text-accent/40" aria-hidden="true">
                  ✦
                </span>
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-8 whitespace-nowrap px-4 font-mono text-xs text-cream/70 sm:text-sm">
            {tickerTechnologies.map((tech, i) => (
              <li key={`tick2-${i}`} className="flex items-center gap-8">
                <span>{tech}</span>
                <span className="text-accent/40" aria-hidden="true">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
