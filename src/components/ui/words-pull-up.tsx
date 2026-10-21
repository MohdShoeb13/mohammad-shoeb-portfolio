import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

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
              ease: EASE_OUT,
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
