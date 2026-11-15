/* The checks before launch, in the order a project meets them. A run without a kind is a treasury check:
   that was the only kind before 2026-11-04. The five together are the launch review (docs/NEXT-MOVE.md). */

import type { CheckKind } from './types';
import { TREASURY } from './treasury';
import { ACCOUNTS } from './accounts';
import { CODE } from './code';
import { PEOPLE } from './people';
import { INCIDENT } from './incident';

export const CHECKS: CheckKind[] = [TREASURY, ACCOUNTS, CODE, PEOPLE, INCIDENT];

export const checkKind = (id?: string | null): CheckKind => CHECKS.find(k => k.id === id) || TREASURY;
export const isCheckKind = (id?: string | null) => !!id && CHECKS.some(k => k.id === id);
