import { FilterButtonProps } from "@/interfaces/history";
import { Text, TouchableOpacity } from "react-native";

const FilterButton: React.FC<FilterButtonProps> = ({
  filter,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    onPress={() => onPress(filter)}
    activeOpacity={0.8}
    className={`px-4 py-2 mr-3 rounded-2xl border-2 ${
      isSelected
        ? "border-primary-dark bg-primary-dark"
        : "border-border-light bg-background-DEFAULT"
    }`}
    style={{
      shadowColor: isSelected ? "#000" : "transparent",
      shadowOffset: { width: 0, height: isSelected ? 4 : 0 },
      shadowOpacity: isSelected ? 0.1 : 0,
      shadowRadius: isSelected ? 8 : 0,
      elevation: isSelected ? 2 : 0,
    }}
  >
    <Text
      className={`font-bold text-sm ${
        isSelected ? "text-text-white" : "text-text-secondary"
      }`}
    >
      {filter}
    </Text>
  </TouchableOpacity>
);
export default FilterButton;
