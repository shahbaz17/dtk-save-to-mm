import { HybridSignatoryConfig } from "@metamask-private/delegator-core-viem";
import { Address, Chain } from "viem";

export enum SignatoryType {
  INJECTED = "injected",
  GUEST = "guest",
  DAPP_OWNER = "dapp_owner",
}

export type SignatoryLoginFunction = () => Promise<{
  signatory: HybridSignatoryConfig;
  owner: Address;
}>;

export type SignatoryLogoutFunction = () => Promise<void>;

export type SignatoryFactory = {
  login: SignatoryLoginFunction;
  canLogout: () => boolean;
  isDisabled?: boolean;
  logout?: SignatoryLogoutFunction;
  type: SignatoryType;
};

export type SignatoryFactoryConfig = {
  chain: Chain;
};

export type SignatoryFactoryConfigurator = (
  config: SignatoryFactoryConfig
) => SignatoryFactory;
