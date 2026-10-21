import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useState } from "react";

interface TiltCardProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const spring = { stiffness: 160, damping: 22, mass: 0.4 };

/**
 * An article that tilts toward the pointer with a soft highlight under it.
 * Only for fine pointers with motion allowed; otherwise it is a plain article.
 */
export const TiltCard = ({ id, className = "", children, ref }: TiltCardProps) => {
  const reduceMotion = useReducedMotion();
  const [finePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const enabled = finePointer && !reduceMotion;

  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, spring);
  const glare = useMotionTemplate`radial-gradient(480px circle at ${glareX}% ${glareY}%, rgba(225,224,204,0.07), transparent 60%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 5);
    rotateX.set(-(py - 0.5) * 4);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  if (!enabled) {
    return (
      <article ref={ref} id={id} className={className}>
        {children}
      </article>
    );
  }

  return (
    <motion.article
      ref={ref}
      id={id}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: glare, opacity: glareOpacity }}
      />
      {children}
    </motion.article>
  );
};
