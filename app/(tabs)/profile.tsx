import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { getToken } = useAuth();
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: true,
  });


  const stats = {
    savedItems: 34,
    daysActive: 45,
    accuracy: 89,
  };

  const menuItems = [
    {
      icon: <MaterialCommunityIcons name="history" size={22} color="black" />,
      title: "History",
      screen: "history",
      count: stats.savedItems,
    },
    {
      icon: <Ionicons name="settings-outline" size={22} color="#000000" />,
      title: "Settings",
      screen: "settings",
    },
    {
      icon: <Ionicons name="help-circle-outline" size={22} color="#000000" />,
      title: "Help & Support",
      screen: "support",
    },
    {
      icon: <AntDesign name="key" size={20} color="black" />,
      title: "API Keys",
      screen: "api-keys",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">Profile</Text>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Profile Card - Rounded Design */}
        <View className="px-4 mb-6">
          <View className="bg-gray-50 rounded-3xl p-6">
            <View className="items-center mb-4">
              {/* Profile Image */}
              <View className="w-24 h-24 rounded-full bg-black mb-4">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <View className="w-full h-full rounded-full bg-gray-200 items-center justify-center">
                    <Text className="text-3xl font-bold text-black">
                      {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Name and Basic Info */}
              <Text className="text-2xl font-bold text-black mb-1">
                {user?.firstName} {user?.lastName}
              </Text>

              {isLoading && !isError ? (
                <Text>loading...</Text>
              ) : (
                <Text className="text-sm text-gray-600 mb-2">
                  @{userData?.user?.fullName?.toLowerCase().split(" ").join("")}
                </Text>
              )}

              <Text className="text-xs text-gray-500">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-around py-4 border-t border-gray-200">
              <View className="items-center">
                {isLoading && !isError ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text className="text-xl font-bold text-black">
                    {userData?.totalTransformations}
                  </Text>
                )}
                <Text className="text-xs text-gray-500">Transformations</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                {isLoading && !isError ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text className="text-xl font-bold text-black">
                    {Number(userData?.totalTransformations) * 63}
                  </Text>
                )}
                <Text className="text-xs text-gray-500">Score</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                {isLoading && !isError ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text className="text-xl font-bold text-black">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(userData?.user.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </Text>
                )}
                <Text className="text-xs text-gray-500">Days Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* User Details Section - Rounded Cards */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-gray-600 uppercase mb-3 px-2">
            Account Details
          </Text>

          <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Email Address</Text>
              <Text className="text-sm font-medium text-black">
                {user?.primaryEmailAddress?.emailAddress || "No email provided"}
              </Text>
            </View>

            <View className="p-4 border-b border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">User ID</Text>
              <Text className="text-sm font-mono text-black">
                {user?.id?.substring(0, 8)}...
                {user?.id?.substring(user.id.length - 4)}
              </Text>
            </View>

            <View className="p-4 border-b border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Account Status</Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-black rounded-full mr-2" />
                <Text className="text-sm font-medium text-black">
                  {userData?.user?.clerkId === user?.id
                    ? "Active "
                    : "Inactive"}
                </Text>
              </View>
            </View>

            <View className="p-4">
              <Text className="text-xs text-gray-500 mb-1">Last Updated</Text>
              <Text className="text-sm font-medium text-black">
                {new Date(userData?.user?.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Activity Section - Rounded Cards */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-gray-600 uppercase mb-3 px-2">
            Activity
          </Text>

          <View className=" flex  gap-3 ">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.screen as any)}
                className="flex-row items-center bg-white border border-gray-200 p-4 rounded-2xl active:bg-gray-50"
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-black">
                    {item.title}
                  </Text>
                  {item.count && (
                    <Text className="text-xs text-gray-500">
                      {item.count}{" "}
                      {item.title === "Activity" ? "transformations" : "items"}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out Section */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            onPress={() => signOut()}
            className="flex-row items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-200 active:bg-gray-100"
          >
            <Ionicons name="log-out-outline" size={20} color="#000000" />
            <Text className="text-base font-medium text-black ml-2">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-4 pb-6">
          <Text className="text-center text-xs text-gray-400">
            CookedGPT v1.0.0 • Built with ❤️
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
