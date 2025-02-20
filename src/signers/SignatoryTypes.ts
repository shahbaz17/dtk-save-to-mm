import { HybridSignatoryConfig } from "@metamask-private/delegator-core-viem";
import { Address, Chain } from "viem";
import { WEB3AUTH_NETWORK_TYPE } from "@web3auth/base";

export enum SignatoryType {
  INJECTED = "injected",
  GUEST = "guest",
  DAPP_OWNER = "dapp_owner",
  EMBEDDED_WALLET = "embedded_wallet",
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
  web3AuthClientId?: string;
  web3AuthNetwork?: WEB3AUTH_NETWORK_TYPE;
  chain: Chain;
  rpcUrl?: string;
};

export type SignatoryFactoryConfigurator = (
  config: SignatoryFactoryConfig
) => SignatoryFactory;
