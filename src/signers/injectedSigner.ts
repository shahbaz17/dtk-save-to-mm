import { createWalletClient, custom, toHex, type Address } from "viem";
import {
  SignatoryFactoryConfig,
  SignatoryType,
  type SignatoryFactoryConfigurator,
} from "./SignatoryTypes";

export const createInjectedProviderSignatoryFactory: SignatoryFactoryConfigurator =
  (config: SignatoryFactoryConfig) => {
    const { chain } = config;

    const provider = (window as any).ethereum;

    if (!provider) {
      throw new Error("No injected provider found");
    }

    const login = async () => {
      const [owner] = (await provider.request({
        method: "eth_requestAccounts",
      })) as Address[];

      const selectedNetwork = await provider.request({ method: "eth_chainId" });
      if (parseInt(selectedNetwork) !== chain.id) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: toHex(chain.id),
            },
          ],
        });
      }

      const walletClient = createWalletClient({
        chain,
        transport: custom(provider),
        account: owner,
      });

      return {
        owner,
        signatory: { walletClient },
      };
    };

    return { login, canLogout: () => false, type: SignatoryType.INJECTED };
  };
