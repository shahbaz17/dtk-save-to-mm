import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { lineaSepolia } from "viem/chains";
import { createLocalSignatoryFactory } from "./signers/localSigner";
import { createSmartAccount } from "./smart-account/smart-account";
import {
  HybridSignatoryConfig,
  Implementation,
  MetaMaskSmartAccount,
  WalletSignatoryConfig,
} from "@metamask-private/delegator-core-viem";
import { createGuestSignatoryFactory } from "./signers/guestSigner";
import { createInjectedProviderSignatoryFactory } from "./signers/injectedSigner";
import { createWeb3AuthSignatoryFactory } from "./signers/web3authSigner";
import {
  delegation,
  redeemDelegation,
  rootDelegation,
} from "./smart-account/delegation";

function App() {
  const [guestAccount, setGuestAccount] =
    useState<HybridSignatoryConfig | null>(null);
  const [injectedAccount, setInjectedAccount] =
    useState<HybridSignatoryConfig | null>(null);
  const [dAppOwnerSmartAccount, setDappOwnerSmartAccount] =
    useState<MetaMaskSmartAccount<Implementation> | null>(null);
  const [isDelegatedToGuestAccount, setIsDelegatedToGuestAccount] =
    useState<boolean>(false);
  const [isDelegatedToExternalAccount, setIsDelegatedToExternalAccount] =
    useState<boolean>(false);

  useEffect(() => {
    const createDappOwner = async () => {
      const dAppOwner = createLocalSignatoryFactory({
        chain: lineaSepolia,
      });
      const smartAccount = await createSmartAccount(dAppOwner, lineaSepolia);
      setDappOwnerSmartAccount(smartAccount);
    };
    createDappOwner();
  }, []);

  const createGuestAccount = async () => {
    const guest = createGuestSignatoryFactory({
      chain: lineaSepolia,
    });
    const { owner, signatory } = await guest.login();
    console.log("Guest Account:", { owner, signatory });
    setGuestAccount(signatory);
  };

  const createInjectedAccount = async () => {
    const injected = createInjectedProviderSignatoryFactory({
      chain: lineaSepolia,
    });
    const { owner, signatory } = await injected.login();
    console.log("Injected Account:", { owner, signatory });
    await delegation(guestAccount!, owner, lineaSepolia);
    setInjectedAccount(signatory);
  };

  const createWeb3AuthAccount = async () => {
    const web3Auth = createWeb3AuthSignatoryFactory({
      chain: lineaSepolia,
      web3AuthClientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: import.meta.env.VITE_WEB3AUTH_NETWORK,
      rpcUrl: import.meta.env.VITE_RPC_URL,
    });
    const { owner, signatory } = await web3Auth.login();
    console.log("Web3Auth Account:", { owner, signatory });
    await delegation(guestAccount!, owner, lineaSepolia);
    setInjectedAccount(signatory);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {!guestAccount ? (
        <div>
          <div>Gator NFT Demo</div>
          <br />
          <button onClick={createGuestAccount}>Create Guest Account</button>
        </div>
      ) : (
        <div className="card">
          {!isDelegatedToGuestAccount && (
            <button
              onClick={async () => {
                await rootDelegation(
                  dAppOwnerSmartAccount!,
                  (guestAccount! as WalletSignatoryConfig).walletClient.account
                    .address
                );
                setIsDelegatedToGuestAccount(true);
              }}
            >
              Delegate to Guest Account
            </button>
          )}
          {isDelegatedToGuestAccount && !isDelegatedToExternalAccount && (
            <button
              onClick={async () => {
                await createInjectedAccount();
                setIsDelegatedToExternalAccount(true);
              }}
            >
              Save to Metamask
            </button>
          )}
          {isDelegatedToGuestAccount && !isDelegatedToExternalAccount && (
            <button
              onClick={async () => {
                await createWeb3AuthAccount();
                setIsDelegatedToExternalAccount(true);
              }}
            >
              Save to Web3Auth
            </button>
          )}
          {injectedAccount && (
            <>
              <button
                onClick={async () => {
                  await redeemDelegation(injectedAccount, lineaSepolia);
                }}
              >
                Mint NFT
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
