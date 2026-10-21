import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { contactInfo } from "@/data/portfolio-data";

const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "expertise", label: "Expertise" },
  { id: "contact", label: "Contact" },
];

const linkClass =
  "relative rounded-sm whitespace-nowrap text-[10px] font-medium tracking-wide transition-colors sm:text-xs md:text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream";

export const SiteNav = () => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // The section crossing the middle band of the viewport is the current one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-14 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      )}

      <nav aria-label="Main navigation" className="fixed top-0 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-2.5 rounded-b-2xl bg-black/80 px-3 py-2 sm:px-4 backdrop-blur-md sm:gap-6 md:gap-10 md:rounded-b-3xl md:px-8 lg:gap-12">
          {sections.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`${linkClass} ${isActive ? "text-cream" : "text-cream/70 hover:text-cream"}`}
              >
                {label}
                {isActive &&
                  (reduceMotion ? (
                    <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-px bg-accent" />
                  ) : (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ))}
              </a>
            );
          })}
          <a
            href={contactInfo.resumeUrl}
            download
            className={`${linkClass} text-cream/70 hover:text-cream`}
          >
            Download CV
          </a>
        </div>
      </nav>
    </>
  );
};
