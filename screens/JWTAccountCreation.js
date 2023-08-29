import { View, Button, ActivityIndicator, Text } from "react-native";
import { useState, useEffect, useMemo} from "react";
import {
  ECDSAProvider,
  getRPCProviderOwner,
  getZeroDevSigner,
} from "@zerodev/sdk";
import * as Linking from "expo-linking";

import {
  ZERO_DEV_PROJECT_ID,
  ERC721_CONTRACT_ADDRESS,
  POLYGON_RPC_URL,
  ERC721_CONTRACT_ABI,
  INFURA_API_KEY,
} from "../utils/config";

import { styles } from "../utils/style";
import { WagmiConfig, configureChains, createClient, createConfig } from "wagmi";
import "@ethersproject/shims";
import { Contract, Wallet } from "ethers";
const {
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
} = require("viem");
import { infuraProvider } from 'wagmi/providers/infura'
import { ZeroDevWeb3Auth } from '@zerodev/web3auth'
const { polygon } = require("viem/chains");

function RpcProviderExample() {
  const [jwt, setJWT] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = '1234'

  resetJWT = () => {
      fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
          response.text().then(setJWT)
      })
  }

  useEffect(() => {
      // THIS IS DEMO CODE TO CREATE A JWT, YOU WOULD HAVE YOUR OWN WAY TO GET YOUR JWT
      resetJWT()
  }, [])

  const setWallet = async (provider) => {
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: defaultProjectId,
        owner: getRPCProviderOwner(provider),
      });
      setAddress(await ecdsaProvider.getAddress())
  }

  const zeroDevWeb3Auth = useMemo(() => {
      const instance = new ZeroDevWeb3Auth([defaultProjectId])
      instance.init({onConnect: async () => {
          setLoading(true)
          setWallet(zeroDevWeb3Auth.provider)
          setLoading(false)
      }})
      return instance
  }, [])

const disconnect = async () => {
  await zeroDevWeb3Auth.logout()
  setAddress('')
  resetJWT()
}

const handleClick = async () => {
  setLoading(true)
  zeroDevWeb3Auth.connect('jwt', {jwt}).then(provider => {
    setWallet(provider)
  }).finally(() => {
    setLoading(false)
  })
}

const connected = !!address
return (
  <div>
    {connected && 
      <div>
        <label>Wallet: {address}</label>
      </div>
    }
    <div>
      {!connected && <button onClick={handleClick} disabled={loading || !jwt}>{ loading ? 'loading...' : 'Create Wallet with JWT'}</button>}
      {connected && 
        <button onClick={disconnect} disabled={loading}>Disconnect</button>
      }
    </div>
  </div>
)
}

export const JWTAccountCreation = () => {
  const [loadingMessage, setLoadingMessage] = useState("");
  const [nftBalance, setNftBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  return (
    <View style={styles.container}>
      <Text>Address: {address.slice(0, 4) + "..." + address.slice(-4)}</Text>
      <Text>NFT Balance: {nftBalance}</Text>
      <View style={{ height: 20 }} />

      <Text>{loadingMessage}</Text>
      <View style={{ height: 20 }} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={{ height: 20 }} />

      
    <RpcProviderExample />
    </View>
  );
};
