import RenderTransformations from "@/components/others/RenderTransformations";
import TagButton from "@/components/ui/TagButton";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HistoryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [token, setToken] = useState<string | null>(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const spinStyles = {
    transform: [{ rotate: spin }],
  };

  const spinAnimation = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    })
  );

  const { getToken } = useAuth();
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsIsError,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/user/tags", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  const {
    data: searchedData,
    isLoading: searchedDataLoading,
    isError: searchedDataIsError,
    error: searchedDataError,
    fetchNextPage: searchedDataFetchNextPage,
    hasNextPage: searchedDataHasNextPage,
    isFetchingNextPage: searchedDataIsFetchingNextPage,
    isRefetching: searchedDataIsRefetching,
    refetch: searchedDataRefetch,
  } = useInfiniteQuery({
    queryKey: ["transformations", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `/user/transformations/search/for?keyword=${searchQuery}&page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    enabled: searchQuery.length > 0,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
    isLoading,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["transformations", selectedTag],
    queryFn: async ({ pageParam = 1 }) => {
      const t = await getToken();
      const response = await axios.get(
        `/user/transformations/${selectedTag
          .toUpperCase()
          .trim()}?page=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    enabled: true,
  });

  const realod = () => {
    refetch();
    searchedDataRefetch();
  };
  useEffect(() => {
    if (!isRefetching && !searchedDataIsRefetching) {
      spinAnimation.reset();
    }
  }, [isRefetching, searchedDataIsRefetching]);

  useEffect(() => {
    refetch();
  }, [selectedTag, refetch]);
  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.transformations) ?? [],
    [data]
  );
  return (
    <SafeAreaView className="flex-1  bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View className="flex-row items-center justify-between p-6 bg-white">
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-PoppinsSemi text-text-primary">
          History
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            realod();
            spinAnimation.start();
          }}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          <Animated.View style={spinStyles}>
            <MaterialCommunityIcons name="reload" size={22} color="#374151" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View className="mx-6 mb-6">
        <View className="bg-background-secondary rounded-2xl p-4 border border-border-light">
          <View className="flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 text-base mt-1  font-Poppins text-text-primary ml-3"
              placeholder="Search transformations..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={(e) => setSearchQuery(e)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Tag Section */}
      <View className="mb-6">
        <Text className="text-lg font-PoppinsSemi text-text-primary mb-4 mx-6">
          Tag by Style
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          <ScrollView
            horizontal
            className="flex-row gap-2"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {tagsLoading ? (
              <View className="flex-row gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <View
                    key={index}
                    className="h-12 mb-3 w-20 bg-gray-200 rounded-2xl"
                  />
                ))}
              </View>
            ) : tagsIsError ? (
              <Text className="text-red-500 font-Poppins">
                {tagsError?.message}
              </Text>
            ) : (
              <>
                {["ALL", ...tags?.default_tags].map(
                  (tag: string, index: number) => (
                    <TagButton
                      key={tag + index}
                      tag={tag}
                      size="small"
                      isSelected={selectedTag === tag}
                      onPress={() => setSelectedTag(tag)}
                    />
                  )
                )}
                {tags?.custom_tags.map(
                  (
                    tag: {
                      name: string;
                      prompt: string;
                    },
                    index: number
                  ) => (
                    <TagButton
                      key={tag.name + index}
                      tag={tag.name}
                      size="small"
                      isSelected={selectedTag === tag.name}
                      onPress={() => setSelectedTag(tag.name)}
                    />
                  )
                )}
              </>
            )}
          </ScrollView>
        </ScrollView>
      </View>
      {/* Results Count */}
      <View className="mx-6 mb-4">
        <Text className="text-sm font-Poppins text-text-tertiary">
          {searchQuery
            ? searchedData?.pages[0].totalTransformations
            : data?.pages[0].foundTransformations}{" "}
          {searchQuery ? "found" : "total"}
        </Text>
      </View>
      {searchQuery ? (
        <RenderTransformations
          isLoading={searchedDataLoading}
          isFetchingNextPage={searchedDataIsFetchingNextPage}
          allItems={
            searchedData?.pages.flatMap((page) => page.transformations) ?? []
          }
          hasNextPage={searchedDataHasNextPage}
          fetchNextPage={searchedDataFetchNextPage}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          isRefetching={searchedDataIsRefetching}
        />
      ) : (
        <RenderTransformations
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          allItems={allItems}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          selectedTag={selectedTag}
          isRefetching={isRefetching}
        />
      )}
    </SafeAreaView>
  );
};
export default HistoryScreen;
