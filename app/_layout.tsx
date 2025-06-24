import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css"; // Import global CSS for NativeWind

export default function RootLayout() {
  const [loaded] = useFonts({
    Popins_Regular: require("../assets/fonts/Poppins-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />

          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
