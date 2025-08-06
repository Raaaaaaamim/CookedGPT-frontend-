import ModelSelector from "@/components/ui/ModelSelector";
import OutputCard from "@/components/ui/OutputCard";
import TagButton from "@/components/ui/TagButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Model, MODEL_TYPE, PERFORMANCE } from "../../interfaces/Model";

axios.defaults.baseURL = "http://192.168.1.111:4000/api/v1";

const TextTransformationScreen: FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["SAVAGE"]);

  const [selectedModel, setSelectedModel] = useState<Partial<Model>>({
    name: "gemini-2.0-flash-lite",
    performance: PERFORMANCE.GOOD,
    type: MODEL_TYPE.GEMINI,
    accuracy: 64,
    pro: false,
    speed: 1.8,
  });
  const [token, setToken] = useState<string | null>(null);

  const { getToken, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!userId) {
      router.replace("/(auth)/auth");
    }
  }, [userId]);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const transformProgress = useRef(new Animated.Value(0)).current;
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const transformationMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/transform",
        {
          content: inputText,
          tags: selectedTags,
          model: selectedModel.name,
          type: selectedModel.type,
          modelId: selectedModel.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    mutationKey: ["transform"],

    onError: (err: any) => {
      console.log("Full error object:", JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: err.response.data.error,
      });
    },
  });
  console.log(JSON.stringify(transformationMutation.error, null, 2));

  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsIsError,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/user/tags", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },

    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const {
    data,
    error: modelsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    isLoading: modelsLoading,
  } = useInfiniteQuery({
    queryKey: ["models"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`/ai-model/all?page=${pageParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: Model[], allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const models = data?.pages.flat() || [];

  //console.log(JSON.stringify(modelsError, null, 2));
  console.log(JSON.stringify(tagsError, null, 3));

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

    transformationMutation.mutate();

    Animated.timing(transformProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const progressWidth = transformProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Clean Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="flex-row items-center justify-between p-6 bg-white"
        >
          <TouchableOpacity className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">Transform</Text>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center overflow-hidden"
          >
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Ionicons name="person" size={20} color="#374151" />
            )}
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
              className="text-base text-text-primary min-h-32 max-h-[500px]"
              placeholder="Type or paste your text here..."
              placeholderTextColor="#9ca3af"
              multiline
              value={inputText}
              onChangeText={setInputText}
              textAlignVertical="top"
              style={{ fontSize: 16, lineHeight: 22 }}
              maxLength={7000}
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
          <ScrollView
            horizontal
            className="flex-row gap-2"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {tagsLoading ? (
              <View className="flex-row gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <View
                    key={index}
                    className="h-14 mb-3 w-28 bg-gray-200 rounded-2xl"
                  />
                ))}
              </View>
            ) : tagsIsError ? (
              <Text className="text-red-500">{tagsError?.message}</Text>
            ) : (
              <>
                {tags?.default_tags.map((tag: string, index: number) => (
                  <TagButton
                    key={tag + index}
                    tag={tag}
                    isSelected={selectedTags.includes(tag)}
                    onPress={() =>
                      setSelectedTags((pre) => {
                        if (pre.includes(tag)) {
                          return pre.filter((val) => val !== tag);
                        } else {
                          return [...pre, tag];
                        }
                      })
                    }
                  />
                ))}
                {tags?.custom_tags.map(
                  (
                    tag: {
                      name: string;
                      prompt: string;
                    },
                    index: number
                  ) => (
                    <TagButton
                      key={tag.name + index}
                      tag={tag.name}
                      isSelected={selectedTags.includes(tag.name)}
                      onPress={() =>
                        setSelectedTags((pre) => {
                          if (pre.includes(tag.name)) {
                            return pre.filter((val) => val !== tag.name);
                          } else {
                            return [...pre, tag.name];
                          }
                        })
                      }
                    />
                  )
                )}
              </>
            )}
          </ScrollView>
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

          {modelsLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={index}
                  className="h-20 mb-3  bg-gray-200 rounded-2xl"
                ></View>
              ))
            : models
                ?.slice(0, seeMore ? models.length : 5)
                .map((model: Model) => (
                  <ModelSelector
                    key={model.id}
                    model={model}
                    isSelected={selectedModel.id === model.id}
                    onPress={() => setSelectedModel(model)}
                  />
                ))}

          {isFetchingNextPage ? (
            <TouchableOpacity className=" gap-1 pt-2 flex-row justify-center items-center">
              <Text className="text-text-primary font-bold">Loading...</Text>
            </TouchableOpacity>
          ) : (
            !modelsLoading && (
              <View className="flex-row justify-center items-center gap-4 mt-4">
                <TouchableOpacity
                  onPress={() => {
                    fetchNextPage();
                    setSeeMore(true);
                  }}
                  disabled={isFetchingNextPage}
                  className="flex-row items-center justify-center gap-2"
                >
                  <Text className="text-text-primary font-bold">
                    {isFetchingNextPage ? "Loading..." : "See More"}
                  </Text>
                  <Feather
                    name="arrow-right"
                    className=" mt-[2px] "
                    size={18}
                    color="#374151"
                  />
                </TouchableOpacity>

                {models && seeMore === true && (
                  <TouchableOpacity
                    onPress={() => setSeeMore(false)}
                    className="flex-row items-center justify-center gap-2"
                  >
                    <Text className="text-text-primary font-bold">
                      Collapse
                    </Text>
                    <Feather
                      name="arrow-up"
                      className=" mt-[2px] "
                      size={18}
                      color="#374151"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )
          )}
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
            disabled={transformationMutation.isPending || !inputText.trim()}
            className={`rounded-2xl py-4 ${
              transformationMutation.isPending || !inputText.trim()
                ? "bg-gray-200"
                : "bg-primary-dark"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity:
                transformationMutation.isPending || !inputText.trim() ? 0 : 0.1,
              shadowRadius: 8,
              elevation:
                transformationMutation.isPending || !inputText.trim() ? 0 : 4,
            }}
          >
            <View className="flex-row items-center justify-center">
              {transformationMutation.isPending && (
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
                  transformationMutation.isPending || !inputText.trim()
                    ? "text-text-tertiary"
                    : "text-text-white"
                }`}
              >
                {transformationMutation.isPending
                  ? "Transforming..."
                  : "Transform Text"}
              </Text>
            </View>

            {transformationMutation.isPending && (
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
          className="mx-6  mb-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            Output
          </Text>
          {transformationMutation.data ? (
            <OutputCard transformation={transformationMutation.data} />
          ) : (
            <OutputCard
              transformation={null}
              isPending={transformationMutation.isPending}
            />
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextTransformationScreen;
