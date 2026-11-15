/* INSIGHTS: what the record says to do next, read from the record and
   nothing else. Each insight names a fact, the number behind it, and one
   action. The order is by urgency: a goal with a date, the thinnest hold,
   the chapter nearest to locking in, the families not yet placed, the shelf
   unread. At most three are shown. */

import { CHAPTERS, GUIDES } from '../content/registry';
import { MODUX_MODELS } from '../content/registry';
import { GAUGES, gaugeOfTheDay } from '../content/modux/gauges';
import { escalate } from '../content/modux/escalate';
import { leverage } from '../content/modux/dynamics';
import { FAMILY_LABEL, type ModuxFamily } from '../content/modux-schema';
import { chapterUnlocked } from './unlock';
import type { S, Act } from './state';
import { serviceRecord } from './service';
import { goalProgress, goalTargetValue, kindOf } from './goals';

export interface Insight {
  key: string;
  kicker: string;
  title: string;
  line: string;
  action?: { label: string; go: Act };
}

const DAY = 86400000;
const hours = (x: number) => String(Math.round(x));

export function insights(s: S, now = Date.now()): Insight[] {
  const out: Insight[] = [];
  const sr = serviceRecord(s, now);

  /* a goal with a date inside two weeks, not reached */
  const due = s.goals
    .filter(g => !g.reachedAt && g.by)
    .map(g => { const d0 = new Date(now); d0.setHours(12, 0, 0, 0); return { g, days: Math.round((new Date(g.by + 'T12:00:00').getTime() - d0.getTime()) / DAY) }; })
    .filter(x => x.days <= 14)
    .sort((a, b) => a.days - b.days)[0];
  if (due) {
    const k = kindOf(due.g.key);
    const v = due.g.key === 'own' ? 0 : goalProgress(s, sr, due.g.key);
    out.push({
      key: 'goal', kicker: 'A GOAL WITH A DATE',
      title: due.days < 0 ? due.g.title + ' is ' + (-due.days) + (due.days === -1 ? ' day past its date' : ' days past its date')
        : due.days === 0 ? due.g.title + ' is due today' : due.g.title + ' is due in ' + due.days + (due.days === 1 ? ' day' : ' days'),
      line: k ? (due.g.key === 'notch' ? 'Held to notch ' + Math.max(0, v - 1) + ' of ' + due.g.target : v.toLocaleString() + ' of ' + goalTargetValue(due.g.key, due.g.target).toLocaleString() + ' ' + k.unit) + ' so far.' : 'In your own words, and in your hands.',
      action: { label: 'Open your goals', go: { t: 'route', view: 'profile' } },
    });
  }

  /* the thinnest hold, and the one move that keeps the most there */
  const thin = [...sr.lines].sort((a, b) => a.hoursKept - b.hoursKept)[0];
  if (thin && thin.hoursKept < 22) {
    const base = GAUGES.find(g => g.id === thin.id) || s.forged.find(g => g.id === thin.id);
    let move = '';
    if (base) {
      try {
        const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
        const esc = escalate(base, (s.gaugeSessions[thin.id]?.used || []).slice(0, thin.notch));
        const rec = s.gauges[thin.id];
        const lev = leverage(esc.gauge, rec?.stack || [], byId, [], new Set(esc.weakened.map(w => w.model)), 1);
        const m = lev.moves[0];
        if (m) move = ' ' + m.name + ' keeps ' + hours(m.kept) + ' more for ' + m.cost + ' budget.';
      } catch { move = ''; }
    }
    out.push({
      key: 'thin', kicker: 'YOUR THINNEST HOLD',
      title: thin.title + (thin.notch ? ' at notch ' + thin.notch : ' at Ground'),
      line: 'About ' + hours(thin.hoursKept) + ' of 24 hours of service kept' + (thin.peopleLabel ? ' for ' + thin.peopleLabel : '') + ' on the stress day.' + move,
      action: { label: 'Open the gauge', go: { t: 'route', view: 'modux-gauge', id: thin.id } },
    });
  } else if (sr.held === 0) {
    const t = gaugeOfTheDay(new Date(now));
    out.push({
      key: 'first-hold', kicker: 'NO GAUGE HELD YET',
      title: 'Today’s gauge is ' + t.title,
      line: 'Hold it at Ground and the record starts counting the people you held for.',
      action: { label: 'Open the gauge', go: { t: 'route', view: 'modux-gauge', id: t.id } },
    });
  }

  /* StudyMode: cards due for review, or a FUD range worth clearing */
  const study = Object.values(s.study || {});
  const dueCards = study.filter(c => typeof c.due === 'number' && c.due <= now).length;
  const fudCards = study.filter(c => typeof c.sound === 'number' && c.sound < 1).length;
  if (dueCards >= 5) {
    out.push({
      key: 'study-due', kicker: 'DUE FOR REVIEW',
      title: dueCards + ' cards are due for review',
      line: 'Each one came back on its own schedule. The queue puts them first, and a review pays one UNITIA a card a day.',
      action: { label: 'Open StudyMode', go: { t: 'route', view: 'study' } },
    });
  } else if (fudCards >= 3) {
    out.push({
      key: 'study-fud', kicker: 'YOUR FUD RANGE',
      title: fudCards + ' cards sit in your FUD range',
      line: 'Rated below 1 on Semble Sound. Turn them, test them and rate them again; the gap between the rating and the recall is the most useful thing to study.',
      action: { label: 'Open StudyMode', go: { t: 'route', view: 'study' } },
    });
  }

  /* the chapter nearest to locking in */
  const near = CHAPTERS
    .filter(c => !s.completedChapters[c.id] && chapterUnlocked(c, s.completedChapters, s.completedPages))
    .map(c => {
      const total = c.pages.reduce((n, p) => n + p.steps.length, 0);
      const done = c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
      return { c, total, done, ratio: total ? done / total : 0 };
    })
    .filter(x => x.done > 0)
    .sort((a, b) => b.ratio - a.ratio)[0];
  if (near) {
    const left = near.total - near.done;
    out.push({
      key: 'chapter', kicker: 'NEAREST TO LOCKING IN',
      title: near.c.title + ' is ' + left + (left === 1 ? ' step' : ' steps') + ' from locked in',
      line: near.done + ' of ' + near.total + ' steps sealed. A locked chapter seats a new member in your unit.',
      action: { label: 'Open the chapter', go: { t: 'route', view: 'chapter', id: near.c.id } },
    });
  }

  /* the families not yet placed in a stack that held */
  const used = new Set(s.runLog.filter(r => r.held).flatMap(r => r.fams));
  const never = (Object.keys(FAMILY_LABEL) as ModuxFamily[]).filter(f => !used.has(f));
  if (used.size > 0 && never.length > 0) {
    const names = never.map(f => FAMILY_LABEL[f]);
    out.push({
      key: 'families', kicker: 'FAMILIES YOU HAVE NOT HELD WITH',
      title: never.length + ' of 12 families have not yet been in a stack that held',
      line: names.slice(0, 4).join(', ') + (names.length > 4 ? ' and ' + (names.length - 4) + ' more' : '') + '. A stack that reaches for the same families every time has the same gap every time.',
      action: { label: 'See the structures', go: { t: 'route', view: 'modux', sub: 'models' } },
    });
  }

  /* the Systems shelf unread */
  const shelf = GUIDES.filter(g => g.domain === 'Systems');
  const unread = shelf.filter(g => !s.guidesRead[g.id]).length;
  if (unread > 0) {
    out.push({
      key: 'shelf', kicker: 'THE SYSTEMS SHELF',
      title: unread === shelf.length ? 'The Systems shelf is unread' : unread + ' of ' + shelf.length + ' Systems guides unread',
      line: 'The notation the map uses, where to act, the delays, the cut, and how to work a problem with no final answer.',
      action: { label: 'Open the shelf', go: { t: 'route', view: 'guides' } },
    });
  }

  return out.slice(0, 3);
}
