import { OAuthExtension } from "@magic-ext/react-native-expo-oauth";
import { Magic } from "@magic-sdk/react-native-expo";
import { MAGIC_API_KEY, POLYGON_RPC_URL } from "./config";

const customNodeOptions = {
  rpcUrl: POLYGON_RPC_URL,
  chainId: 137,
};
export const magic = new Magic(MAGIC_API_KEY, {
  network: customNodeOptions,
  extensions: [new OAuthExtension()],
});
