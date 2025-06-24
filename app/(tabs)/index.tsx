import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface TransformationType {
  name: string;
  color: string;
  bgColor: string;
}

interface ModelType {
  name: string;
  speed: string;
  accuracy: string;
}

const TextTransformationScreen: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [selectedTransformation, setSelectedTransformation] =
    useState<string>("Gen Z");
  const [transformedText, setTransformedText] = useState<string>(
    "Yo, frfr, that's cap. No kizzy, it's bussin'."
  );
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("GPT-4");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const transformProgress = useRef(new Animated.Value(0)).current;

  const transformationTypes: TransformationType[] = [
    {
      name: "Pro",
      color: "text-transformation-pro-text",
      bgColor: "bg-transformation-pro-bg",
    },
    {
      name: "Savage",
      color: "text-transformation-savage-text",
      bgColor: "bg-transformation-savage-bg",
    },
    {
      name: "Gen Z",
      color: "text-transformation-genz-text",
      bgColor: "bg-transformation-genz-bg",
    },
    {
      name: "Insult",
      color: "text-transformation-insult-text",
      bgColor: "bg-transformation-insult-bg",
    },
  ];

  const models: ModelType[] = [
    { name: "GPT-4", speed: "2.3s", accuracy: "98%" },
    { name: "Claude-3", speed: "1.8s", accuracy: "96%" },
    { name: "Gemini Pro", speed: "1.2s", accuracy: "94%" },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTransform = (): void => {
    if (!inputText.trim()) return;

    setIsTransforming(true);

    // Progress animation
    Animated.timing(transformProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      const transformations: Record<string, string> = {
        Professional:
          "I respectfully disagree with your assessment and would appreciate the opportunity to discuss alternative perspectives.",
        Savage:
          "That's completely ridiculous and you know it. Come back when you have something worth discussing.",
        "Gen Z":
          "Bruh that's straight cap, no cap. This ain't it chief, periodt.",
        Insult:
          "Your opinion has the intellectual depth of a puddle and the charm of wet cardboard.",
      };

      setTransformedText(transformations[selectedTransformation]);
      setIsTransforming(false);
      transformProgress.setValue(0);
    }, 2000);
  };

  interface TransformationButtonProps {
    type: string;
    isSelected: boolean;
    onPress: (type: string) => void;
  }

  const TransformationButton: React.FC<TransformationButtonProps> = ({
    type,
    isSelected,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(type)}
        className={`flex-1 mx-1 p-4 rounded-2xl border-2 ${
          isSelected
            ? "border-primary-dark bg-primary-dark"
            : "border-border-light bg-background-DEFAULT"
        }`}
        style={{
          shadowColor: isSelected ? "#000" : "transparent",
          shadowOffset: { width: 0, height: isSelected ? 8 : 0 },
          shadowOpacity: isSelected ? 0.1 : 0,
          shadowRadius: isSelected ? 16 : 0,
          elevation: isSelected ? 4 : 0,
        }}
      >
        <Text
          className={`text-center font-bold text-sm ${
            isSelected ? "text-text-white" : "text-text-secondary"
          }`}
        >
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  interface ModelSelectorProps {
    model: ModelType;
    isSelected: boolean;
    onPress: (modelName: string) => void;
  }

  const ModelSelector: React.FC<ModelSelectorProps> = ({
    model,
    isSelected,
    onPress,
  }) => (
    <TouchableOpacity
      onPress={() => onPress(model.name)}
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
        <Link href="/(auth)/auth">Hello</Link>

        <View
          className={`w-3 h-3 rounded-full ${
            isSelected ? "bg-primary-dark" : "bg-border-dark"
          }`}
        />
      </View>
    </TouchableOpacity>
  );

  const progressWidth = transformProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Clean Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="flex-row items-center justify-between p-6 bg-background-DEFAULT"
        >
          <TouchableOpacity className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">Transform</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={20} color="#374151" />
          </TouchableOpacity>
        </Animated.View>

        {/* Input Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            Input Text
          </Text>
          <View className="bg-background-secondary rounded-2xl p-4 border border-border-light">
            <TextInput
              className="text-base text-text-primary min-h-32"
              placeholder="Type or paste your text here..."
              placeholderTextColor="#9ca3af"
              multiline
              value={inputText}
              onChangeText={setInputText}
              textAlignVertical="top"
              style={{ fontSize: 16, lineHeight: 22 }}
            />
          </View>
          <Text className="text-xs text-text-tertiary mt-2 text-right">
            {inputText.length} characters
          </Text>
        </Animated.View>

        {/* Style Selection */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            Style
          </Text>
          <View className="flex-row">
            {transformationTypes.map((type) => (
              <TransformationButton
                key={type.name}
                type={type.name}
                isSelected={selectedTransformation === type.name}
                onPress={setSelectedTransformation}
              />
            ))}
          </View>
        </Animated.View>

        {/* Model Selection */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            AI Model
          </Text>
          {models.map((model) => (
            <ModelSelector
              key={model.name}
              model={model}
              isSelected={selectedModel === model.name}
              onPress={setSelectedModel}
            />
          ))}
        </Animated.View>

        {/* Transform Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <TouchableOpacity
            onPress={handleTransform}
            disabled={isTransforming || !inputText.trim()}
            className={`rounded-2xl py-4 ${
              isTransforming || !inputText.trim()
                ? "bg-gray-200"
                : "bg-primary-dark"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isTransforming || !inputText.trim() ? 0 : 0.1,
              shadowRadius: 8,
              elevation: isTransforming || !inputText.trim() ? 0 : 4,
            }}
          >
            <View className="flex-row items-center justify-center">
              {isTransforming && (
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: transformProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  }}
                  className="mr-3"
                >
                  <Ionicons name="sync" size={20} color="#9ca3af" />
                </Animated.View>
              )}
              <Text
                className={`font-bold text-base ${
                  isTransforming || !inputText.trim()
                    ? "text-text-tertiary"
                    : "text-text-white"
                }`}
              >
                {isTransforming ? "Transforming..." : "Transform Text"}
              </Text>
            </View>

            {isTransforming && (
              <View className="mt-3 mx-8">
                <View className="h-1 bg-border-dark rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-border-darker rounded-full"
                    style={{ width: progressWidth }}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Output Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            Output
          </Text>
          <View className="bg-primary-dark rounded-2xl p-6">
            <Text className="text-text-white text-base leading-6">
              {transformedText}
            </Text>
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-border-darkest">
              <Text className="text-border-dark text-xs">
                {selectedTransformation} • {selectedModel}
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="copy-outline" size={16} color="#9ca3af" />
                <Text className="text-border-dark text-xs ml-1">Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextTransformationScreen;
