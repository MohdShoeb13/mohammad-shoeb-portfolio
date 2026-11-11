import { experienceData } from "@/data/portfolio-data";
import { OutcomesLedger } from "@/components/metrics-section";

// The record, on paper: outcomes first, then the roles that produced them.
// Everything is visible. Nothing a recruiter needs sits behind a toggle.
export const ExperienceSection = () => {
  return (
    <section id="experience" className="relative w-full py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <h2 className="statement m-0 text-[clamp(44px,8vw,120px)] text-ink">
          Built in the
          <br />
          real world.
        </h2>
        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink/80 sm:text-lg">
          Seven years at three companies. Most of that time went into systems for two
          financial institutions, where an outage or a wrong number has a cost.
        </p>

        <div className="mt-14 md:mt-20">
          <OutcomesLedger />
        </div>

        <ol className="m-0 mt-20 list-none p-0 md:mt-28">
          {experienceData.map((role) => (
            <li key={role.company}>
              <article className="grid grid-cols-1 gap-6 border-t border-ink/25 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <header className="md:col-span-4">
                  <h3 className="statement m-0 text-4xl text-ink sm:text-5xl">{role.company}</h3>
                  {role.client && (
                    <p className="m-0 mt-2 text-base text-ink/80">for {role.client}</p>
                  )}
                  <p className="m-0 mt-4 font-mono text-xs leading-relaxed text-ink/65">
                    {role.period}
                    <br />
                    {role.location}
                  </p>
                </header>

                <div className="md:col-span-8">
                  <h4 className="m-0 text-lg font-semibold text-ink sm:text-xl">{role.title}</h4>
                  {role.note && <p className="m-0 mt-1 text-sm text-cobalt">{role.note}</p>}
                  <ul className="m-0 mt-5 max-w-[68ch] list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-ink/85 marker:text-cobalt sm:text-base">
                    {role.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
