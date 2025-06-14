import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, monadTestnet } from "@reown/appkit/networks";

// Custom Network (Mumbai example)

// Project ID from Reown Cloud
export const projectId = "be8c9914df1866410ece204ce9a72b49";
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Add your networks here
export const networks = [mainnet, arbitrum, monadTestnet];

// Set up Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
