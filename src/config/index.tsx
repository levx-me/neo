declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PROJECT_ID: string;
        }
    }
}

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { cookieStorage, createStorage } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

//@todo  change icon
const metadata = {
    name: 'Caroutche',
    description: 'Channel the power of ancient Egypt with your very own Cartouche',
    url: 'https://cartouche.gold', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
    chains: [arbitrum, arbitrumSepolia], // required
    projectId, // required
    metadata, // required
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    enableWalletConnect: true, // Optional - true by default
    enableInjected: true, // Optional - true by default
    enableEIP6963: true, // Optional - true by default
    enableCoinbase: true, // Optional - true by default
    // ...wagmiOptions // Optional - Override createConfig parameters
});
