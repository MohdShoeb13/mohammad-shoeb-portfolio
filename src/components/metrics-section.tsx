import { metricsData } from "@/data/portfolio-data";

// Outcomes as ledger entries on the paper ground: a figure, what it measures, where it happened.
// Deliberately still. No counters, no cards.
export const OutcomesLedger = () => {
  return (
    <div>
      <dl className="m-0 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {metricsData.map((item) => {
          const long = item.number.length > 6;
          return (
            <div key={item.label} className="flex flex-col border-t border-ink/25 pt-4 pb-10">
              <dt className="order-2 mt-3 max-w-[30ch] text-base leading-snug text-ink/85">
                {item.label}
              </dt>
              <dd
                className={`statement order-1 m-0 flex items-end text-ink sm:min-h-[clamp(62px,7.6vw,104px)] ${
                  long ? "text-[clamp(34px,4vw,52px)] leading-[1.15]" : "text-[clamp(56px,7vw,96px)]"
                }`}
              >
                {item.number}
              </dd>
              <dd className="order-3 m-0 mt-3 font-mono text-xs text-ink/60">{item.source}</dd>
            </div>
          );
        })}
      </dl>
      <p className="m-0 border-t border-ink/25 pt-4 font-mono text-xs text-ink/60">
        Figures as reported in my CV.
      </p>
    </div>
  );
};
