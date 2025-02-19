import { randomBytes } from "@noble/hashes/utils";
import { Chain, createPublicClient, http, toHex } from "viem";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";

export const createSalt = () => toHex(randomBytes(8));

export const publicClient = (chain: Chain) => {
  return createPublicClient({
    chain,
    transport: http(),
  });
};

export const bundlerClient = (chain: Chain) => {
  return createBundlerClient({
    chain,
    transport: http(import.meta.env.VITE_BUNDLER_URL),
  });
};

export const paymasterClient = () => {
  return createPaymasterClient({
    transport: http(import.meta.env.VITE_BUNDLER_URL),
  });
};

export const nftAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
