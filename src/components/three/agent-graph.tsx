import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Color,
  Vector3,
  type BufferGeometry,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import type { ProjectItem } from "@/data/portfolio-data";
import {
  ENTRY,
  HUB,
  POOL_SIZE,
  accentHex,
  arcControl,
  buildLayout,
  quadPoint,
  type GraphLayout,
  type Vec3,
} from "@/components/three/graph-layout";

/*
 * The Work section's signature: one graph that takes the shape of each
 * project's architecture. The node pool stays mounted and morphs between
 * layouts; pulses run the project's real order of execution.
 */

const IVORY = "#e1e0cc";
const AMBER = "#f5b56b";
const MAX_EDGES = POOL_SIZE;
const ARC_SEGMENTS = 24;
const MAX_ROUTE_POINTS = POOL_SIZE * 2 + ARC_SEGMENTS + 2;
const PULSE_SPEED = 2.4; // units per second
const PULSE_GAP = 0.9; // pause between passes, in seconds of travel
const TRAIL = [0, 0.22, 0.42]; // lead pulse and two fading trail pulses

const sizeFor = (kind: GraphLayout["nodes"][number]["kind"]) =>
  kind === "hub" ? 0.3 : kind === "entry" ? 0.17 : 0.2;

// Scratch objects, reused every frame so the loop allocates nothing.
const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpColor = new Color();
const ctrl: Vec3 = [0, 0, 0];
const arcPt: Vec3 = [0, 0, 0];

interface DragState {
  offset: number;
  dragging: boolean;
  lastX: number;
}

interface SceneProps {
  layout: GraphLayout;
  accent: string;
  drag: React.RefObject<DragState>;
  /** Places node label i in panel pixels; the owner of the label elements applies it. */
  placeLabel: (i: number, x: number, y: number, opacity: number) => void;
}

interface Motion {
  pos: Vec3[];
  scale: number[];
  travel: number;
  pass: number;
  route: Float32Array;
}

const Scene = ({ layout, accent, drag, placeLabel }: SceneProps) => {
  const size = useThree((s) => s.size);
  const group = useRef<Group>(null);
  const nodes = useRef<(Mesh | null)[]>([]);
  const pulses = useRef<(Mesh | null)[]>([]);
  const edges = useRef<LineSegments>(null);
  const arc = useRef<LineSegments>(null);
  const motion = useRef<Motion | null>(null);

  const buffers = useMemo(
    () => ({
      edges: new Float32Array(MAX_EDGES * 6),
      arc: new Float32Array(ARC_SEGMENTS * 6),
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const ease = 1 - Math.exp(-dt * 4);
    if (!motion.current) {
      motion.current = {
        pos: layout.nodes.map((n) => [...n.pos] as Vec3),
        scale: layout.nodes.map((n) => (n.visible ? sizeFor(n.kind) : 0)),
        travel: 0,
        pass: 0,
        route: new Float32Array(MAX_ROUTE_POINTS * 3),
      };
    }
    const m = motion.current;

    // 1. Morph every node slot toward the current layout.
    const target = tmpColor.set(accent);
    for (let i = 0; i < POOL_SIZE; i++) {
      const node = layout.nodes[i];
      const p = m.pos[i];
      for (let k = 0; k < 3; k++) p[k] += (node.pos[k] - p[k]) * ease;
      m.scale[i] += ((node.visible ? sizeFor(node.kind) : 0) - m.scale[i]) * ease;
      const mesh = nodes.current[i];
      if (!mesh) continue;
      mesh.position.set(p[0], p[1], p[2]);
      mesh.scale.setScalar(Math.max(m.scale[i], 0.0001));
      if (i !== ENTRY && i !== HUB) {
        (mesh.material as MeshStandardMaterial).color.lerp(target, ease);
        (mesh.material as MeshStandardMaterial).emissive.lerp(target, ease);
      }
    }

    // 2. Edges follow the moving nodes. Buffers are written through the
    // geometries, which own them once mounted.
    const eg = edges.current;
    if (eg) {
      const geo = eg.geometry as BufferGeometry;
      const e = geo.attributes.position.array as Float32Array;
      layout.edges.forEach(([a, b], idx) => {
        const o = idx * 6;
        for (let k = 0; k < 3; k++) {
          e[o + k] = m.pos[a][k];
          e[o + 3 + k] = m.pos[b][k];
        }
      });
      geo.setDrawRange(0, layout.edges.length * 2);
      geo.attributes.position.needsUpdate = true;
      (eg.material as LineBasicMaterial).color.lerp(target, ease);
    }

    const ag = arc.current;
    if (ag) {
      const geo = ag.geometry as BufferGeometry;
      if (layout.arc) {
        const a = m.pos[layout.arc.from];
        const b = m.pos[layout.arc.to];
        arcControl(a, b, ctrl);
        const buf = geo.attributes.position.array as Float32Array;
        for (let s = 0; s < ARC_SEGMENTS; s++) {
          quadPoint(a, ctrl, b, s / ARC_SEGMENTS, arcPt);
          buf[s * 6] = arcPt[0];
          buf[s * 6 + 1] = arcPt[1];
          buf[s * 6 + 2] = arcPt[2];
          quadPoint(a, ctrl, b, (s + 1) / ARC_SEGMENTS, arcPt);
          buf[s * 6 + 3] = arcPt[0];
          buf[s * 6 + 4] = arcPt[1];
          buf[s * 6 + 5] = arcPt[2];
        }
        geo.setDrawRange(0, ARC_SEGMENTS * 2);
        geo.attributes.position.needsUpdate = true;
      } else {
        geo.setDrawRange(0, 0);
      }
    }

    // 3. Pulses run the route as a polyline sampled by distance.
    const hops = layout.route(m.pass);
    const r = m.route;
    let count = 0;
    const push = (v: Vec3) => {
      if (count >= MAX_ROUTE_POINTS) return;
      r[count * 3] = v[0];
      r[count * 3 + 1] = v[1];
      r[count * 3 + 2] = v[2];
      count++;
    };
    hops.forEach((hop, h) => {
      if (h === 0) push(m.pos[hop.from]);
      if (hop.arc) {
        const a = m.pos[hop.from];
        const b = m.pos[hop.to];
        arcControl(a, b, ctrl);
        for (let s = 1; s <= ARC_SEGMENTS; s++) push(quadPoint(a, ctrl, b, s / ARC_SEGMENTS, arcPt));
      } else {
        push(m.pos[hop.to]);
      }
    });
    let length = 0;
    for (let i = 1; i < count; i++) {
      tmpA.set(r[i * 3 - 3], r[i * 3 - 2], r[i * 3 - 1]);
      tmpB.set(r[i * 3], r[i * 3 + 1], r[i * 3 + 2]);
      length += tmpA.distanceTo(tmpB);
    }
    m.travel += dt * PULSE_SPEED;
    if (m.travel > length + PULSE_GAP * PULSE_SPEED) {
      m.travel = 0;
      m.pass = (m.pass + 1) % Math.max(layout.routeCount, 1);
    }
    TRAIL.forEach((lag, t) => {
      const pulse = pulses.current[t];
      if (!pulse) return;
      const d = m.travel - lag;
      if (d < 0 || d > length || count < 2) {
        pulse.visible = false;
        return;
      }
      let walked = 0;
      for (let i = 1; i < count; i++) {
        tmpA.set(r[i * 3 - 3], r[i * 3 - 2], r[i * 3 - 1]);
        tmpB.set(r[i * 3], r[i * 3 + 1], r[i * 3 + 2]);
        const seg = tmpA.distanceTo(tmpB);
        if (walked + seg >= d) {
          pulse.position.copy(tmpA.lerp(tmpB, seg > 0 ? (d - walked) / seg : 0));
          break;
        }
        walked += seg;
      }
      pulse.visible = true;
      pulse.scale.setScalar(0.085 * (1 - t * 0.28));
    });

    // 4. Slow idle sway plus whatever the visitor dragged.
    const g = group.current;
    if (g) {
      const sway = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
      g.rotation.y += (sway + drag.current.offset - g.rotation.y) * ease;
      g.rotation.x = 0.1;
    }

    // 5. Frame the graph for the panel's shape, then place the DOM labels.
    // Far enough to fit the graph's height (labels included) and its width.
    const aspect = size.width / Math.max(size.height, 1);
    const dist = Math.max(10.2, 7.8 / aspect);
    state.camera.position.z += (dist - state.camera.position.z) * ease;
    state.camera.lookAt(0, 0, 0);

    for (let i = 0; i < POOL_SIZE; i++) {
      const mesh = nodes.current[i];
      if (!mesh) continue;
      const visible = layout.nodes[i].visible ? m.scale[i] / sizeFor(layout.nodes[i].kind) : 0;
      mesh.getWorldPosition(tmpA);
      const depth = Math.min(Math.max((tmpA.z + 2) / 4, 0), 1);
      tmpA.project(state.camera);
      const x = (tmpA.x * 0.5 + 0.5) * size.width;
      const y = (-tmpA.y * 0.5 + 0.5) * size.height;
      placeLabel(i, x, y + 16, visible < 0.3 ? 0 : Math.min(visible, 1) * (0.45 + 0.55 * depth));
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
        >
          {i === ENTRY ? <octahedronGeometry args={[1, 0]} /> : <sphereGeometry args={[1, 24, 16]} />}
          <meshStandardMaterial
            color={i === ENTRY || i === HUB ? IVORY : accent}
            emissive={i === ENTRY || i === HUB ? IVORY : accent}
            emissiveIntensity={i === ENTRY || i === HUB ? 0.08 : 0.22}
            roughness={0.45}
            metalness={0.1}
          />
        </mesh>
      ))}

      <lineSegments ref={edges}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.45} depthWrite={false} />
      </lineSegments>

      <lineSegments ref={arc}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.arc, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={AMBER} transparent opacity={0.7} depthWrite={false} />
      </lineSegments>

      {TRAIL.map((_, t) => (
        <mesh
          key={t}
          visible={false}
          ref={(el) => {
            pulses.current[t] = el;
          }}
        >
          <sphereGeometry args={[1, 12, 8]} />
          <meshBasicMaterial color={IVORY} transparent opacity={1 - t * 0.3} />
        </mesh>
      ))}
    </group>
  );
};

export default function AgentGraph({ project, active }: { project: ProjectItem; active: boolean }) {
  const layout = useMemo(() => buildLayout(project), [project]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const drag = useRef<DragState>({ offset: 0, dragging: false, lastX: 0 });

  const placeLabel = (i: number, x: number, y: number, opacity: number) => {
    const el = labels.current[i];
    if (!el) return;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateX(-50%)`;
    el.style.opacity = opacity.toFixed(2);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.dragging = true;
    drag.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    drag.current.offset = Math.max(-0.9, Math.min(0.9, drag.current.offset + dx * 0.006));
  };
  const onPointerUp = () => {
    drag.current.dragging = false;
  };

  return (
    <div
      className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Canvas
        flat
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ fov: 40, position: [0, 0.6, 9.2] }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 6]} intensity={1.6} />
        <Scene layout={layout} accent={accentHex[project.accent]} drag={drag} placeLabel={placeLabel} />
      </Canvas>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {layout.nodes.map((node, i) => (
          <span
            key={i}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute top-0 left-0 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-cream/90"
            style={{ opacity: 0 }}
          >
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}
