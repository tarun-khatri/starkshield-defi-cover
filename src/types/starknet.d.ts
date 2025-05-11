
interface StarknetWindowObject {
  enable: () => Promise<string[]>;
  isPreauthorized: () => Promise<boolean>;
  getAccounts: () => Promise<any[]>;
  provider: any;
  on: (event: string, handler: any) => void;
  removeListener: (event: string, handler: any) => void;
}

declare global {
  interface Window {
    starknet?: StarknetWindowObject;
  }
}

export {};
