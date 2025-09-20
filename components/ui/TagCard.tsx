import { Feather } from "@expo/vector-icons";
import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface CustomTag {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

interface TagCardProps {
  tag: CustomTag;
  onEdit: (tag: CustomTag) => void;
  onDelete: (tag: CustomTag) => void;
}

const TagCard: FC<TagCardProps> = ({ tag, onEdit, onDelete }) => {
  return (
    <View className="bg-white rounded-2xl mb-4 border border-gray-200 shadow-sm">
      {/* Section 1: Tag name and action buttons */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-lg font-PoppinsSemi text-gray-900 flex-1">
          {tag.name}
        </Text>

        {/* Action buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onEdit(tag)}
            className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={16} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(tag)}
            className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-200" />

      <View className="px-5 py-4">
        <Text className="text-sm  text-gray-600 leading-5">{tag.prompt}</Text>
      </View>

      <View className="px-5 py-3">
        <Text className="text-xs text-gray-400 font-medium">
          {tag.updatedAt
            ? `Last updated ${new Date(tag.updatedAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}`
            : "(not provided)"}
        </Text>
      </View>
    </View>
  );
};

export default TagCard;
