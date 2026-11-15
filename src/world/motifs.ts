/* THE FORMS OF THE WORLD: a systems map in the notation a researcher draws,
   built out of the things an organisation is actually made of.

   Every part is a STOCK: a vessel with a level inside it that is the share of
   its function it still delivers. The vessel takes the shape of the real thing,
   with its real details, so a stranger can name it:

     control    a pump house with its pump and tank; or a control room with a
                console of screens; or a transformer bank in its fence, by name
     data       a server rack with its slots and its blinking lights
     identity   a badge door: a frame, a door, a card reader, a key above
     people     figures at a desk row on a lit floor
     public     a street of houses with lit windows
     network    a radio mast for anything wireless; otherwise a switch cabinet
                with its ports lit
     vendor     a van on a pad, on a tether, because it is not yours
     money      a vault with a round door and a wheel
     build      a gantry crane over a stack of crates
     model      a rack cluster with a mind above it: a core and two halos
     time       a clock tower with a hand that sweeps and a dish that listens

   Every structure that protects a part is a ring in the family's own form
   (buildShield, below). Each form has an idle motion that says what it does,
   a pose for when it falls or goes down with a dependency, and a fill that
   the dynamics drive. One material language holds it together: dark metal,
   tinted glass with a clear shell, and light. */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { NodeKind } from '../content/modux-schema';
import { grain } from './texture';

/** a box with bevelled edges, the way a made thing has them */
const rbox = (w: number, h: number, d: number) => new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.14);

export type NodeState = 'ok' | 'fallen' | 'down';

export interface NodeMotif {
  group: THREE.Group;
  /** the top of the form, where the label and arriving threats aim */
  top: number;
  /** where shield rings sit */
  ringR: number;
  ringY: (i: number) => number;
  /** the pick target */
  body: THREE.Mesh;
  /** light materials, recoloured with the state; userData.k carries each one's brightness */
  lights: THREE.MeshBasicMaterial[];
  lines: THREE.LineBasicMaterial[];
  glass: THREE.MeshStandardMaterial[];
  shines: THREE.Mesh[];
  idle(t: number, dt: number): void;
  pose(state: NodeState): void;
  /** the stock: the level inside the vessel, 0 to 1 */
  fill(level: number): void;
}

export interface ShieldMotif {
  group: THREE.Group;
  mats: THREE.MeshStandardMaterial[];
  flash: number;
  idle(t: number): void;
}

const hdr = (c: THREE.Color | string, k: number) => new THREE.Color(c).multiplyScalar(k);
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/* ---------- the material language ---------- */

function glassMat(hue: THREE.Color, opacity = 0.34): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: hue.clone().multiplyScalar(0.3), emissive: hue, emissiveIntensity: 0.07,
    roughness: 0.12, metalness: 0.1, transparent: true, opacity, depthWrite: false, envMapIntensity: 0.6,
  });
}
function shineMat(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#000000'), roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06,
    envMapIntensity: 1.6, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  });
}
function metalMat(tint = '#151d45'): THREE.MeshStandardMaterial {
  const g = grain();
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(tint), metalness: 0.85, roughness: 0.62, roughnessMap: g, bumpMap: g, bumpScale: 0.012, envMapIntensity: 1.1 });
}
function lightMat(hue: THREE.Color, k: number): THREE.MeshBasicMaterial {
  const m = new THREE.MeshBasicMaterial({ color: hdr(hue, k) });
  m.userData.k = k;
  return m;
}

interface Kit {
  group: THREE.Group;
  lights: THREE.MeshBasicMaterial[];
  lines: THREE.LineBasicMaterial[];
  glass: THREE.MeshStandardMaterial[];
  shines: THREE.Mesh[];
  hue: THREE.Color;
  /** a glass body with its clear shell and lit edges */
  body(geo: THREE.BufferGeometry, parent?: THREE.Object3D, opacity?: number): THREE.Mesh;
  /** a thing made of light */
  light(geo: THREE.BufferGeometry, k: number, parent?: THREE.Object3D): THREE.Mesh;
  metal(geo: THREE.BufferGeometry, parent?: THREE.Object3D, tint?: string): THREE.Mesh;
  /** a metal body with its edges lit, so it reads at night the way a drawn thing does */
  metalLit(geo: THREE.BufferGeometry, parent?: THREE.Object3D, tint?: string): THREE.Mesh;
  edges(geo: THREE.BufferGeometry, k: number, parent?: THREE.Object3D): THREE.LineSegments;
}

function kit(hue: THREE.Color): Kit {
  const group = new THREE.Group();
  const k: Kit = {
    group, hue, lights: [], lines: [], glass: [], shines: [],
    body(geo, parent = group, opacity = 0.34) {
      const g = glassMat(hue, opacity);
      const m = new THREE.Mesh(geo, g);
      const s = new THREE.Mesh(geo, shineMat());
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: hdr(hue, 1.0) }));
      (e.material as THREE.LineBasicMaterial).userData.k = 1.0;
      parent.add(m, s, e);
      k.glass.push(g); k.shines.push(s); k.lines.push(e.material as THREE.LineBasicMaterial);
      return m;
    },
    light(geo, kk, parent = group) {
      const mat = lightMat(hue, kk);
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = true;
      parent.add(m);
      k.lights.push(mat);
      return m;
    },
    metal(geo, parent = group, tint) {
      const m = new THREE.Mesh(geo, metalMat(tint));
      m.castShadow = true; m.receiveShadow = true;
      parent.add(m);
      return m;
    },
    metalLit(geo, parent = group, tint) {
      const m = k.metal(geo, parent, tint);
      k.edges(geo, 0.75, m);
      return m;
    },
    edges(geo, kk, parent = group) {
      const mat = new THREE.LineBasicMaterial({ color: hdr(hue, kk) });
      mat.userData.k = kk;
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 15), mat);
      parent.add(e);
      k.lines.push(mat);
      return e;
    },
  };
  return k;
}

/* a pose eases from where it is to where it is going over about a second */
function poser() {
  let state: NodeState = 'ok';
  let k = 1;
  return {
    set(s: NodeState) { if (s !== state) { state = s; k = 0; } },
    get state() { return state; },
    step(dt: number) { k = Math.min(1, k + dt / 0.9); return easeOut(k); },
  };
}

/* ---------- the stock: a vessel with a level ---------- */

interface Vessel { set(level: number): void; body: THREE.Mesh; group: THREE.Group }

/** a glass vessel of the given shape with a liquid inside it that stands at the level */
function vessel(k: Kit, shape: 'cyl' | 'box', w: number, d: number, h: number, parent: THREE.Object3D = k.group, opacity = 0.3): Vessel {
  const group = new THREE.Group();
  const outer = shape === 'cyl' ? new THREE.CylinderGeometry(w / 2, w / 2, h, 24) : new THREE.BoxGeometry(w, h, d);
  outer.translate(0, h / 2, 0);
  const body = k.body(outer, group, opacity);
  const inner = shape === 'cyl' ? new THREE.CylinderGeometry(w / 2 - 0.05, w / 2 - 0.05, 1, 24) : new THREE.BoxGeometry(w - 0.1, 1, d - 0.1);
  inner.translate(0, 0.5, 0);
  const liquidMat = new THREE.MeshStandardMaterial({ color: k.hue.clone().multiplyScalar(0.55), emissive: k.hue, emissiveIntensity: 0.3, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.74, depthWrite: false });
  k.glass.push(liquidMat);
  const liquid = new THREE.Mesh(inner, liquidMat);
  liquid.position.y = 0.02;
  liquid.scale.y = h - 0.04;
  group.add(liquid);
  const surfGeo = shape === 'cyl' ? new THREE.CylinderGeometry(w / 2 - 0.05, w / 2 - 0.05, 0.02, 24) : new THREE.BoxGeometry(w - 0.1, 0.02, d - 0.1);
  const surface = k.light(surfGeo, 1.8, group);
  surface.position.y = h - 0.02;
  /* a metal rim and a lid */
  const rim = shape === 'cyl' ? new THREE.TorusGeometry(w / 2 + 0.01, 0.03, 8, 40) : new THREE.BoxGeometry(w + 0.06, 0.05, d + 0.06);
  const rimMesh = k.metal(rim, group);
  if (shape === 'cyl') rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = h;
  parent.add(group);
  return {
    group, body,
    set(level) {
      const L = Math.max(0.02, Math.min(1, level));
      liquid.scale.y = (h - 0.04) * L;
      surface.position.y = 0.02 + (h - 0.04) * L;
    },
  };
}

/* ---------- small real things ---------- */

function house(k: Kit, x: number, z: number, s: number, parent: THREE.Object3D) {
  const g = new THREE.Group();
  k.metalLit(rbox(0.5 * s, 0.42 * s, 0.44 * s), g, '#182153').position.y = 0.21 * s;
  const roof = k.metalLit(new THREE.ConeGeometry(0.4 * s, 0.26 * s, 4), g, '#121a40');
  roof.position.y = 0.55 * s; roof.rotation.y = Math.PI / 4;
  for (const [wx, wz] of [[-0.12, 0.23], [0.12, 0.23]]) k.light(new THREE.BoxGeometry(0.1 * s, 0.1 * s, 0.02), 2.2, g).position.set(wx * s, 0.22 * s, wz * s);
  g.position.set(x, 0, z);
  parent.add(g);
  return g;
}

function figure(k: Kit, parent: THREE.Object3D, tall = 0.9) {
  const f = new THREE.Group();
  const bodyGeo = new THREE.CapsuleGeometry(0.11, tall * 0.5, 4, 10);
  bodyGeo.translate(0, tall * 0.46, 0);
  k.body(bodyGeo, f, 0.4);
  k.light(new THREE.SphereGeometry(0.07, 12, 10), 2.6, f).position.y = tall * 0.78 + 0.14;
  parent.add(f);
  return f;
}

function screen(k: Kit, parent: THREE.Object3D, w: number, h: number) {
  const s = new THREE.Group();
  k.metal(new THREE.BoxGeometry(w, h, 0.03), s, '#0b1030');
  k.light(new THREE.BoxGeometry(w - 0.05, h - 0.05, 0.01), 1.9, s).position.z = 0.02;
  parent.add(s);
  return s;
}

/* ---------- the parts ---------- */

type Built = Omit<NodeMotif, 'group' | 'lights' | 'lines' | 'glass' | 'shines'>;
type Builder = (k: Kit, name: string) => Built;

const PUMP_HOUSE = (k: Kit): Built => {
  /* a tank on legs beside a pump house, the pump's flywheel turning */
  const tank = vessel(k, 'cyl', 1.0, 1.0, 1.1);
  tank.group.position.set(-0.45, 0.55, 0);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; k.metal(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6)).position.set(-0.45 + Math.cos(a) * 0.4, 0.27, Math.sin(a) * 0.4); }
  const houseG = new THREE.Group();
  k.metalLit(rbox(0.9, 0.6, 0.7), houseG, '#182153').position.y = 0.3;
  const roof = k.metalLit(rbox(1.0, 0.08, 0.8), houseG, '#121a40'); roof.position.y = 0.64;
  k.light(new THREE.BoxGeometry(0.18, 0.22, 0.02), 2.0, houseG).position.set(0, 0.32, 0.36);
  houseG.position.set(0.55, 0, 0);
  k.group.add(houseG);
  /* the pump and its flywheel, outside the house */
  const pump = k.metalLit(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 16), k.group, '#1a2250');
  pump.rotation.z = Math.PI / 2; pump.position.set(0.55, 0.2, 0.62);
  const wheel = k.light(new THREE.TorusGeometry(0.18, 0.025, 8, 32), 2.2);
  wheel.position.set(0.8, 0.22, 0.62);
  const spokes = new THREE.Group();
  for (let i = 0; i < 3; i++) { const s = k.light(new THREE.BoxGeometry(0.34, 0.025, 0.025), 2.2, spokes); s.rotation.x = (i / 3) * Math.PI; }
  spokes.position.copy(wheel.position); spokes.rotation.y = Math.PI / 2;
  k.group.add(spokes);
  /* the pipe from the tank into the house */
  const pipe = k.metal(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), k.group, '#1a2250');
  pipe.rotation.z = Math.PI / 2; pipe.position.set(0.05, 0.75, 0);
  const p = poser();
  let spin = 0;
  return {
    top: 1.75, ringR: 1.15, ringY: i => 0.3 + i * 0.34, body: tank.body,
    idle(t, dt) {
      const e = p.step(dt);
      spin += (p.state === 'ok' ? 2.2 : 2.2 * (1 - e)) * dt;
      spokes.rotation.x = spin; wheel.rotation.z = spin;
      houseG.rotation.z = p.state === 'ok' ? 0 : -0.06 * e;
      tank.group.rotation.z = p.state === 'ok' ? 0 : 0.08 * e;
    },
    pose(s) { p.set(s); },
    fill: l => tank.set(l),
  };
};

const CONTROL_ROOM = (k: Kit): Built => {
  /* a glass room with a console of screens; the level is the room's light */
  const room = vessel(k, 'box', 1.6, 1.2, 0.9, k.group, 0.22);
  const desk = k.metalLit(rbox(1.2, 0.06, 0.4), k.group, '#182153'); desk.position.set(0, 0.42, 0.1);
  k.metal(new THREE.BoxGeometry(0.08, 0.4, 0.3), k.group, '#121a3c').position.set(-0.45, 0.2, 0.1);
  k.metal(new THREE.BoxGeometry(0.08, 0.4, 0.3), k.group, '#121a3c').position.set(0.45, 0.2, 0.1);
  const screens: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const s = screen(k, k.group, 0.34, 0.26); s.position.set(-0.4 + i * 0.4, 0.62, -0.05); s.rotation.y = (1 - i) * 0.18; screens.push(s); }
  const big = screen(k, k.group, 0.9, 0.36); big.position.set(0, 1.12, -0.5);
  k.metal(new THREE.BoxGeometry(0.06, 0.9, 0.06), k.group, '#121a3c').position.set(0, 0.45, -0.52);
  const chair = figure(k, k.group, 0.6); chair.position.set(0, 0, 0.45);
  const p = poser();
  return {
    top: 1.45, ringR: 1.25, ringY: i => 0.3 + i * 0.34, body: room.body,
    idle(t, dt) {
      const e = p.step(dt);
      screens.forEach((s, i) => {
        const m = (s.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const flick = p.state === 'ok' ? 0.85 + 0.15 * Math.sin(t * 2.1 + i) : (1 - e) * (0.5 + 0.5 * Math.abs(Math.sin(t * 9 + i)));
        m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(flick);
      });
      big.rotation.z = p.state === 'ok' ? 0 : 0.25 * e;
      big.position.y = 1.12 - 0.3 * e * (p.state === 'ok' ? 0 : 1);
    },
    pose(s) { p.set(s); },
    fill: l => room.set(l),
  };
};

const SUBSTATION = (k: Kit): Built => {
  /* a transformer bank in a fence, the breaker bar above */
  const yard = vessel(k, 'box', 1.7, 1.2, 0.18, k.group, 0.2);
  const units: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const u = k.metalLit(new THREE.CylinderGeometry(0.18, 0.2, 0.7, 12), k.group, '#182153'); u.position.set(-0.5 + i * 0.5, 0.53, 0);
    for (let f = 0; f < 4; f++) k.metal(new THREE.BoxGeometry(0.46, 0.02, 0.08), k.group, '#0e1430').position.set(-0.5 + i * 0.5, 0.3 + f * 0.14, 0);
    k.light(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), 2.4).position.set(-0.5 + i * 0.5, 1.03, 0);
    units.push(u);
  }
  const bus = k.light(new THREE.BoxGeometry(1.4, 0.03, 0.03), 2.2); bus.position.y = 1.18;
  for (let i = 0; i < 8; i++) { const post = k.metal(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), k.group, '#1a2250'); post.position.set(-0.8 + (i % 4) * 0.53, 0.43, i < 4 ? 0.6 : -0.6); }
  const p = poser();
  return {
    top: 1.35, ringR: 1.25, ringY: i => 0.3 + i * 0.34, body: yard.body,
    idle(t, dt) {
      const e = p.step(dt);
      const m = bus.material as THREE.MeshBasicMaterial;
      m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(p.state === 'ok' ? 0.9 + 0.1 * Math.sin(t * 60) : (1 - e) * Math.abs(Math.sin(t * 25)));
      units.forEach((u, i) => { u.rotation.z = p.state === 'ok' ? 0 : (i % 2 ? 0.12 : -0.08) * e; });
    },
    pose(s) { p.set(s); },
    fill: l => yard.set(l),
  };
};

const RACK = (k: Kit): Built => {
  /* a server rack; the level is how much of it still serves; the lights are its writes */
  const rack = vessel(k, 'box', 0.8, 0.7, 2.0, k.group, 0.26);
  const leds: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    k.metal(new THREE.BoxGeometry(0.7, 0.03, 0.62), k.group, '#0e1430').position.set(0, 0.25 + i * 0.22, 0);
    const led = k.light(new THREE.BoxGeometry(0.05, 0.05, 0.02), 2.4); led.position.set(-0.26 + (i % 3) * 0.1, 0.36 + i * 0.22, 0.36); leds.push(led);
  }
  const p = poser();
  return {
    top: 2.15, ringR: 0.95, ringY: i => 0.32 + i * 0.36, body: rack.body,
    idle(t, dt) {
      const e = p.step(dt);
      leds.forEach((l, i) => {
        const m = l.material as THREE.MeshBasicMaterial;
        const on = p.state === 'ok' ? (Math.sin(t * 7 + i * 1.7) > 0.2 ? 1 : 0.25) : (1 - e) * 0.4;
        m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(on);
      });
      rack.group.rotation.z = p.state === 'ok' ? 0 : 0.14 * e;
    },
    pose(s) { p.set(s); },
    fill: l => rack.set(l),
  };
};

const BADGE_DOOR = (k: Kit): Built => {
  /* a door in a frame with a card reader; the door is the vessel; a key turns above */
  const frameG = new THREE.Group();
  k.metal(new THREE.BoxGeometry(0.14, 2.0, 0.2), frameG, '#141b3a').position.set(-0.5, 1.0, 0);
  k.metal(new THREE.BoxGeometry(0.14, 2.0, 0.2), frameG, '#141b3a').position.set(0.5, 1.0, 0);
  k.metal(new THREE.BoxGeometry(1.14, 0.16, 0.2), frameG, '#141b3a').position.set(0, 2.08, 0);
  k.group.add(frameG);
  const door = vessel(k, 'box', 0.86, 0.08, 1.95, k.group, 0.3);
  const reader = k.metal(new THREE.BoxGeometry(0.16, 0.22, 0.06), k.group, '#0b1030'); reader.position.set(0.78, 1.1, 0.1);
  const readerLight = k.light(new THREE.BoxGeometry(0.08, 0.04, 0.02), 2.6); readerLight.position.set(0.78, 1.14, 0.14);
  const bow = new THREE.Group();
  k.light(new THREE.TorusGeometry(0.16, 0.03, 8, 32), 2.6, bow);
  const shaft = k.light(new THREE.BoxGeometry(0.05, 0.3, 0.05), 2.6, bow); shaft.position.y = -0.3;
  k.light(new THREE.BoxGeometry(0.1, 0.05, 0.05), 2.6, bow).position.set(0.05, -0.38, 0);
  bow.position.y = 2.55;
  k.group.add(bow);
  const p = poser();
  return {
    top: 2.75, ringR: 0.95, ringY: i => 0.32 + i * 0.36, body: door.body,
    idle(t, dt) {
      const e = p.step(dt);
      if (p.state === 'ok') { bow.rotation.set(0, t * 0.5, 0); bow.position.y = 2.55; door.group.rotation.y = 0; }
      else { bow.rotation.set(Math.PI / 2 * e, t * 0.5 * (1 - e), 0); bow.position.y = 2.55 - 1.2 * e; door.group.rotation.y = -1.1 * e; door.group.position.x = -0.43 * e; door.group.position.z = 0.43 * e; }
      const m = readerLight.material as THREE.MeshBasicMaterial;
      m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(p.state === 'ok' ? 0.7 + 0.3 * Math.sin(t * 3) : (1 - e));
    },
    pose(s) { p.set(s); },
    fill: l => door.set(l),
  };
};

const DESK_ROW = (k: Kit): Built => {
  /* people at a desk row on a lit floor; the floor is the vessel */
  const floor = vessel(k, 'box', 2.0, 1.1, 0.14, k.group, 0.22);
  const desk = k.metalLit(rbox(1.8, 0.05, 0.4), k.group, '#182153'); desk.position.set(0, 0.6, -0.1);
  const figs: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const f = figure(k, k.group, 0.82); f.position.set(-0.65 + i * 0.43, 0.14, 0.25); f.userData.i = i; figs.push(f);
    const s = screen(k, k.group, 0.28, 0.2); s.position.set(-0.65 + i * 0.43, 0.78, -0.2);
  }
  const p = poser();
  return {
    top: 1.3, ringR: 1.35, ringY: i => 0.3 + i * 0.3, body: floor.body,
    idle(t, dt) {
      const e = p.step(dt);
      figs.forEach((f, i) => {
        if (p.state === 'ok') { f.rotation.set(Math.sin(t * 0.9 + i) * 0.03, 0, 0); f.position.y = 0.14; }
        else { const d = Math.max(0, Math.min(1, e * 1.6 - i * 0.12)); f.rotation.set(0.5 * d, 0, (i % 2 ? 1 : -1) * 0.5 * d); f.position.y = 0.14 - 0.3 * d; }
      });
    },
    pose(s) { p.set(s); },
    fill: l => floor.set(l),
  };
};

const STREET = (k: Kit): Built => {
  /* a street of houses on a lit ground; the ground is the vessel; windows go dark as it fails */
  const ground = vessel(k, 'box', 2.2, 1.4, 0.12, k.group, 0.2);
  const houses = [house(k, -0.72, -0.25, 1.5, k.group), house(k, 0, 0.18, 1.7, k.group), house(k, 0.74, -0.22, 1.4, k.group)];
  houses.forEach(h => { h.position.y = 0.12; });
  const lamp = k.metal(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), k.group, '#1a2250'); lamp.position.set(1.0, 0.72, 0.55);
  k.light(new THREE.SphereGeometry(0.06, 8, 8), 2.6).position.set(1.0, 1.34, 0.55);
  const p = poser();
  return {
    top: 1.3, ringR: 1.45, ringY: i => 0.3 + i * 0.3, body: ground.body,
    idle(t, dt) {
      const e = p.step(dt);
      houses.forEach((h, i) => {
        for (const c of h.children) {
          const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (!m.userData || m.userData.k === undefined) continue;
          const on = p.state === 'ok' ? 0.8 + 0.2 * Math.sin(t * 0.7 + i) : (1 - e) * 0.3;
          m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(on);
        }
        h.rotation.z = p.state === 'ok' ? 0 : (i % 2 ? 0.06 : -0.05) * e;
      });
    },
    pose(s) { p.set(s); },
    fill: l => ground.set(l),
  };
};

const MAST = (k: Kit): Built => {
  /* a radio mast on a lit base; its rings carry the signal up */
  const base = vessel(k, 'cyl', 1.1, 1.1, 0.3, k.group, 0.26);
  const tower = k.metalLit(new THREE.CylinderGeometry(0.03, 0.12, 2.4, 6), k.group, '#1a2250'); tower.position.y = 1.5;
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const r = k.light(new THREE.TorusGeometry(0.22 - i * 0.03, 0.015, 6, 32), 2.0); r.rotation.x = Math.PI / 2; r.position.y = 1.0 + i * 0.45; rings.push(r); }
  const tip = k.light(new THREE.SphereGeometry(0.07, 10, 8), 3.0); tip.position.y = 2.75;
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const guy = k.metal(new THREE.CylinderGeometry(0.008, 0.008, 2.2, 4), k.group, '#1a2250'); guy.position.set(Math.cos(a) * 0.3, 1.2, Math.sin(a) * 0.3); guy.rotation.z = Math.cos(a) * 0.26; guy.rotation.x = -Math.sin(a) * 0.26; }
  const p = poser();
  return {
    top: 2.9, ringR: 0.95, ringY: i => 0.4 + i * 0.36, body: base.body,
    idle(t, dt) {
      const e = p.step(dt);
      rings.forEach((r, i) => {
        const m = r.material as THREE.MeshBasicMaterial;
        const on = p.state === 'ok' ? 0.5 + 0.5 * Math.max(0, Math.sin(t * 2.4 - i * 0.9)) : (1 - e) * 0.3;
        m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(on);
      });
      tower.rotation.z = p.state === 'ok' ? 0 : 0.2 * e;
    },
    pose(s) { p.set(s); },
    fill: l => base.set(l),
  };
};

const SWITCH = (k: Kit): Built => {
  /* a switch cabinet with its ports lit, a mesh of light above it */
  const cab = vessel(k, 'box', 1.1, 0.7, 1.2, k.group, 0.26);
  const ports: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) { const pm = k.light(new THREE.BoxGeometry(0.06, 0.04, 0.02), 2.2); pm.position.set(-0.4 + (i % 6) * 0.16, 0.45 + Math.floor(i / 6) * 0.14, 0.36); ports.push(pm); }
  const cage = new THREE.Group();
  k.edges(new THREE.IcosahedronGeometry(0.5, 1), 1.3, cage);
  k.light(new THREE.SphereGeometry(0.12, 12, 10), 3.0, cage);
  cage.position.y = 1.85;
  k.group.add(cage);
  const p = poser();
  return {
    top: 2.4, ringR: 1.0, ringY: i => 0.34 + i * 0.36, body: cab.body,
    idle(t, dt) {
      const e = p.step(dt);
      ports.forEach((pt, i) => { const m = pt.material as THREE.MeshBasicMaterial; m.color.copy(m.userData.col as THREE.Color || m.color).multiplyScalar(p.state === 'ok' ? (Math.sin(t * 9 + i * 2.3) > 0 ? 1 : 0.3) : (1 - e) * 0.3); });
      if (p.state === 'ok') { cage.rotation.set(0.3, t * 0.16, 0.1); cage.position.y = 1.85; }
      else { const j = (1 - e) * 0.08; cage.rotation.set(0.3 + Math.sin(t * 40) * j, t * 0.16, 0.1 + Math.cos(t * 37) * j); cage.position.y = 1.85 - 0.5 * e; }
    },
    pose(s) { p.set(s); },
    fill: l => cab.set(l),
  };
};

const VAN = (k: Kit): Built => {
  /* the vendor's van on a lit pad, on a tether, drifting */
  const pad = vessel(k, 'box', 1.6, 1.0, 0.1, k.group, 0.22);
  const van = new THREE.Group();
  k.metalLit(rbox(1.1, 0.5, 0.6), van, '#182153').position.set(0.1, 0.45, 0);
  k.metalLit(rbox(0.4, 0.4, 0.58), van, '#1a2250').position.set(-0.6, 0.4, 0);
  k.light(new THREE.BoxGeometry(0.02, 0.18, 0.4), 1.8, van).position.set(-0.81, 0.46, 0);
  for (const [x, z] of [[-0.5, 0.3], [-0.5, -0.3], [0.45, 0.3], [0.45, -0.3]]) { const w = k.metal(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 12), van, '#0b1030'); w.rotation.x = Math.PI / 2; w.position.set(x, 0.13, z); }
  k.light(new THREE.BoxGeometry(0.5, 0.12, 0.02), 2.2, van).position.set(0.2, 0.5, 0.31);
  k.light(new THREE.SphereGeometry(0.06, 8, 8), 2.6, van).position.set(0.1, 0.85, 0);
  van.position.y = 0.1;
  k.group.add(van);
  const tetherGeo = new THREE.CylinderGeometry(0.015, 0.015, 1, 6);
  tetherGeo.translate(0, 0.5, 0);
  const tether = k.light(tetherGeo, 1.6);
  const anchor = new THREE.Vector3(0, 0.95, 0);
  const up = new THREE.Vector3(0, 1, 0);
  const p = poser();
  return {
    top: 1.4, ringR: 1.2, ringY: i => 0.3 + i * 0.32, body: pad.body,
    idle(t, dt) {
      const e = p.step(dt);
      if (p.state === 'ok') { van.position.set(Math.sin(t * 0.5) * 0.12, 0.1 + Math.sin(t * 0.8) * 0.03, Math.cos(t * 0.4) * 0.1); van.rotation.set(0, Math.sin(t * 0.3) * 0.08, 0); }
      else { van.position.set(0.3 * e, 0.1, 0); van.rotation.set(0, 0.3 * e, 0.3 * e); }
      const to = van.position.clone().add(new THREE.Vector3(0.1, 0.85, 0)).sub(anchor);
      tether.scale.set(1, Math.max(0.01, to.length()), 1);
      tether.position.copy(anchor);
      tether.quaternion.setFromUnitVectors(up, to.normalize());
    },
    pose(s) { p.set(s); },
    fill: l => pad.set(l),
  };
};

const VAULT = (k: Kit): Built => {
  /* a vault with a round door and a wheel; the vault is the vessel */
  const box = vessel(k, 'box', 1.3, 1.1, 1.3, k.group, 0.3);
  const doorG = new THREE.Group();
  k.metal(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32), doorG, '#1a2250').rotation.x = Math.PI / 2;
  k.light(new THREE.TorusGeometry(0.42, 0.018, 6, 48), 2.0, doorG);
  const wheel = k.light(new THREE.TorusGeometry(0.16, 0.022, 8, 32), 2.4, doorG); wheel.position.z = 0.06;
  for (let i = 0; i < 3; i++) { const s = k.light(new THREE.BoxGeometry(0.3, 0.02, 0.02), 2.4, doorG); s.rotation.z = (i / 3) * Math.PI; s.position.z = 0.06; }
  doorG.position.set(0, 0.65, 0.6);
  k.group.add(doorG);
  const p = poser();
  return {
    top: 1.45, ringR: 1.15, ringY: i => 0.3 + i * 0.34, body: box.body,
    idle(t, dt) {
      const e = p.step(dt);
      wheel.rotation.z = p.state === 'ok' ? Math.sin(t * 0.6) * 0.3 : t * 2.5 * (1 - e);
      doorG.rotation.y = p.state === 'ok' ? 0 : -1.3 * e;
      doorG.position.x = p.state === 'ok' ? 0 : -0.42 * e;
    },
    pose(s) { p.set(s); },
    fill: l => box.set(l),
  };
};

const CRANE = (k: Kit): Built => {
  /* a gantry crane over a stack of crates; the stack is the vessel; the hook lifts and lands a crate */
  const stack = vessel(k, 'box', 0.9, 0.9, 1.0, k.group, 0.3);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) k.edges(new THREE.BoxGeometry(0.42, 0.42, 0.42), 1.1).position.set(-0.22 + i * 0.44, 0.22 + j * 0.44, 0);
  for (const x of [-0.75, 0.75]) k.metalLit(rbox(0.08, 2.0, 0.08), k.group, '#1a2250').position.set(x, 1.0, 0);
  k.metalLit(rbox(1.7, 0.08, 0.12), k.group, '#1a2250').position.y = 2.0;
  const hookG = new THREE.Group();
  const cable = k.light(new THREE.BoxGeometry(0.015, 0.6, 0.015), 1.6, hookG); cable.position.y = -0.3;
  const crate = k.body(new THREE.BoxGeometry(0.36, 0.36, 0.36), hookG, 0.4); crate.position.y = -0.78;
  hookG.position.y = 2.0;
  k.group.add(hookG);
  const p = poser();
  return {
    top: 2.15, ringR: 1.1, ringY: i => 0.32 + i * 0.36, body: stack.body,
    idle(t, dt) {
      const e = p.step(dt);
      if (p.state === 'ok') { hookG.position.set(Math.sin(t * 0.35) * 0.5, 2.0, 0); const lift = 0.15 + 0.4 * Math.max(0, Math.sin(t * 0.7)); cable.scale.y = lift / 0.6; cable.position.y = -lift / 2; crate.position.y = -lift - 0.18; }
      else { hookG.position.set(hookG.position.x, 2.0 - 0.2 * e, 0); crate.position.y = -0.18 - 1.3 * e; cable.scale.y = (0.6 + 1.3 * e) / 0.6; cable.position.y = -(0.6 + 1.3 * e) / 2; crate.rotation.z = 0.4 * e; }
    },
    pose(s) { p.set(s); },
    fill: l => stack.set(l),
  };
};

const MIND = (k: Kit): Built => {
  /* a rack cluster with a mind above it: a core and two halos */
  const racks = vessel(k, 'box', 1.4, 0.8, 1.1, k.group, 0.26);
  for (let i = 0; i < 3; i++) for (let s = 0; s < 4; s++) { const led = k.light(new THREE.BoxGeometry(0.04, 0.04, 0.02), 2.2); led.position.set(-0.45 + i * 0.45, 0.22 + s * 0.22, 0.41); }
  const stem = k.light(new THREE.CylinderGeometry(0.03, 0.05, 0.5, 8), 1.8); stem.position.y = 1.35;
  const orb = new THREE.Group();
  k.body(new THREE.SphereGeometry(0.42, 24, 18), orb, 0.3);
  k.light(new THREE.SphereGeometry(0.2, 16, 14), 3.2, orb);
  const h1 = k.light(new THREE.TorusGeometry(0.66, 0.02, 8, 64), 2.4, orb);
  const h2 = k.light(new THREE.TorusGeometry(0.66, 0.02, 8, 64), 2.4, orb);
  orb.position.y = 2.05;
  k.group.add(orb);
  const p = poser();
  return {
    top: 2.75, ringR: 1.15, ringY: i => 0.3 + i * 0.34, body: racks.body,
    idle(t, dt) {
      const e = p.step(dt);
      if (p.state === 'ok') { orb.position.y = 2.05 + Math.sin(t * 1.1) * 0.06; h1.rotation.set(1.1, t * 0.7, 0.3); h2.rotation.set(-0.9, -t * 0.5, 0.8); h1.position.y = 0; h2.position.y = 0; }
      else { orb.position.y = 2.05 - 0.7 * e; h1.rotation.set(1.1 + (Math.PI / 2 - 1.1) * e, t * 0.7 * (1 - e), 0.3 * (1 - e)); h2.rotation.set(-0.9 + (Math.PI / 2 + 0.9) * e, -t * 0.5 * (1 - e), 0.8 * (1 - e)); h1.position.y = -0.4 * e; h2.position.y = -0.45 * e; }
    },
    pose(s) { p.set(s); },
    fill: l => racks.set(l),
  };
};

const CLOCK_TOWER = (k: Kit): Built => {
  /* a clock tower on a lit base; the hand sweeps; a dish on the roof listens for time */
  const base = vessel(k, 'box', 1.0, 1.0, 0.5, k.group, 0.26);
  k.metalLit(rbox(0.6, 1.6, 0.6), k.group, '#182153').position.y = 1.3;
  const face = new THREE.Group();
  k.metal(new THREE.TorusGeometry(0.34, 0.03, 8, 40), face, '#0b1030');
  k.light(new THREE.TorusGeometry(0.34, 0.012, 6, 40), 2.0, face);
  const faceBody = k.body(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 32), face, 0.3); faceBody.rotation.x = Math.PI / 2;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const tick = k.light(new THREE.BoxGeometry(0.025, i % 3 === 0 ? 0.08 : 0.04, 0.02), 2.2, face); tick.position.set(Math.sin(a) * 0.27, Math.cos(a) * 0.27, 0.03); tick.rotation.z = -a; }
  const hand = new THREE.Group();
  const hg = new THREE.BoxGeometry(0.035, 0.27, 0.02); hg.translate(0, 0.12, 0);
  k.light(hg, 3.0, hand); hand.position.z = 0.04;
  face.add(hand);
  face.position.set(0, 1.75, 0.31);
  k.group.add(face);
  const roof = k.metal(new THREE.ConeGeometry(0.46, 0.4, 4), k.group, '#0b1030'); roof.position.y = 2.3; roof.rotation.y = Math.PI / 4;
  const dish = k.metal(new THREE.ConeGeometry(0.2, 0.12, 16, 1, true), k.group, '#1a2250'); dish.position.set(0.1, 2.6, 0); dish.rotation.x = -0.7;
  k.light(new THREE.SphereGeometry(0.04, 8, 8), 2.6).position.set(0.1, 2.66, 0.08);
  const p = poser();
  let a = 0;
  return {
    top: 2.8, ringR: 1.05, ringY: i => 0.35 + i * 0.36, body: base.body,
    idle(t, dt) {
      const e = p.step(dt);
      const speed = p.state === 'ok' ? -0.6 : -0.6 - 40 * (1 - e) * e;
      if (p.state === 'ok' || e < 1) a += speed * dt;
      hand.rotation.z = a;
      dish.rotation.y = p.state === 'ok' ? Math.sin(t * 0.4) * 0.5 : Math.sin(t * 0.4) * 0.5 + 1.2 * e;
    },
    pose(s) { p.set(s); },
    fill: l => base.set(l),
  };
};

const CONTROL: Builder = (k, name) => {
  const n = name.toLowerCase();
  if (/room|console|server|scada|dispatch|cad|centre|center|desk|workstation|ems|hmi/.test(n)) return CONTROL_ROOM(k);
  if (/substation|breaker|grid|transformer|switchgear|feeder|relay/.test(n)) return SUBSTATION(k);
  return PUMP_HOUSE(k);
};
const NETWORK: Builder = (k, name) => (/radio|wifi|cell|tower|antenna|carrier|mast|satellite|wireless|broadcast|dish/.test(name.toLowerCase()) ? MAST(k) : SWITCH(k));

const BUILDERS: Record<NodeKind, Builder> = {
  people: k => DESK_ROW(k), identity: k => BADGE_DOOR(k), network: NETWORK, data: k => RACK(k), build: k => CRANE(k), money: k => VAULT(k),
  control: CONTROL, model: k => MIND(k), public: k => STREET(k), time: k => CLOCK_TOWER(k), vendor: k => VAN(k),
};

/** A part of a system, by kind and name. h is the pillar height the weight of its threats gives it, 1.1 to about 4.9; the form scales with it. */
export function buildNode(kind: NodeKind, hue: THREE.Color, h: number, name = ''): NodeMotif {
  const k = kit(hue);
  const m = BUILDERS[kind](k, name);
  const scale = 0.72 + Math.min(1, (h - 1.1) / 3.8) * 0.6;
  k.group.scale.setScalar(scale);
  for (const l of k.lights) l.userData.col = l.color.clone();
  const ringR = Math.max(0.85, m.ringR * scale + 0.12);
  return {
    group: k.group, lights: k.lights, lines: k.lines, glass: k.glass, shines: k.shines,
    top: m.top * scale, ringR, ringY: i => m.ringY(i) * scale, body: m.body,
    idle: m.idle, pose: m.pose, fill: m.fill,
  };
}

/* ---------- the structures ---------- */

function ringMat(hue: THREE.Color, k = 1.5): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: hue.clone().multiplyScalar(0.35), emissive: hue, emissiveIntensity: k, metalness: 1, roughness: 0.22, envMapIntensity: 1.2 });
}

/** One structure around a part, in its family's form. r is the ring radius, y the stack height, top the form's top for a halo. tier thins or thickens the metal. */
export function buildShield(family: string, hue: THREE.Color, motrus: boolean, r: number, y: number, top: number, tier?: string): ShieldMotif {
  const group = new THREE.Group();
  const mats: THREE.MeshStandardMaterial[] = [];
  const tube = tier === 'bedrock' ? 1.3 : tier === 'frontier' ? 0.75 : tier === 'emerging' ? 0.9 : 1;
  const add = (geo: THREE.BufferGeometry, mat = ringMat(hue)) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    group.add(m);
    mats.push(mat);
    return m;
  };
  const flat = (m: THREE.Mesh) => { m.rotation.x = Math.PI / 2; return m; };
  let orbit: THREE.Mesh | null = null;
  const phase = Math.random() * Math.PI * 2;
  group.position.y = y;

  if (motrus) {
    /* the learner's own model: a violet double ring that breathes */
    flat(add(new THREE.TorusGeometry(r + 0.09, 0.02, 8, 72)));
    flat(add(new THREE.TorusGeometry(r + 0.09, 0.02, 8, 72))).position.y = 0.09;
  } else switch (family) {
    case 'identity': {
      flat(add(new THREE.TorusGeometry(r, 0.034 * tube, 10, 72)));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const t = add(new THREE.BoxGeometry(0.06, 0.1, 0.12));
        t.position.set(Math.cos(a) * r, 0.06, Math.sin(a) * r);
        t.rotation.y = -a;
      }
      break;
    }
    case 'trust': {
      const wall = add(new THREE.CylinderGeometry(r + 0.05, r + 0.05, 0.2 * tube + 0.04, 6, 1, true));
      (wall.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
      wall.position.y = 0.05;
      break;
    }
    case 'crypto': {
      flat(add(new THREE.TorusGeometry(r, 0.055 * tube, 10, 72)));
      add(new THREE.BoxGeometry(0.16, 0.2, 0.12)).position.set(r, 0.09, 0);
      break;
    }
    case 'supply': {
      flat(add(new THREE.TorusGeometry(r, 0.014, 6, 72)));
      for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; add(new THREE.SphereGeometry(0.045 * tube + 0.01, 10, 8)).position.set(Math.cos(a) * r, 0, Math.sin(a) * r); }
      break;
    }
    case 'detect': {
      flat(add(new THREE.TorusGeometry(r, 0.016, 6, 72)));
      orbit = add(new THREE.SphereGeometry(0.075, 12, 10), ringMat(hue, 2.6));
      break;
    }
    case 'resilience': {
      flat(add(new THREE.TorusGeometry(r - 0.07, 0.024 * tube, 8, 72)));
      flat(add(new THREE.TorusGeometry(r + 0.07, 0.024 * tube, 8, 72)));
      break;
    }
    case 'org': {
      const halo = flat(add(new THREE.TorusGeometry(r * 0.62, 0.03 * tube, 8, 72)));
      group.position.y = top + 0.3;
      halo.userData.halo = true;
      break;
    }
    case 'systems': {
      for (let i = 0; i < 4; i++) { const seg = flat(add(new THREE.TorusGeometry(r, 0.034 * tube, 8, 24, Math.PI / 2 - 0.4))); seg.rotation.z = (i / 4) * Math.PI * 2 + 0.2; }
      break;
    }
    case 'data': {
      const plate = add(new THREE.RingGeometry(r - 0.04, r + 0.12, 6));
      (plate.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
      plate.rotation.x = -Math.PI / 2;
      break;
    }
    case 'ai': {
      flat(add(new THREE.TorusGeometry(r, 0.03 * tube, 8, 72)));
      add(new THREE.BoxGeometry(0.06, 0.3, 0.06)).position.set(r, 0.12, 0);
      add(new THREE.BoxGeometry(0.06, 0.3, 0.06)).position.set(-r, 0.12, 0);
      break;
    }
    case 'chain': {
      flat(add(new THREE.TorusGeometry(r, 0.024 * tube, 8, 72)));
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; add(new THREE.OctahedronGeometry(0.075, 0)).position.set(Math.cos(a) * r, 0, Math.sin(a) * r); }
      break;
    }
    case 'si': {
      flat(add(new THREE.TorusGeometry(r, 0.03 * tube, 8, 72)));
      add(new THREE.BoxGeometry(0.36, 0.05, 0.05)).position.set(0, 0.07, r);
      break;
    }
    default:
      flat(add(new THREE.TorusGeometry(r, 0.036 * tube, 10, 72)));
  }

  const base = motrus ? 1.3 : 1.5;
  return {
    group, mats, flash: 0,
    idle(t) {
      const f = this.flash;
      const breath = base - 0.25 + 0.35 * Math.sin(t * 1.1 + phase) + f * 1.6;
      for (const m of mats) m.emissiveIntensity = m === orbit?.material ? 2.6 + f * 2 : breath;
      group.scale.setScalar(1 + f * 0.22);
      if (orbit) {
        const a = t * 1.4 + phase;
        orbit.position.set(Math.cos(a) * (r + 0.14), 0.05 + Math.sin(t * 3 + phase) * 0.03, Math.sin(a) * (r + 0.14));
      }
      if (motrus) group.rotation.y = t * 0.2;
    },
  };
}
