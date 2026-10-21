import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experienceData } from "@/data/portfolio-data";

export const ExperienceSection = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  // The timeline draws itself as the reader moves down the roles.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 60%"],
  });

  const toggleExpand = (company: string) => {
    setExpanded((prev) => ({ ...prev, [company]: !prev[company] }));
  };

  return (
    <section id="experience" className="relative w-full py-16 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h2 className="font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
          Built in the real world.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Three companies, from 2019 to today.
        </p>

        <ol ref={listRef} className="relative mt-12">
          {/* Timeline rail, and the part of it the reader has passed */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-white/10" />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-accent"
            style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
          />

          {experienceData.map((role, idx) => {
            const isRoleOpen = !!expanded[role.company];
            const detailsId = `role-${idx}-details`;
            return (
              <li key={role.company} className="relative pl-10 md:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute top-10 left-0 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent/60 bg-canvas sm:top-12"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>

                <article className="grid grid-cols-1 gap-6 border-b border-white/10 py-8 sm:py-10 md:grid-cols-12">
                  {/* Company and dates */}
                  <div className="md:col-span-4 flex flex-col">
                    <h3 className="font-display text-xl font-medium text-cream">{role.company}</h3>
                    <span className="mt-1 font-mono text-xs text-accent/80">{role.period}</span>
                  </div>

                  {/* Role details */}
                  <div className="md:col-span-8 flex flex-col">
                    <h4 className="font-display text-lg font-medium text-cream/90">{role.title}</h4>
                    <ul className="mt-4 space-y-2 text-sm text-white/70 list-disc pl-5">
                      {role.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>

                    {/* Expandable deeper info */}
                    <div className="mt-6 border-t border-white/5 pt-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(role.company)}
                        className="inline-flex items-center gap-2 rounded-sm font-mono text-xs text-cream/70 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                        aria-expanded={isRoleOpen}
                        aria-controls={detailsId}
                      >
                        <span>More about this role</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isRoleOpen ? "rotate-180 text-accent" : "text-white/40"
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isRoleOpen && (
                          <motion.div
                            id={detailsId}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 text-xs leading-relaxed text-white/60 bg-white/5 rounded-lg p-4 border border-white/5">
                              {role.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
