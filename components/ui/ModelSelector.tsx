import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ModelSelectorProps } from "../../interfaces/Model";

const ModelSelector: FC<ModelSelectorProps> = ({
  model,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    onPress={() => onPress(model)}
    className={`p-4 rounded-xl mb-3 border ${
      isSelected
        ? "border-primary-dark bg-background-secondary"
        : "border-border-light bg-background-DEFAULT"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text
          className={`font-bold text-base mb-1 ${
            isSelected ? "text-text-primary" : "text-text-primary"
          }`}
        >
          {model.name}
        </Text>
        <View className="flex-row gap-2 items-center space-x-4">
          <Text className="text-xs text-text-tertiary">
            Speed: {model.speed}
          </Text>
          <Text className="text-text-tertiary">•</Text>
          <Text className="text-xs text-text-tertiary">
            Accuracy: {model.accuracy}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
export default ModelSelector;
