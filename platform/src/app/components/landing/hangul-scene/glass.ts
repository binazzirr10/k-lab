import { Color, DoubleSide, MeshPhysicalMaterial, Vector4 } from "three";

/** Where the sage light gathers inside a letter: x, y in letter units, radius, strength. */
export type Tint = readonly [number, number, number, number];

const none: Tint = [0, 0, 1, 0];

/** Frosted faces, clear polished sides, sage light that pools in chosen ends of each letter. */
export function makeGlass(tints: readonly Tint[], index: number) {
  const material = new MeshPhysicalMaterial({
    color: "#ffffff", roughness: .3, metalness: 0, transmission: 1, thickness: .55, ior: 1.3,
    attenuationColor: new Color("#d3dcc6"), attenuationDistance: 2.6, dispersion: .25,
    clearcoat: 1, clearcoatRoughness: .04, specularIntensity: 1, envMapIntensity: 1.15, side: DoubleSide,
  });
  const uniforms = {
    uTint: { value: [0, 1, 2].map((i) => new Vector4(...(tints[i] ?? none))) },
    uSage: { value: new Color("#a5ba82") },
    uSeed: { value: index * 2.4 + tints[0][0] * 3.1 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLetter;\nvarying vec3 vFacing;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLetter = position;\nvFacing = normal;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>
        varying vec3 vLetter; varying vec3 vFacing;
        uniform vec4 uTint[3]; uniform vec3 uSage; uniform float uSeed;
        float grain(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`)
      .replace("#include <color_fragment>", `#include <color_fragment>
        float pool = 0.0;
        for (int i = 0; i < 3; i++) {
          vec2 away = (vLetter.xy - uTint[i].xy) / uTint[i].z;
          pool = max(pool, uTint[i].w * exp(-dot(away, away)));
        }
        float face = smoothstep(.55, .99, abs(vFacing.z));
        // Slow pools of light and shade inside the block; they slide as the letter turns.
        float flow = sin(dot(vLetter.xy, vec2(2.6, 1.5)) + uSeed + vNormal.x * 5.0)
                   + .7 * sin(dot(vLetter.xy, vec2(-1.4, 3.2)) + uSeed * 1.7 + vNormal.y * 6.0);
        float shade = smoothstep(-1.5, 1.5, flow);
        float depth = clamp(vLetter.z / .21, -1.0, 1.0);
        vec3 body = mix(vec3(.745, .755, .74), vec3(.985, .99, .985), shade);
        vec3 side = mix(vec3(.87, .885, .86), vec3(1.0), smoothstep(-.4, .8, depth));
        diffuseColor.rgb *= mix(side, body, face);
        diffuseColor.rgb = mix(diffuseColor.rgb, uSage * mix(.98, 1.14, shade), pool * mix(.5, .82, face));
        diffuseColor.rgb *= 1.0 + (grain(floor(vLetter.xy * 150.0)) - .5) * .035 * face;`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
        roughnessFactor = mix(.06, roughnessFactor, face);`)
      .replace("#include <opaque_fragment>", `
        float turn = abs(dot(normalize(normal), normalize(vViewPosition)));
        float nz = abs(vFacing.z);
        float cut = smoothstep(.2, .45, nz) * (1.0 - smoothstep(.78, .99, nz));
        float lip = smoothstep(.02, .16, nz) * (1.0 - smoothstep(.2, .4, nz));
        float rear = (1.0 - smoothstep(-.98, -.7, depth)) * (1.0 - face);
        outgoingLight += vec3(1.0, 1.0, .985) * face * smoothstep(.72, 1.0, shade) * .085;
        outgoingLight = mix(outgoingLight, vec3(1.02), cut * .72);
        outgoingLight *= 1.0 - (lip * .46 + rear * .24) * (gl_FrontFacing ? 1.0 : .25);
        outgoingLight *= 1.0 - (1.0 - smoothstep(.0, .36, turn)) * .4;
        #include <opaque_fragment>`);
  };
  return material;
}

export const tints: readonly (readonly (readonly Tint[])[])[] = [
  [
    [[-1.1, .78, .42, .55], [.2, .85, .25, .15]],
    [[1.08, .55, .3, .95], [.62, -.3, .55, .8]],
    [[-.75, -.7, .55, .6], [.8, -1.0, .5, .75]],
  ],
  [
    [[-.6, .95, .42, 1]],
    [[-1.0, .3, .5, 1]],
    [[.62, -.95, .5, 1], [-.75, -.3, .3, .3]],
  ],
  [
    [[-1.0, .3, .3, .12]],
    [[.82, .8, .3, .95], [.34, .05, .45, .85]],
    [[-.1, -.28, .5, .75], [-.5, -1.15, .45, .55], [.6, -.35, .35, .4]],
  ],
];
