import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Award } from "lucide-react";
import { skillCategoriesData, educationData, certificationsData } from "@/data/portfolio-data";
import { ProviderIcon } from "@/components/ui/provider-icon";

export const ExpertiseSection = () => {
  const [certsOpen, setCertsOpen] = useState(true);

  return (
    <section id="press" className="relative w-full py-16 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Expertise / Continuous learning
        </span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
          AI-native thinking.
          <br />
          Enterprise engineering depth.
        </h2>

        {/* 3 Skill Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategoriesData.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-white/10 bg-[#090e18]/60 p-6 backdrop-blur-xs"
            >
              <h3 className="font-display text-lg font-medium text-cream border-b border-white/10 pb-3">
                {category.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-cream/90 transition-colors hover:border-accent hover:text-accent"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education Timeline */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6">
            Formal Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationData.map((edu) => (
              <div
                key={edu.degree}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div>
                  <span className="font-mono text-xs text-accent/80">
                    Education / {edu.index}
                  </span>
                  <h4 className="mt-2 font-display text-lg font-medium text-cream">
                    {edu.degree}
                  </h4>
                  <p className="mt-1 text-sm text-white/70">{edu.institution}</p>
                </div>
                <span className="mt-4 font-mono text-xs text-white/40">{edu.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Drawer Accordion with Official Provider Icons */}
        <div className="mt-12 rounded-xl border border-white/10 bg-[#070b14] p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setCertsOpen(!certsOpen)}
            className="flex w-full items-center justify-between text-left font-mono text-xs sm:text-sm text-cream hover:text-accent transition-colors"
            aria-expanded={certsOpen}
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span>Industry Certifications listed in my resume ({certificationsData.length})</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                certsOpen ? "rotate-180 text-accent" : "text-white/40"
              }`}
            />
          </button>

          <AnimatePresence>
            {certsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-white/10 pt-5">
                  {certificationsData.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 rounded-lg border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-accent/40"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black/50 p-1 border border-white/10">
                        <ProviderIcon provider={cert.provider} className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-cream leading-snug">
                          {cert.title}
                        </span>
                        <span className="mt-1 font-mono text-[11px] text-accent/80">
                          {cert.providerFull}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
