import type { ProjectItem } from "@/data/portfolio-data";
import { accentHex, buildLayout, type Vec3 } from "@/components/three/graph-layout";

const IVORY = "#e1e0cc";
const AMBER = "#f5b56b";

// Flatten the 3D layout: a light oblique projection keeps a hint of depth.
const toSvg = ([x, y, z]: Vec3): [number, number] => [200 + x * 62 + z * 10, 222 - y * 70 + z * 8];

/** Static drawing of the same graph, for reduced motion, no WebGL, or while 3D loads. */
export const AgentGraphFallback = ({ project }: { project: ProjectItem }) => {
  const layout = buildLayout(project);
  const accent = accentHex[project.accent];
  const pt = (i: number) => toSvg(layout.nodes[i].pos);

  return (
    <svg viewBox="0 0 400 444" className="h-full w-full" aria-hidden="true">
      {layout.edges.map(([a, b]) => {
        const [x1, y1] = pt(a);
        const [x2, y2] = pt(b);
        return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeOpacity={0.5} />;
      })}
      {layout.arc && (() => {
        const [x1, y1] = pt(layout.arc.from);
        const [x2, y2] = pt(layout.arc.to);
        const [cx, cy] = toSvg(layout.arc.control);
        return (
          <path
            d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
            fill="none"
            stroke={AMBER}
            strokeOpacity={0.75}
            strokeDasharray="4 4"
          />
        );
      })()}
      {layout.nodes.map((node, i) => {
        if (!node.visible) return null;
        const [x, y] = pt(i);
        const r = node.kind === "hub" ? 11 : node.kind === "entry" ? 7 : 8;
        const fill = node.kind === "step" ? accent : IVORY;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={fill} fillOpacity={0.9} />
            <text
              x={x}
              y={y + r + 13}
              textAnchor="middle"
              fill={IVORY}
              fillOpacity={0.85}
              stroke="#060a12"
              strokeWidth={3}
              paintOrder="stroke"
              fontSize="10"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
