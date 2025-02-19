import {
  Implementation,
  MetaMaskSmartAccount,
} from "@metamask-private/delegator-core-viem";
import { lineaSepolia } from "viem/chains";
import { bundlerClient, paymasterClient, publicClient } from "./utils";

export const deploySmartAccount = async (
  smartAccount: MetaMaskSmartAccount<Implementation>
) => {
  const bundler = bundlerClient(lineaSepolia);
  const client = publicClient(lineaSepolia);

  const fee = await client.estimateFeesPerGas();

  const userOperationHash = await bundler.sendUserOperation({
    account: smartAccount,
    paymaster: paymasterClient(),
    ...fee,
    calls: [
      {
        to: smartAccount.address,
        data: "0x",
        value: BigInt(0),
      },
    ],
  });

  const receipt = await bundler.waitForUserOperationReceipt({
    hash: userOperationHash,
  });

  return receipt;
};
