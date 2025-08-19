import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

/**
 * Custom toast configuration that matches the app's black and white theme
 */
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing BaseToast component
  */
  success: (props: any) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderLeftColor: "#10b981",
        borderLeftWidth: 4,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        width: "90%",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          backgroundColor: "#ecfdf5", // Light green background for icon
          borderRadius: 20,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  /*
    Overwrite 'error' type,
    by modifying the existing ErrorToast component
   */
  error: (props: any) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderLeftColor: "#ef4444",
        borderLeftWidth: 4,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        width: "90%",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          backgroundColor: "#fef2f2", // Light red background for icon
          borderRadius: 20,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <MaterialIcons name="error-outline" size={20} color="#ef4444" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),

  /*
    Or create a completely new type - `tomatoToast`
  */
  info: (props: any) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderLeftColor: "#3b82f6",
        borderLeftWidth: 4,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        width: "90%",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          backgroundColor: "#eff6ff", // Light blue background for icon
          borderRadius: 20,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 2,
          }}
        >
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {props.text2}
          </Text>
        )}
      </View>
    </View>
  ),
};
