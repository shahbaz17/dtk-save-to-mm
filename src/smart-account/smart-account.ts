import { Implementation } from "@metamask-private/delegator-core-viem";
import { toMetaMaskSmartAccount } from "@metamask-private/delegator-core-viem";
import { SignatoryFactory } from "../signers/SignatoryTypes";
import { publicClient } from "./utils";
import { Chain } from "viem";

export const createSmartAccount = async (
  signer: SignatoryFactory,
  chain: Chain
) => {
  const { owner, signatory } = await signer.login();
  const client = publicClient(chain);

  const smartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [owner, [], [], []],
    deploySalt: "0x1",
    signatory,
  });
  
  return smartAccount;
};
