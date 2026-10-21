import type { ProjectItem } from "@/data/portfolio-data";

/*
 * Turns a project's architecture into graph geometry. Plain numbers only, so
 * the 3D scene and the static SVG fallback share it without loading three.js.
 *
 * Every graph uses one fixed pool of node slots, so switching projects can
 * morph the same nodes instead of remounting them:
 *   slot 0      the entry (the request or input)
 *   slot 1      the hub (router topology only)
 *   slot 2..    the steps or specialists, in data order
 */

export type Vec3 = [number, number, number];

export const MAX_STEPS = 7;
export const POOL_SIZE = 2 + MAX_STEPS;
export const ENTRY = 0;
export const HUB = 1;
export const stepSlot = (i: number) => 2 + i;

export const accentHex: Record<ProjectItem["accent"], string> = {
  coral: "#ff7a6b",
  mint: "#52df9d",
  cyan: "#4be1ec",
  lilac: "#a882ff",
  amber: "#f5a623",
};

export interface GraphNode {
  pos: Vec3;
  label: string;
  kind: "entry" | "hub" | "step";
  visible: boolean;
}

/** One hop of a pulse's journey. `arc` hops follow the curved return edge. */
export interface RouteHop {
  from: number;
  to: number;
  arc?: boolean;
}

export interface GraphLayout {
  nodes: GraphNode[];
  edges: [number, number][];
  /** The bounded return edge, drawn as a curve through `control`. */
  arc?: { from: number; to: number; control: Vec3 };
  /** Router graphs vary the specialist per pass; `pass` picks which one. */
  route: (pass: number) => RouteHop[];
  /** Specialists a router pass can visit, for cycling. */
  routeCount: number;
}

const chainPos = (i: number, total: number): Vec3 => {
  // A gentle helix descending the panel, so a chain reads as depth, not a list.
  const t = total > 1 ? i / (total - 1) : 0;
  const y = 2.5 - t * 5;
  const a = i * 1.05;
  return [Math.sin(a) * 1.5, y, Math.cos(a) * 0.9];
};

export const buildLayout = (project: ProjectItem): GraphLayout => {
  const steps = project.flow.nodes.slice(0, MAX_STEPS);
  const n = steps.length;
  const nodes: GraphNode[] = Array.from({ length: POOL_SIZE }, () => ({
    pos: [0, 0, 0] as Vec3,
    label: "",
    kind: "step" as const,
    visible: false,
  }));

  nodes[ENTRY] = { pos: [0, 2.6, 0], label: project.flow.entry, kind: "entry", visible: true };

  if (project.topology === "router") {
    nodes[HUB] = { pos: [0, 1.0, 0], label: project.flow.router, kind: "hub", visible: true };
    steps.forEach((step, i) => {
      // Half-step offset, plus a strong tilt, so no two specialists share a column.
      const a = ((i + 0.5) / n) * Math.PI * 2 + Math.PI / 2;
      nodes[stepSlot(i)] = {
        pos: [Math.cos(a) * 2.4, -1.3 + Math.sin(a) * 0.9, Math.sin(a) * 1.2],
        label: step.title,
        kind: "step",
        visible: true,
      };
    });
    // Unused slots rest inside the hub so they grow out of it on the next morph.
    for (let i = n; i < MAX_STEPS; i++) nodes[stepSlot(i)].pos = [...nodes[HUB].pos];

    return {
      nodes,
      edges: [[ENTRY, HUB], ...steps.map((_, i) => [HUB, stepSlot(i)] as [number, number])],
      route: (pass) => [
        { from: ENTRY, to: HUB },
        { from: HUB, to: stepSlot(pass % n) },
      ],
      routeCount: n,
    };
  }

  // pipeline and loop: entry then each step in order.
  const total = n + 1;
  nodes[ENTRY].pos = chainPos(0, total);
  nodes[HUB].pos = [...nodes[ENTRY].pos];
  steps.forEach((step, i) => {
    nodes[stepSlot(i)] = { pos: chainPos(i + 1, total), label: step.title, kind: "step", visible: true };
  });
  for (let i = n; i < MAX_STEPS; i++) nodes[stepSlot(i)].pos = [...nodes[stepSlot(n - 1)].pos];

  const edges: [number, number][] = [[ENTRY, stepSlot(0)]];
  for (let i = 0; i < n - 1; i++) edges.push([stepSlot(i), stepSlot(i + 1)]);

  const forward = (a: number, b: number): RouteHop[] => {
    const hops: RouteHop[] = [];
    for (let i = a; i < b; i++) hops.push({ from: stepSlot(i), to: stepSlot(i + 1) });
    return hops;
  };

  const loop = project.topology === "loop" ? project.flow.loop : undefined;
  if (loop && loop.from < n && loop.to < loop.from) {
    const control = arcControl(
      nodes[stepSlot(loop.from)].pos,
      nodes[stepSlot(loop.to)].pos,
      [0, 0, 0],
    );
    return {
      nodes,
      edges,
      arc: { from: stepSlot(loop.from), to: stepSlot(loop.to), control },
      // One pass runs to the failing step, returns once, then finishes.
      route: () => [
        { from: ENTRY, to: stepSlot(0) },
        ...forward(0, loop.from),
        { from: stepSlot(loop.from), to: stepSlot(loop.to), arc: true },
        ...forward(loop.to, n - 1),
      ],
      routeCount: 1,
    };
  }

  return {
    nodes,
    edges,
    route: () => [{ from: ENTRY, to: stepSlot(0) }, ...forward(0, n - 1)],
    routeCount: 1,
  };
};

/** Control point that bows the return edge out to one side and towards the camera. */
export const arcControl = (a: Vec3, b: Vec3, out: Vec3): Vec3 => {
  const mx = (a[0] + b[0]) / 2;
  const side = mx >= 0 ? -1 : 1;
  out[0] = mx + side * 2.4;
  out[1] = (a[1] + b[1]) / 2;
  out[2] = (a[2] + b[2]) / 2 + 1.2;
  return out;
};

/** A point on the quadratic curve a → control → b. */
export const quadPoint = (a: Vec3, c: Vec3, b: Vec3, t: number, out: Vec3): Vec3 => {
  const u = 1 - t;
  for (let k = 0; k < 3; k++) out[k] = u * u * a[k] + 2 * u * t * c[k] + t * t * b[k];
  return out;
};

export const topologyLabel: Record<ProjectItem["topology"], string> = {
  router: "Router: one request, one specialist",
  pipeline: "Pipeline: every step, in order",
  loop: "Loop: in order, with one bounded return",
};
