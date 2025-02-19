import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  SignatoryFactoryConfig,
  SignatoryFactoryConfigurator,
  SignatoryType,
} from "./SignatoryTypes";
import { http } from "viem";
import { createWalletClient } from "viem";

export const createGuestSignatoryFactory: SignatoryFactoryConfigurator = (
  config: SignatoryFactoryConfig
) => {
  const { chain } = config;

  return {
    login: async () => {
      const guest_account = localStorage.getItem("guest_account");
      let account;

      if (!guest_account) {
        const privateKey = generatePrivateKey();
        account = privateKeyToAccount(privateKey);
        localStorage.setItem("guest_account", privateKey);
      } else {
        account = privateKeyToAccount(guest_account as `0x${string}`);
      }

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
    type: SignatoryType.GUEST,
  };
};
