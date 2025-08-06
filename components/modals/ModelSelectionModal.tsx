import { Model } from "@/interfaces/Model";
import React, { FC } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  models: Model[] | undefined;
  onSelectModel: (model: Model) => void;
  loadMore: () => void;
  hasMore: boolean;
}
const ModelSelectionModal: FC<Props> = ({
  isVisible,
  onClose,
  models,
  onSelectModel,
  loadMore,
  hasMore,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white p-5 rounded-t-2xl h-[60%]">
          <Text className="text-lg font-bold mb-4">Select a Model</Text>
          <View className="flex-1">
            <FlatList
              data={models}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => onSelectModel(item)}
                    className="p-4 border-b border-gray-200"
                  >
                    <Text className="text-base">{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity onPress={loadMore} className="p-4 items-center">
              <Text className="text-primary-dark">Load More</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 p-4 items-center bg-gray-100 rounded-lg"
          >
            <Text className="text-red-500">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModelSelectionModal;
