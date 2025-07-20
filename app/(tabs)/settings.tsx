import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

// A reusable component for each setting item
const SettingsItem = ({
  icon,
  label,
  onPress,
  isDestructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-background-secondary p-4 rounded-2xl mb-3"
  >
    <Ionicons
      name={icon}
      size={22}
      color={isDestructive ? "#ef4444" : "#6b7280"}
    />
    <Text
      className={`text-base ml-4 font-medium ${
        isDestructive ? "text-red-500" : "text-text-primary"
      }`}
    >
      {label}
    </Text>
    {!isDestructive && (
      <Ionicons
        name="chevron-forward"
        size={22}
        color="#6b7280"
        style={{ marginLeft: "auto" }}
      />
    )}
  </TouchableOpacity>
);

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
      <ScrollView className="p-6 pt-0">
        {/* Header */}
        <View className="pt-6 pb-8">
          <Text className="text-3xl font-bold text-text-primary">Settings</Text>
        </View>

        {/* Account Section */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-text-secondary uppercase mb-3 px-2">
            Account
          </Text>
          <SettingsItem icon="person-outline" label="Profile" onPress={() => {}} />
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
