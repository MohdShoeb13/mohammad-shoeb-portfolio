import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useId } from "react";
import { techIcons, type TechIcon } from "@/components/two-sides/tech-icons";

/*
 * The page's drawings. All of them are original and drawn here in SVG and CSS:
 * the mark, the figure, and one piece of art for each side.
 */

const FRONT = "#2447d6";
const FRONT_DEEP = "#1a36a8";
const BACK = "#f2b04a";
const INK = "#15130f";
const NIGHT = "#0f1319";
const PAPER = "#f3f0e8";

/** The mark: one disc, solid on the front side and outlined on the back. */
export const Mark = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path d="M20 3 A17 17 0 0 0 20 37 Z" fill="currentColor" />
    <path d="M20 4.5 A15.5 15.5 0 0 1 20 35.5" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M20 12 A8 8 0 0 1 20 28" fill="none" stroke="currentColor" strokeWidth="3" />
  </svg>
);

/**
 * The two sides as one pill: Front on paper, Back on night, and a disc where
 * they join. `joiner` is short: "vs" in the opening, "+" at the end.
 */
export const SidesPill = ({
  joiner,
  wide = false,
  className = "",
}: {
  joiner: string;
  /** Long arms and a soft shadow, for the cover, where the pill floats over the art. */
  wide?: boolean;
  className?: string;
}) => (
  <span
    className={`display flex items-center rounded-full ${
      wide ? "shadow-[0_22px_44px_-20px_rgba(21,19,15,0.55)]" : ""
    } ${className}`}
  >
    <span
      className={`rounded-l-full bg-paper-deep py-[0.32em] text-front ${
        wide ? "pr-[1.25em] pl-[2.6em]" : "pr-[1.1em] pl-[0.9em]"
      }`}
    >
      Front
    </span>
    <span
      className={`z-10 flex shrink-0 items-center justify-center rounded-full bg-front text-paper ${
        wide ? "-mx-[0.7em] h-[1.9em] w-[1.9em]" : "-mx-[0.6em] h-[1.6em] w-[1.6em]"
      }`}
    >
      <span className={joiner.length > 1 ? "text-[0.42em]" : "text-[0.8em]"}>{joiner}</span>
    </span>
    <span
      className={`rounded-r-full bg-panel py-[0.32em] text-back ${
        wide ? "pr-[2.6em] pl-[1.25em]" : "pr-[0.9em] pl-[1.1em]"
      }`}
    >
      Back
    </span>
  </span>
);

/** A gear for the factory. Its turn is set from outside. */
export const Gear = ({ teeth = 10, className = "" }: { teeth?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <g fill="currentColor">
      {Array.from({ length: teeth }, (_, i) => (
        <rect key={i} x="44" y="4" width="12" height="18" rx="2" transform={`rotate(${(360 / teeth) * i} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="34" />
    </g>
    <circle cx="50" cy="50" r="12" fill={NIGHT} />
    <circle cx="50" cy="50" r="4" fill={BACK} />
  </svg>
);

/*
 * The figure: a developer in a hoodie, drawn on a 400 x 440 grid and split down the
 * middle at x = 200. The body is drawn first and the hood over it, so the hood's hem
 * sits on the shoulders. The face is an oval opening in the hood.
 */
const HOOD = "M200 26 C124 26 80 86 76 172 L74 244 C74 262 100 274 138 279 L262 279 C300 274 326 262 326 244 L324 172 C320 86 276 26 200 26 Z";
const BODY = "M30 440 C36 342 96 290 166 282 L234 282 C304 290 364 342 370 440 Z";
const POCKET = "M104 440 L124 396 L276 396 L296 440 Z";
const FACE = { cx: 200, cy: 170, rx: 63, ry: 82 };

/** A mark on the jacket, centred on (cx, cy) at `size` units square. */
const Badge = ({
  icon,
  cx,
  cy,
  size,
  ...paint
}: {
  icon: TechIcon;
  cx: number;
  cy: number;
  size: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) => (
  <g transform={`translate(${cx - size / 2} ${cy - size / 2})`}>
    <path
      d={techIcons[icon]}
      transform={`scale(${size / 24})`}
      vectorEffect="non-scaling-stroke"
      strokeLinejoin="round"
      {...paint}
    />
  </g>
);

type JacketMark = { icon: TechIcon; cx: number; cy: number; size: number };

/** The front-end tools, on the solid half of the chest. */
const frontMarks: JacketMark[] = [
  { icon: "react", cx: 146, cy: 316, size: 24 },
  { icon: "node", cx: 110, cy: 336, size: 26 },
  { icon: "angular", cx: 148, cy: 347, size: 22 },
];

/** The back-end tools, on the wireframe half. */
const backMarks: JacketMark[] = [
  { icon: "spring", cx: 254, cy: 316, size: 24 },
  { icon: "kafka", cx: 290, cy: 334, size: 24 },
  { icon: "java", cx: 254, cy: 348, size: 22 },
  { icon: "postgres", cx: 324, cy: 354, size: 20 },
];

/** The AI tools, down the line itself like buttons on a zip: each one half solid, half drawn. */
const lineMarks: JacketMark[] = [
  { icon: "claude", cx: 200, cy: 300, size: 20 },
  { icon: "openai", cx: 200, cy: 324, size: 20 },
  { icon: "gemini", cx: 200, cy: 348, size: 20 },
];

/** The strip the AI marks sit on, along the line. */
const ZIP = { x: 187, y: 287, width: 26, height: 74, rx: 13 };

/**
 * The figure that stands on the line: a developer in a hoodie, solid on the front
 * side and a wireframe on the back. Front-end tools are on the solid half of the
 * chest, back-end tools on the wireframe half, and the AI tools run down the line,
 * half solid and half drawn. `wire` (0 to 1) draws the back half in from the top.
 */
export const Figure = ({
  wire,
  className = "",
}: {
  wire?: MotionValue<number>;
  className?: string;
}) => {
  const id = useId().replace(/:/g, "");
  const full = useMotionValue(1);
  const hidden = useTransform(wire ?? full, (v) => (1 - v) * 100);
  const clipPath = useMotionTemplate`inset(0 0 ${hidden}% 0)`;

  return (
    <div className={`relative aspect-[400/440] ${className}`} aria-hidden="true">
      {/* Front half: solid */}
      <svg viewBox="0 0 400 440" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id={`${id}-l`}>
            <rect x="0" y="0" width="200" height="440" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-l)`}>
          <path d={BODY} fill={FRONT_DEEP} />
          <path d={POCKET} fill="rgba(0,0,0,0.16)" />
          <path d={HOOD} fill={FRONT} />
          <ellipse {...FACE} fill={INK} />
          <rect x="144" y="158" width="40" height="22" rx="6" fill={PAPER} />
          <path d="M182 278 L174 296" stroke={PAPER} strokeWidth="5" strokeLinecap="round" />
          <circle cx="173" cy="300" r="5" fill={PAPER} />
          <rect {...ZIP} fill="rgba(0,0,0,0.2)" />
          {frontMarks.map((mark) => (
            <Badge key={mark.icon} {...mark} fill={PAPER} opacity={0.92} />
          ))}
          {lineMarks.map((mark) => (
            <Badge key={mark.icon} {...mark} fill={PAPER} />
          ))}
        </g>
      </svg>

      {/* Back half: wireframe */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <svg viewBox="0 0 400 440" className="h-full w-full">
          <defs>
            <clipPath id={`${id}-r`}>
              <rect x="200" y="0" width="200" height="440" />
            </clipPath>
            <clipPath id={`${id}-s`}>
              <path d={BODY} />
              <path d={HOOD} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-r)`}>
            <g fill={NIGHT} stroke={BACK} strokeWidth="2.6" strokeLinejoin="round">
              <path d={BODY} />
              <path d={HOOD} />
            </g>
            {/* Scan lines across the hoodie */}
            <g clipPath={`url(#${id}-s)`} stroke={BACK} strokeWidth="1.3" opacity="0.5">
              {Array.from({ length: 30 }, (_, i) => (
                <line key={i} x1="200" x2="400" y1={40 + i * 14} y2={40 + i * 14} />
              ))}
            </g>
            <ellipse {...FACE} fill={NIGHT} stroke={BACK} strokeWidth="2.6" />
            <path d="M200 169 H216" stroke={BACK} strokeWidth="2.6" />
            <rect x="216" y="158" width="40" height="22" rx="6" fill="none" stroke={BACK} strokeWidth="2.6" />
            <path d="M218 278 L226 296" stroke={BACK} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="227" cy="300" r="5" fill={NIGHT} stroke={BACK} strokeWidth="2.6" />
            {/* Each mark on a dark disc, so the scan lines do not run through it */}
            {backMarks.map((mark) => (
              <g key={mark.icon}>
                <circle cx={mark.cx} cy={mark.cy} r={mark.size * 0.66} fill={NIGHT} />
                <Badge {...mark} fill={BACK} />
              </g>
            ))}
            <rect {...ZIP} fill={NIGHT} stroke={BACK} strokeWidth="1.3" />
            {lineMarks.map((mark) => (
              <Badge key={mark.icon} {...mark} fill="rgba(242,176,74,0.22)" stroke={BACK} strokeWidth={1.3} />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* The line itself */}
      <svg viewBox="0 0 400 440" className="absolute inset-0 h-full w-full">
        <line x1="200" y1="6" x2="200" y2="440" stroke={PAPER} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />
      </svg>
    </div>
  );
};

/**
 * The front side: a small interface kit. A window, type, a switch and a phone.
 * With show="phone" it draws only the phone, in the same place, so the cover can
 * lay a second copy of it over the pill.
 */
export const FrontArt = ({
  className = "",
  show = "all",
}: {
  className?: string;
  show?: "all" | "phone";
}) => (
  <div className={`relative ${className}`} aria-hidden="true">
    <div
      className={`flex aspect-[10/6.7] flex-col overflow-hidden rounded-lg bg-paper-deep ${
        show === "phone" ? "invisible" : ""
      }`}
    >
      <div className="flex h-[11%] min-h-5 shrink-0 items-center gap-1.5 bg-front px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-paper sm:h-2 sm:w-2" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-5 content-center gap-x-3 gap-y-[7%] p-[6%]">
        <div className="col-span-3 flex flex-col gap-2">
          <span className="h-[14px] w-4/5 bg-ink" />
          <span className="h-1.5 w-full bg-ink/20" />
          <span className="h-1.5 w-4/5 bg-ink/20" />
          <span className="h-1.5 w-11/12 bg-ink/20" />
        </div>
        <svg viewBox="0 0 80 60" className="col-span-2 w-full bg-ink/15">
          <circle cx="58" cy="18" r="8" fill={FRONT} />
          <path d="M8 56 L32 26 L46 42 L56 32 L74 56 Z" fill={INK} />
        </svg>
        <div className="col-span-5 mt-1 flex items-center gap-3">
          <span className="relative h-7 w-[38%] rounded-full bg-front">
            <svg viewBox="0 0 24 24" className="absolute -right-2 -bottom-3 h-6 w-6">
              <path d="M4 2 L4 20 L9 15.5 L12.5 23 L15.5 21.5 L12 14 L19 14 Z" fill={INK} stroke={PAPER} strokeWidth="1" />
            </svg>
          </span>
        </div>
        <div className="col-span-5 flex gap-1.5">
          {[FRONT, INK, "#8ea2ee", "#cdc6b4"].map((c) => (
            <span key={c} className="h-4 w-4" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>

    <div className={`mt-[6%] flex items-center gap-[6%] ${show === "phone" ? "invisible" : ""}`}>
      <span className="display flex aspect-[5/4] w-[27%] items-center justify-center rounded-md bg-paper-deep text-[clamp(16px,2.6vw,40px)] text-ink normal-case">
        Aa
      </span>
      <span className="flex h-[clamp(18px,2.6vw,38px)] w-[19%] items-center justify-end rounded-full bg-front p-[1%]">
        <span className="aspect-square h-[82%] rounded-full bg-paper" />
      </span>
    </div>

    {/* Phone */}
    <div className="absolute right-[-5%] bottom-0 aspect-[10/19] w-[29%] overflow-hidden rounded-[14%/8%] border-[5px] border-ink bg-white shadow-[0_18px_30px_-18px_rgba(21,19,15,0.6)] sm:border-[8px]">
      <span className="block h-[14%] bg-front" />
      <span className="mx-[10%] mt-[10%] block h-[22%] rounded-sm bg-ink/10" />
      <span className="mx-[10%] mt-[8%] block h-[22%] rounded-sm bg-ink/10" />
      <span className="mx-[10%] mt-[8%] block h-[3%] w-1/2 bg-ink/25" />
    </div>
  </div>
);

/* The back side's palette, as in the night half of the page. */
const PANEL = "#1c222c";
const PANEL_HI = "#2b3341";
const DIM = "#8d96a6";
const RED = "#e2412d";
const GREEN = "#46d17a";

/** A technology mark, placed by its top-left corner at `size` units square. */
const Tech = ({
  icon,
  x,
  y,
  size,
  className = "",
}: {
  icon: TechIcon;
  x: number;
  y: number;
  size: number;
  className?: string;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={techIcons[icon]} transform={`scale(${size / 24})`} className={className} />
  </g>
);

const terminalLines: { text: string; out?: boolean }[] = [
  { text: "$ ./gradlew test" },
  { text: "BUILD SUCCESSFUL · 1,284 tests", out: true },
  { text: "$ curl /api/instruments" },
  { text: "HTTP/2 200 · 38 ms", out: true },
  { text: "$ kafka-console-consumer --topic trades" },
];

/** The rack, top to bottom: what each unit runs, and the colours of its two lights. */
const rackUnits: { icon: TechIcon; leds: [string, string] }[] = [
  { icon: "docker", leds: [BACK, RED] },
  { icon: "kubernetes", leds: [GREEN, BACK] },
  { icon: "spring", leds: [BACK, BACK] },
  { icon: "jenkins", leds: [RED, GREEN] },
  { icon: "actions", leds: [BACK, GREEN] },
];

/** Each light blinks on its own rhythm, so the rack never pulses in step: [seconds, delay]. */
const ledRhythm: [number, number][] = [
  [1.6, 0],
  [2.3, -0.7],
  [1.1, 0.4],
  [2.9, -1.3],
  [1.9, -0.2],
  [1.3, -0.9],
  [2.6, 0.2],
  [1.7, -1.6],
  [3.1, -0.5],
  [2.1, -1.1],
];

/** Messages riding the event stream from the rack to the database. */
const STREAM_MESSAGES = 4;
const STREAM_SECONDS = 4.8;

/**
 * The back side: a terminal, a rack and a database, wired together. Its lights glow
 * and blink on their own rhythms, light runs down the wires, and messages ride a
 * Kafka stream from the rack into the database. Everything moves slowly and keeps
 * moving; with reduced motion it all holds still.
 */
export const BackArt = ({ className = "" }: { className?: string }) => {
  const id = useId().replace(/:/g, "");
  const glow = `url(#${id}-glow)`;
  return (
    <svg viewBox="0 0 560 626" className={`block h-auto ${className}`} aria-hidden="true">
      <defs>
        <filter id={`${id}-glow`} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`${id}-pool`}>
          <stop offset="0" stopColor={BACK} stopOpacity="0.55" />
          <stop offset="1" stopColor={BACK} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Terminal */}
      <g transform="translate(20 0)">
        <rect width="520" height="290" rx="10" fill={PANEL} stroke="rgba(244,241,234,0.14)" />
        <path d="M0 10 A10 10 0 0 1 10 0 H510 A10 10 0 0 1 520 10 V40 H0 Z" fill={PANEL_HI} />
        {[24, 44, 64].map((cx) => (
          <circle key={cx} cx={cx} cy="20" r="6" fill={DIM} opacity="0.7" />
        ))}
        <g className="font-mono" fontSize="18">
          {terminalLines.map((line, i) => (
            <text key={line.text} x="30" y={86 + i * 34 + (i >= 2 ? 10 : 0) + (i >= 4 ? 10 : 0)} fill={line.out ? BACK : DIM}>
              {line.text}
            </text>
          ))}
          <rect x="30" y="258" width="11" height="22" fill={BACK} className="scene-caret" />
        </g>
      </g>

      {/* Wires from the terminal to the machines, with light running down them */}
      {["M150 290 C150 330 120 338 120 372", "M430 290 C430 330 440 346 440 380"].map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke={BACK} strokeWidth="2" opacity="0.5" />
          <path
            d={d}
            pathLength={100}
            fill="none"
            stroke={BACK}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 90"
            filter={glow}
            className="scene-pulse"
            style={{ animationDelay: `${i * -1.6}s` }}
          />
        </g>
      ))}

      {/* Rack */}
      <g transform="translate(30 372)">
        <rect width="200" height="254" fill={PANEL} />
        <rect width="200" height="6" fill={PANEL_HI} />
        {rackUnits.map((unit, row) => {
          const y = 18 + row * 46;
          return (
            <g key={unit.icon}>
              <rect x="12" y={y} width="176" height="34" rx="2" fill={PANEL_HI} />
              <rect x="64" y={y + 15} width="70" height="4" rx="2" fill={NIGHT} opacity="0.6" />
              {unit.leds.map((color, i) => {
                const [period, delay] = ledRhythm[(row * 2 + i) % ledRhythm.length];
                return (
                  <circle
                    key={i}
                    cx={30 + i * 16}
                    cy={y + 17}
                    r="4.5"
                    fill={color}
                    filter={glow}
                    className="scene-led"
                    style={{ animationDuration: `${period}s`, animationDelay: `${delay}s` }}
                  />
                );
              })}
              <g className={unit.icon === "docker" ? "scene-bob" : undefined}>
                <Tech icon={unit.icon} x={150} y={y + 6} size={22} className={unit.icon === "docker" ? "fill-back" : "fill-[#c3cad6]"} />
              </g>
            </g>
          );
        })}
      </g>

      {/* The Kafka stream from the rack to the database */}
      <g>
        <rect x="226" y="491" width="132" height="14" rx="7" fill={PANEL} />
        <line x1="236" y1="498" x2="348" y2="498" stroke={BACK} strokeWidth="1.5" strokeDasharray="3 5" opacity="0.35" />
        {Array.from({ length: STREAM_MESSAGES }, (_, i) => (
          <rect
            key={i}
            x="234"
            y="494.5"
            width="12"
            height="7"
            rx="2"
            fill={BACK}
            filter={glow}
            className="scene-stream"
            style={{ animationDuration: `${STREAM_SECONDS}s`, animationDelay: `${(-i * STREAM_SECONDS) / STREAM_MESSAGES}s` }}
          />
        ))}
        <line x1="292" y1="476" x2="292" y2="491" stroke={PANEL_HI} strokeWidth="3" />
        <circle cx="292" cy="452" r="24" fill={PANEL} stroke={BACK} strokeWidth="1.5" strokeOpacity="0.5" />
        <circle cx="292" cy="452" r="24" fill="none" stroke={BACK} strokeWidth="2" className="scene-ring" />
        <Tech icon="kafka" x={279} y={439} size={26} className="fill-paper" />
      </g>

      {/* Database */}
      <g>
        <ellipse cx="440" cy="614" rx="104" ry="11" fill={`url(#${id}-pool)`} className="scene-breathe" />
        <path d="M350 404 V592 C350 607 390 618 440 618 C490 618 530 607 530 592 V404" fill={PANEL} />
        <path d="M350 466 C350 481 390 492 440 492 C490 492 530 481 530 466" fill="none" stroke={PANEL_HI} strokeWidth="2.5" />
        <path d="M350 528 C350 543 390 554 440 554 C490 554 530 543 530 528" fill="none" stroke={PANEL_HI} strokeWidth="2.5" />
        <ellipse cx="440" cy="404" rx="90" ry="24" fill={PANEL_HI} />
        <Tech icon="mongodb" x={431} y={393} size={18} className="fill-[#c3cad6]" />
        <Tech icon="postgres" x={420} y={500} size={40} className="fill-back" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={370 + i * 12}
            cy={584}
            r="3"
            fill={i === 1 ? GREEN : BACK}
            filter={glow}
            className="scene-led"
            style={{ animationDuration: `${ledRhythm[i + 3][0]}s`, animationDelay: `${ledRhythm[i + 3][1]}s` }}
          />
        ))}
      </g>
    </svg>
  );
};
