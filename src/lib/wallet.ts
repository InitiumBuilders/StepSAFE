/* Wallet linking — EIP-6963 provider discovery with EIP-1193 connect.
   Supports every major injected wallet (MetaMask, Coinbase Wallet, Rabby,
   Brave, OKX, Zerion, ...) without shipping any wallet SDK.

   Security posture (this is a security school — we practice what we teach):
   - Read-only linking: we request accounts, nothing else.
   - We NEVER request seed phrases, private keys, or signatures for login.
   - No transaction is ever constructed or sent by this app.
   - The address is stored locally only; there is no backend. */

export interface DiscoveredWallet {
  uuid: string;
  name: string;
  icon: string;
  provider: Eip1193Provider;
}

export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, cb: (...a: unknown[]) => void): void;
  removeListener?(event: string, cb: (...a: unknown[]) => void): void;
}

interface Eip6963AnnounceEvent extends Event {
  detail: {
    info: { uuid: string; name: string; icon: string; rdns: string };
    provider: Eip1193Provider;
  };
}

const found = new Map<string, DiscoveredWallet>();
let listening = false;

export function discoverWallets(): Promise<DiscoveredWallet[]> {
  return new Promise(resolve => {
    if (!listening) {
      listening = true;
      window.addEventListener('eip6963:announceProvider', e => {
        const ev = e as Eip6963AnnounceEvent;
        if (ev.detail?.info?.uuid) {
          found.set(ev.detail.info.uuid, {
            uuid: ev.detail.info.uuid,
            name: ev.detail.info.name,
            icon: ev.detail.info.icon,
            provider: ev.detail.provider,
          });
        }
      });
    }
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    // legacy fallback: window.ethereum without 6963 support
    setTimeout(() => {
      const eth = (window as unknown as { ethereum?: Eip1193Provider & { isMetaMask?: boolean } }).ethereum;
      if (eth && found.size === 0) {
        found.set('legacy', {
          uuid: 'legacy',
          name: eth.isMetaMask ? 'MetaMask' : 'Injected Wallet',
          icon: '',
          provider: eth,
        });
      }
      resolve([...found.values()]);
    }, 220);
  });
}

export async function connectWallet(w: DiscoveredWallet): Promise<{ address: string; chainId: string }> {
  const accounts = (await w.provider.request({ method: 'eth_requestAccounts' })) as string[];
  if (!accounts || !accounts[0]) throw new Error('No account authorized.');
  const chainId = (await w.provider.request({ method: 'eth_chainId' })) as string;
  return { address: accounts[0], chainId };
}

export function shortAddr(a: string) {
  return a.length > 12 ? a.slice(0, 6) + '…' + a.slice(-4) : a;
}

export function chainName(chainId: string): string {
  const map: Record<string, string> = {
    '0x1': 'Ethereum',
    '0x2105': 'Base',
    '0xa4b1': 'Arbitrum One',
    '0xa': 'OP Mainnet',
    '0x89': 'Polygon',
    '0x14a34': 'Base Sepolia',
    '0xd3b3': 'Intuition L3',
  };
  return map[chainId.toLowerCase()] || 'Chain ' + parseInt(chainId, 16);
}
