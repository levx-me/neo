import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { useContractConfig } from "./useContractConfig";
import { EContracts } from "@/config/contracts";


export const useMint = (option: { encodedData: string, callback: () => void }) => {
    const mint = useWriteContract()
    const mintConfig = useContractConfig(EContracts.mint)

    const { isSuccess: isTxConfirmed, isLoading: isConfirming } =
        useWaitForTransactionReceipt({
            hash: mint.data,
            confirmations: 10,
        });

    useEffect(() => {
        if (isTxConfirmed) {
            option.callback();
        }
    }, [isTxConfirmed]);

    return {
        ...mint,
        write: () => {
            mint.writeContractAsync({
                ...mintConfig,
                functionName: 'mint',
                args: [option.encodedData]
            })
        }
    }


}