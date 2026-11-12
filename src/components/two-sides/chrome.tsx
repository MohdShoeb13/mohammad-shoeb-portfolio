import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { contactInfo, pageSections } from "@/data/portfolio-data";
import { Mark } from "@/components/two-sides/art";

const LOAD_MS = 1500;

/** The opening screen: the mark, and a count to 100 while the page gets ready. */
export const Loader = () => {
  const reduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / LOAD_MS);
      // Ease out, so the count slows as it lands.
      setPercent(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(step);
      else window.setTimeout(() => setDone(true), 180);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] bg-paper text-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -mt-10 -ml-10 text-front"
            animate={{ rotate: 360 }}
            transition={{ duration: LOAD_MS / 1000, ease: "easeInOut" }}
          >
            <Mark className="h-20 w-20" />
          </motion.div>
          <p className="label absolute bottom-8 left-6 m-0 text-ink/60 sm:left-10">
            {contactInfo.name}, New Delhi
          </p>
          <p className="display absolute right-6 bottom-6 m-0 text-[clamp(44px,6vw,72px)] font-normal tabular-nums sm:right-10">
            {percent}
            <span className="align-top text-[0.28em] text-front">%</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const delhiTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(new Date());

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

/**
 * The header and scroll progress. It uses a difference blend, so the same white
 * text reads dark over paper and light over night.
 */
export const Header = () => {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(delhiTime);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    const timer = window.setInterval(() => setTime(delhiTime()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to the work
      </a>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-front"
          style={{ scaleX: progress }}
        />
      )}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-5 py-5 text-white mix-blend-difference sm:px-10 sm:py-7">
        <a
          href="#top"
          className="pointer-events-auto flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Mark className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="display flex flex-col text-[15px] leading-[0.95] sm:text-[19px]">
            <span>Mohammad</span>
            <span className="font-normal">Shoeb</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="pointer-events-auto flex items-center gap-3 sm:gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`label rounded-sm text-[10px] text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[11px] ${
                link.href === "#experience" ? "hidden sm:inline" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          <span className="label hidden items-center gap-2 border-l border-white/30 pl-8 text-white/80 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            New Delhi {time}
          </span>
        </nav>
      </header>
    </>
  );
};

/** The numbered index down the right edge. It marks the section in view. */
export const SideIndex = () => {
  const [active, setActive] = useState(pageSections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of pageSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 right-6 z-[60] hidden -translate-y-1/2 text-white mix-blend-difference md:block"
    >
      <ol className="m-0 flex list-none flex-col items-end gap-3 p-0">
        {pageSections.map((section, i) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-label={section.label}
                aria-current={isActive ? "location" : undefined}
                className={`label flex items-center gap-3 rounded-sm transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive ? "opacity-100" : "opacity-45 hover:opacity-100"
                }`}
              >
                <span className="text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`block h-px bg-white transition-[width] duration-300 ${isActive ? "w-10" : "w-4"}`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
