import { secondaryWorkData } from "@/data/portfolio-data";

export const SecondaryWorkSection = () => {
  const single = secondaryWorkData.length === 1;

  return (
    <section id="more-work" className="relative w-full py-16 md:py-24 border-t border-white/10 bg-[#070b14]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-cream">
          More things I've built.
        </h2>

        <div className={`mt-8 grid grid-cols-1 gap-6 ${single ? "" : "md:grid-cols-2"}`}>
          {secondaryWorkData.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs ${
                single ? "md:flex-row md:items-center md:justify-between md:gap-10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg font-medium text-cream">{item.title}</h3>
                <span className="font-mono text-[11px] rounded-full border border-white/10 px-2.5 py-0.5 text-white/60">
                  {item.badge}
                </span>
              </div>
              <p className="max-w-[60ch] text-sm text-white/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
