import { formatTimestamp } from "@/features/utils";
import { HistoryItemProps } from "@/interfaces/history";
import { TransformationsRes } from "@/interfaces/Transformation";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import ExpandableSection from "./ExpandableSection";

const HistoryItem: React.FC<HistoryItemProps> = ({ item, selectedTag }) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: deleteTransformation } = useMutation({
    mutationKey: ["delete-transformation", item.id],
    mutationFn: async ({ id }: { id: string }) => {
      const token = await getToken();
      const res = await axios.delete(`/user/transformations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["transformations", selectedTag],
      });

      const previousData: { pages: TransformationsRes[] } | undefined =
        queryClient.getQueryData(["transformations", selectedTag]);

      if (previousData) {
        const newData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            transformations: page.transformations.filter(
              (transformation) => transformation.id !== id
            ),
            totalTransformations: page.totalTransformations - 1,
            foundTransformations: page.foundTransformations - 1,
          })),
        };
        queryClient.setQueryData(["transformations", selectedTag], newData);
      }

      return { previousData, selectedTag };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ["transformations", context?.selectedTag],
        context?.previousData
      );
      Toast.show({
        type: "error",
        text1: "Error deleting transformation",
        text2: "Please try again later",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transformations", selectedTag],
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Transformation deleted",
        text2: "Your transformation has been deleted successfully",
      });
    },
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Transformation",
      `Are you sure you want to delete this transformation?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",

          style: "destructive",
          onPress: () => {
            deleteTransformation({ id: item.id });
          },
        },
      ]
    );
  };

  return (
    <View className="mb-6">
      <View
        className="bg-background-secondary rounded-2xl p-4 border border-border-light"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4 px-2">
          <Text className="text-xs text-text-tertiary">
            {formatTimestamp(item.createdAt)} • {item.modelName}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View className="">
          <ExpandableSection
            label="Input"
            content={item.input}
            characterCount={item.input.length}
          />
        </View>

        {/* Arrow indicator */}
        <View className="items-center my-3">
          <View className="w-8 h-8 rounded-full bg-primary-dark items-center justify-center">
            <Ionicons name="arrow-down" size={16} color="white" />
          </View>
        </View>

        {/* Output Section */}
        <View className="mb-4">
          <ExpandableSection
            label="Output"
            content={item.content}
            characterCount={item.content.length}
            isOutput
          />
        </View>

        {/* Tags and Actions */}
        <View className="px-2">
          <View className="flex-row items-center justify-between pt-3 border-t border-border-light mb-4">
            <View className="flex-row items-center">
              <View className="flex-row gap-1 items-center">
                <View className="px-3 py-1 rounded-full bg-primary-dark mr-3">
                  <Text className="text-text-light text-xs font-medium">
                    {item.tags?.[0] || "General"}
                  </Text>
                </View>
              </View>
              {item.tags?.[1] && (
                <View className="flex-row gap-1 items-center">
                  <View className="px-3 py-1 rounded-full bg-primary-dark mr-3">
                    <Text className="text-text-light text-xs font-medium">
                      {item.tags?.[1] || "General"}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-center gap-2">
              <TouchableOpacity
                onPress={() => handleDelete()}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#0f172b"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;
