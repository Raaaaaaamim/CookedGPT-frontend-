import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Gemini from "../../assets/images/gemini.svg";
import OpenAI from "../../assets/images/openAI.svg";
import OpenRouter from "../../assets/images/openrouter.svg";
type Props = {
  provider: "OPENROUTER" | "OPENAI" | "GEMINI";
  onPress: (provider: "OPENROUTER" | "OPENAI" | "GEMINI") => void;
  selected: boolean;
};

const SelectProviderButton = ({ provider, onPress, selected }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(provider)}
      className="flex-row h-20 px-2 border-border-light rounded-2xl border-[1px] w-full items-center justify-between"
    >
      <View className="flex-row ml-2 items-center gap-2">
        <View>
          {provider === "OPENAI" && <OpenAI width={28} height={28} />}
          {provider === "GEMINI" && <Gemini width={22} height={22} />}
          {provider === "OPENROUTER" && <OpenRouter width={18} height={18} />}
        </View>
        <Text className="text-text-primary"> {provider}</Text>
      </View>
      {selected ? (
        <TouchableOpacity className=" mr-4 rounded-full bg-background-dark/90 p-2 active:bg-background-dark/70  "></TouchableOpacity>
      ) : (
        <TouchableOpacity className=" mr-4 rounded-full border-[1px] border-border-light  p-2   "></TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default SelectProviderButton;
