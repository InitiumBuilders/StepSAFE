/* TWO MADE-UP TOKENS, for the page that reads a token (views/ReadView.tsx). Neither is on Dash Platform: their
   identifiers are words, and the page says so beside them. They are written in the shape the Platform Explorer
   answers in, and read by the same parser as a real record, so what the page shows before a first reading is the
   real page. One is held by a single key. The other is held by a group of three, with a maximum no one can move.
   probe-onchain.mts holds both to their findings. */

import { parseContract, type ContractRead } from '../lib/onchain';

const OWNER = 'ExampLeownerExampLeownerExampLeownerExampLe1';
const MEMBERS = ['ExampLememberoneExampLememberoneExampLeone1', 'ExampLemembertwoExampLemembertwoExampLetwo1', 'ExampLememberthreeExampLememberthreeExampLe1'];

type Taker = 'NoOne' | 'ContractOwner' | 'Group(0)';
const rule = (does: Taker, changes: Taker) => ({
  authorizedToMakeChange: { takerType: does, taker: does === 'Group(0)' ? 0 : null },
  adminActionTakers: { takerType: changes, taker: changes === 'Group(0)' ? 0 : null },
});
const HISTORY = { keepsTransferHistory: true, keepsFreezingHistory: true, keepsMintingHistory: true, keepsBurningHistory: true };

interface Made { contract: string; tokenId: string; name: string; plural: string; base: string; now: string; max: string | null; does: Taker; fixed: boolean; groups: unknown[] }

function record(m: Made) {
  /* the first example leaves every rule with the owner; the second gives minting and pausing to the group and closes the rest */
  const change: Taker = m.fixed ? 'NoOne' : 'ContractOwner';
  const off = (t: Taker): Taker => (m.fixed ? 'NoOne' : t);
  const names = { en: { singularForm: m.name, pluralForm: m.plural, shouldCapitalize: true } };
  const dc = {
    identifier: m.contract, owner: { identifier: OWNER, aliases: [] }, version: 1, isSystem: false, schema: '{}', groups: m.groups,
    tokens: [{ identifier: m.tokenId, position: 0, localizations: names, decimals: 8, baseSupply: m.base, totalSupply: m.now, maxSupply: m.max }],
  };
  const dec = {
    dataContractId: m.contract, ownerId: OWNER, internalConfig: { readonly: m.fixed },
    tokens: [{
      position: 0, tokenId: m.tokenId, conventions: { decimals: 8, localizations: names }, baseSupply: m.base, maxSupply: m.max,
      mainControlGroup: m.groups.length ? 0 : null, keepsHistory: HISTORY, startAsPaused: false, isAllowedTransferToFrozenBalance: true,
      conventionsChangeRules: rule(off('ContractOwner'), change),
      maxSupplyChangeRules: rule(off('ContractOwner'), change),
      manualMintingRules: rule(m.does, change),
      manualBurningRules: rule('ContractOwner', change),
      freezeRules: rule(off('ContractOwner'), change),
      unfreezeRules: rule(off('ContractOwner'), change),
      destroyFrozenFundsRules: rule(off('ContractOwner'), change),
      emergencyActionRules: rule(m.does, change),
      marketplaceRules: { tradeMode: 'NotTradeable', tradeModeChangeRules: rule(off('ContractOwner'), change) },
      distributionRules: { perpetualDistribution: null, preProgrammedDistribution: null, newTokenDestinationIdentity: null, mintingAllowChoosingDestination: true },
    }],
  };
  return { dc, dec };
}

export interface Example { key: string; pick: string; read: () => ContractRead }

const made = (m: Made) => { const r = record(m); return () => parseContract(r.dc, r.dec, 'mainnet', 'example'); };

export const EXAMPLES: Example[] = [
  {
    key: 'one', pick: 'One key holds it',
    read: made({ contract: 'ExampLecontractonekeyExampLecontractonekey11', tokenId: 'ExampLetokenonekeyExampLetokenonekeyExampLe1', name: 'Example One', plural: 'Example One tokens',
      base: '100000000000000', now: '560000000000000', max: null, does: 'ContractOwner', fixed: false, groups: [] }),
  },
  {
    key: 'group', pick: 'A group holds it',
    read: made({ contract: 'ExampLecontractgroupExampLecontractgroup1111', tokenId: 'ExampLetokengroupExampLetokengroupExampLe111', name: 'Example Two', plural: 'Example Two tokens',
      base: '1000000000000000', now: '1260000000000000', max: '2100000000000000', does: 'Group(0)', fixed: true,
      groups: [{ members: { [MEMBERS[0]]: 1, [MEMBERS[1]]: 1, [MEMBERS[2]]: 1 }, requiredPower: 2 }] }),
  },
];
