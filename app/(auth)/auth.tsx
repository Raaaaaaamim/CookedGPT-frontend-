import { useSSO } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const SignInScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [fontsLoaded, fontError] = useFonts({
    Popins_Regular: require("../../assets/fonts/Poppins-Regular.ttf"),
  });
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = async () => {
    console.log("handleGoogleSignIn");
    try {
      const { setActive, createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-1 justify-between px-8 py-12">
        {/* Top Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
          className="flex-1 justify-center items-center"
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View
              className=" mb-3
             flex-row gap-1 justify-center items-center "
            >
              <Image
                className="w-10 h-16 "
                source={require("../../assets/images/cookedgpt.png")}
              />
              <Text
                style={{ fontFamily: "Popins_Regular" }}
                className="text-text-secondary  text-xl font-bold  "
              >
                CookedGPT
              </Text>
            </View>

            <Text className="text-base text-text-secondary text-center px-4 leading-6">
              Your AI cooking companion for delicious recipes and culinary
              inspiration
            </Text>
          </View>

          {/* Hero Image with subtle shadow */}
          <View className="items-center mb-6">
            <View className="shadow-lg">
              <Image
                source={require("../../assets/images/login.png")}
                className="w-96 h-96 rounded-3xl"
                resizeMode="cover"
              />
            </View>
          </View>

          <View
            className=" flex
           flex-col justify-center gap-2 text-start items-start "
          >
            <View className="flex flex-row justify-center items-center gap-3">
              <AntDesign name="checkcircle" size={24} color="#0f172b" />

              <Text className="text-text-secondary text-[1.1rem] ">
                Already have an account?
              </Text>
            </View>
            <View className="flex flex-row justify-center items-center gap-3">
              <AntDesign name="checkcircle" size={24} color="#0f172b" />

              <Text className="text-text-secondary text-[1.1rem] ">
                Best GenZ Transformations
              </Text>
            </View>
            <View className="flex flex-row justify-center items-center gap-3">
              <AntDesign name="checkcircle" size={24} color="#0f172b" />

              <Text className="text-text-secondary text-[1.1rem] ">
                Translate GenZ slangs and more
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Section - Sign In */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="pb-4"
        >
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="bg-primary-dark  flex-row rounded-2xl py-4 px-6  items-center justify-center mb-4 shadow-sm"
            activeOpacity={0.9}
          >
            {/* Enhanced Google Icon */}
            <View className="w-6 h-6 bg-background-DEFAULT rounded-full mr-3 items-center justify-center shadow-sm">
              <Image
                className=" w-6 h-6 "
                source={require("../../assets/images/google-icon.png")}
              />
            </View>
            <Text className="text-base font-semibold text-text-white">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Alternative sign in hint */}
          <Text className="text-xs text-text-tertiary text-center mb-4">
            Quick and secure sign-in with your Google account
          </Text>

          {/* Terms */}
          <Text className="text-xs text-text-tertiary text-center leading-4 px-6">
            By continuing, you agree to our
            <Text className="text-text-secondary underline">
              Terms of Service
            </Text>
            and
            <Text className="text-text-secondary underline">
              Privacy Policy
            </Text>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
