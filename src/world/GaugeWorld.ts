/* THE WORLD: a gauge as a place.

   The organisation stands on a lattice of dots that stays where it is. The
   map is drawn in the notation a systems researcher uses, built out of the
   real things an organisation is made of (motifs.ts): every part is a stock,
   a vessel with a level inside it, shaped as the real thing (a pump house, a
   control room, a transformer bank, a server rack, a badge door, a desk row,
   a street of houses, a radio mast, a van, a vault, a crane, a clock tower).
   Every dependency is a pipe with an arrowhead, with light moving through it
   for what still reaches the part at its end, and bars across it for the
   delay. A breaker in the stack is a valve wheel on the pipe. Every threat is
   a cloud on the horizon with a stream of pressure. Every structure is a ring
   in its family's form. Every feedback loop is an arc with arrows, lettered R
   or B, lit when it is running.

   During a run each threat arrives in its own form and from where it would
   really come (threats.ts): a stolen key from the horizon, a wedge low along
   a path, a ghost that leaves no trail, a crack from under the part, a crate
   from the vendor, a wave from the public, a chain pulse along a dependency,
   an open problem falling from above. A stopped threat ends the way its
   stopper works: seen by a sentinel, flattened on a wall, thrown back in
   sparks, turned grey by a lock, dropped by a seal, sealed with ice, cut at a
   breaker, dissolved in violet. A threat that lands puts the part into its own
   fallen pose and sends a coral wave. Then the failure travels the conduits
   the stack did not cut, and a cut conduit shows a bar of light in the colour
   of the structure that cut it.

   The system runs (dynamics.ts): every part carries a level of its function
   that rises and falls, every dependency carries a stream whose density is
   the function reaching the part that needs it, every threat has a source on
   the horizon with a stream of pressure that ends at the ring that holds it or
   reaches the part when nothing does, and the feedback loops at work run as
   arcs above the parts they pass through, lit when they are active.

   Taking a notch sends a shockwave from the centre and shifts the world into
   the band's colour. Gratus Gold raises a column of gold light.

   The place is lit the way a real place is lit. A night sky with a faint
   horizon stands over a polished floor that reflects everything on it, with
   the reflection softened and faded by the same fog that hides the far floor.
   The pillars are glass: a tinted body and a clear shell that catches the sky
   and the lights around it. The rings are metal with light in them, every
   pillar stands on a lit pedestal, and the heaviest cores throw their own light
   onto the floor and their neighbours. One key light casts soft shadows. The
   camera has a lens: bloom, a filmic curve, a vignette, a trace of colour
   fringing at the edges, and grain.

   Light works as it does in the Dava-Dark camera: cores run brighter than
   white, and the bloom and a filmic curve roll them to white. Under reduced
   motion the engine renders single still frames that show the same states. */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import type { GaugeSystem, GaugeThreat, NodeKind } from '../content/modux-schema';
import { KIND_HUE } from '../components/SystemMap';
import { readSystem, type SystemReading } from '../lib/systemRead';
import { buildNode, buildShield, type NodeMotif, type ShieldMotif } from './motifs';
import { threatMotif, stopStyle, buildHead, ORIGIN, PACE, familyOf, type ThreatMotif, type StopStyle } from './threats';
import { delayOf } from '../content/modux/dynamics';
import { grain, disc } from './texture';

export interface Shield { id: string; name: string; hue: string; motrus?: boolean; family?: string; tier?: string }
export interface Stopper { id: string; motrus: boolean; hue: string }
export interface WorldCut { from: string; to: string; hue: string }

/** a feedback loop to draw above the parts it runs through */
export interface LoopView { id: string; kind: 'R' | 'B'; name: string; parts: string[]; active: boolean }
/** a threat's source on the horizon and the pressure it sends */
export interface StationView { id: string; target: string; weight: number; layers: number }
/** the system's state now, from the dynamics */
export interface DynView {
  health: Record<string, number>;
  /** the function reaching the end of each dependency, by from>to */
  supply: Record<string, number>;
  /** dependencies the stack cuts, by from>to, with the hue of the structure */
  cuts: Record<string, string>;
  /** threats pushing now */
  landed: Record<string, boolean>;
  running: boolean;
}

export interface WorldScene {
  system: GaugeSystem;
  threats: GaugeThreat[];
  /** structures protecting each node */
  shields: Record<string, Shield[]>;
  /** node hit by the newest notch */
  fresh: string | null;
}

/** the frames the camera can take */
export type WorldViewName = 'whole' | 'above' | 'people' | 'keystone' | 'cascade';

export const BAND_HUES = ['#9fe8ff', '#60a5fa', '#a78bff', '#fb7185', '#fcd9a5'];
const CORAL = new THREE.Color('#ff5d73');
const ICE = new THREE.Color('#d8effc');
const GOLD = new THREE.Color('#fcd27a');
const NIGHT = new THREE.Color('#050b20');
const SPREAD = 20;
const RIP_N = 10;
const WELL_N = 14;

const hashAngle = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return (h / 4294967296) * Math.PI * 2;
};
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const easeInOut = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const AMBER = new THREE.Color('#fdc26f');
const hdr = (c: THREE.Color | string, k: number) => new THREE.Color(c).multiplyScalar(k);

/* ---------- the lattice ---------- */

const LATTICE_VS = `
uniform float uTime;
uniform float uBeat;
uniform float uPx;
uniform vec4 uRip[${RIP_N}];
uniform vec3 uRipCol[${RIP_N}];
uniform vec4 uWell[${WELL_N}];
uniform vec3 uBase;
attribute float aSeed;
varying vec3 vCol;
varying float vA;
void main() {
  vec3 p = position;
  float dip = 0.0;
  for (int i = 0; i < ${WELL_N}; i++) {
    vec4 w = uWell[i];
    if (w.z <= 0.0) continue;
    vec2 d = p.xz - w.xy;
    dip += w.z * exp(-dot(d, d) / 3.4);
  }
  p.y -= dip * 0.24;
  vec3 col = uBase * (0.6 + 0.3 * aSeed);
  float glow = dip * 0.035;
  for (int i = 0; i < ${RIP_N}; i++) {
    vec4 r = uRip[i];
    if (r.w <= 0.0) continue;
    float age = uTime - r.z;
    if (age < 0.0 || age > 3.4) continue;
    float d = length(p.xz - r.xy);
    float k = exp(-pow((d - age * 6.2) * 1.25, 2.0)) * (1.0 - age / 3.4) * r.w;
    p.y += k * 0.32;
    glow += k;
    col = mix(col, uRipCol[i], clamp(k, 0.0, 1.0));
  }
  glow += uBeat * 0.32 * exp(-length(p.xz) * 0.07);
  glow = min(glow, 1.4);
  vCol = col * (1.0 + glow * 1.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float fade = clamp(1.0 - (-mv.z - 16.0) / 32.0, 0.0, 1.0);
  vA = (0.5 + glow * 0.5) * fade;
  gl_PointSize = (0.085 + dip * 0.015 + glow * 0.06) * uPx / -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const LATTICE_FS = `
varying vec3 vCol;
varying float vA;
void main() {
  vec2 d = gl_PointCoord * 2.0 - 1.0;
  float r = dot(d, d);
  if (r > 1.0) discard;
  float a = smoothstep(1.0, 0.45, r) * vA;
  gl_FragColor = vec4(vCol * a, a);
}`;

/* ---------- the sky ---------- */

const SKY_VS = `varying vec3 vDir;
void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/* a night: dark at the zenith, a faint glow along the horizon, the band's colour in that glow */
const SKY_FS = `uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uBand;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y, -1.0, 1.0);
  float k = pow(1.0 - clamp(h, 0.0, 1.0), 7.0);
  vec3 c = mix(uZenith, uHorizon, k) + uBand * 0.05 * k;
  if (h < 0.0) c = mix(uHorizon, uZenith * 0.6, clamp(-h * 3.0, 0.0, 1.0));
  gl_FragColor = vec4(c, 1.0);
}`;

/* ---------- the floor ---------- */

/* A polished dark floor. The reflection is read through a slight blur, mixed in
   by a Fresnel term so it is faint when looked at from above and strong at a
   grazing angle, and faded by the same fog as the rest of the scene. */
const FLOOR_SHADER = {
  name: 'PraxisFloor',
  uniforms: {
    color: { value: null as THREE.Color | null }, tDiffuse: { value: null as THREE.Texture | null }, textureMatrix: { value: null as THREE.Matrix4 | null },
    uCam: { value: new THREE.Vector3() }, uFog: { value: new THREE.Color('#050b20') }, uFogD: { value: 0.018 },
    tNoise: { value: null as THREE.Texture | null },
    uLP: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
    uLC: { value: [new THREE.Color(0), new THREE.Color(0), new THREE.Color(0), new THREE.Color(0)] },
  },
  vertexShader: `uniform mat4 textureMatrix;
varying vec4 vUv;
varying vec3 vW;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vUv = textureMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,
  fragmentShader: `uniform vec3 color;
uniform sampler2D tDiffuse;
uniform vec3 uCam;
uniform vec3 uFog;
uniform float uFogD;
uniform vec3 uLP[4];
uniform vec3 uLC[4];
uniform sampler2D tNoise;
varying vec4 vUv;
varying vec3 vW;
void main() {
  vec3 toCam = uCam - vW;
  float d = length(toCam);
  vec3 V = toCam / d;
  vec4 p = vUv;
  /* the stone is not flat: the reflection bends a little with its grain */
  vec2 nz = texture2D(tNoise, vW.xz * 0.09).xy - 0.5;
  p.xy += nz * 0.014 * p.w;
  vec4 ox = vec4(0.0028 * p.w, 0.0, 0.0, 0.0);
  vec4 oy = vec4(0.0, 0.0028 * p.w, 0.0, 0.0);
  vec3 r = texture2DProj(tDiffuse, p).rgb * 0.4
         + texture2DProj(tDiffuse, p + ox).rgb * 0.15 + texture2DProj(tDiffuse, p - ox).rgb * 0.15
         + texture2DProj(tDiffuse, p + oy).rgb * 0.15 + texture2DProj(tDiffuse, p - oy).rgb * 0.15;
  float ndv = clamp(V.y, 0.0, 1.0);
  float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  float k = clamp(0.14 + fres * 1.5, 0.0, 0.9);
  vec3 c = mix(color, r * 0.85, k);
  /* the pools of light the heaviest cores throw on the stone */
  for (int i = 0; i < 4; i++) {
    vec3 L = uLP[i] - vW;
    float dl = max(length(L), 0.001);
    c += uLC[i] * (max(L.y, 0.0) / dl) / (1.0 + dl * dl * 0.3);
  }
  float f = 1.0 - exp(-uFogD * uFogD * d * d);
  c = mix(c, uFog, clamp(f, 0.0, 1.0));
  gl_FragColor = vec4(c, 1.0);
}`,
};

/* a sparse field of stars, the same every time */
function starField(): THREE.Points {
  let seed = 7;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const pts: number[] = [];
  for (let i = 0; i < 640; i++) {
    const th = rnd() * Math.PI * 2;
    const y = 0.12 + rnd() * 0.88;
    const r = Math.sqrt(1 - y * y) * 150;
    pts.push(Math.cos(th) * r, y * 150, Math.sin(th) * r);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const m = new THREE.PointsMaterial({ size: 1.5, sizeAttenuation: false, color: hdr('#d8effc', 0.85), transparent: true, opacity: 0.5, depthWrite: false, fog: false });
  const s = new THREE.Points(g, m);
  s.frustumCulled = false;
  return s;
}

/* grain, a quiet vignette and a trace of colour fringing at the edges, after tone mapping */
const GRAIN = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0.035 }, uCA: { value: 0.0022 } },
  vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader: `uniform sampler2D tDiffuse;uniform float uTime;uniform float uAmt;uniform float uCA;varying vec2 vUv;
    float h(vec2 p){p=fract(p*vec2(443.897,441.423));p+=dot(p,p.yx+19.19);return fract((p.x+p.y)*p.x);}
    void main(){vec2 d=vUv-.5;float r2=dot(d,d);vec2 o=d*r2*uCA*4.0;
    vec4 c=vec4(texture2D(tDiffuse,vUv+o).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-o).b,1.0);
    float l=dot(c.rgb,vec3(.2126,.7152,.0722));
    c.rgb=mix(c.rgb,c.rgb*vec3(.94,1.,1.07),.45*(1.-l));c.rgb+=l*l*vec3(.035,.012,0.);c.rgb=c.rgb*.97+.012;
    float v=1.-.32*smoothstep(.18,.75,r2*2.2);
    float n=h(vUv*1024.+fract(uTime*.37)*vec2(97.,41.))-.5;
    c.rgb=c.rgb*v+n*uAmt*(.35+.65*(1.-l));gl_FragColor=c;}`,
};

/* ---------- moving things ---------- */

interface Ripple { x: number; z: number; t0: number; s: number; col: THREE.Color }
interface Pulse { curve: THREE.QuadraticBezierCurve3; t0: number; dur: number; mesh: THREE.Mesh; stopAt: number; done?: () => void }
interface Comet {
  curve: THREE.Curve<THREE.Vector3>; t0: number; dur: number; head: THREE.Object3D; mats: THREE.MeshBasicMaterial[];
  trail: THREE.Line | null; hist: THREE.Vector3[]; node: string; outcome: 'stopped' | 'landed'; onImpact?: () => void;
  motif: ThreatMotif; style: StopStyle | null; stopHue: THREE.Color; col: THREE.Color;
  ended: boolean; endT0: number; beamed: boolean; lastRipple: number; orient: boolean;
}
interface Spark { m: THREE.Mesh; v: THREE.Vector3; t0: number }
interface LoopObj { view: LoopView; tube: THREE.Mesh; markers: THREE.Mesh[]; label: HTMLDivElement; curve: THREE.CatmullRomCurve3; anchor: THREE.Vector3 }
interface Station { view: StationView; mesh: THREE.Object3D; mats: THREE.MeshStandardMaterial[]; curve: THREE.Curve<THREE.Vector3>; col: THREE.Color; stop: number }
interface Level { cur: number; target: number; top: number }
interface EdgeFlow { pulses: THREE.Mesh[]; mat: THREE.MeshBasicMaterial; phase: number; flow: number }
interface Beam { line: THREE.Line; until: number }
interface NodeView {
  id: string; kind: NodeKind; group: THREE.Group; motif: NodeMotif; glass: THREE.Mesh; shields: ShieldMotif[]; level: Level;
  beacon: THREE.Mesh | null; h: number; pos: THREE.Vector3; baseRing: THREE.Mesh; light: THREE.PointLight | null;
  state: 'ok' | 'fallen' | 'down'; flash: number; rise: number; label: HTMLDivElement; lw: number;
}

const TIER_KEY = 'stepsafe-world-tier';

/** The starting tier, from the device: 2 draws the mirror floor, the lens and the soft shadows;
    1 draws a plain floor, hard shadows a few times a second, and bloom at a quarter size;
    0 draws no shadows and no bloom, thirty frames a second. A tier the governor stepped down
    to on this device before is where the next visit starts. */
function startTier(r: THREE.WebGLRenderer): 0 | 1 | 2 {
  let gpu = '';
  try {
    const gl = r.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  } catch { gpu = ''; }
  let tier: 0 | 1 | 2;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (/swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(gpu) || mem <= 4 || cores <= 4 || coarse) tier = 0;
  else if (/nvidia|geforce|rtx|quadro|radeon rx|radeon pro|apple m\d|apple gpu/i.test(gpu) && !/intel/i.test(gpu)) tier = 2;
  else tier = 1;
  try {
    const kept = localStorage.getItem(TIER_KEY);
    if (kept !== null) tier = Math.min(tier, Math.max(0, Math.min(2, parseInt(kept, 10) || 0))) as 0 | 1 | 2;
  } catch { /* storage closed: the device decides alone */ }
  return tier;
}

/** the pixel ratio for a tier, capped so a large or dense screen does not multiply the cost */
function pixelRatioFor(q: 0 | 1 | 2, w: number, h: number): number {
  const base = q === 2 ? Math.min(window.devicePixelRatio || 1, 1.25) : 1;
  const maxPx = q === 2 ? 2.4e6 : q === 1 ? 1.6e6 : 1.0e6;
  const px = w * h * base * base;
  return px > maxPx ? Math.max(0.6, Math.sqrt(maxPx / (w * h))) : base;
}

export class GaugeWorld {
  private host: HTMLElement;
  private still: boolean;
  private onPick?: (id: string | null) => void;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private grain: ShaderPass;
  private bokeh: BokehPass;
  private dust: THREE.Points | null = null;
  private dustBase: Float32Array | null = null;
  private floats: { el: HTMLDivElement; anchor: THREE.Vector3; until: number }[] = [];
  private lattice: THREE.Points;
  private latticeMat: THREE.ShaderMaterial;
  private labels: HTMLDivElement;
  private world = new THREE.Group();
  private nodes = new Map<string, NodeView>();
  private edges: { from: string; to: string; curve: THREE.QuadraticBezierCurve3; tube: THREE.Mesh; extras: THREE.Object3D[] }[] = [];
  private ripples: Ripple[] = [];
  private pulses: Pulse[] = [];
  private comets: Comet[] = [];
  private sparks: Spark[] = [];
  private loops: LoopObj[] = [];
  private stations: Station[] = [];
  private streamPts: THREE.Points | null = null;
  private flows = new Map<string, EdgeFlow>();
  private breakers = new Map<string, THREE.Object3D>();
  private dyn: DynView | null = null;
  private static STREAM_N = 12;
  private beams: Beam[] = [];
  private sparkGeo = new THREE.TetrahedronGeometry(0.06, 0);
  private bars: THREE.Mesh[] = [];
  private beacons: THREE.Mesh[] = [];
  private goldCol: THREE.Mesh | null = null;
  private goldT0 = -1;
  private key: THREE.DirectionalLight;
  private skyMat: THREE.ShaderMaterial;
  private floor: Reflector;
  private floorMat: THREE.ShaderMaterial;
  private floorPlain: THREE.Mesh;
  private shadowPlane: THREE.Mesh;
  private envRT: THREE.WebGLRenderTarget | null = null;
  private winStart = 0;
  private band = 0;
  private bandCol = new THREE.Color(BAND_HUES[0]);
  private bandTarget = new THREE.Color(BAND_HUES[0]);
  private beatV = 0;
  private shake = 0;
  private focus: THREE.Vector3 | null = null;
  private baseDist = 24;
  private extent = { x: 10, z: 6 };
  private lastScene: WorldScene | null = null;
  private portrait = false;
  private distNow = 24;
  private introT0 = -1;
  private lastAmbient = 0;
  private ambientI = 0;
  private raf = 0;
  private t0 = performance.now();
  private now = 0;
  private disposed = false;
  private ro: ResizeObserver;
  private downAt: { x: number; y: number } | null = null;
  private idleUntil = 0;
  private fresh: string | null = null;
  private freshNext = 0;
  /* quality: 2 full, 1 lighter, 0 lightest. Steps down only, never back up, so it cannot oscillate */
  private quality: 0 | 1 | 2 = 1;
  private gaps: number[] = [];
  private slowWindows = 0;
  /* shaders compile in the background; nothing is drawn until they are ready */
  private ready = false;
  private readyAt = 0;
  private lastDraw = 0;
  private lastShadow = 0;
  private viewW = 1;
  private viewH = 1;
  /* the reading: the keystone's amber column, the rings on the parts with no way around, the dome over
     the people and the fastest cascade as a lit path with a bead that runs it */
  private reading: SystemReading | null = null;
  private readObjs: THREE.Object3D[] = [];
  private keyBeam: THREE.Mesh | null = null;
  private cascade: THREE.CurvePath<THREE.Vector3> | null = null;
  private bead: THREE.Mesh | null = null;
  private readingOn = true;
  /* a camera shot: keyframes the camera eases through, then holds at the last one's distance */
  private shot: { keys: { pos: THREE.Vector3; target: THREE.Vector3; dur: number }[]; t0: number; from: { pos: THREE.Vector3; target: THREE.Vector3 } } | null = null;
  private hold: number | null = null;

  constructor(host: HTMLElement, opts: { still: boolean; onPick?: (id: string | null) => void }) {
    this.host = host;
    this.still = opts.still;
    this.onPick = opts.onPick;

    const w = host.clientWidth || 800, h = host.clientHeight || 600;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.quality = startTier(this.renderer);
    this.renderer.setPixelRatio(pixelRatioFor(this.quality, w, h));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor(NIGHT, 1);
    /* the shadows are drawn a few times a second, not every frame, and not at all on the lightest tier */
    this.renderer.shadowMap.enabled = this.quality > 0;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.type = this.quality === 2 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    this.renderer.domElement.className = 'gw-gl';
    host.appendChild(this.renderer.domElement);
    host.classList.add('gw-warming');

    this.labels = document.createElement('div');
    this.labels.className = 'gw-labels';
    host.appendChild(this.labels);

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 400);
    this.camera.position.set(0, 34, 40);

    this.scene.background = NIGHT.clone();
    this.scene.fog = new THREE.FogExp2(NIGHT.clone(), 0.018);
    this.scene.add(this.world);

    /* the light has a source: a pearl key light from above and in front that casts the
       shadows, and a low azure fill from the sky */
    this.key = new THREE.DirectionalLight(new THREE.Color('#f8f1fb'), 1.25);
    this.key.position.set(6, 18, 12);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(1024, 1024);
    const sc = this.key.shadow.camera;
    sc.left = -18; sc.right = 18; sc.top = 18; sc.bottom = -18; sc.near = 1; sc.far = 70;
    this.key.shadow.bias = -0.0004;
    this.key.shadow.normalBias = 0.03;
    this.key.shadow.radius = 3;
    this.key.target.position.set(0, 0, 0);
    this.scene.add(this.key, this.key.target);
    this.scene.add(new THREE.HemisphereLight(new THREE.Color('#9cc3ef'), new THREE.Color('#141a3a'), 0.5));

    /* the sky, and the stars in it */
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false,
      uniforms: { uZenith: { value: new THREE.Color('#02050f') }, uHorizon: { value: new THREE.Color('#0b1430') }, uBand: { value: new THREE.Color(BAND_HUES[0]) } },
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), this.skyMat);
    sky.frustumCulled = false;
    this.scene.add(sky, starField());

    /* the same sky, with the lights that stand in it, becomes what every surface reflects */
    this.buildEnvironment();

    /* the floor: a mirror read through a Fresnel term, a plain floor for devices that
       cannot afford the mirror, and the plane the shadows fall on */
    const dbs = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.floor = new Reflector(new THREE.PlaneGeometry(400, 400), {
      textureWidth: Math.min(1024, Math.round(dbs.x * 0.5)), textureHeight: Math.min(1024, Math.round(dbs.y * 0.5)),
      color: new THREE.Color('#070d24'), clipBias: 0.003, shader: FLOOR_SHADER, multisample: 0,
    });
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.03;
    this.floorMat = this.floor.material as THREE.ShaderMaterial;
    this.floorMat.uniforms.tNoise.value = grain();
    this.scene.add(this.floor);
    this.floorPlain = new THREE.Mesh(new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#070d24'), roughness: 0.55, roughnessMap: grain(), bumpMap: grain(), bumpScale: 0.02, metalness: 0.45, envMapIntensity: 0.8 }));
    (this.floorPlain.material as THREE.MeshStandardMaterial).roughnessMap!.repeat.set(40, 40);
    this.floorPlain.rotation.x = -Math.PI / 2;
    this.floorPlain.position.y = -0.03;
    this.floorPlain.receiveShadow = true;
    this.floorPlain.visible = false;
    this.scene.add(this.floorPlain);
    this.shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.55, transparent: true, depthWrite: false }));
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -0.02;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);

    /* the air: a few hundred motes drifting through the light */
    const dn = 360;
    const dp = new Float32Array(dn * 3);
    for (let i = 0; i < dn; i++) { dp[i * 3] = (Math.random() - 0.5) * 30; dp[i * 3 + 1] = 0.2 + Math.random() * 6; dp[i * 3 + 2] = (Math.random() - 0.5) * 22; }
    this.dustBase = dp.slice();
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.055, color: hdr('#f8f1fb', 0.9), transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);

    /* the horizon: the lights of somewhere else, far off */
    const hn = 240;
    const hp = new Float32Array(hn * 3), hc = new Float32Array(hn * 3);
    for (let i = 0; i < hn; i++) {
      const a = (i / hn) * Math.PI * 2 + Math.random() * 0.03;
      const r = 100 + Math.random() * 25;
      hp[i * 3] = Math.cos(a) * r; hp[i * 3 + 1] = 0.3 + Math.random() * 1.1; hp[i * 3 + 2] = Math.sin(a) * r;
      const warm = Math.random() < 0.7;
      const c = new THREE.Color(warm ? '#ffd9a0' : '#9fc8ff').multiplyScalar(0.5 + Math.random() * 0.6);
      hc[i * 3] = c.r; hc[i * 3 + 1] = c.g; hc[i * 3 + 2] = c.b;
    }
    const hg = new THREE.BufferGeometry();
    hg.setAttribute('position', new THREE.BufferAttribute(hp, 3));
    hg.setAttribute('color', new THREE.BufferAttribute(hc, 3));
    const horizon = new THREE.Points(hg, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false, fog: false }));
    horizon.frustumCulled = false;
    this.scene.add(horizon);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.enablePan = false;
    this.controls.minDistance = 11;
    this.controls.maxDistance = 70;
    this.controls.minPolarAngle = 0.32;
    this.controls.maxPolarAngle = 1.38;
    this.controls.autoRotate = !this.still;
    this.controls.autoRotateSpeed = 0.32;
    this.controls.addEventListener('start', () => { this.idleUntil = this.now + 7; this.controls.autoRotate = false; this.shot = null; });
    this.controls.addEventListener('change', () => { if (this.still) this.invalidate(); });

    /* the lattice */
    const pts: number[] = [], seeds: number[] = [];
    const sp = 0.46;
    for (let x = -19; x <= 19.001; x += sp) for (let z = -15; z <= 15.001; z += sp) {
      pts.push(x, 0, z);
      seeds.push(((Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1 + 1) % 1);
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    lg.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
    this.latticeMat = new THREE.ShaderMaterial({
      vertexShader: LATTICE_VS,
      fragmentShader: LATTICE_FS,
      uniforms: {
        uTime: { value: 0 },
        uBeat: { value: 0 },
        uPx: { value: 1000 },
        uBase: { value: new THREE.Color(BAND_HUES[0]).multiplyScalar(0.55) },
        uRip: { value: Array.from({ length: RIP_N }, () => new THREE.Vector4(0, 0, 0, 0)) },
        uRipCol: { value: Array.from({ length: RIP_N }, () => new THREE.Color()) },
        uWell: { value: Array.from({ length: WELL_N }, () => new THREE.Vector4(0, 0, 0, 0)) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.lattice = new THREE.Points(lg, this.latticeMat);
    this.lattice.frustumCulled = false;
    this.scene.add(this.lattice);

    /* the camera: a high range buffer, bloom, the filmic curve, then grain */
    const target = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: this.quality === 2 ? 2 : 0 });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    /* a lens: what the camera looks at is sharp, the rest softens with distance */
    this.bokeh = new BokehPass(this.scene, this.camera, { focus: 0.06, aperture: 0.045, maxblur: 0.0038 });
    this.composer.addPass(this.bokeh);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(w / 2, h / 2), 0.7, 0.55, 0.82);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.grain = new ShaderPass(GRAIN);
    this.composer.addPass(this.grain);

    this.applyTier();

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointerup', this.onUp);
    document.addEventListener('visibilitychange', this.onVis);

    this.introT0 = this.still ? -1 : 0;
    if (this.still) this.placeCamera(1);
    this.start();
  }

  /* The sky with four lights standing in it: a pearl key above and in front, azure
     low and behind, violet from the side, and a band of ice high behind. Rendered
     once into a prefiltered map, so glass and metal reflect a place, not a void. */
  private buildEnvironment() {
    const pm = new THREE.PMREMGenerator(this.renderer);
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.SphereGeometry(60, 24, 12), this.skyMat));
    const panel = (col: string, k: number, x: number, y: number, z: number, w: number, h: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: hdr(col, k), side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel('#f8f1fb', 5, 10, 26, 16, 16, 10);
    panel('#60a5fa', 2.2, -24, 10, -18, 20, 8);
    panel('#a78bff', 1.8, 26, 8, -4, 12, 9);
    panel('#9fe8ff', 1.1, 0, 34, -36, 40, 5);
    const rt = pm.fromScene(env, 0.05);
    this.scene.environment = rt.texture;
    this.scene.environmentIntensity = 0.9;
    env.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      if (m.material && m.material !== this.skyMat) (m.material as THREE.Material).dispose();
    });
    pm.dispose();
    this.envRT = rt;
  }

  /* ---------- lifecycle ---------- */

  private start() {
    if (this.still) { this.invalidate(); return; }
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.tick);
  }

  private onVis = () => {
    if (document.hidden) cancelAnimationFrame(this.raf);
    else this.start();
  };

  private pending = false;
  /** under reduced motion: one frame, when something changes */
  invalidate() {
    if (this.pending || this.disposed) return;
    this.pending = true;
    requestAnimationFrame(() => { this.pending = false; this.frame(performance.now(), true); });
  }

  /** the distance at which the whole system, its labels and the HUD all fit */
  private fitDist(): number {
    const h = Math.max(1, this.host.clientHeight);
    const vf = (this.camera.fov * Math.PI) / 360;
    const hf = Math.atan(Math.tan(vf) * this.camera.aspect);
    /* the HUD takes about 230px of height; the system has to fit in what is left */
    const room = Math.max(0.45, (h - 230) / h);
    const byW = (this.extent.x + 3) / Math.tan(hf);
    const byD = ((this.extent.z + 3) / Math.tan(vf)) / room;
    return Math.max(17, byW, byD) * 1.04;
  }

  resize() {
    const w = Math.max(1, this.host.clientWidth), h = Math.max(1, this.host.clientHeight);
    if (this.lastScene && (w / h < 0.8) !== this.portrait) { this.setScene(this.lastScene); return; }
    this.viewW = w; this.viewH = h;
    this.renderer.setPixelRatio(pixelRatioFor(this.quality, w, h));
    this.renderer.setSize(w, h);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(w, h);
    this.bokeh.setSize(w, h);
    const dbs = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.floor.getRenderTarget().setSize(Math.min(768, Math.round(dbs.x * 0.4)), Math.min(768, Math.round(dbs.y * 0.4)));
    const bloomDiv = this.quality === 2 ? 2 : 4;
    this.bloom.resolution.set(w / bloomDiv, h / bloomDiv);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.8 ? 50 : 38;
    this.camera.updateProjectionMatrix();
    this.baseDist = this.fitDist();
    this.distNow = this.baseDist;
    const dbh = this.renderer.getDrawingBufferSize(new THREE.Vector2()).y;
    this.latticeMat.uniforms.uPx.value = dbh / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    if (this.still) { this.placeCamera(1); this.invalidate(); }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    document.removeEventListener('visibilitychange', this.onVis);
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onDown);
    el.removeEventListener('pointerup', this.onUp);
    this.controls.dispose();
    this.scene.traverse(o => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach(x => x.dispose()); else mat?.dispose();
    });
    this.floor.dispose();
    this.envRT?.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    el.remove();
    this.labels.remove();
  }

  /* ---------- the scene ---------- */

  setScene(sc: WorldScene) {
    this.lastScene = sc;
    /* on a portrait screen the system turns a quarter, so its long axis runs into the scene */
    this.portrait = this.host.clientWidth / Math.max(1, this.host.clientHeight) < 0.8;
    const prev = new Set(this.nodes.keys());
    const hadAny = prev.size > 0;
    for (const n of this.nodes.values()) { this.world.remove(n.group); n.label.remove(); this.disposeObj(n.group); }
    for (const e of this.edges) { this.world.remove(e.tube, ...e.extras); this.disposeObj(e.tube); e.extras.forEach(x => this.disposeObj(x)); }
    for (const b of this.beacons) { this.world.remove(b); this.disposeObj(b); }
    for (const o of this.readObjs) { this.world.remove(o); this.disposeObj(o); }
    this.readObjs = []; this.keyBeam = null; this.cascade = null; this.bead = null;
    for (const f of this.flows.values()) for (const m of f.pulses) { this.world.remove(m); this.disposeObj(m); }
    for (const b of this.breakers.values()) { this.world.remove(b); this.disposeObj(b); }
    this.flows.clear(); this.breakers.clear();
    this.nodes.clear(); this.edges = []; this.beacons = [];

    /* the same reading every flat map uses: rows from the parts that depend on nothing at the back to the
       people at the front, nearest the viewer; a link that closes a feedback loop rises as an arc */
    const rd = readSystem(sc.system, sc.threats);
    this.reading = rd;
    const R = rd.rows.length;
    const rowGap = Math.max(3.4, Math.min(5.4, 19 / Math.max(1, R - 1)));
    const placed = new Map<string, { ax: number; az: number }>();
    rd.rows.forEach((row, ri) => {
      const n = row.length;
      const colGap = Math.max(3.2, Math.min(5.6, SPREAD / Math.max(1, n)));
      const shift = n > 1 ? (ri % 2 ? 0.22 : -0.22) * colGap : 0;
      row.forEach((id, i) => placed.set(id, { ax: (i - (n - 1) / 2) * colGap + shift, az: (ri - (R - 1) / 2) * rowGap }));
    });
    const loopKeys = new Set(rd.loops.map(l => l.from + '>' + l.to));
    const wells = this.latticeMat.uniforms.uWell.value as THREE.Vector4[];
    wells.forEach(v => v.set(0, 0, 0, 0));
    let maxR = 4;

    /* the four heaviest cores throw their own light */
    const weightOf = (id: string) => sc.threats.filter(t => t.target === id).reduce((k, t) => k + t.weight, 0);
    const lit = new Set(sc.system.nodes.map(n => n.id).sort((a, b) => weightOf(b) - weightOf(a)).slice(0, this.quality === 2 ? 6 : 0));

    sc.system.nodes.forEach((n, i) => {
      const p = placed.get(n.id) || { ax: 0, az: 0 };
      const ax = p.ax;
      const az = p.az;
      const x = this.portrait ? az : ax;
      const z = this.portrait ? -ax : az;
      maxR = Math.max(maxR, Math.hypot(x, z));
      const on = sc.threats.filter(t => t.target === n.id);
      const weight = on.reduce((k, t) => k + t.weight, 0);
      const h = 1.1 + Math.min(9, weight) * 0.42;
      const hue = new THREE.Color(KIND_HUE[n.kind]);

      const group = new THREE.Group();
      group.position.set(x, 0, z);
      /* the pedestal: dark metal, with a ring of the core's light at its foot */
      const plateGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.1, 6, 1);
      plateGeo.translate(0, 0.05, 0);
      const plate = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({ color: new THREE.Color('#0e1430'), metalness: 0.9, roughness: 0.6, roughnessMap: grain(), bumpMap: grain(), bumpScale: 0.01, envMapIntensity: 1.1 }));
      plate.castShadow = true;
      plate.receiveShadow = true;
      /* the shadow it casts straight down, soft, so it sits on the stone */
      const contact = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ color: new THREE.Color('#000000'), alphaMap: disc(), transparent: true, opacity: 0.72, depthWrite: false }));
      contact.rotation.x = -Math.PI / 2;
      contact.position.y = 0.012;
      group.add(contact);
      const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.016, 8, 48), new THREE.MeshBasicMaterial({ color: hdr(hue, 2.0) }));
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = 0.105;

      /* the part, in its own form, standing on the pedestal */
      const motif = buildNode(n.kind, hue, h, n.name);
      motif.group.position.y = 0.1;
      motif.body.userData.nodeId = n.id;
      for (const sh of motif.shines) sh.visible = this.quality > 0;
      group.add(plate, baseRing, motif.group);
      const top = motif.top + 0.1;
      let light: THREE.PointLight | null = null;
      if (lit.has(n.id)) {
        light = new THREE.PointLight(hue, 10, 9, 2);
        light.position.set(0, top * 0.5, 0);
        group.add(light);
      }

      const label = document.createElement('div');
      label.className = 'gw-label';
      label.innerHTML = '<span></span><small></small><i class="gw-lv"></i>';
      (label.children[0] as HTMLElement).textContent = n.name;
      (label.children[1] as HTMLElement).textContent = n.kind === 'model' ? 'AI model' : n.kind.charAt(0).toUpperCase() + n.kind.slice(1);
      label.style.setProperty('--kind', KIND_HUE[n.kind]);
      this.labels.appendChild(label);

      const view: NodeView = {
        id: n.id, kind: n.kind, group, motif, glass: motif.body, shields: [], beacon: null, h: top,
        level: { cur: 1, target: 1, top },
        baseRing, light,
        pos: new THREE.Vector3(x, 0, z), state: 'ok', flash: 0, lw: 0,
        rise: hadAny && !prev.has(n.id) && !this.still ? 0 : 1, label,
      };
      group.scale.y = Math.max(0.001, easeOut(view.rise));
      this.world.add(group);
      this.nodes.set(n.id, view);
      if (i < WELL_N) wells[i].set(x, z, Math.min(3, weight / 2.5), 0);

      /* an open problem floats above its part as an amber point */
      if (on.some(t => t.open)) {
        const b = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), new THREE.MeshBasicMaterial({ color: hdr('#fcd9a5', 3) }));
        b.position.set(x, top + 1.1, z);
        b.userData.baseY = top + 1.1;
        this.world.add(b);
        this.beacons.push(b);
        view.beacon = b;
      }
    });

    for (const e of sc.system.edges) {
      const a = this.nodes.get(e.from), b = this.nodes.get(e.to);
      if (!a || !b) continue;
      const p0 = a.pos.clone().setY(0.12), p2 = b.pos.clone().setY(0.12);
      const mid = p0.clone().add(p2).multiplyScalar(0.5);
      mid.y = loopKeys.has(e.from + '>' + e.to) ? 2.6 + p0.distanceTo(p2) * 0.16 : 0.6 + p0.distanceTo(p2) * 0.09;
      const curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
      /* the pipe: a glass wall, the light inside it, an arrowhead at its end, and bars across it for the delay */
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.034, 8, false),
        new THREE.MeshBasicMaterial({ color: hdr('#9cc3ef', 0.75), transparent: true, opacity: 0.7, depthWrite: false }));
      const wall = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.085, 10, false),
        new THREE.MeshStandardMaterial({ color: new THREE.Color('#1a2250'), emissive: new THREE.Color('#9cc3ef'), emissiveIntensity: 0.05, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.22, depthWrite: false, envMapIntensity: 0.8 }));
      const extras: THREE.Object3D[] = [wall];
      const up = new THREE.Vector3(0, 1, 0);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.34, 12), new THREE.MeshStandardMaterial({ color: new THREE.Color('#1a2250'), emissive: new THREE.Color('#9cc3ef'), emissiveIntensity: 0.8, roughness: 0.3, metalness: 0.6 }));
      head.position.copy(curve.getPoint(0.94));
      head.quaternion.setFromUnitVectors(up, curve.getTangent(0.94).normalize());
      extras.push(head);
      const delay = delayOf(e, b.kind);
      const bars = delay < 1 ? 1 : delay < 3 ? 2 : 3;
      for (let i = 0; i < bars; i++) {
        const k = 0.5 + (i - (bars - 1) / 2) * 0.045;
        const bar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.016, 6, 24), new THREE.MeshBasicMaterial({ color: hdr('#d8effc', 1.4) }));
        bar.position.copy(curve.getPoint(k));
        bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), curve.getTangent(k).normalize());
        extras.push(bar);
      }
      this.world.add(tube, ...extras);
      this.edges.push({ from: e.from, to: e.to, curve, tube, extras });
      /* the stream on it: five pulses that carry the upstream part's function */
      const mat = new THREE.MeshBasicMaterial({ color: hdr(ICE, 2.2) });
      const pulses: THREE.Mesh[] = [];
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), mat);
        m.visible = false;
        this.world.add(m);
        pulses.push(m);
      }
      this.flows.set(e.from + '>' + e.to, { pulses, mat, phase: Math.random(), flow: 1 });
    }

    let ex = 0, ez = 0;
    for (const n of this.nodes.values()) { ex = Math.max(ex, Math.abs(n.pos.x)); ez = Math.max(ez, Math.abs(n.pos.z)); }
    this.extent = { x: ex, z: ez };
    void maxR;
    /* label widths are read once here, never per frame */
    for (const n of this.nodes.values()) n.lw = n.label.offsetWidth || 90;
    this.fresh = sc.fresh;
    this.buildReading(rd);
    this.setShields(sc.shields);
    this.resize();
    this.warm();
    if (this.still) this.invalidate();
  }

  /** every shader the scene needs, compiled in the background before the frame that shows it.
      The first time, nothing is drawn until they are ready, so entering never freezes the page. */
  private warmed = false;
  private warm() {
    const first = !this.warmed;
    this.warmed = true;
    if (first) this.ready = false;
    const done = () => {
      if (this.disposed) return;
      if (first) {
        this.ready = true;
        this.readyAt = this.now;
        if (this.introT0 >= 0) this.introT0 = this.now;
        this.renderer.shadowMap.needsUpdate = true;
        this.host.classList.remove('gw-warming');
        if (this.still) this.invalidate();
      }
    };
    /* compile() only starts the work when the browser compiles in parallel; each program is then
       asked whether it is ready, which never blocks. (three's compileAsync throws on materials it
       has not seen in this version, so it is not used.) Eight seconds is the most it waits. */
    try { this.renderer.compile(this.scene, this.camera); } catch { /* a program that fails here fails the same way later */ }
    if (!first) return;
    const progs = (this.renderer.info.programs || []) as unknown as { isReady?: () => boolean }[];
    const t0 = performance.now();
    const poll = () => {
      if (this.disposed) return;
      let all = true;
      try { all = progs.every(pr => !pr.isReady || pr.isReady()); } catch { all = true; }
      if (all || performance.now() - t0 > 8000) done(); else window.setTimeout(poll, 50);
    };
    poll();
  }

  /** what each tier draws */
  private applyTier() {
    const q = this.quality;
    this.floor.visible = q === 2;
    this.floorPlain.visible = q < 2;
    this.bokeh.enabled = q === 2;
    this.bloom.enabled = q > 0;
    this.bloom.strength = 0.7;
    this.renderer.shadowMap.enabled = q > 0;
    this.shadowPlane.visible = q > 0;
    this.renderer.shadowMap.needsUpdate = true;
  }

  setShields(shields: Record<string, Shield[]>) {
    for (const n of this.nodes.values()) {
      for (const r of n.shields) { n.group.remove(r.group); this.disposeObj(r.group); }
      n.shields = [];
      const list = (shields[n.id] || []).slice(0, 6);
      list.forEach((s, i) => {
        const hue = new THREE.Color(s.motrus ? '#c4b5fd' : s.hue);
        const sh = buildShield(s.family || familyOf(s.id), hue, !!s.motrus, n.motif.ringR, 0.1 + n.motif.ringY(i), n.motif.top + 0.1, s.tier);
        n.group.add(sh.group);
        n.shields.push(sh);
      });
    }
    if (this.still) this.invalidate();
  }

  setBand(band: number) {
    this.band = Math.max(0, Math.min(4, band));
    this.bandTarget = new THREE.Color(BAND_HUES[this.band]);
    if (this.still) { this.bandCol.copy(this.bandTarget); this.applyBand(); this.invalidate(); }
  }

  /** the notch: a shockwave from the centre and a breath back from the camera */
  notchShock() {
    this.ripple(0, 0, 2.6, new THREE.Color(BAND_HUES[this.band]));
    this.shake = 0.5;
    this.distNow = this.baseDist * 1.12;
    if (this.still) this.invalidate();
  }

  /** a beat from the score: the lattice breathes with it */
  beat(strength = 1) { this.beatV = Math.max(this.beatV, strength); }

  focusOn(id: string | null) {
    this.hold = null; this.shot = null;
    const n = id ? this.nodes.get(id) : null;
    this.focus = n ? n.pos.clone().setY(n.h * 0.5) : null;
    if (this.still) { this.placeCamera(1); this.invalidate(); }
  }

  /* ---------- the system in motion ---------- */

  /** the loops at work, as arcs above the parts they run through */
  setLoops(loops: LoopView[]) {
    for (const l of this.loops) { this.world.remove(l.tube, ...l.markers); this.disposeObj(l.tube); l.markers.forEach(m => this.disposeObj(m)); l.label.remove(); }
    this.loops = [];
    loops.forEach((view, li) => {
      const pts: THREE.Vector3[] = [];
      for (const id of view.parts) { const n = this.nodes.get(id); if (n) pts.push(n.pos.clone().setY(n.h + 0.9 + li * 0.28)); }
      if (!pts.length) return;
      if (pts.length === 1) {
        const c = pts[0];
        pts.length = 0;
        for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; pts.push(new THREE.Vector3(c.x + Math.cos(a) * 0.9, c.y, c.z + Math.sin(a) * 0.9)); }
      } else if (pts.length === 2) {
        const [a, b] = pts;
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const side = b.clone().sub(a).cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(Math.max(0.7, a.distanceTo(b) * 0.16));
        pts.length = 0;
        pts.push(a, mid.clone().add(side), b, mid.clone().sub(side));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
      const hue = new THREE.Color(view.kind === 'R' ? '#fcd9a5' : '#9fe8ff');
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.016, 6, true),
        new THREE.MeshStandardMaterial({ color: hue.clone().multiplyScalar(0.3), emissive: hue, emissiveIntensity: view.active ? 0.9 : 0.25, metalness: 0.6, roughness: 0.3, transparent: true, opacity: view.active ? 0.8 : 0.3, depthWrite: false }));
      this.world.add(tube);
      const markers: THREE.Mesh[] = [];
      if (view.active) for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 8), new THREE.MeshBasicMaterial({ color: hdr(hue, 3.2) }));
        this.world.add(m);
        markers.push(m);
      }
      const label = document.createElement('div');
      label.className = 'gw-loop ' + (view.kind === 'R' ? 'r' : 'b') + (view.active ? ' on' : '');
      label.innerHTML = '<b></b><span></span>';
      (label.children[0] as HTMLElement).textContent = view.kind;
      (label.children[1] as HTMLElement).textContent = view.name;
      this.labels.appendChild(label);
      /* each name sits at its own place on its loop, so the names do not pile up */
      const anchor = curve.getPoint((0.15 + li * 0.23) % 1);
      this.loops.push({ view, tube, markers, label, curve, anchor: anchor.clone().setY(anchor.y + 0.3) });
    });
    if (this.still) this.invalidate();
  }

  /** a line rises from a part when the learner acts on it, and the part answers with a wave */
  cheer(nodeId: string, text: string) {
    const n = this.nodes.get(nodeId);
    if (!n) return;
    const el = document.createElement('div');
    el.className = 'gw-float';
    el.textContent = text;
    this.labels.appendChild(el);
    this.floats.push({ el, anchor: n.pos.clone().setY(n.h + 1.2), until: this.now + 1.8 });
    this.ripple(n.pos.x, n.pos.z, 1.3, ICE);
    const outer = n.shields[n.shields.length - 1];
    if (outer) outer.flash = 1;
    if (this.still) this.invalidate();
  }

  /** the camera turns to a loop */
  focusLoop(id: string) {
    const l = this.loops.find(x => x.view.id === id);
    if (!l) return;
    const c = new THREE.Vector3();
    for (const q of l.curve.points) c.add(q);
    c.divideScalar(l.curve.points.length);
    this.focus = c.setY(c.y - 1.2);
    if (this.still) { this.placeCamera(1); this.invalidate(); }
  }

  /** every threat's source on the horizon, and the stream of pressure it sends */
  setStations(list: StationView[]) {
    for (const st of this.stations) { this.world.remove(st.mesh); this.disposeObj(st.mesh); }
    this.stations = [];
    if (this.streamPts) { this.world.remove(this.streamPts); this.disposeObj(this.streamPts); this.streamPts = null; }
    for (const view of list) {
      const n = this.nodes.get(view.target);
      if (!n) continue;
      const a = hashAngle(view.id);
      const from = new THREE.Vector3(Math.cos(a) * 23, 1.0, Math.sin(a) * 23);
      const held = view.layers > 0;
      const to = n.pos.clone().setY(held ? 0.1 + n.motif.ringY(Math.min(5, view.layers - 1)) : n.h * 0.5);
      const curve = new THREE.CubicBezierCurve3(from, from.clone().lerp(to, 0.4).setY(1.7), from.clone().lerp(to, 0.85).setY(1.2), to);
      const col = new THREE.Color(view.layers >= 2 ? '#9fe8ff' : view.layers === 1 ? '#fcd9a5' : '#ff5d73');
      /* a cloud: the source in the notation, sized by the weight */
      const mesh = new THREE.Group();
      const mats: THREE.MeshStandardMaterial[] = [];
      const sz = 0.5 + view.weight * 0.16;
      for (const [x, y, z, r] of [[0, 0, 0, 0.5], [-0.45, -0.05, 0.1, 0.36], [0.46, -0.02, -0.1, 0.4], [0.1, 0.3, 0.05, 0.34], [-0.2, 0.22, -0.2, 0.28]]) {
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2a1420'), emissive: col, emissiveIntensity: 0.35, roughness: 0.6, metalness: 0, transparent: true, opacity: 0.85 });
        const sph = new THREE.Mesh(new THREE.SphereGeometry(r * sz, 14, 12), mat);
        sph.position.set(x * sz, y * sz, z * sz);
        mesh.add(sph);
        mats.push(mat);
      }
      mesh.position.copy(from).setY(1.4);
      this.world.add(mesh);
      this.stations.push({ view, mesh, mats, curve, col, stop: held ? 0.92 : 1 });
    }
    this.warm();
    const count = this.stations.length * GaugeWorld.STREAM_N;
    if (count) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      this.streamPts = new THREE.Points(g, new THREE.PointsMaterial({ size: 3.4, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      this.streamPts.frustumCulled = false;
      this.world.add(this.streamPts);
    }
    if (this.still) this.invalidate();
  }

  /** the system's state now: levels, flows, cuts, and which pressures are pushing */
  applyDyn(d: DynView) {
    this.dyn = d;
    for (const n of this.nodes.values()) {
      const h = d.health[n.id] ?? 1;
      n.level.target = h;
      const lv = n.label.querySelector('.gw-lv') as HTMLElement | null;
      if (lv) lv.textContent = h < 0.995 ? Math.round(h * 100) + '%' : '';
    }
    for (const e of this.edges) {
      const key = e.from + '>' + e.to;
      const hue = d.cuts[key];
      const have = this.breakers.get(key);
      if (hue && !have) {
        /* a valve on the pipe, closed: a gate inside it, a stem, a wheel with four spokes */
        const q = e.curve.getPoint(0.8);
        const tangent = e.curve.getTangent(0.8).normalize();
        const valve = new THREE.Group();
        const lit = new THREE.MeshBasicMaterial({ color: hdr(new THREE.Color(hue), 2.8) });
        const gate = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16), lit);
        gate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        valve.add(gate);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8), new THREE.MeshStandardMaterial({ color: new THREE.Color('#1a2250'), metalness: 0.9, roughness: 0.3 }));
        stem.position.y = 0.22;
        valve.add(stem);
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.022, 8, 32), lit);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.y = 0.38;
        valve.add(wheel);
        for (let i = 0; i < 2; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.02), lit); sp.rotation.y = i * Math.PI / 2; sp.position.y = 0.38; valve.add(sp); }
        valve.position.copy(q);
        this.world.add(valve);
        this.breakers.set(key, valve);
      } else if (!hue && have) {
        this.world.remove(have); this.disposeObj(have); this.breakers.delete(key);
      }
    }
    if (this.still) this.invalidate();
  }

  /* ---------- the run ---------- */

  /** A threat sets out in its own form, from where it would really come. stopper is the structure that will stop it, if one will. */
  launch(threat: GaugeThreat, outcome: 'stopped' | 'landed', durMs: number, onImpact?: () => void, stopper: Stopper | null = null) {
    const n = this.nodes.get(threat.target);
    if (!n) { onImpact?.(); return; }
    const motif = threatMotif(threat);
    let style: StopStyle | null = outcome === 'stopped' ? stopStyle(stopper && !stopper.motrus ? stopper.id : null, !!stopper?.motrus) : null;
    /* a breaker sits on a dependency; anything that did not come along one is stopped at the ring instead */
    if (style === 'break' && motif !== 'chain') style = 'wall';
    if (this.still || durMs <= 0) { this.impact(n, outcome, style); onImpact?.(); return; }
    const a = hashAngle(threat.id);
    const end = n.pos.clone().setY(n.h + 0.15);
    let curve: THREE.Curve<THREE.Vector3> | null = null;
    let origin = ORIGIN[motif];
    const other = (kinds: NodeKind[]) => [...this.nodes.values()].find(x => x.id !== n.id && kinds.includes(x.kind));
    if (origin === 'vendor') { const v = other(['vendor', 'build']); if (v) curve = this.arc(v.pos.clone().setY(v.h + 0.2), end, 2.5); else origin = 'horizon'; }
    if (origin === 'public') { const v = other(['public']); if (v) curve = this.arc(v.pos.clone().setY(1.0), end.clone().setY(n.h * 0.5), 1.2); else origin = 'low'; }
    if (origin === 'edge') { const e = this.edges.find(x => x.to === n.id); if (e) curve = e.curve; else origin = 'horizon'; }
    if (!curve) {
      if (origin === 'below') {
        curve = new THREE.LineCurve3(n.pos.clone().setY(-3), n.pos.clone().setY(0.25));
        this.ripple(n.pos.x, n.pos.z, 0.8, CORAL);
      } else if (origin === 'above') {
        curve = new THREE.LineCurve3(n.pos.clone().setY(n.h + 11).add(new THREE.Vector3(Math.cos(a) * 0.6, 0, Math.sin(a) * 0.6)), end);
      } else if (origin === 'low') {
        const start = new THREE.Vector3(Math.cos(a) * 26, 0.6, Math.sin(a) * 26);
        const lowEnd = n.pos.clone().setY(Math.max(0.5, n.h * 0.45));
        curve = new THREE.CubicBezierCurve3(start, start.clone().lerp(lowEnd, 0.35).setY(0.9), start.clone().lerp(lowEnd, 0.8).setY(0.9), lowEnd);
      } else {
        const start = new THREE.Vector3(Math.cos(a) * 26, 8 + (threat.weight * 1.2), Math.sin(a) * 26);
        curve = new THREE.CubicBezierCurve3(start, start.clone().lerp(end, 0.35).setY(start.y + 3), end.clone().add(new THREE.Vector3(0, 5, 0)), end);
      }
    }
    const col = motif === 'open' ? new THREE.Color('#fcd9a5') : outcome === 'landed' ? CORAL : new THREE.Color('#ffb4a8');
    const head = buildHead(motif, col, threat.weight);
    const start = curve.getPoint(0);
    head.obj.position.copy(start);
    this.world.add(head.obj);
    let trail: THREE.Line | null = null;
    const hist = Array.from({ length: 26 }, () => start.clone());
    if (head.trail) {
      const tg = new THREE.BufferGeometry().setFromPoints(hist);
      const cols = new Float32Array(26 * 3);
      for (let i = 0; i < 26; i++) { const k = 1 - i / 25; cols[i * 3] = col.r * 3 * k; cols[i * 3 + 1] = col.g * 3 * k; cols[i * 3 + 2] = col.b * 3 * k; }
      tg.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      trail = new THREE.Line(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }));
      this.world.add(trail);
    }
    this.comets.push({
      curve, t0: this.now, dur: (durMs / 1000) * PACE[motif], head: head.obj, mats: head.mats, trail, hist, node: n.id, outcome, onImpact,
      motif, style, stopHue: new THREE.Color(stopper?.hue || '#d8effc'), col, ended: false, endT0: 0, beamed: false, lastRipple: 0,
      orient: motif === 'wedge' || motif === 'chain' || motif === 'spark',
    });
    this.focus = n.pos.clone().setY(n.h * 0.5);
  }

  private arc(from: THREE.Vector3, to: THREE.Vector3, lift: number): THREE.Curve<THREE.Vector3> {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y = Math.max(from.y, to.y) + lift;
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }

  private impact(n: NodeView, outcome: 'stopped' | 'landed', style: StopStyle | null) {
    if (outcome === 'stopped') {
      const outer = n.shields[n.shields.length - 1];
      if (outer) outer.flash = 1;
      if (style === 'ice') { this.ripple(n.pos.x, n.pos.z, 1.6, ICE); this.ripple(n.pos.x, n.pos.z, 0.9, ICE, 0.25); }
      else if (style === 'motrus') this.ripple(n.pos.x, n.pos.z, 1.3, new THREE.Color('#c4b5fd'));
      else this.ripple(n.pos.x, n.pos.z, 1.1, ICE);
    } else {
      n.state = 'fallen';
      n.flash = 1;
      this.ripple(n.pos.x, n.pos.z, 2.0, CORAL);
      this.shake = Math.max(this.shake, 0.35);
    }
    this.paintNode(n);
    if (this.still) this.invalidate();
  }

  /** the end of a stopped threat, in the way its stopper works */
  private endComet(c: Comet, n: NodeView, t: number) {
    const age = t - c.endT0;
    const h = c.head;
    switch (c.style) {
      case 'bounce': case 'shatter':
        if (age < 0.12) h.position.y += 2.2 * (0.12 - age);
        else { this.burst(h.position, c.col, 7); return false; }
        return true;
      case 'wall':
        h.scale.set(1 + age * 2.4, Math.max(0.05, 1 - age * 2), 1 + age * 2.4);
        for (const m of c.mats) { m.transparent = true; m.opacity = Math.max(0, 1 - age * 1.8); }
        return age < 0.55;
      case 'grey':
        h.scale.setScalar(Math.max(0.01, 1 - age * 1.6));
        return age < 0.6;
      case 'drop':
        h.position.y = Math.max(0.12, h.position.y - age * age * 12);
        h.rotation.x += age * 0.1; h.rotation.z += age * 0.08;
        for (const m of c.mats) m.color.copy(c.col).multiplyScalar(Math.max(0.3, 2.5 - age * 3));
        return age < 0.9;
      case 'ice':
        h.position.y -= age * 1.6;
        h.scale.setScalar(Math.max(0.01, 1 - age * 1.4));
        return age < 0.6;
      case 'motrus':
        h.scale.setScalar(1 + age * 2.2);
        for (const m of c.mats) { m.transparent = true; m.opacity = Math.max(0, 0.9 - age * 1.8); m.color.copy(new THREE.Color('#c4b5fd')).multiplyScalar(4); }
        return age < 0.5;
      case 'break':
        if (age === 0 || !c.beamed) { this.cutBarAt(h.position, c.stopHue); c.beamed = true; }
        for (const m of c.mats) { m.transparent = true; m.opacity = Math.max(0, 1 - age * 2.5); }
        return age < 0.4;
      case 'seen': case 'dissipate':
        return false;
      default:
        /* landed: it sinks into the part */
        h.scale.setScalar(Math.max(0.01, 1 - age * 2.5));
        h.position.y = Math.max(0.2, h.position.y - age * 2);
        void n;
        return age < 0.4;
    }
  }

  private burst(p: THREE.Vector3, col: THREE.Color, n = 7) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(this.sparkGeo, new THREE.MeshBasicMaterial({ color: hdr(col, 5), transparent: true }));
      m.position.copy(p);
      const a = Math.random() * Math.PI * 2;
      this.sparks.push({ m, v: new THREE.Vector3(Math.cos(a) * (1 + Math.random() * 2.5), 2.5 + Math.random() * 3, Math.sin(a) * (1 + Math.random() * 2.5)), t0: this.now });
      this.world.add(m);
    }
  }

  private beam(from: THREE.Vector3, to: THREE.Vector3, col: THREE.Color) {
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: hdr(col, 4), transparent: true, opacity: 0.9 }));
    this.world.add(line);
    this.beams.push({ line, until: this.now + 0.45 });
  }

  /** after the last impact: the failure travels every dependency the stack did not cut */
  outcome(fallen: string[], reached: string[], cuts: WorldCut[]) {
    const fallenSet = new Set(fallen), reachedSet = new Set(reached);
    for (const id of fallen) { const n = this.nodes.get(id); if (n && n.state !== 'fallen') { n.state = 'fallen'; this.paintNode(n); } }
    const cutKey = new Map(cuts.map(c => [c.from + '>' + c.to, c.hue]));
    /* breadth first from the fallen, so the cascade runs in the order it would spread */
    const depth = new Map<string, number>();
    fallen.forEach(id => depth.set(id, 0));
    const queue = [...fallen];
    while (queue.length) {
      const at = queue.shift()!;
      for (const e of this.edges) {
        if (e.from !== at) continue;
        const d = (depth.get(at) || 0) + 1;
        const hue = cutKey.get(e.from + '>' + e.to);
        const delay = d * 0.75;
        if (hue) this.sendPulse(e.curve, CORAL, delay, 0.5, () => this.cutBar(e.curve, hue));
        else if (reachedSet.has(e.to) && !depth.has(e.to)) {
          depth.set(e.to, d);
          queue.push(e.to);
          this.sendPulse(e.curve, CORAL, delay, 1, () => {
            const n = this.nodes.get(e.to);
            if (n && n.state === 'ok') { n.state = 'down'; this.paintNode(n); this.ripple(n.pos.x, n.pos.z, 0.9, CORAL); }
          });
          (e.tube.material as THREE.MeshBasicMaterial).color.copy(hdr(CORAL, 1.4));
        }
      }
    }
    if (this.still) {
      for (const id of reached) { const n = this.nodes.get(id); if (n) { n.state = 'down'; this.paintNode(n); } }
      for (const c of cuts) { const e = this.edges.find(x => x.from === c.from && x.to === c.to); if (e) this.cutBar(e.curve, c.hue); }
      this.invalidate();
    }
    void fallenSet;
    this.focus = null;
  }

  clearOutcome() {
    for (const n of this.nodes.values()) { n.state = 'ok'; n.flash = 0; this.paintNode(n); }
    for (const e of this.edges) (e.tube.material as THREE.MeshBasicMaterial).color.copy(hdr('#9cc3ef', 0.75));
    for (const b of this.bars) { this.world.remove(b); this.disposeObj(b); }
    this.bars = [];
    for (const c of this.comets) this.removeComet(c);
    this.comets = [];
    for (const sp of this.sparks) { this.world.remove(sp.m); (sp.m.material as THREE.Material).dispose(); }
    this.sparks = [];
    for (const b of this.beams) { this.world.remove(b.line); this.disposeObj(b.line); }
    this.beams = [];
    this.focus = null;
    if (this.still) this.invalidate();
  }

  /** Gratus Gold: a column of gold light rises from the centre */
  gold() {
    if (this.goldCol) { this.world.remove(this.goldCol); this.disposeObj(this.goldCol); }
    const geo = new THREE.CylinderGeometry(0.9, 2.2, 34, 48, 1, true);
    geo.translate(0, 17, 0);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 }, uCol: { value: hdr(GOLD, 2.6) } },
      vertexShader: 'varying float vY;void main(){vY=position.y/34.0;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: 'uniform float uA;uniform vec3 uCol;varying float vY;void main(){float a=uA*(1.0-vY)*(0.35+0.65*smoothstep(0.0,0.08,vY));gl_FragColor=vec4(uCol*a,a);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    this.goldCol = new THREE.Mesh(geo, mat);
    this.world.add(this.goldCol);
    this.goldT0 = this.now;
    for (let i = 0; i < 3; i++) this.ripple(0, 0, 2.2 - i * 0.5, GOLD, i * 0.45);
    this.focus = null;
    if (this.still) { mat.uniforms.uA.value = 0.8; this.invalidate(); }
  }

  /* ---------- the reading in light ---------- */

  private buildReading(rd: SystemReading) {
    const k = rd.keystone ? this.nodes.get(rd.keystone) : null;
    if (k) {
      /* the one amber light: a column from the keystone into the sky, brightest at its foot and at its rim */
      const geo = new THREE.CylinderGeometry(0.3, 0.52, 20, 40, 1, true);
      geo.translate(0, 10, 0);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uCol: { value: hdr(AMBER, 1.5) }, uT: { value: 0 } },
        vertexShader: 'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'uniform vec3 uCol; uniform float uT; varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.7); float fade = pow(1.0 - vUv.y, 2.2); float band = 0.78 + 0.22 * sin(vUv.y * 26.0 - uT * 2.0); gl_FragColor = vec4(uCol * band, (0.1 + rim * 0.6) * fade); }',
      });
      const beam = new THREE.Mesh(geo, mat);
      beam.position.set(k.pos.x, 0.1, k.pos.z);
      beam.renderOrder = 4;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.032, 8, 72), new THREE.MeshBasicMaterial({ color: hdr(AMBER, 2.6) }));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(k.pos.x, 0.125, k.pos.z);
      this.world.add(beam, ring);
      this.readObjs.push(beam, ring);
      this.keyBeam = beam;
    }
    /* no way around: a thin ring of ice */
    for (const id of rd.chokepoints) {
      const n = this.nodes.get(id);
      if (!n || id === rd.keystone) continue;
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.02, 6, 72), new THREE.MeshBasicMaterial({ color: hdr(ICE, 1.7) }));
      r.rotation.x = Math.PI / 2;
      r.position.set(n.pos.x, 0.13, n.pos.z);
      this.world.add(r);
      this.readObjs.push(r);
    }
    /* the people: the stock every flow serves, under a dome of soft light */
    for (const id of rd.publicIds) {
      const n = this.nodes.get(id);
      if (!n) continue;
      const rad = Math.max(1.7, n.h * 0.5 + 0.9);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(rad, 40, 18, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: hdr('#f18ac6', 1.0), transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      dome.position.set(n.pos.x, 0.1, n.pos.z);
      this.world.add(dome);
      this.readObjs.push(dome);
    }
    /* the fastest cascade rides the real pipes, lit, with a bead that runs it */
    if (rd.fastest.length >= 2) {
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 1; i < rd.fastest.length; i++) {
        const e = this.edges.find(x => x.from === rd.fastest[i - 1] && x.to === rd.fastest[i]);
        if (e) path.add(e.curve);
      }
      if (path.curves.length) {
        const line = new THREE.Mesh(new THREE.TubeGeometry(path as unknown as THREE.Curve<THREE.Vector3>, 64 * path.curves.length, 0.07, 8, false),
          new THREE.MeshBasicMaterial({ color: hdr('#ff9a7a', 1.4), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), new THREE.MeshBasicMaterial({ color: hdr('#ffc09a', 4.5) }));
        bead.visible = false;
        this.world.add(line, bead);
        this.readObjs.push(line, bead);
        this.cascade = path;
        this.bead = bead;
      }
    }
    for (const o of this.readObjs) o.visible = this.readingOn && o !== this.bead;
  }

  /** the reading on or off */
  setReadingVisible(on: boolean) {
    this.readingOn = on;
    for (const o of this.readObjs) o.visible = on && o !== this.bead;
    if (this.still) this.invalidate();
  }

  /** the hardening points: the day numbers of the moves that enter each part, in the verb's colour */
  setHardening(points: { id: string; text: string; verb: string }[]) {
    for (const n of this.nodes.values()) n.label.querySelector('.gw-hp')?.remove();
    for (const pt of points) {
      const n = this.nodes.get(pt.id);
      if (!n) continue;
      const b = document.createElement('b');
      b.className = 'gw-hp v-' + pt.verb;
      b.textContent = pt.text;
      n.label.appendChild(b);
    }
    if (this.still) this.invalidate();
  }

  /** a part struck in a state: a flash on it and a ripple through the lattice under it */
  strike(id: string, hue = '#ff5d73') {
    const n = this.nodes.get(id);
    if (!n) return;
    n.flash = 1;
    this.ripple(n.pos.x, n.pos.z, 2.4, new THREE.Color(hue));
    if (this.still) this.invalidate();
  }

  /** the frames: the whole, from above, from the people looking upstream, the keystone, and along the cascade */
  view(name: WorldViewName) {
    const rd = this.reading;
    const portrait = this.portrait;
    const front = portrait ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    const nodes = [...this.nodes.values()];
    const centre = new THREE.Vector3(0, 0.8, 0);
    const key = (pos: THREE.Vector3, target: THREE.Vector3, dur: number) => ({ pos, target, dur });
    const keys: { pos: THREE.Vector3; target: THREE.Vector3; dur: number }[] = [];
    const D = this.baseDist;
    if (name === 'whole') {
      keys.push(key(centre.clone().add(new THREE.Vector3(0, 0.47, 0.88).normalize().multiplyScalar(D)), centre.clone(), 1.6));
    } else if (name === 'above') {
      const h = D * 1.15;
      keys.push(key(new THREE.Vector3(0, h, 0).add(front.clone().multiplyScalar(h * Math.tan(0.34))), new THREE.Vector3(0, 0, 0), 1.8));
    } else if (name === 'people') {
      const ppl = (rd?.publicIds || []).map(id => this.nodes.get(id)).filter(Boolean) as NodeView[];
      const at = ppl.length ? ppl.reduce((v, n) => v.add(n.pos), new THREE.Vector3()).multiplyScalar(1 / ppl.length) : centre.clone();
      const pos = at.clone().add(front.clone().multiplyScalar(6.5)).setY(2.4);
      const target = centre.clone().sub(front.clone().multiplyScalar(this.extent.z * 0.4)).setY(1.6);
      keys.push(key(pos, target, 2.0));
    } else if (name === 'keystone' && rd?.keystone) {
      const k = this.nodes.get(rd.keystone)!;
      const target = k.pos.clone().setY(k.h * 0.6);
      keys.push(key(target.clone().add(front.clone().multiplyScalar(7.5)).add(new THREE.Vector3(2.4, 4.2, 0)), target, 1.8));
    } else if (name === 'cascade' && rd && rd.fastest.length >= 2) {
      for (const id of rd.fastest) {
        const n = this.nodes.get(id);
        if (!n) continue;
        const target = n.pos.clone().setY(n.h * 0.5);
        keys.push(key(target.clone().add(front.clone().multiplyScalar(5.2)).add(new THREE.Vector3(1.6, 3.0, 0)), target, keys.length ? 1.7 : 1.4));
      }
    }
    if (!keys.length) return;
    void nodes;
    this.controls.autoRotate = false;
    this.idleUntil = this.now + 12;
    this.focus = null;
    this.hold = null;
    if (this.still) {
      const last = keys[keys.length - 1];
      this.camera.position.copy(last.pos); this.controls.target.copy(last.target); this.controls.update();
      this.focus = last.target.clone(); this.hold = last.pos.distanceTo(last.target);
      this.invalidate();
      return;
    }
    this.shot = { keys, t0: this.now, from: { pos: this.camera.position.clone(), target: this.controls.target.clone() } };
    if (name === 'whole') this.hold = null;
  }

  /** after a shot to the whole, the camera returns to its own easing */
  release() { this.hold = null; this.focus = null; }

  /* ---------- helpers ---------- */

  private ripple(x: number, z: number, s: number, col: THREE.Color, delay = 0) {
    this.ripples.push({ x, z, t0: this.now + delay, s, col: col.clone().multiplyScalar(1.4) });
    if (this.ripples.length > RIP_N) this.ripples.shift();
  }

  private sendPulse(curve: THREE.QuadraticBezierCurve3, col: THREE.Color, delay: number, stopAt: number, done?: () => void) {
    if (this.still) { done?.(); return; }
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: hdr(col, 5) }));
    mesh.visible = false;
    this.world.add(mesh);
    this.pulses.push({ curve, t0: this.now + delay, dur: 0.75, mesh, stopAt, done });
  }

  private cutBar(curve: THREE.QuadraticBezierCurve3, hue: string) {
    this.cutBarAt(curve.getPoint(0.5), new THREE.Color(hue));
  }

  /** a breaker: a bar of light in the colour of the structure that cut the path */
  private cutBarAt(p: THREE.Vector3, hue: THREE.Color) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), new THREE.MeshBasicMaterial({ color: hdr(hue, 4) }));
    bar.position.copy(p).setY(p.y + 0.3);
    bar.userData.flash = 1;
    this.world.add(bar);
    this.bars.push(bar);
    this.ripple(p.x, p.z, 0.8, hue);
  }

  private removeComet(c: Comet) {
    this.world.remove(c.head);
    this.disposeObj(c.head);
    if (c.trail) { this.world.remove(c.trail); this.disposeObj(c.trail); }
  }

  /** the part's light and its pose follow its state */
  private paintNode(n: NodeView) {
    const hue = new THREE.Color(KIND_HUE[n.kind]);
    const col = n.state === 'fallen' ? CORAL : n.state === 'down' ? new THREE.Color('#7a3a4a') : hue;
    const kk = n.state === 'fallen' ? 1.3 : n.state === 'down' ? 0.6 : 1;
    for (const m of n.motif.lights) { m.color.copy(hdr(col, (m.userData.k as number) * kk)); m.userData.col = m.color.clone(); }
    for (const m of n.motif.lines) m.color.copy(hdr(col, (m.userData.k as number) * (n.state === 'down' ? 0.5 : 1)));
    for (const g of n.motif.glass) {
      g.emissive.copy(n.state === 'down' ? new THREE.Color('#5a2030') : col);
      g.emissiveIntensity = n.state === 'fallen' ? 0.42 : n.state === 'down' ? 0.2 : 0.14;
    }
    (n.baseRing.material as THREE.MeshBasicMaterial).color.copy(hdr(col, n.state === 'down' ? 0.7 : 2.0));
    if (n.light) { n.light.color.copy(n.state === 'ok' ? hue : CORAL); n.light.intensity = n.state === 'fallen' ? 14 : n.state === 'down' ? 3 : 10; }
    n.motif.pose(n.state);
    n.label.classList.toggle('fallen', n.state === 'fallen');
    n.label.classList.toggle('down', n.state === 'down');
  }

  private applyBand() {
    const bg = NIGHT.clone().lerp(this.bandCol, 0.045);
    (this.scene.background as THREE.Color).copy(bg);
    (this.scene.fog as THREE.FogExp2).color.copy(bg);
    this.renderer.setClearColor(bg, 1);
    (this.latticeMat.uniforms.uBase.value as THREE.Color).copy(this.bandCol.clone().lerp(ICE, 0.25).multiplyScalar(0.55));
    const su = this.skyMat.uniforms;
    (su.uZenith.value as THREE.Color).copy(bg).multiplyScalar(0.5);
    (su.uHorizon.value as THREE.Color).copy(bg).lerp(new THREE.Color('#162250'), 0.4);
    (su.uBand.value as THREE.Color).copy(this.bandCol);
    const fu = this.floorMat.uniforms;
    (fu.uFog.value as THREE.Color).copy(bg);
    fu.uFogD.value = (this.scene.fog as THREE.FogExp2).density;
    fu.uCam.value.copy(this.camera.position);
  }

  private placeCamera(k: number) {
    const dist = this.distNow;
    const target = this.focus || new THREE.Vector3(0, 0.8, 0);
    if (this.still || k >= 1) {
      this.controls.target.copy(target);
      const dir = this.camera.position.clone().sub(this.controls.target);
      if (dir.lengthSq() < 0.01) dir.set(0, 0.47, 0.88);
      dir.normalize().multiplyScalar(dist);
      if (this.still) dir.set(0, 0.5, 0.86).normalize().multiplyScalar(dist);
      this.camera.position.copy(this.controls.target).add(dir);
      this.controls.update();
    }
  }

  private disposeObj(o: THREE.Object3D) {
    o.traverse(x => {
      const m = x as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach(y => y.dispose()); else mat?.dispose();
    });
  }

  private onDown = (e: PointerEvent) => { this.downAt = { x: e.clientX, y: e.clientY }; };
  private onUp = (e: PointerEvent) => {
    if (!this.downAt) return;
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y);
    this.downAt = null;
    if (moved > 6 || !this.onPick) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hits = ray.intersectObjects([...this.nodes.values()].map(n => n.glass), false);
    this.onPick(hits[0] ? (hits[0].object.userData.nodeId as string) : null);
  };

  /* ---------- the frame ---------- */

  private tick = (ms: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    /* the lightest tier draws thirty frames a second; the motion is timed, so it reads the same */
    if (this.quality === 0 && ms - this.lastDraw < 31) return;
    this.lastDraw = ms;
    this.frame(ms, false);
  };

  private lastMs = 0;
  /* The device decides. Over windows of sixty frames or two seconds, if the median
     frame takes longer than 26ms two windows running, the world steps down a level:
     first the mirror floor gives way to a plain one, the pixel ratio drops to one,
     the shadows halve and the cores' own lights go out; then the bloom, the
     shadows and the glass shells go too. It steps down only, so it cannot oscillate. */
  private govern(gapMs: number) {
    /* the first seconds compile shaders and are no measure of the device */
    /* a gap over a second is a tab switch or a stall, not a frame; the first second after the
       shaders are ready is still settling */
    if (this.quality === 0 || document.visibilityState !== 'visible' || gapMs > 1000 || !this.ready || this.now - this.readyAt < 1) return;
    if (!this.winStart) this.winStart = performance.now();
    this.gaps.push(gapMs);
    if (this.gaps.length < 30 && performance.now() - this.winStart < 1000) return;
    const sorted = this.gaps.slice().sort((a, b) => a - b);
    const median = sorted[sorted.length >> 1];
    this.gaps = [];
    this.winStart = 0;
    this.slowWindows = median > 34 ? this.slowWindows + 1 : 0;
    if (this.slowWindows < 2) return;
    this.slowWindows = 0;
    this.quality = (this.quality - 1) as 0 | 1 | 2;
    try { localStorage.setItem(TIER_KEY, String(this.quality)); } catch { /* the next visit starts from the device again */ }
    this.applyTier();
    if (this.quality === 1) {
      for (const n of this.nodes.values()) if (n.light) { n.group.remove(n.light); n.light.dispose(); n.light = null; }
    } else {
      for (const n of this.nodes.values()) for (const sh of n.motif.shines) sh.visible = false;
      this.scene.traverse(o => {
        const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach(x => { x.needsUpdate = true; }); else if (m) m.needsUpdate = true;
      });
    }
    this.resize();
  }

  /** for the probe and the console: how the device is coping */
  get qualityLevel() { return this.quality; }

  private frame(ms: number, single: boolean) {
    const t = (ms - this.t0) / 1000;
    if (!this.ready) { this.now = t; this.lastMs = 0; return; }
    if (!single && this.lastMs) this.govern(ms - this.lastMs);
    if (this.renderer.shadowMap.enabled && ms - this.lastShadow > (this.quality === 2 ? 200 : 400)) { this.renderer.shadowMap.needsUpdate = true; this.lastShadow = ms; }
    const dt = this.lastMs ? Math.min(0.05, (ms - this.lastMs) / 1000) : 0.016;
    this.lastMs = ms;
    this.now = t;

    /* the band's colour arrives over about a second and a half */
    if (!single) this.bandCol.lerp(this.bandTarget, 1 - Math.exp(-dt * 1.8));
    this.applyBand();

    /* the arrival: from high above, down into orbit */
    if (this.introT0 >= 0 && !single) {
      const k = easeOut((t - this.introT0) / 2.2);
      const from = new THREE.Vector3(0, 30, 34);
      const dir = new THREE.Vector3(0, 0.47, 0.88).normalize().multiplyScalar(this.distNow);
      this.camera.position.copy(from.lerp(dir, k));
      if (k >= 1) this.introT0 = -1;
    }

    /* a shot in flight moves the camera through its keyframes; when it lands the view holds */
    if (this.shot && !single) {
      const s = this.shot;
      let el = t - s.t0; let i = 0; let from = s.from;
      while (i < s.keys.length && el > s.keys[i].dur) { el -= s.keys[i].dur; from = { pos: s.keys[i].pos, target: s.keys[i].target }; i++; }
      if (i >= s.keys.length) {
        const last = s.keys[s.keys.length - 1];
        this.camera.position.copy(last.pos); this.controls.target.copy(last.target);
        this.focus = last.target.clone(); this.hold = last.pos.distanceTo(last.target); this.shot = null;
        if (last.target.distanceTo(new THREE.Vector3(0, 0.8, 0)) < 0.01 && Math.abs(this.hold - this.baseDist) < 0.5) { this.focus = null; this.hold = null; }
      } else {
        const k = easeInOut(el / s.keys[i].dur);
        this.camera.position.lerpVectors(from.pos, s.keys[i].pos, k);
        this.controls.target.lerpVectors(from.target, s.keys[i].target, k);
      }
      this.controls.update();
    } else
    /* the camera eases toward whatever is happening, and back */
    if (!single) {
      const target = this.focus || new THREE.Vector3(0, 0.8, 0);
      this.controls.target.lerp(target, 1 - Math.exp(-dt * 2.4));
      const want = this.hold !== null ? this.hold : this.focus ? this.distNow * 0.72 : this.distNow;
      const cur = this.camera.position.clone().sub(this.controls.target);
      const len = cur.length();
      if (this.introT0 < 0 && Math.abs(len - want) > 0.01) cur.setLength(len + (want - len) * (1 - Math.exp(-dt * 1.6)));
      this.camera.position.copy(this.controls.target).add(cur);
      this.distNow += (this.baseDist - this.distNow) * (1 - Math.exp(-dt * 0.8));
      if (!this.controls.autoRotate && this.now > this.idleUntil && this.idleUntil > 0) { this.controls.autoRotate = true; this.idleUntil = 0; }
      this.controls.update();
    }

    /* the reading: the column shimmers, and a bead runs the fastest cascade every few seconds */
    if (this.keyBeam) (this.keyBeam.material as THREE.ShaderMaterial).uniforms.uT.value = t;
    if (this.bead && this.cascade) {
      const per = 3.4, gap = 1.4;
      const k = ((t % (per + gap)) / per);
      const on = this.readingOn && k <= 1 && !single;
      this.bead.visible = on || (single && this.readingOn);
      this.bead.position.copy(this.cascade.getPointAt(on ? Math.min(1, k) : 0.5));
    }

    /* uniforms: ripples, wells, the beat */
    const u = this.latticeMat.uniforms;
    u.uTime.value = t;
    this.beatV *= Math.exp(-dt * 4.5);
    u.uBeat.value = this.beatV;
    const rv = u.uRip.value as THREE.Vector4[], rc = u.uRipCol.value as THREE.Color[];
    this.ripples = this.ripples.filter(r => t - r.t0 < 3.4);
    for (let i = 0; i < RIP_N; i++) {
      const r = this.ripples[i];
      if (r && !single) { rv[i].set(r.x, r.z, r.t0, r.s); rc[i].copy(r.col); } else rv[i].set(0, 0, 0, 0);
    }

    /* nodes: rising, each in its own motion, a flicker on a fall, the structures breathing back to rest */
    for (const n of this.nodes.values()) {
      if (n.rise < 1) { n.rise = Math.min(1, n.rise + dt / 1.1); n.group.scale.y = Math.max(0.001, easeOut(n.rise)); }
      n.motif.idle(t, single ? 5 : dt);
      if (n.flash > 0) {
        n.flash = Math.max(0, n.flash - dt * 0.9);
        const k = 1 + Math.sin(t * 38) * 0.5 * n.flash;
        for (const m of n.motif.lights) m.color.copy(m.userData.col as THREE.Color).multiplyScalar(k);
      }
      for (const sh of n.shields) {
        if (sh.flash > 0) sh.flash = Math.max(0, sh.flash - dt * 1.6);
        sh.idle(t);
      }
      if (n.light && n.flash > 0) n.light.intensity = 14 * (0.7 + 0.3 * Math.sin(t * 41));
      if (n.beacon && !single) n.beacon.position.y = (n.beacon.userData.baseY as number) + Math.sin(t * 1.4) * 0.18;
    }

    /* the newest notch's target: a wave from beneath it until the run */
    if (this.fresh && !single && t > this.freshNext) {
      const n = this.nodes.get(this.fresh);
      if (n) this.ripple(n.pos.x, n.pos.z, 0.9, new THREE.Color(BAND_HUES[this.band]));
      this.freshNext = t + 1.8;
    }

    /* the system in motion: levels settle toward the model, streams carry what reaches each part */
    const d = this.dyn;
    for (const n of this.nodes.values()) {
      const L = n.level;
      L.cur += (L.target - L.cur) * (single ? 1 : 1 - Math.exp(-dt * 2.4));
      n.motif.fill(L.cur);
    }
    for (const e of this.edges) {
      const key = e.from + '>' + e.to;
      const f = this.flows.get(key);
      if (!f) continue;
      const flow = d ? (d.supply[key] ?? 1) : 1;
      f.flow += (flow - f.flow) * (single ? 1 : 1 - Math.exp(-dt * 2));
      const cut = this.breakers.has(key);
      const count = f.flow < 0.06 ? 0 : Math.ceil(f.flow * 5);
      f.phase = (f.phase + dt * (0.1 + f.flow * 0.2)) % 1;
      f.mat.color.copy(ICE).lerp(CORAL, 1 - f.flow).multiplyScalar(1.2 + f.flow * 1.2);
      f.pulses.forEach((m, i) => {
        const k = (f.phase + i / 5) % 1;
        const show = i < count && !(cut && k > 0.78);
        m.visible = show;
        if (show) m.position.copy(e.curve.getPoint(k));
      });
    }
    if (this.streamPts) {
      const pos = this.streamPts.geometry.getAttribute('position') as THREE.BufferAttribute;
      const col = this.streamPts.geometry.getAttribute('color') as THREE.BufferAttribute;
      const N = GaugeWorld.STREAM_N;
      this.stations.forEach((st, si) => {
        const pushing = !!d?.landed[st.view.id];
        const bright = pushing ? 2.6 : d?.running ? 0.55 : 0.9;
        for (let i = 0; i < N; i++) {
          const k = ((t * (pushing ? 0.34 : 0.16) + i / N + si * 0.37) % 1) * st.stop;
          const q = st.curve.getPoint(k);
          const j = si * N + i;
          pos.setXYZ(j, q.x, q.y, q.z);
          const fade = 0.35 + 0.65 * Math.min(1, k * 3);
          col.setXYZ(j, st.col.r * bright * fade, st.col.g * bright * fade, st.col.b * bright * fade);
        }
        for (const m of st.mats) m.emissiveIntensity = pushing ? 1.4 + 0.3 * Math.sin(t * 6) : 0.35;
        st.mesh.position.y = 1.4 + Math.sin(t * 0.5 + si) * 0.08;
      });
      pos.needsUpdate = true; col.needsUpdate = true;
    }
    for (const l of this.loops) l.markers.forEach((m, i) => {
      const k = (t * 0.07 + i / 3) % 1;
      m.position.copy(l.curve.getPoint(k));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), l.curve.getTangent(k).normalize());
    });

    /* threats: each flies in its own way, and ends the way its stopper works */
    this.comets = this.comets.filter(c => {
      const n = this.nodes.get(c.node);
      if (c.ended) {
        if (n && this.endComet(c, n, t)) return true;
        this.removeComet(c);
        return false;
      }
      const k = Math.min(1, (t - c.t0) / c.dur);
      let kk = c.motif === 'ghost' || c.motif === 'open' ? k : easeIn(k);
      if (c.style === 'seen') {
        /* the sentinel sees it at six tenths of the way; it slows, and it never arrives */
        if (k >= 0.6 && !c.beamed && n) { this.beam(n.pos.clone().setY(n.h + 0.1), c.head.position.clone(), c.stopHue); c.beamed = true; }
        if (kk > 0.6) kk = 0.6 + (kk - 0.6) * 0.5;
        if (k > 0.7) for (const m of c.mats) { m.transparent = true; m.opacity = Math.max(0, 1 - (k - 0.7) / 0.3); }
      } else if (c.style === 'break') {
        kk = Math.min(kk, 0.85);
      } else if (c.style === 'dissipate') {
        if (k > 0.7) for (const m of c.mats) { m.transparent = true; m.opacity = Math.max(0, 1 - (k - 0.7) / 0.3); }
      } else if (c.style === 'grey' && k > 0.7) {
        const g = (k - 0.7) / 0.3;
        for (const m of c.mats) m.color.copy(c.col).multiplyScalar(6 * (1 - g)).lerp(new THREE.Color('#6b7280'), g);
      }
      const p = c.curve.getPoint(kk);
      if (c.orient) { const q = c.curve.getPoint(Math.min(1, kk + 0.02)); if (q.distanceToSquared(p) > 1e-6) c.head.lookAt(q); }
      else if (c.motif === 'key' || c.motif === 'cube' || c.motif === 'crate' || c.motif === 'block') c.head.rotation.y += dt * 2.4;
      else if (c.motif === 'open' || c.motif === 'prompt') c.head.rotation.y += dt * 1.2;
      c.head.position.copy(p);
      /* a wave runs through the lattice as it comes */
      if (c.motif === 'wave' && t - c.lastRipple > 0.3) { this.ripple(p.x, p.z, 0.5, c.col); c.lastRipple = t; }
      if (c.trail) {
        c.hist.pop(); c.hist.unshift(p.clone());
        const arr = c.trail.geometry.getAttribute('position') as THREE.BufferAttribute;
        c.hist.forEach((v, i) => arr.setXYZ(i, v.x, v.y, v.z));
        arr.needsUpdate = true;
      }
      if (k >= 1) {
        if (n) this.impact(n, c.outcome, c.style);
        c.onImpact?.();
        c.ended = true;
        c.endT0 = t;
        if (c.trail) { this.world.remove(c.trail); this.disposeObj(c.trail); c.trail = null; }
        if (!n || c.style === 'seen' || c.style === 'dissipate') { this.removeComet(c); return false; }
      }
      return true;
    });

    /* sparks fall, beams fade */
    this.sparks = this.sparks.filter(sp => {
      const age = t - sp.t0;
      sp.v.y -= 9 * dt;
      sp.m.position.addScaledVector(sp.v, dt);
      (sp.m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - age / 0.7);
      if (age > 0.7) { this.world.remove(sp.m); (sp.m.material as THREE.Material).dispose(); return false; }
      return true;
    });
    this.beams = this.beams.filter(b => {
      (b.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, (b.until - t) / 0.45);
      if (t > b.until) { this.world.remove(b.line); this.disposeObj(b.line); return false; }
      return true;
    });

    /* pulses on the conduits */
    this.pulses = this.pulses.filter(p => {
      const k = (t - p.t0) / p.dur;
      if (k < 0) return true;
      p.mesh.visible = true;
      p.mesh.position.copy(p.curve.getPoint(Math.min(p.stopAt, k)));
      if (k >= p.stopAt) {
        p.done?.();
        this.world.remove(p.mesh);
        this.disposeObj(p.mesh);
        return false;
      }
      return true;
    });

    for (const b of this.bars) {
      const f = (b.userData.flash as number) || 0;
      if (f > 0) { b.userData.flash = Math.max(0, f - dt); b.scale.set(1 + f, 1 + f * 0.4, 1 + f); }
    }

    /* gold */
    if (this.goldCol && this.goldT0 >= 0 && !single) {
      const k = t - this.goldT0;
      const m = this.goldCol.material as THREE.ShaderMaterial;
      this.goldCol.scale.y = easeOut(k / 1.4);
      m.uniforms.uA.value = k < 1.4 ? easeOut(k / 1.4) * 0.9 : Math.max(0, 0.9 - (k - 3.2) / 2.6);
      if (k > 6) { this.world.remove(this.goldCol); this.disposeObj(this.goldCol); this.goldCol = null; }
    }

    /* a small shake when something lands or a notch is taken */
    if (this.shake > 0 && !single) {
      this.shake = Math.max(0, this.shake - dt * 1.4);
      this.camera.position.x += (Math.random() - 0.5) * this.shake * 0.35;
      this.camera.position.y += (Math.random() - 0.5) * this.shake * 0.25;
    }

    /* the lens focuses where the camera looks */
    const fd = this.camera.position.distanceTo(this.controls.target);
    (this.bokeh.uniforms as { focus: { value: number } }).focus.value = (fd - this.camera.near) / (this.camera.far - this.camera.near);
    if (this.dust && this.dustBase && !single) {
      const pos = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const bx = this.dustBase[i * 3], by = this.dustBase[i * 3 + 1], bz = this.dustBase[i * 3 + 2];
        pos.setXYZ(i, bx + Math.sin(t * 0.13 + i) * 0.6, 0.2 + ((by + t * 0.05 + i * 0.01) % 6), bz + Math.cos(t * 0.11 + i * 0.7) * 0.6);
      }
      pos.needsUpdate = true;
    }
    for (const f of this.floats) if (t > f.until) { f.el.remove(); }
    this.floats = this.floats.filter(f => t <= f.until);

    const lp = this.floorMat.uniforms.uLP.value as THREE.Vector3[], lc = this.floorMat.uniforms.uLC.value as THREE.Color[];
    let li = 0;
    for (const n of this.nodes.values()) {
      if (!n.light || li >= 4) continue;
      n.light.getWorldPosition(lp[li]);
      lc[li].copy(n.light.color).multiplyScalar(n.light.intensity * 0.07);
      li++;
    }
    for (; li < 4; li++) lc[li].setScalar(0);

    (this.grain.uniforms.uTime as { value: number }).value = t;
    this.composer.render(dt);
    this.placeLabels();
  }

  /* When labels collide the nearer one wins and the farther one dims, so a
     crowded notch stays readable and every name returns as the camera turns. */
  private placeLabels() {
    const w = this.viewW, h = this.viewH;
    const v = new THREE.Vector3();
    const items: { n: NodeView; x: number; y: number; d: number; behind: boolean }[] = [];
    for (const n of this.nodes.values()) {
      v.copy(n.pos).setY(n.h * n.group.scale.y + 0.75);
      const d = v.distanceTo(this.camera.position);
      v.project(this.camera);
      items.push({ n, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, d, behind: v.z > 1 });
    }
    items.sort((a, b) => a.d - b.d);
    const placed: { l: number; r: number; t: number; b: number }[] = [];
    for (const it of items) {
      const half = it.n.lw / 2;
      const box = { l: it.x - half, r: it.x + half, t: it.y - 32, b: it.y };
      const hit = placed.some(p => box.l < p.r && box.r > p.l && box.t < p.b && box.b > p.t);
      if (!hit && !it.behind) placed.push(box);
      it.n.label.style.transform = 'translate(-50%, -100%) translate(' + it.x.toFixed(1) + 'px,' + it.y.toFixed(1) + 'px)';
      it.n.label.style.opacity = it.behind ? '0' : hit ? '0.22' : '1';
      it.n.label.style.zIndex = hit ? '0' : '1';
    }
    for (const f of this.floats) {
      v.copy(f.anchor).project(this.camera);
      f.el.style.transform = 'translate(-50%, -100%) translate(' + ((v.x * 0.5 + 0.5) * w).toFixed(1) + 'px,' + ((-v.y * 0.5 + 0.5) * h).toFixed(1) + 'px)';
    }
    for (const l of this.loops) {
      v.copy(l.anchor).project(this.camera);
      const behind = v.z > 1;
      l.label.style.transform = 'translate(-50%, -100%) translate(' + ((v.x * 0.5 + 0.5) * w).toFixed(1) + 'px,' + ((-v.y * 0.5 + 0.5) * h).toFixed(1) + 'px)';
      l.label.style.opacity = behind ? '0' : '1';
    }
  }
}

function easeIn(x: number) {
  /* comets accelerate into their target */
  return x * x * (1.6 - 0.6 * x);
}
