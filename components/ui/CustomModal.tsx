import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  editingTag?: any;
  tagName: string;
  setTagName: (name: string) => void;
  tagPrompt: string;
  setTagPrompt: (prompt: string) => void;
  handleSaveTag: () => void;
  saveTagMutation: { isPending: boolean };
  isUpdating: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  editingTag,
  tagName,
  setTagName,
  tagPrompt,
  setTagPrompt,
  handleSaveTag,
  saveTagMutation,
  isUpdating,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <SafeAreaView className="flex-1  bg-white">
        <View className="flex-row items-center  justify-between px-6 py-5 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={onClose}
            className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#4b5563" />
          </TouchableOpacity>

          <Text className="  text-xl font-PoppinsBold  text-gray-900">
            {editingTag ? "Edit Tag" : "Create New Tag"}
          </Text>

          <TouchableOpacity
            onPress={handleSaveTag}
            disabled={
              saveTagMutation.isPending || !tagName.trim() || !tagPrompt.trim()
            }
            className={`px-6 py-3 rounded-full ${
              saveTagMutation.isPending || !tagName.trim() || !tagPrompt.trim()
                ? "bg-gray-100"
                : "bg-gray-900"
            }`}
          >
            <Text
              className={`font-PoppinsSemi ${
                saveTagMutation.isPending ||
                !tagName.trim() ||
                !tagPrompt.trim()
                  ? "text-gray-400"
                  : "text-white"
              }`}
            >
              {!editingTag ? (
                <>{saveTagMutation.isPending ? "Saving..." : "Save"}</>
              ) : (
                <>{isUpdating && editingTag ? "Updating..." : "Update"}</>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6 py-8 bg-white"
          showsVerticalScrollIndicator={false}
        >
          {/* Tag Name Section */}
          <View className="mb-8">
            <Text className="  text-lg font-PoppinsBold text-gray-900 mb-4">
              Tag Name
            </Text>
            <View className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <TextInput
                className="text-lg text-gray-900 font-medium"
                placeholder="e.g., Professional, Casual, Creative..."
                placeholderTextColor="#9ca3af"
                value={tagName}
                onChangeText={setTagName}
                maxLength={50}
                autoCapitalize="words"
              />
            </View>
            <View className="flex-row justify-between items-center mt-3">
              <Text className="text-Poppins text-sm text-gray-500">
                {editingTag
                  ? "Rename this tag to update it "
                  : "Choose a name for your tag "}
              </Text>
              <Text className="text-Poppins text-xs text-gray-400 font-medium">
                {tagName.length}/50
              </Text>
            </View>
          </View>

          {/* Instructions Section */}
          <View className="mb-8">
            <Text className="text-Poppins text-lg font-PoppinsBold text-gray-900 mb-4">
              Custom Instructions
            </Text>
            <View className="bg-gray-50 rounded-2xl border border-gray-200 p-5 min-h-40">
              <TextInput
                className="text-base text-gray-900 leading-6"
                placeholder="Describe exactly how you want the AI to transform text. Be specific about tone, style, format, structure, etc..."
                placeholderTextColor="#9ca3af"
                multiline
                value={tagPrompt}
                onChangeText={setTagPrompt}
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>
            <View className="flex-row justify-between items-center mt-3">
              <Text className="text-Poppins text-sm text-gray-500">
                More specific instructions = better results
              </Text>
              <Text className="text-Poppins text-xs text-gray-400 font-medium">
                {tagPrompt.length}/1000
              </Text>
            </View>
          </View>

          {/* Tips Section */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8">
            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-4 mt-1">
                <Text className="text-Poppins text-gray-600  text-lg">💡</Text>
              </View>
              <View className="flex-1">
                <Text className=" font-PoppinsBold text-gray-900  text-lg mb-3">
                  Writing Great Instructions
                </Text>
                <Text className=" text-gray-700 text-sm leading-6 mb-3">
                  Instead of: &quot;Make it professional&quot;
                </Text>
                <Text className="text-Poppins text-gray-700 text-sm leading-6">
                  Try: &quot;Rewrite in formal business language with clear
                  structure, polite tone, and professional vocabulary suitable
                  for corporate emails&quot;
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default CustomModal;
