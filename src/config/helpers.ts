// import { ASSET_CONFIG } from "./assets";
import { CONTRACTS, EContracts } from "./contracts";
// import { LZ_NETWORK_ENDPOINTS } from "./contracts/lz";
import { AddressType, ENetwork } from "@/config/networks";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// export function getAssetConfig(asset: EAssets) {
//     return ASSET_CONFIG[asset];
// }

export function getContract(contract: EContracts, network: ENetwork) {
    return CONTRACTS[contract].addresses[network] as AddressType;
}

export function getABI(contract: EContracts, network: ENetwork) {
    return CONTRACTS[contract].abi;
}

// export function getLZNetEndpoint(network: ENetwork) {
//     return LZ_NETWORK_ENDPOINTS[network];
// }