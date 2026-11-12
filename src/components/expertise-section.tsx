import {
  certificationCount,
  certificationsData,
  educationData,
  skillCategoriesData,
} from "@/data/portfolio-data";
import { ProviderIcon } from "@/components/ui/provider-icon";

// The toolkit, still on paper: a table to scan, not a wall of chips.
export const ExpertiseSection = () => {
  return (
    <section id="expertise" className="relative w-full border-t border-ink/25 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <h2 className="statement m-0 text-[clamp(36px,5.6vw,84px)] text-ink">
          AI-native thinking.
          <br />
          Enterprise engineering depth.
        </h2>

        {/* Skills */}
        <dl className="m-0 mt-14 md:mt-20">
          {skillCategoriesData.map((category) => (
            <div
              key={category.title}
              className="grid grid-cols-1 gap-1 border-t border-ink/25 py-4 sm:grid-cols-12 sm:gap-6 sm:py-5"
            >
              <dt className="text-base font-semibold text-ink sm:col-span-4 lg:col-span-3">
                {category.title}
              </dt>
              <dd className="m-0 text-base leading-relaxed text-ink/85 sm:col-span-8 lg:col-span-9">
                {category.skills.join(", ")}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid grid-cols-1 gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Education */}
          <div className="lg:col-span-5">
            <h3 className="statement m-0 text-3xl text-ink sm:text-4xl">Education</h3>
            <ul className="m-0 mt-6 list-none p-0">
              {educationData.map((edu) => (
                <li key={edu.degree} className="border-t border-ink/25 py-5">
                  <p className="m-0 text-lg font-semibold text-ink">{edu.degree}</p>
                  <p className="m-0 mt-1 text-base text-ink/80">{edu.institution}</p>
                  <p className="m-0 mt-2 font-mono text-xs text-ink/60">{edu.period}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications, grouped by who issued them */}
          <div className="lg:col-span-7">
            <h3 className="statement m-0 text-3xl text-ink sm:text-4xl">
              Certifications
              <span className="ml-3 align-middle font-mono text-sm tracking-normal text-ink/60">
                {certificationCount}
              </span>
            </h3>
            <ul className="m-0 mt-6 list-none p-0">
              {certificationsData.map((group) => (
                <li
                  key={group.provider}
                  className="grid grid-cols-12 gap-4 border-t border-ink/25 py-5"
                >
                  <div className="col-span-12 flex items-center gap-2.5 text-ink sm:col-span-4">
                    {/* A fixed slot, so the names line up whatever the logo's shape; the AWS wordmark is wide */}
                    <span className="flex w-8 shrink-0 items-center">
                      <ProviderIcon
                        provider={group.provider}
                        className={group.provider === "AWS" ? "h-5 w-8" : "h-4 w-4"}
                      />
                    </span>
                    <span className="text-base font-semibold">{group.providerFull}</span>
                  </div>
                  <ul className="col-span-12 m-0 list-none space-y-1.5 p-0 text-base leading-snug text-ink/85 sm:col-span-8">
                    {group.titles.map((title) => (
                      <li key={title}>{title}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
