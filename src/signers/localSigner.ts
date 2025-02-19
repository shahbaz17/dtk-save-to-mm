import { privateKeyToAccount } from "viem/accounts";
import {
  SignatoryFactoryConfig,
  SignatoryFactoryConfigurator,
  SignatoryType,
} from "./SignatoryTypes";
import { http } from "viem";
import { createWalletClient } from "viem";

export const createLocalSignatoryFactory: SignatoryFactoryConfigurator = (
  config: SignatoryFactoryConfig
) => {
  const { chain } = config;

  return {
    login: async () => {
      const privateKey = import.meta.env.VITE_DAPP_OWNER_PRIVATE_KEY;
      const account = privateKeyToAccount(privateKey);

      const walletClient = createWalletClient({
        account,
        chain,
        transport: http(),
      });

      return {
        signatory: { walletClient },
        owner: account.address,
      };
    },
    canLogout: () => false,
    type: SignatoryType.DAPP_OWNER,
  };
};
