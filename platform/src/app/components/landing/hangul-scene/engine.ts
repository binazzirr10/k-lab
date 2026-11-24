import {
  Color, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, PMREMGenerator, PerspectiveCamera, PlaneGeometry, Raycaster, Scene,
  SRGBColorSpace, NoToneMapping, TextureLoader, Vector2, Vector3, WebGLRenderer, DirectionalLight, type BufferGeometry,
} from "three";
import { home, scenes, type SceneConfig, type StageInput } from "./composition";
import { makeGlass, tints } from "./glass";
import { makeSyllables, syllableOutlines } from "./outlines";

declare global { interface Window { __hangulReady?: boolean } }

type Options = { capture: boolean; input: StageInput; onReady: () => void; onFailure: () => void };
export type Engine = { setRunning: (running: boolean) => void; dispose: () => void };

const axes = ["x", "y", "z"] as const;
const sounds = ["한", "글", "말"];
const float = [
  { period: 7.9, phase: .2, amplitude: .105 },
  { period: 10.6, phase: 1.8, amplitude: .115 },
  { period: 9.2, phase: 3.7, amplitude: .14 },
];

/** One jamo on a spring: where it flies when its syllable comes apart, and how it is moving now. */
type Piece = { away: Vector3; spin: Vector3; delay: number; offset: Vector3; velocity: Vector3; angle: Vector3; whirl: Vector3 };

function makePieces(geometries: BufferGeometry[][]): Piece[][] {
  return geometries.map((syllable, i) => syllable.map((geometry, j) => {
    geometry.computeBoundingBox();
    const centre = geometry.boundingBox?.getCenter(new Vector3()) ?? new Vector3();
    const side = j % 2 ? 1 : -1;
    const away = centre.clone().setZ(0).multiplyScalar(1.15);
    away.x += side * .12;
    away.z = .55 - j * .5;
    return {
      away, spin: new Vector3(side * (.55 + i * .12), .9 - j * .55, side * (.3 + j * .14)), delay: i * .13 + j * .085,
      offset: new Vector3(), velocity: new Vector3(), angle: new Vector3(), whirl: new Vector3(),
    };
  }));
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = .8;
  window.speechSynthesis.speak(utterance);
}

// Soft boxes around the glass: position, size, brightness, colour.
const lamps: [x: number, y: number, z: number, w: number, h: number, power: number, color: string][] = [
  [-4, 4, 5, 5, 3, 3.2, "#ffffff"], [5, 2, 3, 1.2, 6, 3, "#ffffff"], [0, -5, 2, 7, 1.4, 3.4, "#fbfff2"],
  [-5, -1, 1, 1, 5, 1.4, "#c8dcab"], [2.5, 5, 1, 4, .5, .12, "#3b3d36"], [6, -2, 1, .6, 4, .12, "#3b3d36"],
];

function makeSurroundings(renderer: WebGLRenderer) {
  const room = new Scene();
  room.background = new Color("#d9d8cf");
  const plane = new PlaneGeometry();
  const materials = lamps.map(([x, y, z, w, h, power, color]) => {
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(power), side: DoubleSide, toneMapped: false });
    const lamp = new Mesh(plane, material);
    lamp.position.set(x, y, z);
    lamp.scale.set(w, h, 1);
    lamp.lookAt(0, 0, 0);
    room.add(lamp);
    return material;
  });
  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(room, 0, .1, 100);
  generator.dispose();
  plane.dispose();
  materials.forEach((material) => material.dispose());
  return target;
}

export function createEngine(canvas: HTMLCanvasElement, { capture, input, onReady, onFailure }: Options): Engine {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: capture });
  renderer.toneMapping = NoToneMapping;
  const scene = new Scene();
  const camera = new PerspectiveCamera(20, 1, .1, 60);
  camera.position.z = 17.3;
  const surroundings = makeSurroundings(renderer);
  scene.environment = surroundings.texture;
  const sun = new DirectionalLight("#fffaf0", .7);
  sun.position.set(-4, 6, 5);
  scene.add(sun);

  const root = new Group();
  scene.add(root);
  const plane = new PlaneGeometry();
  const floorMaterial = new MeshBasicMaterial({ color: "#f6f3ec", toneMapped: false });
  const floor = new Mesh(plane, floorMaterial);
  floor.position.z = -1.65;
  floor.scale.set(40, 30, 1);
  const groundMaterial = new MeshBasicMaterial({ toneMapped: false });
  const backdrop = new Mesh(plane, groundMaterial);
  backdrop.position.z = -1.6;
  backdrop.scale.set(9.3 * 1.092, 6.1 * 1.092, 1);
  root.add(floor, backdrop);

  const geometries = makeSyllables(syllableOutlines());
  const materials = tints.map((syllable) => syllable.map((jamo, index) => makeGlass(jamo, index)));
  const pieces = makePieces(geometries);
  const groups = geometries.map((syllable, i) => {
    const group = new Group();
    group.position.set(...home[i].position);
    group.rotation.set(...home[i].rotation);
    group.scale.setScalar(home[i].scale);
    syllable.forEach((geometry, j) => group.add(new Mesh(geometry, materials[i][j])));
    root.add(group);
    return group;
  });
  const meshes = groups.map((group) => group.children as Mesh[]);

  let view = { width: 1, height: 1 };
  let pixelRatio = capture ? 2 : Math.min(1.5, Math.max(1, devicePixelRatio));
  let size = { width: 0, height: 0 };
  let running = false;
  let loaded = false;
  let disposed = false;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let frames = 0;
  let opened: number | null = null;
  let hovered = -1;
  let taps = input.taps;
  let restless = 0;
  let skipped = false;
  let slow = 0;
  let timed = 0;
  let spent = 0;
  const struck = [-9, -9, -9];
  const previous = [0, 0];
  const impulse = [0, 0];
  const lastPointer = [0, 0];
  const ray = new Raycaster();
  const point = new Vector2();
  const d = MathUtils.damp;

  const resize = () => {
    size = { width: canvas.clientWidth, height: canvas.clientHeight };
    if (!size.width || !size.height) return;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(size.width, size.height, false);
    // Refraction is blurred anyway, so its picture can stay small.
    renderer.transmissionResolutionScale = Math.min(.6, 760 / Math.max(size.width * pixelRatio, size.height * pixelRatio));
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    const height = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    view = { width: height * camera.aspect, height };
    if (loaded) paint(0);
  };

  function paint(dt: number) {
    elapsed += dt;
    const time = capture ? 2.2 : elapsed;
    const { scene: name, pointer, impulse: drag, leave, inside } = input;
    for (let axis = 0; axis < 2; axis++) {
      impulse[axis] = MathUtils.clamp(d(impulse[axis], 0, 2.5, dt) + drag[axis] - previous[axis], -1, 1);
      previous[axis] = drag[axis];
    }
    const config: SceneConfig = scenes[capture ? "hero" : name];
    root.scale.setScalar(Math.min(view.width / config.frame[0], view.height / config.frame[1]));
    backdrop.visible = capture || name === "hero";

    let found = -1;
    if (inside && !capture) {
      ray.setFromCamera(point.set(pointer[0], pointer[1]), camera);
      const hit = ray.intersectObjects(meshes.flat().filter((mesh) => mesh.parent?.visible), false)[0];
      found = hit ? meshes.findIndex((syllable) => syllable.includes(hit.object as Mesh)) : -1;
    }
    if (found !== hovered) {
      hovered = found;
      document.body.style.cursor = found < 0 ? "" : "pointer";
    }
    if (input.taps !== taps) {
      taps = input.taps;
      if (found >= 0) { struck[found] = elapsed; speak(sounds[found]); }
    }

    let energy = Math.abs(impulse[0]) + Math.abs(impulse[1]) + Math.hypot(pointer[0] - lastPointer[0], pointer[1] - lastPointer[1]);
    lastPointer[0] = pointer[0];
    lastPointer[1] = pointer[1];
    const breath = opened === null ? -1 : elapsed - opened;
    groups.forEach((group, i) => {
      const { rotation } = home[i];
      const { position, turn, scale } = config.letters[i];
      const { period, phase, amplitude } = float[i];
      const cycle = time / period * 2 * Math.PI + phase;
      const [px, py] = capture ? [0, 0] : pointer;
      const settle = (value: number, target: number, rate = 4) => capture ? target : d(value, target, rate, dt);
      const before = group.position.x + group.position.y + group.scale.x;
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
      energy += Math.max(0, Math.abs(group.position.x + group.position.y + group.scale.x - before) - .004);

      // Come apart on arrival, under the pointer, on a press, while leaving and while tucked away.
      pieces[i].forEach((piece, j) => {
        const mesh = meshes[i][j];
        if (capture) { mesh.position.set(0, 0, 0); mesh.rotation.set(0, 0, 0); return; }
        const arriving = breath >= piece.delay * .5 && breath < .75 + piece.delay ? .82 : 0;
        const pressed = elapsed - struck[i] < .2 ? 1.25 : 0;
        const apart = Math.max(arriving, pressed, hovered === i ? .34 : 0,
          scale === 0 ? .9 : 0, MathUtils.smoothstep(leave, piece.delay * .5, .62 + piece.delay * .5) * 1.35);
        const steps = Math.max(1, Math.ceil(dt / .012));
        const h = dt / steps;
        for (let step = 0; step < steps; step++) {
          for (const axis of axes) {
            piece.velocity[axis] += ((piece.away[axis] * apart - piece.offset[axis]) * 88 - piece.velocity[axis] * 8.4) * h;
            piece.offset[axis] += piece.velocity[axis] * h;
            piece.whirl[axis] += ((piece.spin[axis] * apart - piece.angle[axis]) * 62 - piece.whirl[axis] * 6.6) * h;
            piece.angle[axis] += piece.whirl[axis] * h;
          }
        }
        if (group.visible) energy += piece.velocity.length() * .2 + piece.whirl.length() * .1;
        mesh.position.copy(piece.offset);
        mesh.rotation.set(piece.angle.x, piece.angle.y, piece.angle.z);
      });
    });
    if (energy > .01) restless = elapsed;
    renderer.render(scene, camera);
  }

  const tick = (now: number) => {
    frame = running && !disposed ? requestAnimationFrame(tick) : 0;
    if (!loaded || !size.width) { last = now; return; }
    const gap = (now - (last || now)) / 1000;
    // Nothing but the slow float: every other frame is enough.
    const calm = !capture && elapsed - restless > .8;
    skipped = calm && !skipped;
    if (skipped && gap < .03) return;
    last = now;
    paint(Math.min(gap, .05));
    if (++frames === 4) {
      opened = elapsed + .45;
      requestAnimationFrame(() => { if (!disposed) { onReady(); if (capture) window.__hangulReady = true; } });
    }
    // A machine that cannot keep up gets fewer pixels, then the still picture.
    if (!capture && frames > 20 && !calm && gap < .5) {
      spent += gap;
      if (++timed === 45) {
        slow = spent / timed > .03 ? slow + 1 : 0;
        if (slow && pixelRatio > 1) { pixelRatio = 1; resize(); }
        else if (slow > 3) onFailure();
        timed = spent = 0;
      }
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const lost = (event: Event) => { event.preventDefault(); onFailure(); };
  canvas.addEventListener("webglcontextlost", lost);
  const texture = new TextureLoader().load("/assets/hangul-ground.webp", () => {
    if (disposed) return;
    groundMaterial.map = texture;
    groundMaterial.needsUpdate = true;
    // Compile the glass off the main thread where the browser can.
    renderer.compileAsync(scene, camera).catch(() => {}).then(() => { loaded = true; resize(); });
  }, undefined, () => onFailure());
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;

  return {
    setRunning(next) {
      running = next;
      if (next && !frame) { last = 0; frame = requestAnimationFrame(tick); }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      document.body.style.cursor = "";
      [...geometries.flat(), plane].forEach((geometry) => geometry.dispose());
      [...materials.flat(), floorMaterial, groundMaterial].forEach((material) => material.dispose());
      texture.dispose();
      surroundings.dispose();
      renderer.dispose();
    },
  };
}
