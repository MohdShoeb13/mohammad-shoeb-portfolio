import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { storyBeats } from "@/data/portfolio-data";
import { BackArt, Figure, FrontArt, SidesPill } from "@/components/two-sides/art";

/*
 * The opening story, told on one pinned screen as the visitor scrolls:
 *
 *   1. Every system has two sides.   The screen is split: paper front, night back.
 *   2. Most engineers pick one.      A panel opens in the middle; the figure rises.
 *   3. I work across the line.       The figure's back half draws in.
 *   4. I build both sides.           The panel closes; the figure stands on the line.
 *
 * With reduced motion there is no pinning: the last frame is shown as it is.
 */

/** Piecewise-linear interpolation: where `v` falls on `input`, read off `output`. */
const rampAt = (v: number, input: number[], output: number[]) => {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
};

/*
 * Scroll-linked values, worked out in JavaScript on purpose. Given keyframe arrays,
 * the animation library hands opacity to the browser's native scroll timeline, which
 * mapped these multi-step ranges wrongly. A function transform keeps every value on
 * the same clock.
 */
const useRamp = (p: MotionValue<number>, input: number[], output: number[]) =>
  useTransform(p, (v) => rampAt(v, input, output));

const usePercentRamp = (p: MotionValue<number>, input: number[], output: number[]) =>
  useTransform(p, (v) => `${rampAt(v, input, output)}%`);

// Larger on a phone, where 2.9vw would be 11px and the screen has room above the art.
const headline = "display m-0 text-[clamp(15px,4.6vw,30px)] sm:text-[clamp(22px,2.9vw,46px)]";

// Both pieces of art stand on the floor band, and never grow into the headline.
const artFrame = "absolute inset-0 flex items-end justify-center pb-[6svh]";
const artSize = "w-[min(72%,540px,66svh)]";

/**
 * A headline that sits across the split: its left half on paper, its right on night.
 * One word on each side takes the colour of that side, and a short rule sits under
 * each half.
 *   accent "ends"  colours the last word of both halves
 *   accent "turn"  colours only the first word after the line
 */
const SplitBeat = ({
  beat,
  opacity,
  accent,
}: {
  beat: { left: string; right: string };
  opacity?: MotionValue<number>;
  accent: "ends" | "turn";
}) => {
  const left = beat.left.split(" ");
  const right = beat.right.split(" ");
  return (
    <motion.p
      className={`${headline} absolute inset-x-0 top-[14svh] grid grid-cols-2`}
      style={opacity ? { opacity } : undefined}
    >
      <span className="flex flex-col items-end pr-[2.6vw] pl-4 text-ink">
        <span>
          {accent === "ends" ? (
            <>
              {left.slice(0, -1).join(" ")} <span className="text-front">{left[left.length - 1]}</span>
            </>
          ) : (
            beat.left
          )}
        </span>
        <span className="mt-[0.75em] block h-px w-[4.6em] bg-ink/30" />
      </span>
      <span className="flex flex-col items-start pr-4 pl-[2.6vw] text-paper">
        <span>
          {accent === "ends" ? (
            <>
              {right.slice(0, -1).join(" ")} <span className="text-back">{right[right.length - 1]}</span>
            </>
          ) : (
            <>
              <span className="text-back">{right[0]}</span> {right.slice(1).join(" ")}
            </>
          )}
        </span>
        <span className="mt-[0.75em] block h-px w-[4.6em] bg-paper/30" />
      </span>
    </motion.p>
  );
};

/** Fixed stars for the night side: [left %, top %, size px]. Each twinkles on its own beat. */
const stars: [number, number, number][] = [
  [12, 9, 2],
  [31, 21, 1.5],
  [58, 7, 2.5],
  [83, 16, 1.5],
  [92, 34, 2],
  [70, 27, 1.5],
  [22, 37, 2],
  [47, 44, 1.5],
  [6, 52, 1.5],
  [38, 12, 1],
  [76, 48, 2],
  [64, 4, 1],
  [88, 58, 1.5],
  [18, 26, 1],
];

/** A headline centred over the middle panel. */
const PanelBeat = ({
  beat,
  opacity,
}: {
  beat: { left: string; right: string };
  opacity: MotionValue<number>;
}) => (
  <motion.p
    className={`${headline} absolute inset-x-0 top-[13svh] px-6 text-center text-paper`}
    style={{ opacity }}
  >
    {beat.left} <span className="text-back">{beat.right}</span>
  </motion.p>
);

export const IntroStory = () => {
  const reduceMotion = !!useReducedMotion();
  const story = !reduceMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  /*
   * The story does not follow the wheel one-to-one. It trails the scroll by about a
   * second and settles without overshooting, so a wheel's steps turn into one slow,
   * continuous glide: the panel opens, the figure rises and the beats cross-fade
   * smoothly however the page is scrolled.
   */
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 20, mass: 1, restDelta: 0.0005 });

  const beat0 = useRamp(p, [0, 0.1, 0.16], [1, 1, 0]);
  const introPointer = useTransform(beat0, (v) => (v > 0.5 ? "auto" : "none"));
  const panelWidth = usePercentRamp(p, [0.12, 0.28, 0.66, 0.82], [0, 62, 62, 0]);
  const frontShift = usePercentRamp(p, [0.12, 0.28, 0.66, 0.82], [0, -9, -9, 0]);
  const backShift = usePercentRamp(p, [0.12, 0.28, 0.66, 0.82], [0, 9, 9, 0]);
  const figureY = usePercentRamp(p, [0.16, 0.32], [105, 0]);
  const beat1 = useRamp(p, [0.24, 0.3, 0.42, 0.47], [0, 1, 1, 0]);
  const wire = useRamp(p, [0.44, 0.6], [0, 1]);
  const beat2 = useRamp(p, [0.47, 0.53, 0.66, 0.71], [0, 1, 1, 0]);
  const tagOpacity = useRamp(p, [0.58, 0.64], [0, 1]);
  const beat3 = useRamp(p, [0.8, 0.88], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className={`relative w-full ${story ? "h-[360svh]" : ""}`}
    >
      <h1 className="sr-only">
        Mohammad Shoeb. Senior software engineer who builds both sides: front end and back end.
      </h1>

      <div className={`${story ? "sticky top-0" : "relative"} h-svh min-h-[560px] w-full overflow-hidden`}>
        {/* The two sides */}
        <div className="absolute inset-0 flex">
          <div className="paper-columns relative flex-1 overflow-hidden bg-paper">
            {/* The floor the front side stands on */}
            <span className="absolute inset-x-0 bottom-0 block h-[6svh] border-t border-ink/10 bg-paper-deep" />
            <motion.div className={artFrame} style={story ? { x: frontShift } : undefined}>
              <FrontArt className={artSize} />
            </motion.div>
          </div>
          <div className="relative flex-1 overflow-hidden bg-night">
            {stars.map(([left, top, size], i) => (
              <span
                key={`${left}-${top}`}
                className="twinkle absolute block rounded-full bg-paper"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  animationDuration: `${4 + (i % 4) * 1.3}s`,
                  animationDelay: `${-i * 0.9}s`,
                }}
              />
            ))}
            <span className="absolute inset-x-0 bottom-0 block h-[6svh] bg-panel" />
            <motion.div className={artFrame} style={story ? { x: backShift } : undefined}>
              <BackArt className={artSize} />
            </motion.div>
          </div>
        </div>

        {/* The panel that opens in the middle */}
        {story && (
          <motion.div
            aria-hidden="true"
            className="stage absolute inset-y-0 left-1/2 -translate-x-1/2"
            style={{ width: panelWidth }}
          />
        )}

        {/* The four beats. Only the last is read out; the heading above covers the rest. */}
        <div aria-hidden="true">
          {story ? (
            <>
              <SplitBeat beat={storyBeats[0]} opacity={beat0} accent="ends" />
              <PanelBeat beat={storyBeats[1]} opacity={beat1} />
              <PanelBeat beat={storyBeats[2]} opacity={beat2} />
              <SplitBeat beat={storyBeats[3]} opacity={beat3} accent="turn" />
            </>
          ) : (
            <SplitBeat beat={storyBeats[3]} accent="turn" />
          )}
        </div>

        {/* The opening frame: Front vs Back, and a way in */}
        {story && (
          <motion.div
            className="absolute top-[47svh] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-[2.2svh]"
            style={{ opacity: beat0, pointerEvents: introPointer }}
          >
            <SidesPill joiner="vs" wide className="text-[clamp(20px,3.3vw,50px)]" />
            <button
              type="button"
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
              className="label inline-flex items-center gap-2 rounded-full bg-front px-5 py-3 text-[10px] text-paper shadow-[0_14px_26px_-14px_rgba(36,71,214,0.9)] transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Scroll down <ArrowDown className="h-3 w-3" aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {/* A second copy of the phone, over the pill, so the pill sits inside the scene */}
        {story && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 overflow-hidden"
            style={{ opacity: beat0 }}
          >
            <motion.div className={artFrame} style={{ x: frontShift }}>
              <FrontArt className={artSize} show="phone" />
            </motion.div>
          </motion.div>
        )}

        {/* The figure on the line */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-[min(50svh,74vw,440px)] -translate-x-1/2"
          style={story ? { y: figureY } : undefined}
        >
          <Figure wire={story ? wire : undefined} />
        </motion.div>

        {/* On a phone the tag wraps to two lines, so it sits in the open space under the
            headline instead of over the jacket. */}
        <motion.p
          className="label absolute top-[30svh] left-1/2 m-0 sm:top-auto sm:bottom-5 w-max max-w-[92vw] -translate-x-1/2 bg-paper px-4 py-2.5 text-center text-[10px] text-ink sm:text-[11px]"
          style={story ? { opacity: tagOpacity } : undefined}
        >
          Mohammad Shoeb <span className="text-ink/40">/</span> Senior engineer{" "}
          <span className="text-ink/40">/</span> New Delhi <span className="text-ink/40">/</span> Since
          2019
        </motion.p>

        {story && (
          <a
            href="#work"
            className="label absolute right-5 bottom-8 hidden rounded-full border border-paper/60 px-5 py-3 text-paper transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper sm:right-10 lg:block"
          >
            Skip the story
          </a>
        )}
      </div>
    </section>
  );
};
