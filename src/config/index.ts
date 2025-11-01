import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Get projectId from environment variables with fallback
export const projectId = `ff7e4c6da87929d965ceb31b6a72924c`;

export const MonadTestnet = {
  id: 545,
  name: "Monad EVM Testnet",
  chainNamespace: "eip155",
  nativeCurrency: { name: "Monad", symbol: "Monad", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.evm.nodes.onMonad.org/"],
    },
    public: {
      http: ["https://testnet.evm.nodes.onMonad.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet Explorer",
      url: "https://evm-testnet.Monadscan.io/",
    },
  },
};

export const avalancheTestnet = {
  id: 43113,
  name: "Avalanche Fuji C-Chain",
  chainNamespace: "eip155",
  nativeCurrency: { name: "Monad", symbol: "Monad", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://api.Monad-test.network/ext/bc/C/rpc"],
    },
    public: {
      http: ["https://api.Monad-test.network/ext/bc/C/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Avalanche Testnet Scan",
      url: "https://subnets-test.Monad.network/c-chain",
    },
  },
};

export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  chainNamespace: "eip155",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
    public: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet Explorer",
      url: "https://testnet.monadexplorer.com/",
    },
  },
};

export const networks = [MonadTestnet, avalancheTestnet, monadTestnet];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: projectId || "demo-project-id", // Ensure we always have a fallback
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
