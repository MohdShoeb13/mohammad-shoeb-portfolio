import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown } from "lucide-react";
import { projectsData, type ProjectItem } from "@/data/portfolio-data";

const accentClasses: Record<ProjectItem["accent"], { border: string; glow: string; text: string }> = {
  mint: { border: "hover:border-[#52df9d]/50", glow: "from-[#52df9d]/10", text: "text-[#52df9d]" },
  cyan: { border: "hover:border-[#4be1ec]/50", glow: "from-[#4be1ec]/10", text: "text-[#4be1ec]" },
  lilac: { border: "hover:border-[#a882ff]/50", glow: "from-[#a882ff]/10", text: "text-[#a882ff]" },
  amber: { border: "hover:border-[#f5a623]/50", glow: "from-[#f5a623]/10", text: "text-[#f5a623]" },
};

export const ProjectsSection = () => {
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});

  const toggleNotes = (id: string) => {
    setOpenNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="agents" className="relative w-full py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-2 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Selected work / Agentic systems
              </span>
              <span className="font-mono text-xs text-white/40">01</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
              Different problems.
              <br />
              Purpose-built agents.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Four projects, from financial education to creative work. Explore what each system
              does — and the architecture behind it.
            </p>
          </div>

          {/* Quick jump anchors */}
          <nav aria-label="Featured projects jump" className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            {projectsData.map((project) => (
              <a
                key={project.id}
                href={`#${project.id}`}
                className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-cream/70 transition-colors hover:border-accent hover:text-cream"
              >
                {project.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Project cards */}
        <div className="mt-12 flex flex-col gap-12 sm:gap-16">
          {projectsData.map((project, idx) => {
            const colors = accentClasses[project.accent];
            const isNotesOpen = !!openNotes[project.id];

            return (
              <motion.article
                key={project.id}
                id={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#090e18]/80 backdrop-blur-md transition-all duration-300 ${colors.border}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10">
                  {/* Left Column: Copy & Stack */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-white/50">
                        <span className={colors.text}>{project.category}</span>
                        <span>{project.index}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl sm:text-3xl font-medium tracking-tight text-cream">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-cream/90">{project.tagline}</p>
                      <p className="mt-4 text-sm leading-relaxed text-white/70">
                        {project.description}
                      </p>

                      {/* Tech stack badges */}
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-cream/80"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="font-mono text-xs text-white/60">{project.agentsCount}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-xs font-medium text-cream transition-colors hover:border-accent hover:bg-accent/20"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#52df9d] shadow-[0_0_6px_#52df9d]"
                          />
                          Live demo <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3.5 py-1.5 font-mono text-xs text-cream transition-colors hover:border-accent hover:bg-accent/10"
                        >
                          View GitHub <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      {project.liveNote && (
                        <p className="w-full font-mono text-[11px] leading-relaxed text-white/40">
                          {project.liveNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Interactive Architecture Flow */}
                  <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-5 sm:p-6">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                          System architecture
                        </span>
                        <span className="font-mono text-xs text-accent">↘</span>
                      </div>

                      {/* Flow Layers */}
                      <div className="mt-4 flex flex-col gap-2.5">
                        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center font-mono text-xs text-cream/90">
                          {project.flow.entry}
                        </div>
                        <div className="text-center font-mono text-[11px] text-accent/80">
                          ↓ {project.flow.transport}
                        </div>
                        <div className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-center font-mono text-xs font-medium text-cream">
                          {project.flow.router}
                        </div>
                        <p className="my-1 text-center font-mono text-[10px] uppercase tracking-wider text-white/40">
                          {project.flow.label}
                        </p>

                        {/* Specialist nodes grid */}
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {project.flow.nodes.map((node) => (
                            <div
                              key={node.index}
                              className="flex flex-col justify-between rounded border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/25"
                            >
                              <span className="font-mono text-[10px] text-accent/70">
                                {node.index}
                              </span>
                              <strong className="mt-1 text-xs text-cream">{node.title}</strong>
                              <span className="text-[10px] text-white/50">{node.detail}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 rounded-md border border-white/5 bg-black/30 px-3 py-2 text-center font-mono text-[11px] text-white/50">
                          {project.flow.foundation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Architecture Notes */}
                <div className="border-t border-white/10 bg-black/20 px-6 sm:px-8 py-3">
                  <button
                    type="button"
                    onClick={() => toggleNotes(project.id)}
                    className="flex w-full items-center justify-between py-1 text-left font-mono text-xs text-cream/80 hover:text-cream transition-colors"
                    aria-expanded={isNotesOpen}
                  >
                    <span>Architecture notes & production considerations</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isNotesOpen ? "rotate-180 text-accent" : "text-white/40"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isNotesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-2 flex flex-col gap-3 text-xs text-white/70 leading-relaxed border-t border-white/5 mt-2">
                          <ul className="list-disc pl-5 space-y-1.5">
                            {project.notes.points.map((pt, i) => (
                              <li key={i}>
                                <strong className="text-cream">{pt.title}</strong> {pt.desc}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={project.notes.readmeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline self-start mt-1"
                          >
                            Read the complete repository README <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-white/40">
          Architecture overviews distilled from the linked repository READMEs. Diagrams describe system design, not live executions.
        </p>
      </div>
    </section>
  );
};
