import { Transformation } from "./Transformation";

export interface FilterButtonProps {
  filter: string;
  isSelected: boolean;
  onPress: (filter: string) => void;
}
export interface HistoryItemProps {
  item: Transformation;
}
