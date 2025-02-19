import {
  DelegationStorageClient,
  DelegationStorageEnvironment,
  DelegationStoreFilter,
  DelegationStruct,
} from "@metamask-private/delegator-core-viem";
import { Address } from "viem";

export const delegationStorageClient = () => {
  const api = import.meta.env.VITE_API_KEY;
  const apiKeyId = import.meta.env.VITE_API_KEY_ID;
  console.log(api, apiKeyId);

  return new DelegationStorageClient({
    apiKey: api,
    apiKeyId: apiKeyId,
    environment: DelegationStorageEnvironment.dev,
  });
};

export const getDelegation = async (
  address: Address
): Promise<DelegationStruct> => {
  const delegations = await delegationStorageClient().fetchDelegations(
    address,
    DelegationStoreFilter.Received
  );

  return delegations[0];
};

export const storeDelegation = async (delegation: DelegationStruct) => {
  await delegationStorageClient().storeDelegation(delegation);
};
