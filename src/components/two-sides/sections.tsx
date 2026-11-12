import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUp, Code, Download, ExternalLink, Lock } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  backSystems,
  bio,
  certificationCount,
  contactInfo,
  projectShots,
  projectsData,
  workKinds,
  type BackSystem,
  type ProjectItem,
} from "@/data/portfolio-data";
import { Figure, Mark, SidesPill } from "@/components/two-sides/art";
import { useSideways } from "@/components/two-sides/sideways";
import { ProviderIcon } from "@/components/ui/provider-icon";

const two = (n: number) => String(n).padStart(2, "0");

/** The numbered label above each section heading. */
const SectionLabel = ({
  number,
  name,
  tone,
}: {
  number: number;
  name: string;
  tone: "front" | "back";
}) => (
  <p className="label m-0 flex items-center gap-3">
    <span className={tone === "front" ? "text-front" : "text-back"}>{two(number)}</span>
    <span className="opacity-60">{name}</span>
  </p>
);

/* ------------------------------------------------------------------ */
/* 02  The front: what people see, as a street of shops                */
/* ------------------------------------------------------------------ */

/** Three facades, used in turn along the street: red, stone and cobalt. */
const shopTones = [
  {
    wall: "bg-stamp",
    ledge: "bg-stamp-ink",
    upper: "bg-[#f6d6cd]",
    sill: "bg-[#e7b2a4]",
    rule: "border-paper/25",
    sign: "bg-paper text-ink",
    number: "text-paper/80",
    frame: "border-stamp-ink",
    caption: "text-paper/85",
    stripes: ["#15130f", "#f3f0e8"],
  },
  {
    wall: "bg-paper-deep",
    ledge: "bg-[#c9c2b2]",
    upper: "bg-[#2b2925]",
    sill: "bg-[#3d3a34]",
    rule: "border-ink/12",
    sign: "bg-ink text-paper",
    number: "text-ink/60",
    frame: "border-[#6b6559]",
    caption: "text-ink/65",
    stripes: ["#e2412d", "#f3f0e8"],
  },
  {
    wall: "bg-front",
    ledge: "bg-[#1a36a8]",
    upper: "bg-[#dfe5fb]",
    sill: "bg-[#b4c0ef]",
    rule: "border-paper/25",
    sign: "bg-paper text-ink",
    number: "text-paper/75",
    frame: "border-[#152c8c]",
    caption: "text-paper/85",
    stripes: ["#15130f", "#f3f0e8"],
  },
];

/** Stripe width on the awning; each scallop hangs under one stripe. */
const STRIPE = 40;

/** A striped awning with a row of scallops hanging under it. */
const Awning = ({ stripes: [a, b] }: { stripes: string[] }) => (
  <div aria-hidden="true" className="w-full shrink-0">
    <div
      className="h-[clamp(18px,3svh,28px)]"
      style={{ backgroundImage: `repeating-linear-gradient(to right, ${a} 0 ${STRIPE}px, ${b} ${STRIPE}px ${STRIPE * 2}px)` }}
    />
    <div
      className="h-[20px]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0, ${a} 19.5px, transparent 20px)`,
        backgroundSize: `${STRIPE}px 20px`,
        backgroundRepeat: "repeat-x",
      }}
    />
  </div>
);

/** A street lamp on the pavement, between this shop and the next. */
const Lamp = () => (
  <span aria-hidden="true" className="absolute bottom-0 -right-[40px] z-[1] flex h-[50%] w-[26px] translate-x-1/2 flex-col items-center">
    <span className="block h-[5px] w-[9px] shrink-0 bg-ink" />
    <span className="block h-[15px] w-[26px] shrink-0 bg-stamp [clip-path:polygon(26%_0,74%_0,100%_100%,0_100%)]" />
    <span className="block w-[5px] flex-1 bg-ink" />
    <span className="block h-[15px] w-[15px] shrink-0 bg-ink" />
  </span>
);

/** Low buildings at the back of the street, seen in the gap after a shop. */
const Backdrop = () => (
  <span aria-hidden="true" className="absolute bottom-0 -right-[120px] -z-10 flex items-end">
    <span className="block h-[calc(var(--facade)*0.7)] w-[110px] bg-[#ebe7de]" />
    <span className="-ml-[70px] grid h-[calc(var(--facade)*0.3)] w-[150px] grid-cols-3 content-start gap-x-3 gap-y-2.5 bg-paper-deep p-3.5">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="block h-3 bg-paper/80" />
      ))}
    </span>
  </span>
);

/** What shows in a shop window: the live app, or a note for private work. */
const ShopWindow = ({ project }: { project: ProjectItem }) => {
  const shot = projectShots[project.id];
  if (shot) {
    return (
      <img
        src={shot}
        alt={`${project.title}, as it looks when open`}
        loading="lazy"
        className="h-full w-full object-cover object-left-top"
      />
    );
  }
  if (project.affiliation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-night px-6 text-center text-paper">
        <Lock className="h-6 w-6 text-back" aria-hidden="true" />
        <p className="label m-0 text-paper/80">Private. Built at EPAM.</p>
      </div>
    );
  }
  return (
    <ol className="m-0 flex h-full list-none flex-wrap content-center items-center justify-center gap-2 bg-night p-5">
      {project.flow.nodes.map((node, i) => (
        <li key={node.index} className="flex items-center gap-2">
          <span className="label border border-back/60 px-2 py-1 text-[9px] text-paper">{node.title}</span>
          {i < project.flow.nodes.length - 1 && <span className="h-px w-2 bg-back/60" />}
        </li>
      ))}
    </ol>
  );
};

const shopFocus =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-back";

/** A link's address without the scheme, for a tooltip. */
const bareUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** The light on the glass: two pale streaks, always there, as on a real window. */
const glare =
  "linear-gradient(115deg, transparent 0 16%, rgba(255,255,255,0.24) 16% 25%, transparent 25% 30%, rgba(255,255,255,0.13) 30% 33%, transparent 33%)";

/**
 * The shop window. Where the project has a live demo, the glass is the link to it.
 * Hovering or focusing it sweeps a light across and shows a tooltip with where it
 * leads. The tooltip sits outside the clipped glass, so it can rise over the awning.
 */
const ShopGlass = ({ project, frame }: { project: ProjectItem; frame: string }) => {
  const box = `relative block h-full min-w-0 flex-1 border-[6px] bg-paper ${frame}`;
  const glass = (
    <div className="absolute inset-0 overflow-hidden">
      <ShopWindow project={project} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: glare }} />
      {project.liveUrl && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[-10%] left-[-45%] block w-[32%] -skew-x-[18deg] bg-white/30 opacity-0 group-hover/glass:translate-x-[520%] group-hover/glass:opacity-100 group-focus-visible/glass:translate-x-[520%] group-focus-visible/glass:opacity-100 motion-safe:transition-[translate,opacity] motion-safe:duration-700 motion-safe:ease-out"
        />
      )}
    </div>
  );
  if (!project.liveUrl) return <div className={box}>{glass}</div>;
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the ${project.title} live app, in a new tab`}
      className={`group/glass ${box} ${shopFocus}`}
    >
      {glass}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-20 flex -translate-x-1/2 translate-y-1 flex-col items-center gap-1 bg-ink px-3.5 py-2.5 whitespace-nowrap text-paper opacity-0 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] transition-[opacity,translate] duration-200 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[7px] after:border-transparent after:border-t-ink after:content-[''] group-hover/glass:translate-y-0 group-hover/glass:opacity-100 group-focus-visible/glass:translate-y-0 group-focus-visible/glass:opacity-100"
      >
        <span className="label flex items-center gap-1.5 text-[10px]">
          Open the live app <ExternalLink className="h-3 w-3" />
        </span>
        <span className="font-mono text-[10px] text-paper/55">{bareUrl(project.liveUrl)}</span>
        {project.liveNote && (
          <span className="max-w-[230px] text-center text-[11px] leading-snug whitespace-normal text-back">
            Free hosting: the first load can take up to a minute.
          </span>
        )}
      </span>
    </a>
  );
};

/** The door's glass pane, the knob, and on a public project, the GitHub mark. */
const DoorLeaf = ({ github }: { github: boolean }) => (
  <>
    <span className="absolute inset-x-[16%] top-[9%] flex aspect-square items-center justify-center bg-[#7b7770]">
      {github && (
        <span className="flex h-[64%] w-[64%] text-paper">
          <ProviderIcon provider="GitHub" className="h-full w-full" />
        </span>
      )}
    </span>
    <span className="absolute top-[58%] right-[14%] block h-[7px] w-[7px] rounded-full bg-paper" />
  </>
);

/**
 * The shop door. Where the project has public code, the door is the link to it:
 * the GitHub mark sits in its glass, it swings open on its hinge on hover, focus or
 * press, and a tooltip says where it leads. A private project keeps a plain door.
 */
const ShopDoor = ({ project }: { project: ProjectItem }) => {
  const size = "relative block h-[78%] w-[18%] shrink-0";
  if (!project.githubUrl) {
    return (
      <span aria-hidden="true" className={`${size} bg-ink`}>
        <DoorLeaf github={false} />
      </span>
    );
  }
  return (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read the ${project.title} code on GitHub, in a new tab`}
      className={`group/door ${size} [perspective:520px] ${shopFocus}`}
    >
      {/* The doorway, lit from inside */}
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-back text-ink">
        <span className="flex h-[42%] w-[42%]">
          <ProviderIcon provider="GitHub" className="h-full w-full" />
        </span>
      </span>
      {/* The door itself, hinged on the left */}
      <span
        aria-hidden="true"
        className="absolute inset-0 block origin-left bg-ink group-hover/door:[transform:rotateY(-72deg)] group-focus-visible/door:[transform:rotateY(-72deg)] group-active/door:[transform:rotateY(-72deg)] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      >
        <DoorLeaf github />
      </span>
      {/* The tooltip, lined up with the door's right edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[calc(100%+14px)] z-20 flex translate-y-1 flex-col items-end gap-1 bg-ink px-3.5 py-2.5 whitespace-nowrap text-paper opacity-0 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] transition-[opacity,translate] duration-200 after:absolute after:top-full after:right-[clamp(8px,30%,24px)] after:border-[7px] after:border-transparent after:border-t-ink after:content-[''] group-hover/door:translate-y-0 group-hover/door:opacity-100 group-focus-visible/door:translate-y-0 group-focus-visible/door:opacity-100"
      >
        <span className="label flex items-center gap-1.5 text-[10px]">
          Read the code on GitHub <ExternalLink className="h-3 w-3" />
        </span>
        <span className="font-mono text-[10px] text-paper/55">{bareUrl(project.githubUrl)}</span>
      </span>
    </a>
  );
};

/** The tag hanging by the sign: says at a glance whether the shop is open to visit. */
const ShopTag = ({ project }: { project: ProjectItem }) => {
  const live = !!project.liveUrl;
  return (
    <span
      aria-hidden="true"
      className="absolute top-[13%] right-[5%] z-[2] flex w-[30px] flex-col items-center gap-2 bg-paper py-2.5 text-ink shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45)]"
    >
      {live ? (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-stamp motion-safe:animate-ping" />
          <span className="relative block h-2.5 w-2.5 rounded-full bg-stamp" />
        </span>
      ) : (
        <Lock className="h-3 w-3" />
      )}
      <span className="label rotate-180 text-[9px] tracking-[0.2em] [writing-mode:vertical-rl]">
        {live ? "Live demo" : "Private"}
      </span>
    </span>
  );
};

/** One project as a shop: a sign, an awning, the app in the window and a door. */
const Shop = ({ project, index, last }: { project: ProjectItem; index: number; last: boolean }) => {
  const tone = shopTones[index % shopTones.length];
  return (
    <article className="relative flex w-[min(82vw,460px)] shrink-0 snap-start flex-col">
      {/* The facade */}
      <div className="relative">
        <div className={`relative flex h-[var(--facade)] flex-col ${tone.wall}`}>
          <span aria-hidden="true" className={`block h-[6px] shrink-0 ${tone.ledge}`} />
          <div aria-hidden="true" className="flex justify-around px-[8%] pt-[3.5%]">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`relative block h-[clamp(18px,3.4svh,34px)] w-[17%] ${tone.upper}`}>
                <span className={`absolute inset-x-0 bottom-0 block h-[20%] ${tone.sill}`} />
              </span>
            ))}
          </div>

          <div className={`mt-[3%] flex items-center gap-3 border-y py-[2.2%] pr-[16%] pl-[6%] ${tone.rule}`}>
            <span className={`label ${tone.number}`}>{two(index + 1)}</span>
            <h3 className={`display m-0 px-3 py-1.5 text-[clamp(14px,1.45vw,21px)] leading-[1.05] ${tone.sign}`}>
              {project.title}
            </h3>
          </div>

          <Awning stripes={tone.stripes} />

          <div className="flex min-h-0 flex-1 items-end gap-[5%] px-[6%] pt-[2.5%]">
            <ShopGlass project={project} frame={tone.frame} />
            <ShopDoor project={project} />
          </div>

          <p className={`label m-0 truncate border-t px-[6%] py-[2.6%] ${tone.rule} ${tone.caption}`}>{project.category}</p>

          <ShopTag project={project} />
        </div>
        {!last && (
          <>
            <Backdrop />
            <Lamp />
          </>
        )}
      </div>

      {/* Below the road: what it does. The links live on the shop itself: glass and door. */}
      <div className="pt-[calc(var(--road)+18px)]">
        <p className="m-0 text-base font-medium text-ink">{project.tagline}</p>
        <p className="label mt-2 mb-0 truncate text-ink/55">{project.stack.slice(0, 5).join(" / ")}</p>
        {project.privateNote && <p className="label mt-2 mb-0 text-ink/55">{project.privateNote}</p>}
      </div>
    </article>
  );
};

/** Projects as a street of shops. On desktop, scrolling down walks the street. */
export const FrontSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { driven, travel, x } = useSideways(sectionRef, trackRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="paper-columns relative w-full bg-paper text-ink"
      style={driven ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      {/* Clears the fixed header (72px). On a phone the shops are shorter, so the
          heading, a whole shop and its caption all fit on one screen. */}
      <div className={driven ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[76px]" : "py-24"}>
        <div className="flex flex-col items-center px-5 text-center">
          <SectionLabel number={2} name="The street" tone="front" />
          <h2 className="display mt-3 mb-0 text-[clamp(24px,4.2vw,58px)] sm:text-[clamp(28px,4.2vw,58px)]">
            The front is
            <br />
            what <span className="text-front">people see.</span>
          </h2>
          <p className="label mt-3 mb-0 flex items-center gap-3 text-ink/55 sm:mt-4">
            <span className="h-px w-8 bg-front" />
            {driven ? "Scroll to walk the street" : "Swipe sideways →"}
          </p>
          <p className="label mt-2 mb-0 flex sm:mt-3 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-ink/65">
            <ExternalLink aria-hidden="true" className="h-3 w-3 text-front" />
            The window opens the live app
            <span aria-hidden="true">·</span>
            <span aria-hidden="true" className="flex h-3 w-3 text-front">
              <ProviderIcon provider="GitHub" className="h-full w-full" />
            </span>
            The door opens the code
          </p>
        </div>

        <div className={`mt-4 sm:mt-6 ${driven ? "" : "swipe-row snap-x snap-mandatory overflow-x-auto pb-4"}`}>
          <motion.div
            ref={trackRef}
            className="relative flex w-max gap-[80px] px-5 [--facade:clamp(190px,34svh,460px)] [--road:44px] sm:px-10 sm:[--facade:clamp(300px,44svh,460px)] sm:[--road:56px] lg:px-[8vw]"
            style={driven ? { x } : undefined}
          >
            {/* The pavement and the road, under every shop */}
            <div aria-hidden="true" className="absolute inset-x-0 top-[var(--facade)] h-[var(--road)] border-t-2 border-ink bg-paper-deep">
              <span className="road-lane absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" />
            </div>
            {projectsData.map((project, i) => (
              <Shop key={project.id} project={project} index={i} last={i === projectsData.length - 1} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 03  The back: what keeps it running, as a factory                   */
/* ------------------------------------------------------------------ */

/** Which panes are lit in each factory window. Fixed, so the scene never shuffles. */
const litPanes = [[2, 9], [5], [0, 11, 14], [7], [3, 12], [10], [1, 6], [13]];

/** The factory wall: tall windows, a few panes lit. */
const FactoryWall = () => (
  <div aria-hidden="true" className="flex h-full w-max gap-[90px] px-[4vw]">
    {Array.from({ length: 16 }, (_, w) => (
      <div key={w} className="grid h-full w-[200px] grid-cols-4 grid-rows-4 gap-[6px] border-[6px] border-[#1d2430] bg-[#1d2430]">
        {Array.from({ length: 16 }, (_, p) => (
          <span key={p} className={litPanes[w % litPanes.length].includes(p) ? "bg-back/45" : "bg-night"} />
        ))}
      </div>
    ))}
  </div>
);

/** A robot arm on the factory floor, in silhouette. */
const RobotArm = ({ flip = false }: { flip?: boolean }) => (
  <svg viewBox="0 0 220 300" className={`block h-full w-auto ${flip ? "-scale-x-100" : ""}`}>
    <g fill="#202733" stroke="#202733" strokeLinecap="round">
      <rect x="40" y="272" width="84" height="28" rx="3" stroke="none" />
      <rect x="64" y="236" width="36" height="40" stroke="none" />
      <path d="M82 236 L66 122" strokeWidth="26" fill="none" />
      <path d="M66 122 L168 74" strokeWidth="20" fill="none" />
      <path d="M168 74 L180 108 M168 74 L202 94" strokeWidth="8" fill="none" />
      <circle cx="82" cy="236" r="21" stroke="none" />
      <circle cx="66" cy="122" r="18" stroke="none" />
    </g>
    <circle cx="82" cy="236" r="6" fill="#2d3645" />
    <circle cx="66" cy="122" r="6" fill="#2d3645" />
  </svg>
);

/** The machines between the wall and the belt: arms, and a pipe behind the crates. */
const FactoryMachines = () => (
  <div aria-hidden="true" className="flex h-full w-max items-end gap-[46vw] pl-[18vw]">
    {Array.from({ length: 7 }, (_, i) => (
      <RobotArm key={i} flip={i % 2 === 1} />
    ))}
  </div>
);

/**
 * One system as a crate. It arrives as a raw box; once the press has stamped it,
 * it is a labelled card. Both faces are always in the page, so the card's text is
 * there for screen readers whether or not it has been stamped.
 */
const Crate = ({
  system,
  done,
  refFn,
}: {
  system: BackSystem;
  done: boolean;
  refFn: (el: HTMLLIElement | null) => void;
}) => {
  const [head, ...rest] = system.name.split("-");
  const tail = rest.join("-");
  const company = system.where.split(",")[0];
  return (
    <li ref={refFn} className="crate snap-start" data-done={done} data-legendary={system.legendary ? "true" : undefined}>
      <div aria-hidden="true" className="crate-raw">
        <Code className="h-[min(48px,6svh)] w-[min(48px,6svh)]" strokeWidth={2.25} />
        <span className="label text-center text-[10px] leading-[1.7] text-paper/45">
          {head}-
          <br />
          {tail}
        </span>
      </div>
      <div className="crate-card">
        <span aria-hidden="true" className="crate-tape" />
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-[8%] pt-[8%]">
          <p className="label m-0 flex items-center gap-1.5 text-[9px] tracking-[0.14em] text-ink/55">
            <span aria-hidden="true" className="text-ink">&gt;_</span>
            {company}
          </p>
          <h3
            className={`display m-0 ${head.length > 7 ? "text-[clamp(14px,2.3svh,20px)]" : "text-[clamp(17px,2.9svh,25px)]"}`}
          >
            {head}
            <span className="font-light normal-case text-ink/45">-{tail}</span>
          </h3>
          <p className="m-0 text-[clamp(11.5px,1.6svh,13.5px)] leading-[1.45] text-ink/75">{system.detail}</p>
        </div>
        <p className="label m-0 truncate border-t border-ink/12 px-[8%] pt-3 pb-3.5 text-[9px] text-stamp-ink">
          {system.stack.join(" · ")}
        </p>
        <span aria-hidden="true" className="crate-stamp label text-[10px]">
          {system.legendary ? "★ Legendary" : "Shipped"}
        </span>
      </div>
    </li>
  );
};

/** Three lights on the press, blinking out of step. */
const pressLights = [
  { tone: "bg-back", period: "1.4s" },
  { tone: "bg-stamp", period: "2.1s" },
  { tone: "bg-back", period: "0.9s" },
];

/**
 * The press. It hangs from the gantry on two wheels and slides along it to meet a
 * crate. `rod` lowers the ram, `trolley` moves the whole press sideways.
 */
const Press = ({
  rod,
  trolley,
  headRef,
  sparkRef,
}: {
  rod: MotionValue<number>;
  trolley: MotionValue<number>;
  headRef: RefObject<HTMLSpanElement | null>;
  sparkRef: RefObject<HTMLDivElement | null>;
}) => (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-[calc(var(--floor)+var(--belt)+var(--crate-h)+var(--gap))] left-1/2 z-[3] flex w-[calc(var(--crate)*0.72)] -translate-x-1/2 flex-col items-center"
    style={{ x: trolley }}
  >
    <span className="relative z-[3] -mb-[1.2svh] flex h-[2.4svh] w-[70%] justify-between">
      <span className="press-wheel [rotate:calc(var(--spin,0)*-2deg)]" />
      <span className="press-wheel [rotate:calc(var(--spin,0)*-2deg)]" />
    </span>
    <span className="relative z-[2] flex h-[9svh] w-full items-center justify-center gap-[14%] rounded-t-[8px] rounded-b-[2px] bg-[#232a36] shadow-[inset_0_-0.5rem_0_rgba(0,0,0,0.25)]">
      {pressLights.map((light, i) => (
        <span
          key={i}
          className={`block aspect-square w-[9%] rounded-full ${light.tone}`}
          style={{ animation: `caret ${light.period} steps(1) infinite` }}
        />
      ))}
    </span>
    <motion.span className="relative z-[1] -mt-[4.6svh] block h-[8svh] w-[16%] bg-steel" style={{ y: rod }}>
      <span
        ref={headRef}
        className="absolute bottom-0 left-1/2 block h-[1.6svh] w-[calc(var(--crate)*0.62)] -translate-x-1/2 rounded-[3px] bg-stamp"
      />
    </motion.span>
    <div ref={sparkRef} className="absolute inset-0" />
  </motion.div>
);

/** Sparks fanning up off the press head, for the legendary crate. */
const burstSparks = (layer: HTMLElement, head: HTMLElement) => {
  const box = layer.getBoundingClientRect();
  const ram = head.getBoundingClientRect();
  const left = ram.left - box.left + ram.width / 2;
  const top = ram.bottom - box.top;
  for (let i = 0; i < 18; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${left}px`;
    spark.style.top = `${top}px`;
    layer.append(spark);
    const angle = (Math.PI * i) / 17;
    const reach = 50 + Math.random() * 90;
    const flight = spark.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${-Math.cos(angle) * reach}px, ${-Math.sin(angle) * reach * 0.8}px) scale(0.2)`, opacity: 0 },
      ],
      { duration: 500 + Math.random() * 400, delay: 100, easing: "cubic-bezier(0.33, 1, 0.68, 1)", fill: "both" },
    );
    flight.onfinish = () => spark.remove();
  }
};

/** Seconds the ram takes to come down, and to go back up. */
const STAMP_TIME = 0.12;
const RISE_TIME = 0.45;
/** Degrees a roller turns for each pixel the belt moves. */
const SPIN_RATE = 0.45;
/** The hazard stripe repeats after this many pixels. */
const HAZARD_PERIOD = 22 * Math.SQRT2;
const ROLLERS = 64;

/**
 * The heading. On the driven belt it rides the start of the belt and scrolls away.
 * On a phone it spans the screen under the fixed header and drops the lead line, so
 * it ends above the press.
 */
const FactoryHead = ({ driven }: { driven: boolean }) => (
  <div
    className={
      driven
        ? "absolute top-[max(88px,11svh)] left-5 w-[calc(100vw-40px)] text-left sm:top-[14svh] sm:left-[6vw] sm:w-auto sm:max-w-[min(40vw,620px)]"
        : "flex flex-col items-center px-5 text-center"
    }
  >
    <SectionLabel number={3} name="The factory" tone="back" />
    <h2 className={`display mt-3 mb-0 ${driven ? "text-[clamp(24px,3.4vw,50px)]" : "text-[clamp(28px,4.2vw,58px)]"}`}>
      Behind the screens,
      <br />
      <span className="text-back">the systems.</span>
    </h2>
    <p className={`mt-4 mb-0 max-w-[46ch] text-base leading-relaxed text-paper/70 ${driven ? "hidden sm:block" : ""}`}>
      Services, gateways and pipelines I built and ran for financial institutions.
    </p>
    <p className="label mt-4 mb-0 flex items-center gap-3 text-paper/55">
      <span className="h-px w-8 bg-back" />
      {driven ? "Scroll to run the belt" : "Swipe sideways →"}
    </p>
  </div>
);

const publicRepos = projectsData.filter((project) => project.githubUrl).length;

/**
 * The sign at the end of the belt: an amber arrow on a post, pointing to GitHub.
 * The post stands on the belt, so the sign travels in with the crates.
 */
const GitHubSign = () => (
  <div className="ml-[calc(var(--crate)*0.6)] flex shrink-0 snap-start flex-col items-center">
    <a
      href={contactInfo.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`All my code on GitHub, ${publicRepos} public repositories, in a new tab`}
      className="group/sign flex flex-col items-start gap-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-back"
    >
      <span className="label bg-night px-1.5 py-0.5 text-paper/60">{two(publicRepos)} public repositories · open source</span>
      <span className="display flex items-center gap-[0.55em] bg-back py-[0.7em] pr-[2.6em] pl-[0.9em] text-[clamp(18px,2.7svh,26px)] text-ink transition-colors duration-200 [clip-path:polygon(0_0,calc(100%-1.6em)_0,100%_50%,calc(100%-1.6em)_100%,0_100%)] group-hover/sign:bg-paper group-focus-visible/sign:bg-paper">
        All on GitHub
        <span aria-hidden="true" className="flex">
          <ProviderIcon provider="GitHub" className="h-[1.15em] w-[1.15em]" />
        </span>
      </span>
    </a>
    <span aria-hidden="true" className="block h-[calc(var(--crate-h)*0.42)] w-[6px] bg-steel" />
  </div>
);

/** The belt's rollers. They turn in place; the crates are what travel. */
const Rollers = () => (
  <div className="flex h-full items-center gap-[2.2rem] pl-4">
    {Array.from({ length: ROLLERS }, (_, i) => (
      <span key={i} className="belt-roller w-[calc(var(--belt)*0.7)] [rotate:calc(var(--spin,0)*1deg)]" />
    ))}
  </div>
);

/** The systems behind the screens, carried along a belt and stamped by a press. */
export const BackSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const crateRefs = useRef<(HTMLLIElement | null)[]>([]);
  const headRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const { driven, travel, x } = useSideways(sectionRef, trackRef);
  const [shipped, setShipped] = useState(0);
  // Which crates have been stamped, one bit each. Held in a ref for the frame loop,
  // and mirrored into state only when it changes.
  const [stamped, setStamped] = useState(0);
  const stampedRef = useRef(0);

  // The layout, measured when it changes rather than on every frame: each crate's
  // middle along the belt, half the spacing between crates, and how far the ram
  // has to come down to meet the top of a crate.
  const centres = useRef<number[]>([]);
  const half = useRef(0);
  const reach = useRef(0);
  const rod = useMotionValue(0);
  const trolley = useMotionValue(0);
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const crates = crateRefs.current;
      centres.current = crates.map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0));
      half.current = crates.length > 1 && crates[0] && crates[1] ? (crates[1].offsetLeft - crates[0].offsetLeft) / 2 : 150;
      const head = headRef.current;
      if (head && crates[0]) {
        reach.current = Math.max(0, crates[0].getBoundingClientRect().top - (head.getBoundingClientRect().bottom - rod.get()));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [driven, rod]);

  /*
   * Everything in the factory reads the belt's travel `x`, so the parts stay in step:
   * the wall slides at a third of the speed and the arms at a little over half, for
   * depth; the hazard stripe moves with the crates and wraps every pattern length;
   * the rollers and the press wheels turn in place by `--spin`.
   */
  const wallX = useTransform(x, (v) => v * 0.35);
  const machinesX = useTransform(x, (v) => v * 0.6);
  const hazardX = useTransform(x, (v) => v % HAZARD_PERIOD);
  const spin = useTransform(x, (v) => -v * SPIN_RATE);

  // A crate is shipped once its middle has passed the press.
  useMotionValueEvent(x, "change", (v) => {
    const middle = window.innerWidth / 2;
    const count = centres.current.filter((centre) => centre + v < middle).length;
    setShipped((previous) => (previous === count ? previous : count));
  });

  /*
   * The press. Each frame it looks for the next crate coming up to it. The ram
   * takes STAMP_TIME to come down, so it aims where that crate will be by then: the
   * faster the belt runs, the earlier it starts. While coming down it slides along
   * the gantry to stay over the crate. When it lands the crate is stamped, and the
   * ram rises and the press slides back to the middle. A crate the belt carries past
   * faster than the press can follow is stamped anyway, so none goes out raw.
   * Running the belt backwards un-stamps crates as they come back past the press.
   */
  const lastX = useRef<number | null>(null);
  const stroke = useRef<{ index: number; from: number; fromY: number; start: number } | null>(null);

  const mark = (index: number, on: boolean) => {
    const next = on ? stampedRef.current | (1 << index) : stampedRef.current & ~(1 << index);
    if (next === stampedRef.current) return;
    stampedRef.current = next;
    setStamped(next);
  };

  const land = (index: number) => {
    mark(index, true);
    if (backSystems[index]?.legendary && sparkRef.current && headRef.current) {
      burstSparks(sparkRef.current, headRef.current);
    }
  };

  const lift = () => {
    stroke.current = null;
    animate(rod, 0, { duration: RISE_TIME, ease: "easeOut" });
    animate(trolley, 0, { duration: RISE_TIME + 0.25, ease: "easeInOut" });
  };

  useAnimationFrame((time, delta) => {
    if (!driven) return;
    const v = x.get();
    const middle = window.innerWidth / 2;
    const offset = (index: number) => centres.current[index] + v - middle;
    const previous = lastX.current;
    const speed = previous === null ? 0 : (Math.max(0, previous - v) / Math.max(delta, 1)) * 1000;

    // A stroke in progress: bring the ram down and keep the press over its crate.
    const current = stroke.current;
    if (current) {
      const t = Math.min(1, (time - current.start) / (STAMP_TIME * 1000));
      rod.set(current.fromY + (reach.current - current.fromY) * t * t * t);
      const at = offset(current.index);
      const aim = at - speed * (1 - t) * STAMP_TIME;
      if (Math.abs(aim) > half.current) {
        lift();
        if (aim < 0) land(current.index);
      } else if (t < 1) {
        trolley.set(current.from + (aim - current.from) * t);
      } else {
        trolley.set(at);
        lift();
        land(current.index);
      }
    }

    if (previous === v) return;
    lastX.current = v;

    // On the first frame, crates already past the press arrive stamped.
    if (previous === null) {
      centres.current.forEach((_, i) => mark(i, offset(i) < 0));
      return;
    }

    const forward = v < previous;
    const lead = speed * STAMP_TIME;
    let next = -1;
    centres.current.forEach((_, i) => {
      const at = offset(i);
      const done = (stampedRef.current >> i) & 1;
      const inStroke = stroke.current?.index === i;
      if (!forward) {
        if (done && at >= 0 && !inStroke) mark(i, false);
        return;
      }
      if (done || inStroke || at > lead) return;
      if (at - lead < -half.current) land(i);
      else if (next < 0 || at > offset(next)) next = i;
    });

    if (next >= 0 && !stroke.current && rod.get() <= reach.current / 2) {
      rod.stop();
      trolley.stop();
      stroke.current = { index: next, from: trolley.get(), fromY: rod.get(), start: time };
    }
  });

  const isStamped = (i: number) => !driven || ((stamped >> i) & 1) === 1;
  const crates = backSystems.map((system, i) => (
    <Crate
      key={system.name}
      system={system}
      done={isStamped(i)}
      refFn={(el) => {
        crateRefs.current[i] = el;
      }}
    />
  ));
  const count = (
    <p className="label m-0 text-paper/50">
      <span className="text-back">{two(driven ? shipped : backSystems.length)}</span> / {two(backSystems.length)} systems shipped
      <span className="hidden sm:inline">, at three companies</span>
    </p>
  );
  const scene = {
    "--floor": "9svh",
    "--belt": "3.2svh",
    "--crate": driven ? "clamp(180px, 30svh, 270px)" : "250px",
    "--crate-h": "calc(var(--crate) * 1.15)",
    "--gap": "3.4svh",
  } as CSSProperties;

  if (!driven) {
    return (
      <section ref={sectionRef} id="systems" className="relative w-full overflow-hidden bg-night py-24 text-paper" style={scene}>
        <FactoryHead driven={false} />
        <div className="swipe-row mt-10 snap-x snap-mandatory overflow-x-auto">
          <div className="flex w-max items-end px-5 sm:px-10">
            <ul className="m-0 flex list-none items-end gap-6 p-0">{crates}</ul>
            <GitHubSign />
          </div>
        </div>
        <div aria-hidden="true" className="h-[26px] overflow-hidden border-t-[3px] border-steel bg-panel">
          <Rollers />
        </div>
        <div className="hazard h-[8px]" />
        <div className="bg-[#151b23] px-5 py-4 sm:px-10">{count}</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="systems" className="relative w-full bg-night text-paper" style={{ ...scene, height: `calc(100svh + ${travel}px)` }}>
      <motion.div className="sticky top-0 h-svh overflow-hidden" style={{ "--spin": spin } as MotionStyle}>
        {/* The wall and the machines, sliding slower than the belt */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[calc(var(--floor)+var(--belt))] left-0 h-[58svh] opacity-70 will-change-transform"
          style={{ x: wallX }}
        >
          <FactoryWall />
        </motion.div>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-[calc(var(--floor)+var(--belt)+var(--crate-h)*0.42)] block h-[6px] bg-back/25" />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[calc(var(--floor)+var(--belt))] left-0 h-[40svh] will-change-transform"
          style={{ x: machinesX }}
        >
          <FactoryMachines />
        </motion.div>

        {/* The gantry the press rides on */}
        <span
          aria-hidden="true"
          className="gantry absolute inset-x-0 bottom-[calc(var(--floor)+var(--belt)+var(--crate-h)+var(--gap)+12.4svh)] z-[1] block h-[1.7svh]"
        />
        <Press rod={rod} trolley={trolley} headRef={headRef} sparkRef={sparkRef} />

        {/* The crates, with the heading riding the start of the belt */}
        <motion.div
          ref={trackRef}
          className="relative z-[2] flex h-full w-max items-end pr-5 sm:pr-[42vw] pb-[calc(var(--floor)+var(--belt))] pl-[55vw] will-change-transform"
          style={{ x }}
        >
          <FactoryHead driven />
          <ul className="m-0 flex list-none items-end gap-[calc(var(--crate)*0.34)] p-0">{crates}</ul>
          <GitHubSign />
        </motion.div>

        {/* The belt and the floor */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-[var(--floor)] z-[2] h-[var(--belt)] overflow-hidden border-t-[3px] border-steel bg-panel">
          <Rollers />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[2] h-[var(--floor)] bg-[#151b23]">
          <div aria-hidden="true" className="overflow-hidden">
            <motion.div className="hazard h-[8px] w-[calc(100%+64px)] will-change-transform" style={{ x: hazardX }} />
          </div>
          <div className="px-[6vw] pt-[2.4svh]">{count}</div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 04  Profile                                                         */
/* ------------------------------------------------------------------ */

const stats = [
  { label: "Years shipping", value: "7+" },
  { label: "Certifications", value: String(certificationCount) },
  { label: "Uptime in production", value: "99.9%" },
  { label: "Based in", value: "IN" },
];

export const ProfileSection = () => (
  <section id="profile" className="relative w-full bg-night pt-8 pb-24 text-paper md:pb-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-10">
      <SectionLabel number={4} name="Profile" tone="back" />
      <h2 className="display mt-4 mb-0 text-[clamp(34px,6.4vw,92px)]">
        Who builds
        <br />
        <span className="text-back">both sides?</span>
      </h2>

      <div className="mt-12 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-5 lg:block">
          <Figure className="mx-auto w-[min(100%,360px)]" />
          <div className="mx-auto h-3 w-[min(100%,420px)] bg-panel" />
        </div>

        <article className="relative bg-paper text-ink lg:col-span-7">
          <div className="h-2 bg-front" />
          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <p className="label m-0 text-ink/55">Profile</p>
              <p className="label m-0 flex items-center gap-2 text-ink/55">
                <span className="h-1.5 w-1.5 rounded-full bg-front" />
                {contactInfo.location}
              </p>
            </div>
            <h3 className="display mt-4 mb-0 text-[clamp(30px,4.6vw,60px)]">{contactInfo.name}</h3>
            <p className="label mt-3 mb-0 text-front">Senior software engineer / EPAM Systems</p>

            <p className="mt-6 mb-0 text-lg leading-snug text-ink sm:text-xl">{bio}</p>
            <p className="mt-4 mb-0 max-w-[58ch] text-[15px] leading-relaxed text-ink/75">
              I work full-stack on Java and Spring Boot, with React and Angular in front and
              Kafka and AWS behind.
            </p>
            <p className="mt-3 mb-0 max-w-[58ch] text-[15px] leading-relaxed text-ink/75">
              Today I build agentic tooling at EPAM with Claude Code and MCP. Before that I built
              systems for Wellington Management and Mitsubishi UFJ Financial Group.
            </p>

            <dl className="m-0 mt-8 grid grid-cols-2 border border-ink/15">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex items-center justify-between gap-3 p-4 sm:p-5 ${
                    i % 2 === 0 ? "border-r border-ink/15" : ""
                  } ${i < 2 ? "border-b border-ink/15" : ""}`}
                >
                  <dt className="label text-ink/55">{stat.label}</dt>
                  <dd className="display m-0 text-2xl sm:text-3xl">{stat.value}</dd>
                </div>
              ))}
            </dl>

            {/* Where the work sits between the two sides */}
            <div className="mt-6 flex items-center gap-4" aria-hidden="true">
              <span className="label text-ink/55">Front</span>
              <span className="relative h-1 flex-1 rounded-full bg-ink/15">
                <span className="absolute inset-y-0 right-0 w-[38%] rounded-full bg-ink" />
                <span className="absolute top-1/2 left-[62%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-front" />
              </span>
              <span className="label text-ink/55">Back</span>
            </div>
            <p className="sr-only">My work leans towards the back end.</p>

            <a
              href={contactInfo.resumeUrl}
              download
              className="label mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper transition-colors hover:bg-front focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Download CV <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 05  Choose what to build                                            */
/* ------------------------------------------------------------------ */

export const ChooseSection = () => {
  const [selected, setSelected] = useState(0);
  const kind = workKinds[selected];
  const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`${kind.title}: a project to discuss`)}`;

  return (
    <section id="choose" className="relative grid w-full grid-cols-1 lg:grid-cols-2">
      <div className="paper-columns bg-paper px-5 py-20 text-ink sm:px-10 md:py-28">
        <div className="mx-auto max-w-xl lg:mr-0 lg:ml-auto lg:pr-6">
          <SectionLabel number={5} name="Choose" tone="front" />
          <h2 className="display mt-4 mb-0 text-[clamp(32px,4.8vw,64px)]">
            Choose what
            <br />
            <span className="text-front">to build.</span>
          </h2>
          <p className="mt-5 mb-0 max-w-[40ch] text-base leading-relaxed text-ink/75">
            Four kinds of work. Pick one and the email opens with the subject already written.
          </p>

          <ul className="m-0 mt-10 list-none border-t border-ink/15 p-0">
            {workKinds.map((item, i) => {
              const isSelected = i === selected;
              return (
                <li key={item.title} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={isSelected}
                    className={`group relative flex w-full items-center gap-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      isSelected ? "text-ink" : "text-ink/50 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`absolute top-3 bottom-3 left-0 w-1 bg-front transition-opacity ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className={`label pl-4 ${isSelected ? "text-front" : ""}`}>{two(i + 1)}</span>
                    <span className="display flex-1 text-[clamp(20px,2.6vw,34px)]">{item.title}</span>
                    {isSelected && <ArrowRight className="h-5 w-5 text-front" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="bg-night px-5 py-20 text-paper sm:px-10 md:py-28" aria-live="polite">
        <div className="mx-auto max-w-xl lg:mr-auto lg:ml-0 lg:pl-6">
          <p className="label m-0 flex items-center gap-3 text-back">
            <span className="flex h-7 w-7 items-center justify-center bg-front text-paper">
              {two(selected + 1)}
            </span>
            Selected
          </p>
          <h3 className="display mt-6 mb-0 text-[clamp(36px,5.4vw,76px)]">{kind.title}</h3>
          <p className="mt-5 mb-0 max-w-[44ch] text-lg leading-snug text-paper/85">{kind.detail}</p>

          <p className="label mt-8 mb-0 text-paper/50">Stack</p>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
            {kind.stack.map((tech) => (
              <li key={tech} className="label rounded-full border border-paper/25 px-3 py-1.5 text-paper">
                {tech}
              </li>
            ))}
          </ul>

          <p className="label mt-8 mb-0 text-paper/50">Built with it</p>
          <ul className="m-0 mt-3 list-none p-0">
            {kind.built.map((name) => (
              <li
                key={name}
                className="flex items-center gap-3 border-b border-paper/12 py-2.5 text-[15px] text-paper/85"
              >
                <span className="h-1.5 w-1.5 bg-back" />
                {name}
              </li>
            ))}
          </ul>

          <a
            href={mailto}
            className="label mt-10 inline-flex items-center gap-3 rounded-full bg-front px-6 py-4 text-paper transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            Email me about this <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 06  Both sides, and contact                                         */
/* ------------------------------------------------------------------ */

type CopyState = "idle" | "copied" | "failed";

export const FinaleSection = () => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section id="contact" className="relative w-full">
      <h2 className="sr-only">Contact</h2>

      {/* The last scene: both sides, and the figure on the line between them */}
      <div className="relative flex h-[76svh] min-h-[520px] w-full overflow-hidden">
        <div className="paper-columns relative flex-1 bg-paper">
          {/* A row of screens on the front side */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[22%] flex items-end justify-end gap-[4%] pr-[26%]">
            <span className="absolute right-[34%] bottom-0 aspect-square w-[26%] rounded-full bg-front" />
            {[38, 62, 30, 78, 48].map((h, i) => (
              <span
                key={i}
                className="relative block w-[10%] bg-paper-deep"
                style={{ height: `${h * 0.34}svh` }}
              >
                <span className="absolute inset-x-[18%] top-[12%] h-1.5 bg-front/70" />
                <span className="absolute inset-x-[18%] top-[30%] h-1.5 bg-ink/15" />
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex-1 bg-night">
          {/* A row of racks on the back side */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[22%] flex items-end gap-[4%] pl-[26%]">
            {[56, 34, 72, 44, 60].map((h, i) => (
              <span
                key={i}
                className="relative block w-[10%] bg-panel"
                style={{ height: `${h * 0.34}svh` }}
              >
                <span
                  className="led absolute top-[10%] left-[18%] h-1.5 w-1.5 rounded-full bg-back"
                  style={{ animationDelay: `${i * -0.5}s` }}
                />
                <span className="absolute inset-x-[18%] top-[28%] h-px bg-paper/15" />
                <span className="absolute inset-x-[18%] top-[40%] h-px bg-paper/15" />
              </span>
            ))}
          </div>
        </div>

        {/* The ground both sides stand on */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-[22%]">
          <span className="flex-1 border-t-2 border-ink bg-paper-deep" />
          <span className="flex-1 border-t-2 border-back/60 bg-panel" />
        </div>

        {/* Let's build the whole thing: Front + Back */}
        <p className="display absolute inset-x-0 top-[11svh] m-0 grid grid-cols-2 text-[clamp(20px,3.2vw,48px)]" aria-hidden="true">
          <span className="pr-[3vw] text-right text-ink">Let&rsquo;s build</span>
          <span className="pl-[3vw] text-left text-paper">
            the <span className="text-back">whole</span> thing.
          </span>
        </p>
        <p className="sr-only">Let&rsquo;s build the whole thing, front and back.</p>
        <SidesPill
          joiner="+"
          className="absolute top-[23svh] left-1/2 -translate-x-1/2 text-[clamp(20px,3.4vw,44px)]"
        />

        {/* Chimneys on the back side */}
        <div aria-hidden="true" className="absolute right-[12%] bottom-[22%] flex items-end gap-[3vw]">
          {[30, 22].map((h, i) => (
            <span key={h} className="relative block w-[clamp(18px,2vw,30px)] bg-panel" style={{ height: `${h}svh` }}>
              <span className="absolute inset-x-0 top-[8%] h-1 bg-back/70" />
              {[0, 1, 2].map((p) => (
                <span
                  key={p}
                  className="smoke absolute -top-4 left-1/2 block h-[clamp(14px,1.8vw,26px)] w-[clamp(14px,1.8vw,26px)] rounded-full bg-[#3a4352]"
                  style={{ animationDelay: `${-(p * 1.4 + i * 0.7)}s` }}
                />
              ))}
            </span>
          ))}
        </div>

        <div className="absolute bottom-[14%] left-1/2 w-[min(34svh,56vw,300px)] -translate-x-1/2">
          <Figure />
        </div>

        <div className="absolute bottom-[5%] left-1/2 flex w-max max-w-[94vw] -translate-x-1/2 flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${contactInfo.email}`}
            className="label inline-flex items-center gap-3 rounded-full bg-front px-6 py-4 text-paper transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-sm bg-paper px-4 py-3.5 font-mono text-xs text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            {copyState === "copied"
              ? "Copied to clipboard"
              : copyState === "failed"
                ? "Couldn't copy. Select it instead."
                : contactInfo.email}
          </button>
          <span role="status" className="sr-only">
            {copyState === "copied" ? "Email copied to clipboard." : copyState === "failed" ? "Couldn't copy the email." : ""}
          </span>
        </div>
      </div>
    </section>
  );
};

export const SiteFooter = () => (
  <footer className="paper-columns w-full bg-paper text-ink">
    <div className="mx-auto max-w-7xl px-5 sm:px-10">
      <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-6">
          <Mark className="h-10 w-10 text-front" />
          <div>
            <p className="label m-0 text-ink/55">Get in touch</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="mt-2 block rounded-sm text-2xl text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:text-front focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:text-3xl"
            >
              {contactInfo.email}
            </a>
            <p className="label mt-3 mb-0 text-ink/55">{contactInfo.location}</p>
          </div>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
          {[
            { label: "GitHub", href: contactInfo.githubUrl },
            { label: "LinkedIn", href: contactInfo.linkedinUrl },
          ].map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label rounded-sm text-ink transition-colors hover:text-front focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={contactInfo.resumeUrl}
              download
              className="label rounded-sm text-ink transition-colors hover:text-front focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Download CV
            </a>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink/15 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label m-0 text-ink/55">
          © {new Date().getFullYear()} {contactInfo.name}
        </p>
        <p className="label m-0 text-ink/55">Senior software engineer</p>
        <a
          href="#top"
          className="label inline-flex items-center gap-2 rounded-sm text-ink transition-colors hover:text-front focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);
