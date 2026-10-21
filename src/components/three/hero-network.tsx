import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  type BufferGeometry,
  type Group,
} from "three";

/*
 * The hero's loose agent network: drifting nodes that link to near neighbours.
 * It is the unstructured echo of the graph in the Work section, so it stays
 * quiet: low opacity, slow drift, no structure.
 */

const IVORY = new Color("#e1e0cc");
const AMBER = new Color("#f5b56b");
const BOUNDS = { x: 9, y: 5, zMin: -4, zMax: 2 };
const LINK_DISTANCE = 2.2;
const MAX_LINKS = 260;

type Pointer = { x: number; y: number };

/** Small seeded PRNG (mulberry32), so the layout is stable across renders. */
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** A soft round dot, so points render as discs instead of squares. */
const makeDotTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new CanvasTexture(canvas);
};

const Network = ({ count, pointer }: { count: number; pointer: React.RefObject<Pointer> }) => {
  const group = useRef<Group>(null);
  const pointsGeo = useRef<BufferGeometry>(null);
  const linesGeo = useRef<BufferGeometry>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new Color();
    const random = seeded(7);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() * 2 - 1) * BOUNDS.x;
      positions[i * 3 + 1] = (random() * 2 - 1) * BOUNDS.y;
      positions[i * 3 + 2] = BOUNDS.zMin + random() * (BOUNDS.zMax - BOUNDS.zMin);
      const speed = 0.05 + random() * 0.1;
      const angle = random() * Math.PI * 2;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.sin(angle) * speed;
      velocities[i * 3 + 2] = (random() * 2 - 1) * 0.03;
      tmp.copy(random() < 0.3 ? AMBER : IVORY);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return {
      positions,
      velocities,
      colors,
      linePositions: new Float32Array(MAX_LINKS * 6),
      lineColors: new Float32Array(MAX_LINKS * 6),
    };
  }, [count]);

  const texture = useMemo(() => makeDotTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    const pg = pointsGeo.current;
    const lg = linesGeo.current;
    if (!pg || !lg) return;
    const dt = Math.min(delta, 0.05);
    // Buffers are read through the geometries: three owns them once mounted.
    const p = pg.attributes.position.array as Float32Array;
    const v = pg.attributes.velocity.array as Float32Array;
    const c = pg.attributes.color.array as Float32Array;
    const lp = lg.attributes.position.array as Float32Array;
    const lc = lg.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      p[ix] += v[ix] * dt;
      p[ix + 1] += v[ix + 1] * dt;
      p[ix + 2] += v[ix + 2] * dt;
      if (p[ix] > BOUNDS.x || p[ix] < -BOUNDS.x) v[ix] *= -1;
      if (p[ix + 1] > BOUNDS.y || p[ix + 1] < -BOUNDS.y) v[ix + 1] *= -1;
      if (p[ix + 2] > BOUNDS.zMax || p[ix + 2] < BOUNDS.zMin) v[ix + 2] *= -1;
    }

    let links = 0;
    for (let i = 0; i < count && links < MAX_LINKS; i++) {
      for (let j = i + 1; j < count && links < MAX_LINKS; j++) {
        const dx = p[i * 3] - p[j * 3];
        const dy = p[i * 3 + 1] - p[j * 3 + 1];
        const dz = p[i * 3 + 2] - p[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > LINK_DISTANCE) continue;
        const t = 1 - d / LINK_DISTANCE;
        const o = links * 6;
        for (let k = 0; k < 3; k++) {
          lp[o + k] = p[i * 3 + k];
          lp[o + 3 + k] = p[j * 3 + k];
          lc[o + k] = c[i * 3 + k] * t;
          lc[o + 3 + k] = c[j * 3 + k] * t;
        }
        links++;
      }
    }

    pg.attributes.position.needsUpdate = true;
    lg.setDrawRange(0, links * 2);
    lg.attributes.position.needsUpdate = true;
    lg.attributes.color.needsUpdate = true;

    const g = group.current;
    if (g) {
      const ease = 1 - Math.exp(-dt * 2);
      g.rotation.y += (pointer.current.x * 0.12 - g.rotation.y) * ease;
      g.rotation.x += (-pointer.current.y * 0.08 - g.rotation.x) * ease;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-velocity" args={[data.velocities, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.09}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeo}>
          <bufferAttribute attach="attributes-position" args={[data.linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

export default function HeroNetwork({ active }: { active: boolean }) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const count = useMemo(() => (window.innerWidth < 768 ? 60 : 110), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      camera={{ fov: 50, position: [0, 0, 10] }}
      style={{ pointerEvents: "none" }}
    >
      <Network count={count} pointer={pointer} />
    </Canvas>
  );
}
