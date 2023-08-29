import "@ethersproject/shims";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as Linking from "expo-linking";
import { HomeScreen } from "./screens/HomeScreen";
import { MagicAccountCreation } from "./screens/MagicAccountCreation";
// import { JWTAccountCreation } from "./screens/JWTAccountCreation";
import { magic } from "./utils/magicInstance";

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: "",
  },
};

const linking = {
  prefixes: [Linking.createURL("exp://")],
  config,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <magic.Relayer />
      <NavigationContainer
        linking={linking}
        fallback={
          <View>
            <Text>Loading...</Text>
          </View>
        }
      >
        <Stack.Navigator initialRouteName=" ">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Welcome" }}
          />
          <Stack.Screen
            name="MagicAccountCreation"
            component={MagicAccountCreation}
          />
          {/* <Stack.Screen
            name="JWTAccountCreation"
            component={JWTAccountCreation}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
