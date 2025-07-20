import { Transformation } from "@/interfaces/Transformation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  transformation: Transformation | null;
  isPending?: boolean;
};

const OutputCard = ({ transformation, isPending }: Props) => {
  const isEmpty = !transformation?.content?.trim();

  if (isEmpty || !transformation) {
    return (
      <View className="bg-gray-900 border border-gray-800 rounded-xl p-8 items-center justify-center min-h-[120px]">
        <View className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center mb-3">
          <Ionicons name="document-text-outline" size={24} color="#6b7280" />
        </View>
        <Text className="text-gray-400 text-sm text-center">
          Your transformed text will appear here
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-900 border border-gray-800 rounded-xl p-4 relative">
      {/* Info Icon */}
      <TouchableOpacity className="absolute top-3 right-3 w-6 h-6 items-center justify-center z-10">
        <MaterialIcons name="info-outline" size={18} color="#6b7280" />
      </TouchableOpacity>

      {/* Content */}
      <View className="pr-8 mb-4">
        <Text className="text-white text-base leading-6">
          {transformation.content}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-800">
        <Text className="text-gray-400 text-xs flex-1 mr-4" numberOfLines={1}>
          {transformation.tags[0]} • {transformation.modelName}
        </Text>

        <TouchableOpacity
          className="flex-row items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-800 active:bg-gray-700"
          activeOpacity={0.8}
        >
          <Ionicons name="copy-outline" size={14} color="#e5e7eb" />
          <Text className="text-gray-200 text-xs font-medium">Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutputCard;
