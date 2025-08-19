import { Transformation } from "./Transformation";

export interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onPress: (tag: string) => void;
}
export interface HistoryItemProps {
  item: Transformation;
  selectedTag: string | undefined;
}
