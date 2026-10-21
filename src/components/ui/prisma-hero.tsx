import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
export interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={isInView || reduceMotion ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {!isLast && <span className="sr-only"> </span>}
            {showAsterisk && isLast && (
              <span
                aria-hidden="true"
                className="absolute top-[0.6em] -right-[0.34em] text-[0.31em]"
              >
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </span>
  );
};

/* ---------------- Hero ---------------- */
const navItems = [
  { label: "Work", href: "#agents" },
  { label: "Experience", href: "#record" },
  { label: "Expertise", href: "#press" },
  { label: "Contact", href: "#emit" },
  { label: "Download CV", href: "/assets/mohammad-shoeb-resume.pdf", download: true },
];

export const PrismaHero = () => {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduceMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [reduceMotion]);

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section className="h-svh w-full p-2.5 sm:p-3 md:p-4">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-canvas md:rounded-[2rem]">
        {/* Background video (self-hosted) */}
        <video
          ref={videoRef}
          autoPlay={!reduceMotion}
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/hero.mp4"
        />

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay" />

        {/* Gradient overlay: protects bottom content band while keeping upper video visible */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,18,0.5) 0%, rgba(8,11,18,0.12) 30%, rgba(8,11,18,0.55) 55%, rgba(8,11,18,0.88) 78%, rgba(8,11,18,0.96) 100%)",
          }}
        />

        {/* Navbar */}
        <nav
          aria-label="Main navigation"
          className="absolute top-0 left-1/2 z-20 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-b-2xl bg-black/95 px-4 py-2 sm:gap-6 md:gap-10 md:rounded-b-3xl md:px-8 lg:gap-12 backdrop-blur-xs">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                download={item.download}
                className="text-cream/80 hover:text-cream focus-visible:text-cream text-[10px] font-medium tracking-wide transition-colors sm:text-xs md:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 md:px-10 md:pb-6">
          <div className="grid grid-cols-12 items-end gap-4 lg:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <p className="font-mono text-[11px] tracking-[0.14em] text-cream/70 uppercase sm:text-xs mb-2 md:mb-3">
                Agentic AI · Java · Enterprise systems
              </p>
              <h1 className="m-0 text-cream text-[clamp(40px,13vw,110px)] leading-[0.88] font-medium tracking-[-0.07em] lg:text-[clamp(46px,9.8vw,144px)]">
                <WordsPullUp text="Mohammad Shoeb" />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-4 pb-2 lg:col-span-4 lg:pb-4">
              <motion.p
                {...rise(0.5)}
                className="m-0 max-w-[44ch] text-xs leading-[1.5] text-cream/80 sm:text-sm md:text-base font-normal"
              >
                Agentic AI Engineer and Senior Java Full Stack Developer building
                multi-agent workflows and secure enterprise software.
              </motion.p>

              <motion.a
                {...rise(0.7)}
                href="#agents"
                className="group bg-cream focus-visible:outline-cream inline-flex items-center gap-2 self-start rounded-full py-1 pr-1 pl-5 text-sm font-medium text-black no-underline transition-all hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-base"
              >
                Explore my work
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="text-cream h-4 w-4" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaHero;
