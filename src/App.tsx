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
          <div>Gator NFT</div>
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
          {isDelegatedToGuestAccount && (
            <button
              onClick={async () => {
                await createInjectedAccount();
              }}
            >
              Save to Metamask
            </button>
          )}
          {injectedAccount && (
            <button
              onClick={async () => {
                await redeemDelegation(injectedAccount, lineaSepolia);
              }}
            >
              Mint NFT
            </button>
          )}
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
