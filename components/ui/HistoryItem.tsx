import { formatTimestamp } from "@/features/utils";
import { HistoryItemProps } from "@/interfaces/history";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
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
            {formatTimestamp(item.createdAt)} • {item.modelName}
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
            {item.input}
          </Text>
          <Text className="text-xs text-text-tertiary">
            {item.input.length} characters
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
            {item.content}
          </Text>
          <View className="flex-row items-center justify-between pt-3 border-t border-border-darkest">
            <View className="flex-row items-center">
              <View className="px-3 py-1 rounded-full bg-border-darkest mr-3">
                <Text className="text-border-dark text-xs font-medium">
                  {item.tags?.[0] || "General"}
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

export default HistoryItem;
