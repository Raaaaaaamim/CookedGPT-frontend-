import RenderTransformations from "@/components/layout/RenderTransformations";
import FilterButton from "@/components/ui/FillterButton";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
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
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filters = ["All", "Pro", "Savage", "Gen Z", "Insult"];

  const { getToken } = useAuth();

  const {
    data: searchedData,
    isLoading: searchedDataLoading,
    isError: searchedDataIsError,
    error: searchedDataError,
    fetchNextPage: searchedDataFetchNextPage,
    hasNextPage: searchedDataHasNextPage,
    isFetchingNextPage: searchedDataIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transformations", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
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
  console.log(searchedData, "searchedData");
  console.log(JSON.stringify(searchedDataError, null, 2));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["transformations", selectedFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      const response = await axios.get(
        `/user/transformations/${selectedFilter
          .toUpperCase()
          .trim()}?page=${pageParam}`,
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
    enabled: true,
  });

  // console.log(JSON.stringify(data, null, 2));
  // console.log(JSON.stringify(error, null, 2));

  useEffect(() => {
    refetch();
  }, [selectedFilter, refetch]);

  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.transformations) ?? [],
    [data]
  );

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between p-6 bg-background-DEFAULT">
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-primary">History</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          <Ionicons name="trash-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mx-6 mb-6">
        <View className="bg-background-secondary rounded-2xl p-4 border border-border-light">
          <View className="flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 text-base text-text-primary ml-3"
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

      {/* Filter Section */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-text-primary mb-4 mx-6">
          Filter by Style
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              filter={filter}
              isSelected={selectedFilter === filter}
              onPress={setSelectedFilter}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="mx-6 mb-4">
        <Text className="text-sm text-text-tertiary">66 found</Text>
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
        />
      ) : (
        <RenderTransformations
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          allItems={allItems}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          selectedFilter={selectedFilter}
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;
