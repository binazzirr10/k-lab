import { ExtrudeGeometry, Path, Shape } from "three";

type Point = readonly [number, number];

/** Traces a closed outline with softened corners, like cast and polished glass. */
function outline(points: readonly Point[], x: number, y: number, path: Path, radius = .055) {
  const count = points.length;
  points.forEach((point, index) => {
    const before = points[(index + count - 1) % count];
    const after = points[(index + 1) % count];
    const toward = ([u, v]: Point): Point => {
      const length = Math.hypot(u - point[0], v - point[1]);
      const step = Math.min(radius, length * .4) / length;
      return [point[0] + (u - point[0]) * step + x, point[1] + (v - point[1]) * step + y];
    };
    const [ax, ay] = toward(before);
    const [bx, by] = toward(after);
    if (index === 0) path.moveTo(ax, ay);
    else path.lineTo(ax, ay);
    path.quadraticCurveTo(point[0] + x, point[1] + y, bx, by);
  });
  path.closePath();
}

function polygon(points: readonly Point[], x = 0, y = 0) {
  const shape = new Shape();
  outline(points, x, y, shape);
  return shape;
}

function bar(x: number, y: number, w: number, h: number) {
  return polygon([[0, 0], [w, .014], [w - .026, h], [.016, h - .01]], x, y);
}

function ring(x: number, y: number) {
  const oval = (rx: number, ry: number, path: Path, clockwise: boolean) => {
    const steps = 72;
    for (let k = 0; k < steps; k++) {
      const a = (clockwise ? -1 : 1) * k / steps * Math.PI * 2;
      const u = Math.cos(a) * rx, v = Math.sin(a) * ry;
      const px = x + u * .997 - v * .075, py = y + u * .075 + v * .997;
      if (k === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    }
    path.closePath();
  };
  const shape = new Shape();
  oval(.6, .41, shape, false);
  const hole = new Path();
  oval(.235, .15, hole, true);
  shape.holes.push(hole);
  return shape;
}

function vowel(x: number, y: number) {
  return polygon([[0, 0], [.36, .014], [.36, .68], [.74, .69], [.74, 1.02], [.36, 1.03], [.35, 1.7], [.012, 1.69]], x, y);
}

function rieul(x: number, y: number, width: number) {
  const w = width;
  return polygon([[0, 0], [w + .16, .02], [w + .16, .28], [.4, .27], [.4, .48], [w, .49], [w, 1.17], [.02, 1.16], [.02, .92], [w - .4, .93], [w - .4, .73], [0, .72]], x, y);
}

function mieum(x: number, y: number) {
  const shape = polygon([[0, 0], [.98, .025], [.96, .99], [.02, .97]], x, y);
  const hole = new Path();
  outline([[.25, .24], [.262, .728], [.714, .74], [.727, .251]], x, y, hole);
  shape.holes.push(hole);
  return shape;
}

function giyeok(x: number, y: number) {
  // Top bar with a leg that curves inwards at the foot, as in the brief.
  const shape = new Shape();
  shape.moveTo(x, y + .52);
  shape.quadraticCurveTo(x, y + .57, x + .05, y + .577);
  shape.lineTo(x + 1.5, y + .75);
  shape.quadraticCurveTo(x + 1.66, y + .77, x + 1.65, y + .62);
  shape.lineTo(x + 1.605, y + .07);
  shape.quadraticCurveTo(x + 1.6, y + .02, x + 1.55, y + .018);
  shape.lineTo(x + 1.2, y + .002);
  shape.quadraticCurveTo(x + 1.15, y, x + 1.175, y + .045);
  shape.quadraticCurveTo(x + 1.27, y + .2, x + 1.28, y + .38);
  shape.lineTo(x + .06, y + .246);
  shape.quadraticCurveTo(x + .01, y + .24, x + .01, y + .29);
  shape.closePath();
  return shape;
}

export function syllableOutlines() {
  return [
    [
      [bar(-.62, 1.02, .6, .27), bar(-1.18, .66, 1.52, .29), ring(-.5, .16)],
      [vowel(.48, -.34)],
      [polygon([[0, 0], [1.78, .02], [1.77, .34], [.37, .33], [.36, .66], [.012, .65]], -.86, -1.18)],
    ],
    [
      [giyeok(-.86, .6)],
      [bar(-1.24, .17, 2.42, .33)],
      [rieul(-.9, -1.2, 1.72)],
    ],
    [[mieum(-1.08, .02)], [vowel(.2, -.06)], [rieul(-.84, -1.3, 1.6)]],
  ];
}

export function makeSyllables(shapes: Shape[][][]) {
  return shapes.map((syllable) => syllable.map((jamo) => {
    const geometry = new ExtrudeGeometry(jamo, {
      depth: .36, bevelEnabled: true, bevelThickness: .03, bevelSize: .03,
      bevelSegments: 5, curveSegments: 12, steps: 1,
    });
    geometry.translate(0, 0, -.18);
    return geometry;
  }));
}
