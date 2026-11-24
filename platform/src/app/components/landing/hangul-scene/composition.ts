type Vector = readonly [number, number, number];
type Pose = { position: Vector; rotation: Vector; scale: number };

export const home: readonly Pose[] = [
  { position: [-2.06, 1.2, .1], rotation: [-.24, -.4, .03], scale: 1.06 },
  { position: [1.46, .62, -.15], rotation: [-.24, -.36, .04], scale: 1.08 },
  { position: [-.86, -1.3, .4], rotation: [-.24, -.42, .035], scale: .9 },
];

type Place = { x: number; width: number; top: number; height: number };
export type SceneConfig = {
  /** World size that must fit inside the stage. */
  frame: readonly [number, number];
  /** Per letter: position, extra turn and scale; scale 0 tucks the letter away. */
  letters: readonly { position: Vector; turn: number; scale: number }[];
  /** Empty spot of the section: x and width as parts of the 12 columns, top and height in pixels. */
  place?: Place;
};

const away: SceneConfig["letters"][number] = { position: [0, 0, -.6], turn: .5, scale: 0 };
const alone = (turn: number): SceneConfig["letters"][number] => ({ position: [0, .05, .2], turn, scale: 1 });

export const scenes = {
  hero: { frame: [9.3, 6.1], letters: home.map(({ position, scale }) => ({ position, turn: 0, scale })) },
  speaking: { frame: [3.3, 3.3], letters: [away, away, alone(.16)], place: { x: .53, width: .15, top: 26, height: 270 } },
  drama: { frame: [3.3, 3.3], letters: [alone(-.1), away, away], place: { x: .53, width: .15, top: 26, height: 270 } },
  university: { frame: [3.1, 3.1], letters: [away, alone(.14), away], place: { x: .87, width: .12, top: 4, height: 126 } },
  vocabulary: {
    frame: [9, 3.4],
    letters: [
      { position: [-2.9, 0, 0], turn: .1, scale: .95 },
      { position: [0, .1, .1], turn: 0, scale: .95 },
      { position: [2.9, 0, 0], turn: -.1, scale: .95 },
    ],
    place: { x: -.01, width: .34, top: 668, height: 176 },
  },
} satisfies Record<string, SceneConfig>;

export type Scene = keyof typeof scenes;
export type StageInput = { scene: Scene; pointer: [number, number]; impulse: [number, number] };
