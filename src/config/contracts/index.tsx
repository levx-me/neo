import { ENetwork } from "../networks";
import Cartouche from '@/abis/Cartouche.json'

export enum EContracts {
    mint = 'Mint'
}


type TContractConfig = Record<
    EContracts,
    {
        abi: any;
        addresses: Partial<Record<ENetwork, string>>;
    }
>;


export const CONTRACTS: TContractConfig = {
    [EContracts.mint]: {
        abi: Cartouche.abi,
        addresses: {
            [ENetwork.ARBITRUM_SEPOLIA]: '0x612ef87bfcd858687160294b0eFFACA0CBA342E2',
            [ENetwork.ARBITRUM]: '0x612ef87bfcd858687160294b0eFFACA0CBA342E2'
        }
    }
}
