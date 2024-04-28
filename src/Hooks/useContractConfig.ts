import { EContracts } from "@/config/contracts";
import { getABI, getContract } from "@/config/helpers";
import { AddressType, ENetwork } from "@/config/networks";
import { useAccount } from "wagmi";

export function useContractConfig(ct: EContracts): {
  abi: any;
  address: AddressType;
} {
  const { chain } = useAccount();
  const network = (chain?.name ?? ENetwork.ARBITRUM) as ENetwork;

  // if ((!chain || chain?.unsupported) && isConnected) {
  //   console.warn(
  //     `WARNING: chain is ${
  //       !chain ? "UNDEFINED" : "DEFINED"
  //     } and current chain (${chain?.name}) is ${
  //       chain?.unsupported ? "UNSUPPORTED" : "SUPPORTED"
  //     }`
  //   );
  //   return { abi: {}, address: "0x0" };
  // }

  return {
    abi: getABI(ct, network),
    address: getContract(ct, network) as AddressType,
  };
}
