import CustomModal from "@/components/ui/CustomModal";
import type { CustomTag } from "@/components/ui/TagCard";
import TagCard from "@/components/ui/TagCard";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CustomTagsScreen: FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<CustomTag | null>(null);
  const [tagName, setTagName] = useState<string>("");
  const [tagPrompt, setTagPrompt] = useState<string>("");

  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

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
    data: customTags,
    isLoading: customTagsLoading,
    isError: customTagsIsError,
    error: customTagsError,
  } = useQuery({
    queryKey: ["customTags"],
    queryFn: async () => {
      const response = await axios.get("/user/custom-tags", {
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
  console.log(customTags);

  const saveTagMutation = useMutation({
    mutationFn: async ({ name, prompt }: { name: string; prompt: string }) => {
      const response = await axios.post(
        "/user/custom-tags",
        { name: name.toString().toUpperCase(), prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },

    onMutate: async (newTag) => {
      await queryClient.cancelQueries({ queryKey: ["customTags"] });

      const previousCustomTags = queryClient.getQueryData(["customTags"]);

      queryClient.setQueryData(["customTags"], (oldQueryData: any) => {
        const optimisticTag = {
          ...newTag,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const oldData = oldQueryData?.data || [];
        return {
          ...oldQueryData,
          data: [...oldData, optimisticTag],
        };
      });

      return { previousCustomTags };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customTags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsModalVisible(false);
      resetForm();
      Toast.show({
        type: "success",
        text1: editingTag
          ? "Tag updated successfully!"
          : "Tag created successfully!",
      });
    },
    onError: (err: any, _, context) => {
      queryClient.setQueryData(["customTags"], context?.previousCustomTags);
      Toast.show({
        type: "error",
        text1: err.response?.data?.error || "Failed to save tag",
      });
      console.log(JSON.stringify(err, null, 2));
    },
  });
  //////////
  const updateTagMutation = useMutation({
    mutationFn: async ({
      name,
      prompt,
      tagId,
    }: {
      name: string;
      prompt: string;
      tagId: string;
    }) => {
      const response = await axios.put(
        `/user/custom-tags`,
        { name: name.toString().toUpperCase(), prompt, id: tagId }, // Ensure name is uppercase like in create
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },

    onMutate: async (updatedTag) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["customTags"] });

      // Snapshot the previous value
      const previousCustomTags = queryClient.getQueryData(["customTags"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["customTags"], (oldQueryData: any) => {
        // Handle case where oldQueryData might be undefined
        if (!oldQueryData || !oldQueryData.data) {
          console.log("No existing data found for optimistic update");
          return oldQueryData;
        }

        const oldData = oldQueryData.data;

        // Find the tag to update
        const tagToUpdate = oldData.find(
          (tag: CustomTag) => tag.id === updatedTag.tagId
        );

        if (!tagToUpdate) {
          console.log(
            `Tag with id ${updatedTag.tagId} not found for optimistic update`
          );
          return oldQueryData; // Return unchanged if tag not found
        }

        return {
          ...oldQueryData,
          data: oldData.map((tag: CustomTag) => {
            if (tag.id === updatedTag.tagId) {
              return {
                ...tag, // Preserve all original properties including id
                name: updatedTag.name.toString().toUpperCase(), // Match the backend behavior
                prompt: updatedTag.prompt,
                updatedAt: new Date().toISOString(),
              };
            }
            return tag;
          }),
        };
      });

      return { previousCustomTags };
    },

    onSuccess: (data) => {
      console.log("Update successful:", data);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["customTags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });

      setIsModalVisible(false);
      resetForm();
      Toast.show({
        type: "success",
        text1: "Tag updated successfully!",
      });
    },

    onError: (err: any, variables, context) => {
      console.log("Update error details:");
      console.log("Error:", JSON.stringify(err, null, 2));
      console.log("Variables:", variables);
      console.log("Context:", context);

      // Rollback to previous state
      if (context?.previousCustomTags) {
        queryClient.setQueryData(["customTags"], context.previousCustomTags);
      }

      // Show error message
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update tag";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      await axios.delete(`/user/custom-tags/${tagId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({ queryKey: ["customTags"] });

      const previousCustomTags = queryClient.getQueryData(["customTags"]);

      queryClient.setQueryData(["customTags"], (oldTags: any) => {
        const oldData: CustomTag[] = oldTags.data || [];
        if (!oldData || oldData.length === 0) {
          return [];
        }
        return {
          ...oldTags,
          data: oldData.filter((tag) => {
            return tag.id !== tagId;
          }),
        };
      });

      return { previousCustomTags };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customTags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });

      Toast.show({
        type: "success",
        text1: "Tag deleted successfully!",
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: err.response?.data?.error || "Failed to delete tag",
      });
    },
  });

  const resetForm = () => {
    setTagName("");
    setTagPrompt("");
    setEditingTag(null);
  };

  const handleAddTag = () => {
    setIsModalVisible(true);
    resetForm();
  };

  const handleEditTag = (tag: CustomTag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagPrompt(tag.prompt);
    setIsModalVisible(true);
  };

  const handleDeleteTag = (tag: CustomTag) => {
    Alert.alert(
      "Delete Tag",
      `Are you sure you want to delete "${tag.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTagMutation.mutate(tag.id),
        },
      ]
    );
  };

  const handleSaveTag = () => {
    console.log("handleSaveTag called");
    console.log("editingTag:", editingTag);
    console.log("tagName:", tagName);
    console.log("tagPrompt:", tagPrompt);

    // Validate inputs
    if (!tagName.trim()) {
      Toast.show({
        type: "error",
        text1: "Tag name is required",
      });
      return;
    }

    if (!tagPrompt.trim()) {
      Toast.show({
        type: "error",
        text1: "Tag prompt is required",
      });
      return;
    }

    if (editingTag) {
      // Additional validation for editing
      if (!editingTag.id) {
        console.error("EditingTag missing ID:", editingTag);
        Toast.show({
          type: "error",
          text1: "Invalid tag selected for editing",
        });
        return;
      }

      console.log("Updating tag with ID:", editingTag.id);

      updateTagMutation.mutate({
        tagId: editingTag.id,
        name: tagName.trim(),
        prompt: tagPrompt.trim(),
      });
    } else {
      console.log("Creating new tag");

      saveTagMutation.mutate({
        name: tagName.trim(),
        prompt: tagPrompt.trim(),
      });
    }

    // Close modal after initiating the mutation
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="flex-1 mt-6 " showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="flex-row items-center justify-between p-6 bg-white"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">
            Custom Tags
          </Text>
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

        {/* Add Tag Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-6"
        >
          <TouchableOpacity
            onPress={handleAddTag}
            className="bg-primary-dark rounded-2xl py-4 flex-row items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="add" size={20} color="white" className="mr-2" />
            <Text className="text-text-white font-PoppinsSemi text-base ml-2">
              Add New Tag
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Tags List */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-6 mb-8"
        >
          <Text className="text-lg font-PoppinsSemi text-text-primary mb-4">
            Your Tags ({tags?.custom_tags?.length || 0})
          </Text>

          {customTagsLoading ? (
            <View>
              {Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={index}
                  className="h-36 mb-3 bg-gray-200 rounded-2xl"
                />
              ))}
            </View>
          ) : customTagsIsError ? (
            <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
              <Text className="text-red-600 text-center">
                Failed to load tags: {customTagsError?.message}
              </Text>
            </View>
          ) : !customTags?.data || customTags?.data?.length === 0 ? (
            <View className="bg-background-secondary rounded-2xl p-8 border border-border-light items-center">
              <Feather name="tag" size={48} color="#9ca3af" className="mb-4" />
              <Text className="text-text-secondary text-center text-lg font-PoppinsSemi mb-2">
                No Custom Tags Yet
              </Text>
              <Text className="text-text-tertiary text-center leading-5">
                Create your first custom tag to personalize your text
                transformations with specific instructions.
              </Text>
            </View>
          ) : (
            customTags.data?.map(
              (
                tag: {
                  id: string;
                  name: string;
                  prompt: string;
                  createdAt: string;
                  updatedAt: string;
                },
                index: number
              ) => (
                <TagCard
                  onEdit={handleEditTag}
                  onDelete={handleDeleteTag}
                  key={tag.id || `${tag.name}-${index}`}
                  tag={tag}
                />
              )
            )
          )}
        </Animated.View>
      </ScrollView>

      <CustomModal
        onClose={() => {
          setIsModalVisible(false);
        }}
        handleSaveTag={handleSaveTag}
        visible={isModalVisible}
        editingTag={editingTag}
        tagName={tagName}
        setTagName={setTagName}
        tagPrompt={tagPrompt}
        setTagPrompt={setTagPrompt}
        saveTagMutation={saveTagMutation}
        isUpdating={updateTagMutation.isPending}
      />
    </SafeAreaView>
  );
};

export default CustomTagsScreen;
