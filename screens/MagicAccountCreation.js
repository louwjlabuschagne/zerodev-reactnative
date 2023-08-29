import { View, Button, ActivityIndicator, Text } from "react-native";
import { useState } from "react";
import {
  ECDSAProvider,
  getRPCProviderOwner,
  getZeroDevSigner,
} from "@zerodev/sdk";
import { magic } from "../utils/magicInstance";
import * as Linking from "expo-linking";

import {
  ZERO_DEV_PROJECT_ID,
  ERC721_CONTRACT_ADDRESS,
  POLYGON_RPC_URL,
  ERC721_CONTRACT_ABI,
} from "../utils/config";

import { styles } from "../utils/style";

const { encodeFunctionData, createPublicClient, http } = require("viem");
const { polygon } = require("viem/chains");

export const MagicAccountCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [nftBalance, setNftBalance] = useState(0);
  const [address, setAddress] = useState("");

  const contractAddress = ERC721_CONTRACT_ADDRESS;
  const contractABI = ERC721_CONTRACT_ABI;

  const getECDSAProvider = async () => {
    setLoadingMessage("Initialising ECDSA Provider");

    setLoadingMessage("Initialising ECDSA Provider");
    console.log("magic.rpcProvider", magic.rpcProvider);
    const ecdsaProvider = await ECDSAProvider.init({
      projectId: ZERO_DEV_PROJECT_ID,
      owner: getRPCProviderOwner(magic.rpcProvider),
      bundlerProvider: "ALCHEMY",
      // The paymaster
      opts: {
        paymasterConfig: {
          paymasterProvider: "ALCHEMY",
          policy: "VERIFYING_PAYMASTER",
        },
      },
    });
    return ecdsaProvider;
  };

  const getPublicClient = async () => {
    setLoadingMessage("Creating Public Client");
    const publicClient = createPublicClient({
      chain: polygon,
      transport: http(POLYGON_RPC_URL),
    });
    setLoadingMessage("Created Public Client");
    return publicClient;
  };

  const getNFTBalance = async (address) => {
    try {
      setLoadingMessage("Getting NFT balance");
      const publicClient = await getPublicClient();

      setLoadingMessage("Getting NFT balance");
      let balanceOf = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "balanceOf",
        args: [address],
      });
      balanceOf = Number(balanceOf.toString());
      setNftBalance(balanceOf);
      setLoadingMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const mintNFT = async () => {
    try {
      setLoadingMessage("Minting NFT");
      const ecdsaProvider = await getECDSAProvider();
      const address = await ecdsaProvider.getAddress();

      const data = encodeFunctionData({
        abi: contractABI,
        args: [address],
        functionName: "mint",
      });

      // const signer = await getZeroDevSigner({
      //   projectId: ZERO_DEV_PROJECT_ID,
      //   owner: magic.wallet.getSigner(),
      //   rpcProvider: magic.rpcProvider,
      // });

      // console.log({ signer });

      console.log({ data });

      setLoadingMessage("Sending user operation");
      const { hash } = await ecdsaProvider.sendUserOperation({
        target: contractAddress,
        data,
        // value: 0,
        // maxFeePerGas: 0x1E449A9400,
      });

      setLoadingMessage("Waiting for transaction to be mined");

      await ecdsaProvider.waitForUserOperationTransaction(hash);

      setLoadingMessage("Transaction mined");

      getNFTBalance(address);
    } catch (err) {
      console.error(err);
    }
  };

  const magicGoogleSignIn = async () => {
    setIsLoading(true);
    const redirectURI = Linking.createURL("exp://");
    try {
      setLoadingMessage("Logging in with Google");
      const result = await magic.oauth.loginWithPopup({
        provider: "google",
        redirectURI: redirectURI,
      });
      setLoadingMessage("Logged in with Google");
      setIsLoading(false);
      setIsAuthorized(true);

      const ecdsaProvider = await getECDSAProvider();

      const address = await ecdsaProvider.getAddress();
      setAddress(address);
      getNFTBalance(address);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Address: {address.slice(0, 4) + "..." + address.slice(-4)}</Text>
      <Text>NFT Balance: {nftBalance}</Text>
      <View style={{ height: 20 }} />

      <Text>{loadingMessage}</Text>
      <View style={{ height: 20 }} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={{ height: 20 }} />

      <Button onPress={() => magicGoogleSignIn()} title="Login" />
      <Button
        disabled={isAuthorized ? false : true}
        onPress={() => mintNFT()}
        title="Mint NFT"
      />
      <Button
        onPress={() => {
          magic.wallet.showUI();
        }}
        title="Show UI"
        disabled={isAuthorized ? false : true}
      />
      <Button
        onPress={() => {
          magic.wallet.showAddress();
        }}
        title="Show Address"
        disabled={isAuthorized ? false : true}
      />
      <Button
        onPress={() => {
          magic.wallet.showBalances();
        }}
        title="Show Balances"
        disabled={isAuthorized ? false : true}
      />
      <Button
        onPress={() => {
          magic.wallet.showNFTs();
        }}
        title="Show NFTs"
        disabled={isAuthorized ? false : true}
      />
      <Button
        onPress={() => {
          magic.wallet.showSendTokensUI();
        }}
        title="Show Send Tokens UI"
        disabled={isAuthorized ? false : true}
      />
    </View>
  );
};
