import { Text, View, Button } from "react-native";

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Magic Account Creation"
        onPress={() => navigation.navigate("MagicAccountCreation")}
      />
      {/* <Button title="JWT Account Creation" onPress={() => navigation.navigate("JWTAccountCreation")} /> */}
    </View>
  );
};
