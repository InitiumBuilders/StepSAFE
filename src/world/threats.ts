/* WHAT A THREAT LOOKS LIKE, WHERE IT COMES FROM, AND HOW IT IS STOPPED.

   A threat's nature is told by what would stop it: the family of its counters.
   A move that identity structures stop arrives as a stolen key. A move that
   trust structures stop is a wedge that comes in low along a path. A move only
   detection would catch is a ghost, slow and faint, with no trail. A failure
   that resilience would absorb is a crack that opens under the part. A move
   that a supply structure stops is a crate, and it comes from the vendor or
   the build if the system has one. A move that organisation would handle is a
   wave that comes from the public. A move that systems thinking would stop
   rides a dependency in from a neighbour. An open problem is the amber point
   that already hangs over the part, falling.

   How it is stopped is told by the family of the structure that stopped it: a
   sentinel sees it before it arrives, a wall flattens it, a collar throws it
   back in sparks, a lock turns it grey and unreadable, a seal drops it to the
   floor, twin rings seal a crack with ice, a halo dissipates a wave, a broken
   ring cuts a chain at a breaker, and a MoTRUS model dissolves it in violet. */

import * as THREE from 'three';
import type { GaugeThreat } from '../content/modux-schema';

export type ThreatMotif = 'key' | 'wedge' | 'cube' | 'crate' | 'ghost' | 'crack' | 'wave' | 'chain' | 'drop' | 'prompt' | 'block' | 'spark' | 'open';
export type Origin = 'horizon' | 'low' | 'below' | 'above' | 'vendor' | 'public' | 'edge';
export type StopStyle = 'seen' | 'wall' | 'bounce' | 'grey' | 'drop' | 'ice' | 'dissipate' | 'break' | 'motrus' | 'shatter';

export const familyOf = (id: string) => id.split('-')[1] || '';

function mode(ids: string[]): string {
  const c: Record<string, number> = {};
  for (const id of ids) { const f = familyOf(id); c[f] = (c[f] || 0) + 1; }
  let best = '', n = 0;
  for (const [f, k] of Object.entries(c)) if (k > n) { best = f; n = k; }
  return best;
}

const BY_FAMILY: Record<string, ThreatMotif> = {
  identity: 'key', trust: 'wedge', crypto: 'cube', supply: 'crate', detect: 'ghost', resilience: 'crack',
  org: 'wave', systems: 'chain', data: 'drop', ai: 'prompt', chain: 'block', si: 'spark',
};

export function threatMotif(t: GaugeThreat): ThreatMotif {
  if (t.open) return 'open';
  return BY_FAMILY[mode(t.counters)] || 'key';
}

export const ORIGIN: Record<ThreatMotif, Origin> = {
  key: 'horizon', wedge: 'low', cube: 'horizon', crate: 'vendor', ghost: 'low', crack: 'below',
  wave: 'public', chain: 'edge', drop: 'above', prompt: 'horizon', block: 'horizon', spark: 'horizon', open: 'above',
};

/** how long the flight takes, as a factor of the run's step */
export const PACE: Record<ThreatMotif, number> = {
  key: 1, wedge: 1, cube: 1, crate: 1.1, ghost: 1.5, crack: 0.7, wave: 1.2, chain: 0.9, drop: 0.8, prompt: 0.9, block: 1, spark: 0.6, open: 1.4,
};

const STOP_BY_FAMILY: Record<string, StopStyle> = {
  detect: 'seen', trust: 'wall', identity: 'bounce', crypto: 'grey', supply: 'drop', resilience: 'ice',
  org: 'dissipate', systems: 'break', data: 'wall', ai: 'seen', chain: 'break', si: 'bounce',
};

export function stopStyle(stopper: string | null, motrus: boolean): StopStyle {
  if (motrus) return 'motrus';
  if (!stopper) return 'shatter';
  return STOP_BY_FAMILY[familyOf(stopper)] || 'shatter';
}

const hdr = (c: THREE.Color, k: number) => c.clone().multiplyScalar(k);

export interface Head {
  obj: THREE.Object3D;
  mats: THREE.MeshBasicMaterial[];
  /** a ghost shows no trail */
  trail: boolean;
}

/** The thing that arrives. */
export function buildHead(m: ThreatMotif, col: THREE.Color, weight: number): Head {
  const mats: THREE.MeshBasicMaterial[] = [];
  const mat = (k: number, opacity = 1) => {
    const x = new THREE.MeshBasicMaterial({ color: hdr(col, k), transparent: opacity < 1, opacity });
    mats.push(x);
    return x;
  };
  const s = 0.9 + weight * 0.18;
  const g = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, k: number, opacity = 1) => { const mesh = new THREE.Mesh(geo, mat(k, opacity)); g.add(mesh); return mesh; };
  let trail = true;
  switch (m) {
    case 'key': {
      add(new THREE.TorusGeometry(0.12 * s, 0.03 * s, 8, 24), 6);
      add(new THREE.BoxGeometry(0.05 * s, 0.3 * s, 0.05 * s), 6).position.y = -0.24 * s;
      add(new THREE.BoxGeometry(0.1 * s, 0.05 * s, 0.05 * s), 6).position.set(0.05 * s, -0.34 * s, 0);
      break;
    }
    case 'wedge': {
      const geo = new THREE.ConeGeometry(0.16 * s, 0.42 * s, 3);
      geo.rotateX(Math.PI / 2);
      geo.scale(1, 0.35, 1);
      add(geo, 6);
      break;
    }
    case 'cube': add(new THREE.BoxGeometry(0.2 * s, 0.2 * s, 0.2 * s), 6); break;
    case 'crate': {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.26 * s, 0.26 * s, 0.26 * s), new THREE.MeshStandardMaterial({ color: new THREE.Color('#2a1a1e'), metalness: 0.8, roughness: 0.4 }));
      g.add(box);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: hdr(col, 3) }));
      g.add(e);
      add(new THREE.SphereGeometry(0.05 * s, 8, 8), 6);
      break;
    }
    case 'ghost': add(new THREE.SphereGeometry(0.16 * s, 14, 12), 1.6, 0.35); trail = false; break;
    case 'crack': add(new THREE.TetrahedronGeometry(0.2 * s, 0), 6); break;
    case 'wave': {
      const d = add(new THREE.CylinderGeometry(0.32 * s, 0.32 * s, 0.03, 32), 4, 0.8);
      d.rotation.x = 0;
      add(new THREE.TorusGeometry(0.42 * s, 0.02, 6, 40), 5).rotation.x = Math.PI / 2;
      break;
    }
    case 'chain': {
      add(new THREE.SphereGeometry(0.11 * s, 12, 10), 6);
      add(new THREE.TorusGeometry(0.17 * s, 0.025 * s, 6, 24), 5);
      break;
    }
    case 'drop': {
      const geo = new THREE.ConeGeometry(0.13 * s, 0.34 * s, 12);
      geo.rotateX(Math.PI);
      add(geo, 6);
      break;
    }
    case 'prompt': add(new THREE.OctahedronGeometry(0.16 * s, 0), 6); break;
    case 'block': add(new THREE.CylinderGeometry(0.16 * s, 0.16 * s, 0.14 * s, 6), 6); break;
    case 'spark': add(new THREE.IcosahedronGeometry(0.12 * s, 0), 8); break;
    case 'open': add(new THREE.OctahedronGeometry(0.26, 0), 3); break;
  }
  return { obj: g, mats, trail };
}
