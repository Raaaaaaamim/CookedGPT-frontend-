import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const ExpandableSection: React.FC<{
  label: string;
  content: string;
  characterCount: number;
  isOutput?: boolean;
}> = ({ label, content, characterCount, isOutput = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = isOutput ? 200 : 150;
  const isLongText = characterCount > characterLimit;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: "success",
      text1: "Copied to clipboard",
    });
  };

  const textColor = isOutput ? "text-text-white" : "text-text-primary";
  const headerColor = isOutput ? "text-border-dark" : "text-text-tertiary";

  return (
    <View
      className={`rounded-2xl p-4 ${
        isOutput ? "bg-primary-dark" : "border-[1px]"
      }`}
      style={{ borderColor: isOutput ? undefined : "#e5e7eb" }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-xs font-bold uppercase tracking-wider ${headerColor}`}
        >
          {label}
        </Text>
        <TouchableOpacity onPress={copyToClipboard} activeOpacity={0.7}>
          <Ionicons name="copy-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
      <Text
        className={`text-sm leading-5 mb-2 ${textColor}`}
        numberOfLines={
          isLongText && !isExpanded ? (isOutput ? 4 : 3) : undefined
        }
      >
        {content}
      </Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text className={`text-xs ${headerColor}`}>
          {characterCount} characters
        </Text>
        {isLongText && (
          <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
            <Text
              className={`text-xs font-semibold ${
                isOutput ? "text-border-dark" : "text-text-primary"
              }`}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default ExpandableSection;
