import { secondaryWorkData } from "@/data/portfolio-data";

// Two smaller builds with no public repo. Rows, not cards: they support the Work section.
export const SecondaryWorkSection = () => {
  return (
    <section id="more-work" className="relative w-full border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h2 className="statement m-0 text-[clamp(32px,4.4vw,64px)] text-cream">Also built.</h2>

        <ul className="m-0 mt-10 list-none p-0">
          {secondaryWorkData.map((item) => (
            <li
              key={item.title}
              className="grid grid-cols-1 gap-4 border-t border-white/15 py-8 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-4">
                <h3 className="m-0 text-xl font-medium text-cream sm:text-2xl">{item.title}</h3>
                <p className="m-0 mt-2 font-mono text-xs text-white/55">{item.badge}</p>
              </div>
              <div className="md:col-span-8">
                <p className="m-0 max-w-[64ch] text-base leading-relaxed text-white/75">
                  {item.description}
                </p>
                <p className="m-0 mt-4 font-mono text-xs text-accent/85">{item.stack.join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
