import { Address, encodeFunctionData } from "viem";
import { nftAbi } from "./utils";

export const encodeExecutionData = (to: Address) =>
  encodeFunctionData({
    abi: nftAbi,
    functionName: "safeMint",
    args: [to],
  });
