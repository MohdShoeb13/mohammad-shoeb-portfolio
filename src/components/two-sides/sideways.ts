import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

/**
 * Sideways scrolling, driven by the vertical scroll. The section is made as tall as
 * the row is wide, pinned, and the row slides left as the visitor scrolls down. This
 * runs on phones too: a hidden sideways swipe row inside a page that scrolls down
 * reads as broken there. Only with reduced motion is it a plain row that swipes.
 *
 * The row does not follow the scroll one-to-one. A mouse wheel scrolls in steps, and
 * a row tied straight to it moves in the same jolts. Instead `x` is a spring that
 * chases the scroll position: it catches up in about half a second and never
 * overshoots, so the row glides.
 *
 * The target is a function transform, so it stays on the JavaScript clock (see story.tsx).
 */
export const useSideways = (
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
): { driven: boolean; travel: number; x: MotionValue<number> } => {
  const reduceMotion = !!useReducedMotion();
  const [travel, setTravel] = useState(0);
  const driven = !reduceMotion;

  // How far the row has to travel. This runs again when the layout switches, because
  // the pinned layout changes the row's padding, and it watches the row itself, so
  // late images, font swaps and window resizes are all picked up. Measuring only once,
  // before the pinned layout, left the row stopping short of its end.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [trackRef, driven]);

  const travelRef = useRef(0);
  useEffect(() => {
    travelRef.current = travel;
  }, [travel]);

  // Progress through the section is read from where the section is right now, on each
  // scroll. The library's own per-section progress caches the section's position, and
  // that cache went stale when the rows above finished measuring and changed height:
  // the row then started late and stopped short.
  //
  // The section is pinned for exactly `travel` pixels of scroll, so that is the range.
  // Section height minus the window height is not: on a phone the window grows when
  // the address bar hides, while the section is sized in svh, and the row would then
  // reach its end early and sit there.
  const { scrollY } = useScroll();
  const target = useTransform(scrollY, () => {
    const section = sectionRef.current;
    const range = travelRef.current;
    if (!section || range <= 0) return 0;
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
    return -progress * range;
  });
  // Slightly over-damped: quick to follow, with no bounce at either end.
  const x = useSpring(target, { stiffness: 120, damping: 26, mass: 1 });

  return { driven, travel, x };
};
