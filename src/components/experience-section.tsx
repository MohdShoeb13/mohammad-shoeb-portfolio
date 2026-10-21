import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experienceData } from "@/data/portfolio-data";

export const ExperienceSection = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (company: string) => {
    setExpanded((prev) => ({ ...prev, [company]: !prev[company] }));
  };

  return (
    <section id="record" className="relative w-full py-16 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Experience / 2019—Present
        </span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
          Built in the real world.
        </h2>

        <div className="mt-12 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {experienceData.map((role, idx) => {
            const isRoleOpen = !!expanded[role.company];
            return (
              <motion.article
                key={role.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Company and dates */}
                <div className="md:col-span-4 flex flex-col">
                  <h3 className="font-display text-xl font-medium text-cream">{role.company}</h3>
                  <span className="mt-1 font-mono text-xs text-accent/80">{role.period}</span>
                </div>

                {/* Role details */}
                <div className="md:col-span-8 flex flex-col">
                  <h4 className="font-display text-lg font-medium text-cream/90">{role.title}</h4>
                  <ul className="mt-4 space-y-2 text-sm text-white/70 list-disc pl-5">
                    {role.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>

                  {/* Expandable deeper info */}
                  <div className="mt-6 border-t border-white/5 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(role.company)}
                      className="inline-flex items-center gap-2 font-mono text-xs text-cream/70 hover:text-cream transition-colors"
                      aria-expanded={isRoleOpen}
                    >
                      <span>More about this role</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isRoleOpen ? "rotate-180 text-accent" : "text-white/40"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
