import { DelegationStruct } from "@metamask-private/delegator-core-viem";
import { Address } from "viem";

export const getDelegation = async (
  address: Address
): Promise<DelegationStruct> => {
  const delegationJson = localStorage.getItem(address);
  if (delegationJson) {
    return JSON.parse(delegationJson);
  }

  throw new Error("Delegation not found");
};

export const storeDelegation = async (delegation: DelegationStruct) => {
  const json = JSON.stringify(delegation, (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });

  console.log("Delegation Json", json);

  localStorage.setItem(delegation.delegate, json);
};
