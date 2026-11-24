"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef, type RefObject } from "react";
import { Group, MathUtils, SRGBColorSpace, TextureLoader } from "three";
import { home, scenes, type StageInput } from "./composition";
import { makeGlass, tints } from "./glass";
import { makeSyllables, syllableOutlines } from "./outlines";

type Props = {
  capture: boolean;
  running: boolean;
  input: RefObject<StageInput>;
  onReady: () => void;
  onFailure: () => void;
};

declare global { interface Window { __hangulReady?: boolean } }

const float = [
  { period: 7.9, phase: .2, amplitude: .105 },
  { period: 10.6, phase: 1.8, amplitude: .115 },
  { period: 9.2, phase: 3.7, amplitude: .14 },
];

function Sculpture({ capture, input, onReady, onFailure }: Props) {
  const [{ geometries, materials }] = useState(() => ({
    geometries: makeSyllables(syllableOutlines()),
    materials: tints.map((syllable) => syllable.map((jamo, index) => makeGlass(jamo, index))),
  }));
  const source = useLoader(TextureLoader, "/assets/hangul-ground.webp");
  const [ground] = useState(() => {
    const texture = source.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  });
  const groups = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);
  const frames = useRef(0);
  const nudge = useRef({ previous: [0, 0], impulse: [0, 0] });
  const ready = useRef(onReady);
  const failure = useRef(onFailure);
  const { gl } = useThree();
  const root = useRef<Group>(null);
  const backdrop = useRef<Group>(null);
  const d = MathUtils.damp;

  useEffect(() => {
    const surface = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); failure.current(); };
    surface.addEventListener("webglcontextlost", lost);
    return () => surface.removeEventListener("webglcontextlost", lost);
  }, [gl]);

  useEffect(() => () => {
    geometries.flat().forEach((geometry) => geometry.dispose());
    materials.flat().forEach((material) => material.dispose());
    ground.dispose();
  }, [geometries, materials, ground]);

  useFrame(({ gl: renderer, viewport }, delta) => {
    const dt = Math.min(delta, .05);
    elapsed.current += dt;
    const time = capture ? 2.2 : elapsed.current;
    const { scene, pointer, impulse: drag } = input.current;
    const { previous, impulse } = nudge.current;
    for (let axis = 0; axis < 2; axis++) {
      impulse[axis] = MathUtils.clamp(d(impulse[axis], 0, 2.5, dt) + drag[axis] - previous[axis], -1, 1);
      previous[axis] = drag[axis];
    }
    const pixels = Math.max(renderer.domElement.width, renderer.domElement.height);
    renderer.transmissionResolutionScale = Math.min(.6, 900 / Math.max(pixels, 1));
    const { frame, letters } = scenes[capture ? "hero" : scene];
    root.current?.scale.setScalar(Math.min(viewport.width / frame[0], viewport.height / frame[1]));
    if (backdrop.current) backdrop.current.visible = capture || scene === "hero";
    groups.current.forEach((group, i) => {
      if (!group) return;
      const { rotation } = home[i];
      const { position, turn, scale } = letters[i];
      const { period, phase, amplitude } = float[i];
      const cycle = time / period * 2 * Math.PI + phase;
      const [px, py] = capture ? [0, 0] : pointer;
      const settle = (value: number, target: number, rate = 4) => capture ? target : d(value, target, rate, dt);
      group.position.set(
        settle(group.position.x, position[0] + Math.cos(cycle) * .036),
        settle(group.position.y, position[1] + Math.sin(cycle) * amplitude),
        settle(group.position.z, position[2] + Math.cos(cycle) * .08),
      );
      group.rotation.set(
        settle(group.rotation.x, rotation[0] + Math.sin(cycle) * .042 - py * .08 - impulse[1] * .16),
        settle(group.rotation.y, rotation[1] + turn + Math.cos(cycle) * .045 + px * .10 + impulse[0] * .2),
        settle(group.rotation.z, rotation[2] + Math.sin(cycle * .8) * .027),
      );
      group.scale.setScalar(Math.max(.0001, settle(group.scale.x, scale)));
      group.visible = group.scale.x > .01;
    });
    if (++frames.current === 4) {
      requestAnimationFrame(() => {
        ready.current();
        if (capture) requestAnimationFrame(() => { window.__hangulReady = true; });
      });
    }
  });

  return <>
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#d9d8cf"]} />
      <Lightformer form="rect" position={[-4, 4, 5]} scale={[5, 3, 1]} intensity={3.2} color="#ffffff" target={[0, 0, 0]} />
      <Lightformer form="rect" position={[5, 2, 3]} scale={[1.2, 6, 1]} intensity={3} color="#ffffff" target={[0, 0, 0]} />
      <Lightformer form="rect" position={[0, -5, 2]} scale={[7, 1.4, 1]} intensity={3.4} color="#fbfff2" target={[0, 0, 0]} />
      <Lightformer form="rect" position={[-5, -1, 1]} scale={[1, 5, 1]} intensity={1.4} color="#c8dcab" target={[0, 0, 0]} />
      <Lightformer form="rect" position={[2.5, 5, 1]} scale={[4, .5, 1]} intensity={.12} color="#3b3d36" target={[0, 0, 0]} />
      <Lightformer form="rect" position={[6, -2, 1]} scale={[.6, 4, 1]} intensity={.12} color="#3b3d36" target={[0, 0, 0]} />
    </Environment>
    <directionalLight position={[-4, 6, 5]} intensity={.7} color="#fffaf0" />
    <group ref={root}>
      <group ref={backdrop}><mesh position={[0, 0, -1.6]} scale={[9.3 * 1.092, 6.1 * 1.092, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={ground} toneMapped={false} />
      </mesh></group>
      <mesh position={[0, 0, -1.65]} scale={[40, 30, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#f6f3ec" toneMapped={false} />
      </mesh>
      {geometries.map((syllable, i) => (
        <group key={i} ref={(group) => { groups.current[i] = group; }} position={home[i].position} rotation={home[i].rotation} scale={home[i].scale}>
          {syllable.map((geometry, j) => <mesh key={j} geometry={geometry} material={materials[i][j]} />)}
        </group>
      ))}
    </group>
  </>;
}

export default function CanvasScene(props: Props) {
  const [dpr, setDpr] = useState(1.5);
  return <Canvas flat camera={{ position: [0, 0, 17.3], fov: 20, near: .1, far: 60 }}
    dpr={Math.min(props.capture ? 1.75 : dpr, typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio))}
    frameloop={props.running ? "always" : "never"}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: props.capture }}
    onCreated={({ gl }) => { gl.transmissionResolutionScale = .35; }}
    fallback={null}>
    {!props.capture && <PerformanceMonitor flipflops={3} onFallback={() => setDpr(1)} onChange={({ factor }) => setDpr(1 + factor * .75)} />}
    <Suspense fallback={null}><Sculpture {...props} /></Suspense>
  </Canvas>;
}
