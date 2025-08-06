import { formatTimestamp } from "@/features/utils";
import { HistoryItemProps } from "@/interfaces/history";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import ExpandableSection from "./ExpandableSection";

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const handleReuse = () => {};
  return (
    <View className="mb-6">
      <View
        className="bg-background-secondary rounded-2xl p-4 border border-border-light"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4 px-2">
          <Text className="text-xs text-text-tertiary">
            {formatTimestamp(item.createdAt)} • {item.modelName}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View className="">
          <ExpandableSection
            label="Input"
            content={item.input}
            characterCount={item.input.length}
          />
        </View>

        {/* Arrow indicator */}
        <View className="items-center my-3">
          <View className="w-8 h-8 rounded-full bg-primary-dark items-center justify-center">
            <Ionicons name="arrow-down" size={16} color="white" />
          </View>
        </View>

        {/* Output Section */}
        <View className="mb-4">
          <ExpandableSection
            label="Output"
            content={item.content}
            characterCount={item.content.length}
            isOutput
          />
        </View>

        {/* Tags and Actions */}
        <View className="px-2">
          <View className="flex-row items-center justify-between pt-3 border-t border-border-light mb-4">
            <View className="flex-row items-center">
              <View className="flex-row gap-1 items-center">
                <View className="px-3 py-1 rounded-full bg-primary-dark mr-3">
                  <Text className="text-text-light text-xs font-medium">
                    {item.tags?.[0] || "General"}
                  </Text>
                </View>
              </View>
              {item.tags?.[1] && (
                <View className="flex-row gap-1 items-center">
                  <View className="px-3 py-1 rounded-full bg-primary-dark mr-3">
                    <Text className="text-text-light text-xs font-medium">
                      {item.tags?.[1] || "General"}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-center gap-2">
              <TouchableOpacity
                onPress={() => handleReuse()}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;
