import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { quickFacts, statement, tickerTechnologies } from "@/data/portfolio-data";

const words = statement.split(" ");

/** One word of the statement. It brightens as the reader scrolls past it. */
const Word = ({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) => {
  const start = index / words.length;
  const end = Math.min(1, start + 4 / words.length);
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
};

// The quiet beat between the hero and the Work section: who is speaking, in one breath.
export const IntroSection = () => {
  const reduceMotion = useReducedMotion();
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 85%", "end 50%"],
  });

  return (
    <section id="about" className="relative w-full pt-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <p
          ref={textRef}
          className="statement m-0 max-w-[24ch] text-[clamp(30px,5.2vw,76px)] text-cream"
        >
          {reduceMotion
            ? statement
            : words.map((word, i) => (
                <Word key={`${i}-${word}`} word={word} index={i} progress={scrollYProgress} />
              ))}
        </p>

        <dl className="mt-14 grid grid-cols-1 border-t border-white/15 md:mt-20 md:grid-cols-3">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-white/15 py-5 md:border-b-0 md:py-6 md:pr-10"
            >
              <dt className="font-mono text-xs text-accent">{fact.label}</dt>
              <dd className="m-0 mt-2 max-w-[38ch] text-sm leading-relaxed text-cream/80 sm:text-base">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Technology ribbon. Decorative: the real list is in the Expertise section. */}
      <div
        aria-hidden="true"
        className="mt-16 w-full overflow-hidden border-y border-white/10 py-5 md:mt-24 md:py-7"
      >
        <div className="flex w-max animate-ticker">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="m-0 flex list-none items-center gap-8 pr-8 pl-0 whitespace-nowrap text-2xl font-normal tracking-tight text-cream/60 sm:text-3xl md:gap-12 md:pr-12 md:text-4xl"
            >
              {tickerTechnologies.map((tech) => (
                <li key={`${copy}-${tech}`} className="flex items-center gap-8 md:gap-12">
                  <span>{tech}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};
