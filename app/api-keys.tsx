import SelectProviderButton from "@/components/ui/SelectProviderButton";
import { ApiKey } from "@/interfaces/apiKeys";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Gemini from "../assets/images/gemini.svg";
import OpenAI from "../assets/images/openAI.svg";
import OpenRouter from "../assets/images/openrouter.svg";

const ApiKeys = () => {
  const { getToken } = useAuth();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    fetchToken();
  }, [getToken]);
  const [modalVisible, setModalVisible] = useState(false);
  const [provider, setProvider] = useState<"OPENAI" | "GEMINI" | "OPENROUTER">(
    "GEMINI"
  );
  function isValidApiKey(apiKey: string, provider?: string) {
    if (!apiKey || typeof apiKey !== "string") {
      return false;
    }

    apiKey = apiKey.trim();

    switch (provider) {
      case "OPENAI":
        return /^sk-[A-Za-z0-9]{48}$/.test(apiKey);

      case "OPENROUTER":
        return /^sk-or-v1-[A-Za-z0-9\-_./:=+]{10,}$/.test(apiKey);

      case "GEMINI":
        return /^[A-Za-z0-9\-_]{20,50}$/.test(apiKey);

      default:
        return (
          apiKey.length >= 20 &&
          apiKey.length <= 200 &&
          /^[A-Za-z0-9\-_./:=+]+$/.test(apiKey)
        );
    }
  }

  const {
    data: apiKeys,
    isLoading: apiKeysLoading,
    isError: apiKeysIsError,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const res = await axios.get("/api-key/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
  const { mutate: addKey, isPending: isAddingKey } = useMutation({
    mutationKey: ["addKey"],
    mutationFn: async ({
      key,
      type,
    }: {
      key: string;
      type: "OPENAI" | "GEMINI" | "OPENROUTER";
    }) => {
      const res = await axios.post(
        "/api-key/create",
        {
          apiKey: key,
          type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },

    onMutate: ({ key, type }) => {
      queryClient.cancelQueries({ queryKey: ["apiKeys"] });
      const previousKeys = queryClient.getQueryData<ApiKey[]>(["apiKeys"]);
      queryClient.setQueryData(["apiKeys"], (old: ApiKey[]) => {
        return [
          ...old,
          {
            apiKey: key,
            type,
            id: Date.now().toString() + Math.random(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      });
      return { previousKeys };
    },

    onError: (err: any, _, context) => {
      queryClient.setQueryData(["apiKeys"], context?.previousKeys);
      setModalVisible(false);
      setNext(false);

      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: err.response.data.error,
      });
    },
    onSuccess: async () => {
      setTempKey("");
      setModalVisible(false);

      Toast.show({
        type: "success",
        text1: "Key added successfully",
      });
      setNext(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });

  const { mutate: updateKey, isPending: isUpdatingKey } = useMutation({
    mutationKey: ["apiKey", "update"],
    mutationFn: async ({ keyId, key }: { keyId: string; key: string }) => {
      const res = await axios.put(
        `/api-key/update`,
        {
          apiKey: key,
          id: keyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onMutate: ({ keyId, key }) => {
      queryClient.cancelQueries({ queryKey: ["apiKeys"] });
      const previousKeys = queryClient.getQueryData<ApiKey[]>(["apiKeys"]);

      queryClient.setQueryData(["apiKeys"], (old: ApiKey[]) => {
        return old.map((apiKey) =>
          apiKey.id === keyId
            ? { ...apiKey, apiKey: key, updatedAt: new Date().toISOString() }
            : apiKey
        );
      });

      return { previousKeys };
    },
    onError: (err: any, _, context) => {
      queryClient.setQueryData(["apiKeys"], context?.previousKeys);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: err.response?.data?.error || "Failed to update API key",
      });
      console.log(JSON.stringify(err, null, 2));
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Key updated successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });

  const { mutate: deleteKey } = useMutation({
    mutationKey: ["apiKey", "delete"],
    mutationFn: async (keyId: string) => {
      const res = await axios.delete(`/api-key/${keyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },

    onMutate: (deletedKeyId) => {
      queryClient.cancelQueries({ queryKey: ["apiKeys"] });
      const previousKeys = queryClient.getQueryData(["apiKeys"]);

      queryClient.setQueryData(["apiKeys"], (old: ApiKey[]) => {
        return old.filter((key) => key.id !== deletedKeyId);
      });
      return { previousKeys };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["apiKeys"], context?.previousKeys);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });

  const providers: ("OPENAI" | "GEMINI" | "OPENROUTER")[] = [
    "OPENAI",
    "GEMINI",
    "OPENROUTER",
  ];

  const handleEdit = (keyId: string, currentKey: string) => {
    setEditingKey(keyId);
    setTempKey(currentKey);
  };

  const handleSave = (keyId: string) => {
    if (!isValidApiKey(tempKey, provider)) {
      Toast.show({
        type: "error",
        text1: "Invalid API key",
        text2: "Please enter a valid API key",
      });
      return;
    }

    updateKey({ keyId, key: tempKey });
    setEditingKey(null);
    setTempKey("");
  };

  const handleCancel = () => {
    setEditingKey(null);
    setTempKey("");
  };

  const handleAddKey = () => {
    if (isAddingKey) {
      return;
    }
    if (!isValidApiKey(tempKey, provider)) {
      Toast.show({
        type: "error",
        text1: "Invalid API key",
        text2: "Please enter a valid API key",
      });
      return;
    }
    addKey({ key: tempKey, type: provider });
  };

  const handleProviderSelect = (
    provider: "OPENAI" | "GEMINI" | "OPENROUTER"
  ) => {
    setProvider(provider);
  };
  const handleKeyChange = (key: string) => {
    console.log(key, "key");

    setTempKey(key);
  };
  const handleDelete = (keyId: string, keyName: string) => {
    Alert.alert(
      "Delete API Key",
      `Are you sure you want to delete the ${keyName} API key?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteKey(keyId);
          },
        },
      ]
    );
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "****";
    const prefix = key.startsWith("sk-or-v1-")
      ? "sk-or-v1-"
      : key.startsWith("sk-")
      ? "sk-"
      : "";
    const suffix = key.slice(-4);
    return `${prefix}****${suffix}`;
  };
  const getIcon = (type: string) => {
    switch (type) {
      case "OPENROUTER":
        return <OpenRouter width={18} height={18} />;
      case "OPENAI":
        return <OpenAI width={28} height={28} />;
      case "GEMINI":
        return <Gemini width={22} height={22} />;
      default:
        return <View className="w-6 h-6 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">API Keys</Text>
          <View className="w-10" />
        </View>

        {/* Description */}
        <View className="px-4 mb-6">
          <Text className="text-sm text-gray-600 leading-5">
            Manage your API keys for different AI providers. You can add one API
            key for each provider.
          </Text>
        </View>

        {/* API Keys List */}
        <View className="px-4">
          {apiKeysIsError ? (
            <Text className="text-red-500">Error fetching API keys</Text>
          ) : apiKeysLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            apiKeys?.map((apiKey: ApiKey) => (
              <View
                key={apiKey.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3">
                      {getIcon(apiKey.type)}
                    </View>
                    <View>
                      <Text className="text-lg font-semibold text-black">
                        {apiKey.type}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Last updated at{" "}
                        {format(new Date(apiKey.updatedAt), "PP")}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {apiKey.apiKey && (
                      <TouchableOpacity
                        onPress={() => handleEdit(apiKey.id, apiKey.apiKey)}
                        className="p-2 rounded-full active:bg-gray-100"
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#666666"
                        />
                      </TouchableOpacity>
                    )}
                    {apiKey.apiKey && (
                      <TouchableOpacity
                        onPress={() => handleDelete(apiKey.id, apiKey.type)}
                        className="p-2 rounded-full active:bg-gray-100"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ef4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {editingKey === apiKey.id ? (
                  <View className=" flex gap-3 mt-2">
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder={`Enter your ${apiKey.type} API key`}
                      onChangeText={setTempKey}
                      secureTextEntry
                      autoFocus
                    />
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleSave(apiKey.id)}
                        className="flex-1 bg-black py-2 rounded-lg active:bg-gray-800"
                        disabled={isUpdatingKey}
                      >
                        {isUpdatingKey ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text className="text-white text-center font-medium">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleCancel}
                        className="flex-1 border border-gray-300 py-2 rounded-lg active:bg-gray-50"
                        disabled={isUpdatingKey}
                      >
                        <Text className="text-black text-center font-medium">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    {apiKey.apiKey ? (
                      <View className="bg-gray-50 rounded-lg p-3">
                        <Text className="text-sm font-mono text-gray-700">
                          {maskApiKey(apiKey.apiKey)}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleEdit(apiKey.id, "")}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center active:bg-gray-50"
                      >
                        <Ionicons name="add" size={24} color="#666666" />
                        <Text className="text-sm text-gray-600 mt-1">
                          Add {apiKey.type} API key
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
        <View className="px-4 w-full flex gap-2 flex-row justify-start mt-4">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-50 rounded-lg p-4 flex-row items-center flex gap-2"
          >
            <AntDesign name="plus" size={24} color="black" />
            <Text className="text-base font-medium">Add API key</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View className=" w-full   flex items-center justify-center h-full ">
              <View className="bg-background-secondary border-[1px] border-border-light relative  w-[90%] p-5 rounded-2xl max-h-[70%]">
                <Text className="text-base font-bold">
                  {next ? "" : "Select Provider"}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="absolute top-4 right-4"
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                {next ? (
                  <>
                    <TextInput
                      placeholder="Enter API key"
                      value={tempKey}
                      onChangeText={handleKeyChange}
                      secureTextEntry
                      maxLength={400}
                      className="border mb-4 mt-4 h-16 border-gray-300 rounded-lg px-3 py-2 text-sm"
                    ></TextInput>
                  </>
                ) : (
                  <View className=" flex my-6 gap-2 ">
                    {providers.map((item) => (
                      <SelectProviderButton
                        onPress={() => handleProviderSelect(item)}
                        selected={provider === item}
                        key={item}
                        provider={item}
                      />
                    ))}
                  </View>
                )}

                <View className=" flex flex-row justify-end gap-2 ">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setNext(false);
                    }}
                    className=" border-border-light border-[1px] rounded-full w-20  h-10 items-center justify-center "
                  >
                    <Text className="text-text-primary font-medium ">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  {next ? (
                    isAddingKey ? (
                      <TouchableOpacity className=" bg-background-dark  rounded-full w-20  h-10  items-center justify-center ">
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handleAddKey}
                        className=" bg-background-dark  rounded-full w-20  h-10  items-center justify-center "
                      >
                        <Text className="text-text-light font-medium ">
                          Add
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => setNext(true)}
                      className=" bg-background-dark  rounded-full w-20  h-10  items-center justify-center "
                    >
                      <Text className="text-text-light font-medium ">Next</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Security Note */}
        <View className="px-4 mt-4">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-blue-800 mb-1">
                  Security Information
                </Text>
                <Text className="text-xs text-blue-700">
                  Your API keys are stored securely and are only used to make
                  requests to AI providers. Never share your API keys with
                  others.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApiKeys;
