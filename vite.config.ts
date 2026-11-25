import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { FLOOR, LOWER, floor } from './scripts/floor.mjs';

/* The curriculum is large by design. Split it so the browser fetches the
   content chunks in parallel and caches them independently of the app shell —
   a content edit must not invalidate the shell, and vice versa. */
export default defineConfig({
  plugins: [react(), floor()],
  /* class fields as constructor code; scripts/floor.mjs says why */
  esbuild: { supported: LOWER },
  build: {
    outDir: 'dist',
    /* Safari 15.4 and later. scripts/floor.mjs says why, and its check runs on every build. */
    target: FLOOR,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          /* three.js loads only with the world, so it gets its own chunk */
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules')) return 'vendor';
          /* Map your own system reads the known systems, so it travels with them and not with the catalog,
             which the app loads at start */
          if (id.includes('src/content/modux/own')) return 'outlier';
          /* the pressures the known systems add to the gauges, and the hidden chapter's names, are small and
             needed at start; the known systems themselves are not */
          if (id.includes('src/content/outlier/pressures') || id.includes('src/content/outlier/ids')) return 'modux';
          /* counting the people a system serves: the engine needs it at start, and Map your own system too; without
             a chunk of its own, the build folds it into the known systems and the app would load them at start */
          if (id.includes('src/lib/people')) return 'modux';
          /* the outline of the curriculum the app starts from (content/registry.ts) */
          if (id.includes('src/content/outline.gen')) return 'outline';
          /* The model texts, and the module that compiles them into chapters and projects (content/modux/index.ts),
             are most of the catalog. The first screen reads the catalog's outline instead (content/outline.gen.ts),
             so they travel apart and arrive with the rest of the curriculum. */
          if (id.includes('src/content/modux/models/') || id.includes('src/content/modux/index.ts') || id.includes('src/content/modux/compile.ts') || id.includes('src/content/modux/projects.ts')) return 'modux-models';
          if (id.includes('src/content/modux/')) return 'modux';
          if (id.includes('src/content/chapters/')) {
            const m = id.match(/chapters\/([a-z-]+)\.ts/);
            return m ? 'ch-' + m[1] : 'chapters';
          }
          if (id.includes('src/content/outlier/')) return 'outlier';
          if (id.includes('src/content/practice/')) return 'practice';
          /* The learner's record reads the glossary's retired names as it loads (lib/state.tsx). They are a few
             lines, and in the glossary's chunk they brought the whole glossary to the first screen. They travel with
             whatever reads them; the glossary itself arrives with the rest of the curriculum. */
          if (id.includes('src/content/glossary-aliases')) return undefined;
          if (id.includes('src/content/glossary')) return 'glossary';
          if (id.includes('src/content/guides')) return 'guides';
          if (id.includes('src/content/awards')) return 'awards';
          if (id.includes('src/content/projects')) return 'projects';
          if (id.includes('src/content/seva')) return 'seva';
          if (id.includes('src/content/unit')) return 'unit';
          return undefined;
        },
      },
    },
  },
});
