import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Gemini from "../../assets/images/gemini.svg";
import OpenAI from "../../assets/images/openAI.svg";
import OpenRouter from "../../assets/images/openrouter.svg";
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
      <View className="">
        <Text
          className={`font-bold text-base mb-1 ${
            isSelected ? "text-text-primary" : "text-text-primary"
          }`}
        >
          {model.name}
        </Text>

        {/* Redesigned speed and accuracy section */}
        <View className="flex-row gap-4 mt-2">
          <View className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <Text className="text-xs text-gray-700 font-medium">
              Speed: {model.speed}s
            </Text>
          </View>
          <View className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Text className="text-xs text-slate-700 font-medium">
              Accuracy: {model.accuracy}%
            </Text>
          </View>
        </View>
      </View>
      <View>
        {model.type === "OPENAI" && <OpenAI width={28} height={28} />}
        {model.type === "GEMINI" && <Gemini width={22} height={22} />}
        {model.type === "OPENROUTER" && <OpenRouter width={18} height={18} />}
      </View>
    </View>
  </TouchableOpacity>
);

export default ModelSelector;
