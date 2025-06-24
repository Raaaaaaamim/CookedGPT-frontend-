export interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onPress: (type: string) => void;
}
export interface TransformationType {
  name: string;
}
export interface Transformation {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
