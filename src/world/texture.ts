/* Surfaces made at runtime, so nothing in the World is a perfect flat colour.
   A grain of value noise serves as roughness and as a bump for every metal
   body and for the stone, so light breaks on them the way it breaks on real
   material. A soft disc serves as the contact shadow under every part. */

import * as THREE from 'three';

let grainTex: THREE.CanvasTexture | null = null;
let discTex: THREE.CanvasTexture | null = null;

/** value noise over four octaves, tiling, the same every time */
export function grain(size = 256): THREE.CanvasTexture {
  if (grainTex) return grainTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  let seed = 11;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const grids: { n: number; g: Float32Array }[] = [];
  for (let o = 0; o < 4; o++) {
    const n = 4 << o;
    const g = new Float32Array(n * n);
    for (let i = 0; i < g.length; i++) g[i] = rnd();
    grids.push({ n, g });
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0, amp = 0.5, tot = 0;
      for (const { n, g } of grids) {
        const fx = (x / size) * n, fy = (y / size) * n;
        const x0 = Math.floor(fx) % n, y0 = Math.floor(fy) % n, x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
        const tx = fx - Math.floor(fx), ty = fy - Math.floor(fy);
        const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const top = g[y0 * n + x0] + (g[y0 * n + x1] - g[y0 * n + x0]) * sx;
        const bot = g[y1 * n + x0] + (g[y1 * n + x1] - g[y1 * n + x0]) * sx;
        v += (top + (bot - top) * sy) * amp;
        tot += amp;
        amp *= 0.5;
      }
      const k = Math.round((v / tot) * 255);
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = k;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  grainTex = new THREE.CanvasTexture(cv);
  grainTex.wrapS = grainTex.wrapT = THREE.RepeatWrapping;
  return grainTex;
}

/** a soft disc, bright at the centre and gone at the edge, for the shadow a thing casts straight down */
export function disc(size = 128): THREE.CanvasTexture {
  if (discTex) return discTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  discTex = new THREE.CanvasTexture(cv);
  return discTex;
}
