
interface StarknetWindowObject {
  enable: () => Promise<string[]>;
  isPreauthorized: () => Promise<boolean>;
  getAccounts: () => Promise<any[]>;
  provider: any;
  on: (event: string, handler: any) => void;
  off: (event: string, handler: any) => void; // Correct method for removing listeners
}

declare global {
  interface Window {
    starknet?: StarknetWindowObject;
  }
}

export {};
