import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, Lock } from "lucide-react";
import { projectsData, type ProjectItem } from "@/data/portfolio-data";
import { AgentGraphFallback } from "@/components/three/agent-graph-fallback";
import { accentHex, topologyLabel } from "@/components/three/graph-layout";
import { TiltCard } from "@/components/ui/tilt-card";
import { useCanRender3D, useInViewport } from "@/lib/motion";

// Lazy, so three.js loads in its own chunk.
const AgentGraph = lazy(() => import("@/components/three/agent-graph"));

const accentClasses: Record<ProjectItem["accent"], { active: string; text: string }> = {
  coral: { active: "border-[#ff7a6b]/45", text: "text-[#ff7a6b]" },
  mint: { active: "border-[#52df9d]/45", text: "text-[#52df9d]" },
  cyan: { active: "border-[#4be1ec]/45", text: "text-[#4be1ec]" },
  lilac: { active: "border-[#a882ff]/45", text: "text-[#a882ff]" },
  amber: { active: "border-[#f5a623]/45", text: "text-[#f5a623]" },
};

const countWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export const ProjectsSection = () => {
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [scrollActive, setScrollActive] = useState(projectsData[0].id);
  const [preview, setPreview] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const canRender3D = useCanRender3D();
  const graphVisible = useInViewport(panelRef);

  const shownId = preview ?? scrollActive;
  const shown = projectsData.find((p) => p.id === shownId) ?? projectsData[0];

  // The card crossing the middle of the viewport drives the graph.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setScrollActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const el of Object.values(cardRefs.current)) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleNotes = (id: string) => {
    setOpenNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const count = countWords[projectsData.length] ?? String(projectsData.length);

  return (
    <section id="work" className="relative w-full py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
              Different problems.
              <br />
              Purpose-built agents.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {count} projects, from security remediation at EPAM to financial education and
              creative work. The graph takes the shape of each system as you read about it.
            </p>
          </div>

          {/* Jump chips: hovering or focusing one previews its graph */}
          <nav aria-label="Jump to a project" className="flex flex-wrap gap-2">
            {projectsData.map((project) => (
              <a
                key={project.id}
                href={`#${project.id}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(project.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setPreview(null)}
                onFocus={() => setPreview(project.id)}
                onBlur={() => setPreview(null)}
                onClick={() => setPreview(null)}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${
                  project.id === shownId
                    ? "border-white/30 text-cream"
                    : "border-white/10 text-cream/70 hover:border-white/30 hover:text-cream"
                }`}
              >
                {project.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* The graph: pinned beside the cards on desktop */}
          <aside className="lg:col-span-5" aria-label="Architecture graph">
            <div className="lg:sticky lg:top-16">
              <div
                ref={panelRef}
                className="relative h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#060a12] sm:h-[380px] lg:h-[calc(100svh-10rem)] lg:max-h-[640px]"
              >
                {canRender3D ? (
                  <Suspense fallback={<AgentGraphFallback project={shown} />}>
                    <AgentGraph project={shown} active={graphVisible} />
                  </Suspense>
                ) : (
                  <AgentGraphFallback project={shown} />
                )}
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <p className="flex items-center gap-2 text-sm font-medium text-cream">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: accentHex[shown.accent] }}
                  />
                  {shown.title}
                </p>
                <p className="text-xs leading-relaxed text-white/60">
                  {topologyLabel[shown.topology]}. {shown.flow.loop?.label ?? shown.flow.label}.
                </p>
                {canRender3D && (
                  <p className="font-mono text-[11px] text-white/40">Drag the graph to turn it.</p>
                )}
              </div>
            </div>
          </aside>

          {/* Project cards */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            {projectsData.map((project) => {
              const colors = accentClasses[project.accent];
              const isNotesOpen = !!openNotes[project.id];
              const isActive = project.id === shownId;

              return (
                <TiltCard
                  key={project.id}
                  id={project.id}
                  ref={(el) => {
                    cardRefs.current[project.id] = el;
                  }}
                  className={`relative flex scroll-mt-20 flex-col overflow-hidden rounded-2xl border bg-[#090e18]/80 backdrop-blur-md transition-colors duration-300 ${
                    isActive ? colors.active : "border-white/10"
                  }`}
                >
                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                      <span className={colors.text}>{project.category}</span>
                      {project.affiliation && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-0.5 text-white/70">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          {project.affiliation} · private
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-cream sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-cream/90">{project.tagline}</p>
                    <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-white/70">
                      {project.description}
                    </p>

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

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="font-mono text-xs text-white/60">{project.agentsCount}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {project.privateNote && (
                          <span className="font-mono text-xs text-white/60">{project.privateNote}</span>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-xs font-medium text-cream transition-colors hover:border-accent hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                          >
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#52df9d]" />
                            Live demo <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3.5 py-1.5 font-mono text-xs text-cream transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                          >
                            View GitHub <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      {project.liveNote && (
                        <p className="w-full font-mono text-[11px] leading-relaxed text-white/40">
                          {project.liveNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Architecture, as text: the graph's readable counterpart */}
                  <div className="relative z-10 mx-6 mb-6 rounded-xl border border-white/10 bg-black/40 p-4 sm:mx-8 sm:p-5">
                    <div className="flex flex-col gap-2.5">
                      <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center font-mono text-xs text-cream/90">
                        {project.flow.entry}
                      </div>
                      <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-accent/80">
                        <span aria-hidden="true" className="relative h-5 w-px overflow-hidden bg-accent/30">
                          {isActive && <span className="flow-pulse absolute top-0 left-0 h-2 w-px bg-cream" />}
                        </span>
                        {project.flow.transport}
                      </div>
                      <div className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-center font-mono text-xs font-medium text-cream">
                        {project.flow.router}
                      </div>
                      <p className="my-1 text-center font-mono text-[10px] tracking-wide text-white/50">
                        {project.flow.label}
                      </p>

                      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {project.flow.nodes.map((node) => (
                          <li
                            key={node.index}
                            className="flex flex-col justify-between rounded border border-white/10 bg-white/5 p-2.5"
                          >
                            <span className="font-mono text-[10px] text-accent/70">{node.index}</span>
                            <strong className="mt-1 text-xs text-cream">{node.title}</strong>
                            <span className="text-[10px] text-white/50">{node.detail}</span>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-2 rounded-md border border-white/5 bg-black/30 px-3 py-2 text-center font-mono text-[11px] text-white/50">
                        {project.flow.foundation}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible architecture notes */}
                  <div className="relative z-10 border-t border-white/10 bg-black/20 px-6 py-3 sm:px-8">
                    <button
                      type="button"
                      onClick={() => toggleNotes(project.id)}
                      className="flex w-full items-center justify-between py-1 text-left font-mono text-xs text-cream/80 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                      aria-expanded={isNotesOpen}
                      aria-controls={`${project.id}-notes`}
                    >
                      <span>Architecture notes and production considerations</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isNotesOpen ? "rotate-180 text-accent" : "text-white/40"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isNotesOpen && (
                        <motion.div
                          id={`${project.id}-notes`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 flex flex-col gap-3 border-t border-white/5 pt-3 pb-2 text-xs leading-relaxed text-white/70">
                            <ul className="list-disc space-y-1.5 pl-5">
                              {project.notes.points.map((pt) => (
                                <li key={pt.title}>
                                  <strong className="text-cream">{pt.title}</strong> {pt.desc}
                                </li>
                              ))}
                            </ul>
                            {project.notes.readmeUrl && (
                              <a
                                href={project.notes.readmeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 self-start font-mono text-xs text-accent hover:underline"
                              >
                                Read the full repository README <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-xs text-white/40">
          Architecture overviews come from each project's own README. The graph shows how each
          system is wired, not a live run.
        </p>
      </div>
    </section>
  );
};
