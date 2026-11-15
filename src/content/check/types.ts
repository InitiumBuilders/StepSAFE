/* DASH DEFENDERS · THE CHECKS BEFORE LAUNCH. One shape for every check: twelve statements in three parts,
   each with its move, the catalog structures that hold it, its NIST CSF 2.0 category, and the sources its
   facts were verified against, with the date. A fact has a shelf life: probe-check.mts fails a statement
   whose sources were checked longer ago than its shelf allows, so nothing stale ships. */

export type CheckAnswer = 'yes' | 'partly' | 'no' | 'unsure' | 'na';

/** the public records that can show a statement (lib/evidence.ts); the keyring keeps a reading only of these kinds */
export const EVIDENCE_KINDS = [
  'domain-locks', 'dns-records', 'multisig-agree', 'multisig-spare',
  'scorecard-review', 'scorecard-branch', 'scorecard-token', 'scorecard-signed', 'scorecard-provenance', 'scorecard-updates', 'scorecard-policy',
] as const;
export type EvidenceKind = typeof EVIDENCE_KINDS[number];

export interface CheckSource {
  label: string;
  url: string;
  /** the day the facts this source supports were read at the source, YYYY-MM-DD */
  checked: string;
}

export interface CheckItem {
  id: string;
  /** the part this statement belongs to, one of its check's three */
  part: string;
  /** the statement in a few words, for the ring and the gaps */
  short: string;
  /** the statement the project answers */
  ask: string;
  /** why it matters, in one or two sentences */
  why: string;
  /** the move when it does not hold yet */
  move: string;
  /** the catalog structures that hold it */
  models: string[];
  /** 3 is the deepest gap, 1 the lightest; the result orders gaps by it */
  weight: 1 | 2 | 3;
  /** the NIST CSF 2.0 category it serves */
  csf: string;
  /** days the facts stay good before they are read again: 90 for a vendor's support, 365 for a protocol or a standard */
  shelf: number;
  /** a statement that can rightly not apply, with the label for that answer */
  na?: string;
  /** a public record that can show this statement, so it need not rest on the project's word */
  evidence?: EvidenceKind;
  sources: CheckSource[];
}

export interface CheckPartDef { id: string; name: string; line: string }

export interface CheckKind {
  id: string;
  /** the check's name in a list */
  name: string;
  /** the page heading */
  title: string;
  lede: string;
  /** one line for the door and the hub */
  line: string;
  parts: CheckPartDef[];
  items: CheckItem[];
}
