import { Text, TouchableOpacity } from "react-native";
import { TagButtonProps } from "../../interfaces/Transformation";

const TagButton: React.FC<TagButtonProps> = ({ tag, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(tag)}
      className={`flex-1 mx-1 py-4 px-6   rounded-2xl border-2 ${
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
        {tag.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default TagButton;
