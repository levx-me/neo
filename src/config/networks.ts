export enum ENetwork {
    ARBITRUM = 'Arbitrum One',
    // testnets
    ARBITRUM_SEPOLIA = 'Arbitrum Sepolia',
}
export type AddressType = `0x${string}`;

type NetworkInfo = {
    id: number;
    lzID: number;
    logo: string;
    nativeCurrency: string;
};



export const networkMapping: Record<ENetwork, NetworkInfo> =
{
    [ENetwork.ARBITRUM]: {
        id: 42161,
        lzID: 110,
        logo: 'assets/logos/arbitrum.svg',
        nativeCurrency: 'ETH',
    },

    [ENetwork.ARBITRUM_SEPOLIA]: {
        id: 421614,
        lzID: 10231,
        logo: 'assets/logos/arbitrum.svg',
        nativeCurrency: 'ETH',
    },
}