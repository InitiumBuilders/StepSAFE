import { createRoot } from 'react-dom/client';
import { PageSigil } from './components/PageSigil';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/future.css';
import './styles/modux.css';
import './styles/modeltable.css';
import './styles/gauge.css';
import './styles/world.css';
import './styles/profile.css';
import './styles/field.css';
import './styles/valor.css';
import './styles/study.css';
import './styles/outlier.css';
import './styles/atlas.css';
import './styles/commons.css';
import './styles/minds.css';
import './styles/ocean.css';
import './styles/mov.css';
import './styles/lumen.css';
import './styles/display.css';
import './styles/calm.css';
import './styles/sigil.css';
import './styles/sacred.css';
import './styles/check.css';
import './styles/tokenread.css';
import './styles/ownrecord.css';
import './styles/glossary.css';
import './styles/rise.css';
import './styles/reflow.css';
import './styles/tabbar.css';
import './styles/touch.css';
import { registerPwa } from './lib/pwa';
import { mountWelcome, readRecord } from './welcome';

registerPwa();
/* StepSAFE's own record lists every site a visit has reached from the browser's list of loaded files. The list keeps
   250 by default and a long visit loads more, so it keeps 1000 (lib/selfread.ts, LOADED_LIST_SIZE). */
try { performance.setResourceTimingBufferSize(1000); } catch { /* an older browser keeps its own size */ }

const root = createRoot(document.getElementById('root')!);

/* The Praxis itself (bootApp.tsx) is a separate download. A first visit and a /welcome link show the welcome
   page at once and fetch the app while the visitor reads, so it is ready when they begin. A link that
   carries something (a shared profile, gauge, result or study set) opens the app directly, which asks
   about it. */
let app: Promise<typeof import('./bootApp')> | null = null;
const loadApp = () => (app ??= import('./bootApp'));
const carries = /(?:^|[#&])[pgrs]=/.test(location.hash);

async function start() {
  /* /MOTRUS (the move), /ankras (the card) and /PAXT (the agreement between communities; /telepaxt opens its room)
     are the proposal pages: their own download, drawn without the Praxis */
  const proposal = /^\/(motrus|ankras?|paxt|telepaxt)\/?$/i.exec(location.pathname);
  if (proposal) {
    const m = await import('./motrus/mount');
    if (/^telepaxt$/i.test(proposal[1]) && !location.hash) history.replaceState(null, '', '/PAXT#telepaxt');
    m.mountMotrus(root, /^ankra/i.test(proposal[1]) ? 'ankras' : /^(paxt|telepaxt)$/i.test(proposal[1]) ? 'paxt' : 'motrus');
    return;
  }
  /* /trust is StepSAFE's own record for anyone, a reviewer included: no welcome page and no handle first */
  if (/^\/trust\/?$/i.test(location.pathname)) {
    const m = await import('./views/trustMount');
    m.mountTrust(root);
    return;
  }
  if (!carries && (location.pathname === '/welcome' || !readRecord().onboarded)) {
    mountWelcome(root, async go => {
      const m = await loadApp();
      m.renderApp(root, go || 'home');
      m.watchFragment(root);
    });
    const idle = (cb: () => void) => { if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout: 6000 }); else window.setTimeout(cb, 1500); };
    window.setTimeout(() => idle(() => { loadApp(); }), 2500);
    return;
  }
  /* while the Praxis comes down, the seed of life breathes where it will open, so the screen is never blank */
  root.render(<div className="boot-frame" role="status" aria-label="Opening the Praxis"><PageSigil kind="seed" /></div>);
  const m = await loadApp();
  await m.boot(root);
  m.watchFragment(root);
}

start();
