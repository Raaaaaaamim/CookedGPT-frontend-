import SettingsItem from "@/components/ui/SettingsItem";
import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

const SettingsScreen = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
      console.log("Signed out");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <ScrollView className="p-6 ">
        {/* Header */}
        <View className="pt-10 pb-5   w-full justify-center items-center flex  ">
          <Text className="text-3xl font-bold text-text-primary">Settings</Text>
        </View>

        {/* Account Section */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-text-secondary uppercase mb-3 px-2">
            Account
          </Text>
          <SettingsItem
            icon="person-outline"
            label="Profile"
            onPress={() => {}}
          />
          <SettingsItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {}}
          />
        </View>

        {/* App Section */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-text-secondary uppercase mb-3 px-2">
            App
          </Text>
          <SettingsItem
            icon="color-palette-outline"
            label="Appearance"
            onPress={() => {}}
          />
          <SettingsItem
            icon="information-circle-outline"
            label="About"
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            onPress={() => {}}
          />
        </View>

        {/* Sign Out */}
        <View className="mt-6">
          <SettingsItem
            icon="log-out-outline"
            label="Sign Out"
            onPress={handleSignOut}
            isDestructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
