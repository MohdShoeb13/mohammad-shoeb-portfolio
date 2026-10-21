import { useReducedMotion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

/** The easing curve shared by every transition on the page. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

let webglSupport: boolean | undefined;

const detectWebGL = (): boolean => {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
};

/**
 * True only when a WebGL scene should mount: the browser supports WebGL and the
 * visitor has not asked for reduced motion.
 */
export const useCanRender3D = (): boolean => {
  const reduceMotion = useReducedMotion();
  const [supported] = useState(() => typeof document !== "undefined" && detectWebGL());
  return supported && !reduceMotion;
};

/**
 * Whether the element is on screen and the tab is visible. Canvases use it to
 * stop rendering when nobody can see them.
 */
export const useInViewport = (
  ref: RefObject<Element | null>,
  rootMargin = "100px",
): boolean => {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return inView && pageVisible;
};
