/* THE SUBJECTS. One set of eleven for the whole corpus, so the glossary, the StepGuides and the StudyMode deck are
   organised the same way. The glossary's terms were written across 77 domains, many holding one to three terms and
   some naming the same field twice (AppSec and Application Security); each domain now belongs to one subject, read
   on 2026-11-08 from the terms it holds. A term keeps its own domain as a finer label beside the subject.
   probe-subjects.mts fails if any term, guide, model family, chapter, threat target, room or incident has none.
   The word is subject because shelf was taken twice: StudyMode's Shelf is the learner's own saved cards, and a
   shelf of guides (the Systems shelf, the Launch shelf) is a set written together. */

export type SubjectId = 'systems' | 'governance' | 'identity' | 'keys' | 'software' | 'detect' | 'resilience' | 'chain' | 'decentral' | 'graph' | 'ai';

/** hue: the subject's light, from the Dava-Dark palette; it tints the subject's glyph and marks; text stays in the theme's inks */
export interface Subject { id: SubjectId; name: string; short: string; hue: string; line: string }

export const SUBJECTS: Subject[] = [
  { id: 'systems', name: 'Systems and foundations', short: 'Systems', hue: '#d8effc', line: 'How a security program behaves as a system, and the ideas the other subjects build on.' },
  { id: 'governance', name: 'Governance and risk', short: 'Governance', hue: '#fdc26f', line: 'Risk, frameworks, regulation, privacy, and the people who decide.' },
  { id: 'identity', name: 'Identity and access', short: 'Identity', hue: '#9cc3ef', line: 'Who signs in, what they may do, and where trust is bounded.' },
  { id: 'keys', name: 'Keys and custody', short: 'Keys', hue: '#f4a582', line: 'Cryptography, keys, secrets, and the custody of what moves value.' },
  { id: 'software', name: 'Software and supply chain', short: 'Software', hue: '#7282ed', line: 'How code is written, tested, built, signed and shipped.' },
  { id: 'detect', name: 'Detection and response', short: 'Detection', hue: '#e8786a', line: 'Seeing an attack, hunting it, running the incident, and learning from it.' },
  { id: 'resilience', name: 'Resilience and platforms', short: 'Resilience', hue: '#7be3ea', line: 'Architecture, isolation, backups, domains, and the systems that keep running.' },
  { id: 'chain', name: 'Chain and Dash', short: 'Chain', hue: '#a78bff', line: 'Blockchains, consensus, treasuries, smart contracts and the Dash network.' },
  { id: 'decentral', name: 'Decentralized infrastructure', short: 'Decentralized', hue: '#d8b4fe', line: 'Permanent storage, content addressing, peer-to-peer networks and compute you do not own.' },
  { id: 'graph', name: 'Intuition and trust graphs', short: 'Trust graphs', hue: '#f18ac6', line: 'Attestations, curation markets and the honest graph.' },
  { id: 'ai', name: 'AI and frontier control', short: 'AI', hue: '#d65bb5', line: 'Securing models and agents, and controlling systems that may exceed their evaluations.' },
];

export const subjectById = (id: SubjectId) => SUBJECTS.find(s => s.id === id)!;

/* the glossary's domains, by the terms they hold */
export const TERM_SUBJECT: Record<string, SubjectId> = {
  'Systems': 'systems', 'Foundations': 'systems', 'Decision Science': 'systems', 'Doctrine': 'systems', 'Safety': 'systems', 'Threat Modeling': 'systems',
  'Governance': 'governance', 'Risk': 'governance', 'Risk Quantification': 'governance', 'Regulatory': 'governance', 'Privacy': 'governance',
  'Data Protection': 'governance', 'Leadership': 'governance', 'Program Design': 'governance', 'Assurance': 'governance',
  'Identity': 'identity', 'Authentication': 'identity', 'Authorization': 'identity', 'Access Control': 'identity', 'Federation': 'identity',
  'Identity Lifecycle': 'identity', 'Tokens': 'identity', 'Transport': 'identity',
  'Cryptography': 'keys', 'Key Management': 'keys', 'Custody': 'keys', 'PKI': 'keys', 'Hardware Security': 'keys', 'Threat': 'keys',
  'Application Security': 'software', 'AppSec': 'software', 'Supply Chain': 'software', 'CI/CD Security': 'software', 'Software Assurance': 'software',
  'Web Security': 'software', 'API Security': 'software', 'Vulnerability Management': 'software', 'Design Security': 'software', 'Platform Security': 'software',
  'Detection': 'detect', 'Detection Engineering': 'detect', 'Threat Detection': 'detect', 'Threat Hunting': 'detect', 'Security Operations': 'detect',
  'Deception': 'detect', 'Digital Forensics': 'detect', 'Incident Response': 'detect', 'Incident': 'detect', 'Ransomware': 'detect', 'Preparedness': 'detect',
  'Endpoint Defense': 'detect', 'Threat Intelligence': 'detect', 'Adversary Tradecraft': 'detect', 'Adversary Simulation': 'detect', 'Learning': 'detect',
  'Learning Systems': 'detect', 'Council': 'detect', 'Defensive Ontology': 'detect', 'Human Factors': 'detect', 'Operations Metrics': 'detect',
  'Resilience': 'resilience', 'Isolation': 'resilience', 'Architecture': 'resilience',
  'Chain security': 'chain', 'Chain': 'chain', 'Consensus': 'chain', 'EVO': 'chain', 'Dash Platform': 'chain',
  'Decentralized': 'decentral', 'Decentralized storage': 'decentral', 'P2P networks': 'decentral',
  'Intuition': 'graph', 'Trust graph': 'graph',
  'AI security': 'ai', 'AI safety': 'ai', 'AI governance': 'ai',
};
/** a term whose domain mixes two fields goes where the term itself belongs */
export const TERM_OVERRIDE: Record<string, SubjectId> = { 'root-of-trust': 'keys' };

export const GUIDE_SUBJECT: Record<string, SubjectId> = {
  'Systems': 'systems', 'Risk Quantification': 'governance', 'CISO Leadership': 'governance', 'Risk & Governance': 'governance',
  'Identity': 'identity', 'Cryptography': 'keys', 'Secrets Management': 'keys', 'Data Security': 'keys',
  'Design Security': 'software', 'Vulnerability Management': 'software',
  'Incident Response': 'detect', 'Detection Engineering': 'detect', 'Threat Hunting': 'detect', 'Incident Command': 'detect',
  'Domains and DNS': 'resilience', 'Blockchain Security': 'chain', 'Decentralized Infrastructure': 'decentral',
  'AI Security': 'ai', 'AI Governance': 'ai',
};

/** the catalog's families, by their labels */
export const MODEL_SUBJECT: Record<string, SubjectId> = {
  'Identity and access': 'identity', 'Trust boundaries': 'identity', 'Keys and custody': 'keys', 'Supply chain': 'software',
  'Detection and response': 'detect', 'Resilience': 'resilience', 'Data and privacy': 'governance', 'Chain and treasury': 'chain',
  'AI systems': 'ai', 'Frontier control': 'ai', 'Organisation': 'governance', 'Systems thinking': 'systems',
};

/** each chapter, by the subject it teaches first */
export const CHAPTER_SUBJECT: Record<string, SubjectId> = {
  'ch-foundations': 'systems', 'ch-identity': 'identity', 'ch-detection': 'detect', 'ch-appsec': 'software', 'ch-incident': 'detect',
  'ch-grc': 'governance', 'ch-chain': 'chain', 'ch-decinfra': 'decentral', 'ch-ai': 'ai', 'ch-ciso': 'governance',
  'ch-intuition': 'graph', 'ch-dashevo': 'chain', 'ch-outlier': 'systems',
  'mx-ground': 'systems', 'mx-identity-trust': 'identity', 'mx-supply-detect': 'software', 'mx-resilience-data': 'resilience',
  'mx-chain': 'chain', 'mx-ai-si': 'ai',
};

/** a page whose subject differs from its chapter's goes on its own subject: The Keeper's cipher and custody pages,
   the chain chapter's custody page, and the incident chapter's recovery page */
export const PAGE_SUBJECT: Record<string, SubjectId> = {
  'ch-identity-p4': 'keys', 'ch-identity-p5': 'keys', 'pg-chain-custody': 'keys', 'ch-incident-page-after': 'resilience',
};

/** a threat by what it hits */
export const THREAT_SUBJECT: Record<string, SubjectId> = {
  people: 'identity', identity: 'identity', network: 'resilience', data: 'governance', build: 'software', money: 'keys',
  control: 'resilience', model: 'ai', public: 'governance', time: 'resilience', vendor: 'governance',
};

/** the public incidents in the deck */
export const INCIDENT_SUBJECT: Record<string, SubjectId> = { 'cal-booster': 'resilience', 'cal-clearinghouse': 'detect', 'cal-update': 'resilience' };

export const termSubject = (t: { id: string; domain: string }): SubjectId | undefined => TERM_OVERRIDE[t.id] || TERM_SUBJECT[t.domain];
export const guideSubject = (g: { domain: string }): SubjectId | undefined => GUIDE_SUBJECT[g.domain];
