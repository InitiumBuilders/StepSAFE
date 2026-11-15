# Modux Models: author spec

One security structure per entry. Three authors, four families each.

Read first:
1. `src/content/modux-schema.ts` (the ModuxModel type; match it exactly)
2. `src/content/modux/catalog.ts` (the id contract: every id, name, family, tier)
3. `src/content/schema.ts` (the Drill and DrillOption types)

Split:
- Author A: identity, trust, crypto, supply
- Author B: detect, resilience, data, org
- Author C: chain, ai, si, systems

Output: one file per family at `src/content/modux/models/<family>.ts`:

```ts
import type { ModuxModel } from "../../modux-schema";
export const MODELS: ModuxModel[] = [ ... ];
```

Cover every catalog id in the family. Copy id, name, family, tier exactly. Add no ids.
Write each family file as soon as that family is done. Stop starting new models at
17 minutes. Every file left behind must be complete and compile.

## Fields

- statement: one sentence, what this structure defeats.
- origin: where it came from and who proved it in use. 2 to 3 sentences.
- structure: the parts and the flows between them. 4 to 8 sentences, drawable.
- components: 4 to 8 short items.
- defeats: 3 to 6 threat or failure classes.
- failsWhen: 3 to 6 concrete ways it fails or gets misused.
- evidence: 2 to 5 items {label, note}. Real deployments, standards, incidents, papers.
- combines: 3 to 6 items {model, how}. model is a catalog id. how says what the pair gives.
- conflicts: 0 to 2 items {model, why}. Only real tensions.
- systemsLens: 2 to 4 sentences on stocks, flows, delays and loops.
- underStress: 2 to 3 sentences on whether it strengthens under load, and what that depends on.
- adoption: 3 to 5 sentences. First move and order.
- signals: 3 to 5 observable signs it is working.
- drill: one Drill with 4 options, exactly one isBest, scores -3..+3.
- minutes 14 to 28. mode novus / motus / both. tags 3 to 6 lowercase words.

## Evidence

Primary sources only: NIST, MITRE, CISA, OWASP, SLSA, OpenSSF, engineering papers
from Google, AWS, Microsoft, Cloudflare, public post incident reports, academic
papers, protocol documentation, RAND, published safety work from Anthropic, OpenAI
and DeepMind, docs.intuition.systems, Dash documentation. Never invent a number,
date, CVE, incident or citation. Without a source, write the claim without the figure.

## Writing rules

- Plain declarative sentences. Say a thing once. No aphorisms or sayings.
- No em dashes or en dashes in prose. Commas, periods, colons or parentheses.
- Never the shape "not X but Y".
- Banned words: crucial, robust (figurative), landscape, delve, pivotal, leverage
  (verb), testament, tapestry, underscore, showcase, seamless, vibrant, meticulous.
- No jabs at vendors, industries or people. State what a structure gives.
- Explain mechanism. Keep technical terms.

## TypeScript rules

- UTF-8 without a byte order mark.
- Double quoted strings. No literal double quote inside a string; use “ ” inside strings.
- No template literals. No emoji.
