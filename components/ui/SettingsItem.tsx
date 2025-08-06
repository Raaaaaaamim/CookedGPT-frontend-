import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

const SettingsItem = ({
  icon,
  label,
  onPress,
  isDestructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-background-secondary p-4 rounded-2xl mb-3"
  >
    <Ionicons
      name={icon}
      size={22}
      color={isDestructive ? "#ef4444" : "#6b7280"}
    />
    <Text
      className={`text-base ml-4 font-medium ${
        isDestructive ? "text-red-500" : "text-text-primary"
      }`}
    >
      {label}
    </Text>
    {!isDestructive && (
      <Ionicons
        name="chevron-forward"
        size={22}
        color="#6b7280"
        style={{ marginLeft: "auto" }}
      />
    )}
  </TouchableOpacity>
);
export default SettingsItem;
