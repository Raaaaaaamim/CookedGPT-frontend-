import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HistoryItem {
  id: string;
  inputText: string;
  outputText: string;
  transformationType: string;
  modelName: string;
  timestamp: Date;
  characterCount: number;
}

const HistoryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Mock history data
  const mockHistory: HistoryItem[] = [
    {
      id: "1",
      inputText:
        "I think your idea is completely wrong and makes no sense whatsoever. This approach will never work in practice.",
      outputText:
        "I respectfully disagree with your assessment and would appreciate the opportunity to discuss alternative perspectives that might address the underlying concerns you've raised.",
      transformationType: "Pro",
      modelName: "GPT-4",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      characterCount: 156,
    },
    {
      id: "2",
      inputText:
        "This presentation was boring and poorly structured. Nobody understood what you were trying to say.",
      outputText:
        "Bruh that presentation was straight cap, no cap. This ain't it chief, periodt. Y'all need to step up your game frfr.",
      transformationType: "Gen Z",
      modelName: "Claude-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      characterCount: 118,
    },
    {
      id: "3",
      inputText:
        "I don't think this approach will work for our project timeline and budget constraints.",
      outputText:
        "That's completely ridiculous and you know it. Come back when you have something worth discussing instead of wasting everyone's time.",
      transformationType: "Savage",
      modelName: "GPT-4",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      characterCount: 98,
    },
    {
      id: "4",
      inputText:
        "Your suggestion lacks practical implementation details and feasibility analysis.",
      outputText:
        "Your suggestion has the intellectual depth of a puddle and the practical value of a chocolate teapot in a desert storm.",
      transformationType: "Insult",
      modelName: "Gemini Pro",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      characterCount: 87,
    },
    {
      id: "5",
      inputText:
        "The meeting could have been more productive if we had better preparation.",
      outputText:
        "I believe we could enhance our meeting effectiveness through improved preparation and structured agenda planning for future discussions.",
      transformationType: "Pro",
      modelName: "Claude-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      characterCount: 85,
    },
  ];

  const filters = ["All", "Pro", "Savage", "Gen Z", "Insult"];

  useEffect(() => {
    setHistoryItems(mockHistory);
    setFilteredItems(mockHistory);
  }, []);

  useEffect(() => {
    let filtered = historyItems;

    if (selectedFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.transformationType === selectedFilter
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.inputText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.outputText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.transformationType
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.modelName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, historyItems, selectedFilter]);

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  interface FilterButtonProps {
    filter: string;
    isSelected: boolean;
    onPress: (filter: string) => void;
  }

  const FilterButton: React.FC<FilterButtonProps> = ({
    filter,
    isSelected,
    onPress,
  }) => (
    <TouchableOpacity
      onPress={() => onPress(filter)}
      activeOpacity={0.8}
      className={`px-4 py-2 mr-3 rounded-2xl border-2 ${
        isSelected
          ? "border-primary-dark bg-primary-dark"
          : "border-border-light bg-background-DEFAULT"
      }`}
      style={{
        shadowColor: isSelected ? "#000" : "transparent",
        shadowOffset: { width: 0, height: isSelected ? 4 : 0 },
        shadowOpacity: isSelected ? 0.1 : 0,
        shadowRadius: isSelected ? 8 : 0,
        elevation: isSelected ? 2 : 0,
      }}
    >
      <Text
        className={`font-bold text-sm ${
          isSelected ? "text-text-white" : "text-text-secondary"
        }`}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  interface HistoryItemProps {
    item: HistoryItem;
    index: number;
  }

  const HistoryItemComponent: React.FC<HistoryItemProps> = ({
    item,
    index,
  }) => {
    return (
      <View className="mb-6">
        <TouchableOpacity
          activeOpacity={0.95}
          className="bg-background-secondary rounded-2xl p-6 border border-border-light"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* Header with timestamp and model */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xs text-text-tertiary">
              {formatTimestamp(item.timestamp)} • {item.modelName}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-text-tertiary mb-2 uppercase tracking-wider">
              Input
            </Text>
            <Text className="text-sm text-text-primary leading-5 mb-2">
              {item.inputText}
            </Text>
            <Text className="text-xs text-text-tertiary">
              {item.characterCount} characters
            </Text>
          </View>

          {/* Arrow indicator */}
          <View className="items-center mb-4">
            <View className="w-8 h-8 rounded-full bg-primary-dark items-center justify-center">
              <Ionicons name="arrow-down" size={16} color="white" />
            </View>
          </View>

          {/* Output Section */}
          <View className="bg-primary-dark rounded-2xl p-4 mb-4">
            <Text className="text-xs font-bold text-border-dark mb-2 uppercase tracking-wider">
              Output
            </Text>
            <Text className="text-text-white text-sm leading-5 mb-3">
              {item.outputText}
            </Text>
            <View className="flex-row items-center justify-between pt-3 border-t border-border-darkest">
              <View className="flex-row items-center">
                <View className="px-3 py-1 rounded-full bg-border-darkest mr-3">
                  <Text className="text-border-dark text-xs font-medium">
                    {item.transformationType}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <Ionicons name="copy-outline" size={14} color="#9ca3af" />
                <Text className="text-border-dark text-xs ml-1">Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 mr-2 py-3 rounded-xl bg-background-DEFAULT border border-border-light items-center"
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh-outline" size={16} color="#374151" />
                <Text className="text-text-secondary text-sm font-medium ml-2">
                  Reuse
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 ml-2 py-3 rounded-xl bg-background-DEFAULT border border-border-light items-center"
            >
              <View className="flex-row items-center">
                <Ionicons name="share-outline" size={16} color="#374151" />
                <Text className="text-text-secondary text-sm font-medium ml-2">
                  Share
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
              onChangeText={setSearchQuery}
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
        <Text className="text-sm text-text-tertiary">
          {filteredItems.length} transformation
          {filteredItems.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {/* History List */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <HistoryItemComponent key={item.id} item={item} index={index} />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-background-secondary items-center justify-center mb-4">
              <Ionicons
                name="document-text-outline"
                size={32}
                color="#9ca3af"
              />
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
        )}

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
