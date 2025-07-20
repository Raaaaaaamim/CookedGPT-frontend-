import { RenderTransformationsProps } from "@/interfaces/layout";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import HistoryItem from "../ui/HistoryItem";

const RenderTransformations = ({
  isLoading,
  isFetchingNextPage,
  allItems,
  hasNextPage,
  fetchNextPage,
  searchQuery,
  selectedFilter,
}: RenderTransformationsProps) => {
  if (isLoading && !isFetchingNextPage) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <FlatList
      data={allItems}
      renderItem={({ item }) => <HistoryItem item={item} />}
      keyExtractor={(item) => item.id}
      className="flex-1 px-6"
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        <View className="h-20 pt-4">
          {isFetchingNextPage && <ActivityIndicator />}
        </View>
      }
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <View className="w-16 h-16 rounded-full bg-background-secondary items-center justify-center mb-4">
            <Ionicons name="document-text-outline" size={32} color="#9ca3af" />
          </View>
          <Text className="text-text-primary text-lg font-bold mb-2 text-center">
            {searchQuery || selectedFilter !== "All"
              ? "No matches found"
              : "No history yet"}
          </Text>
          <Text className="text-text-tertiary text-sm text-center max-w-64">
            {searchQuery || selectedFilter !== "All"
              ? "Try adjusting your search or filter to find what you're looking for"
              : "Start transforming text to see your history appear here"}
          </Text>
        </View>
      }
    />
  );
};
export default RenderTransformations;
