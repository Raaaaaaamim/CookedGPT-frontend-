import { toastConfig } from "@/components/ui/ToastConfig";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { RecoilRoot } from "recoil";
import "../global.css"; // Import global CSS for NativeWind
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ClerkProvider tokenCache={tokenCache}>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" />

              <Stack.Screen name="(auth)/auth" />
            </Stack>
          </SafeAreaProvider>
        </ClerkProvider>
      </RecoilRoot>
      <Toast config={toastConfig} topOffset={50} />
    </QueryClientProvider>
  );
}
