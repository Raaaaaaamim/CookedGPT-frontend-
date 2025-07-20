export interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onPress: (type: string) => void;
}

export interface Transformation {
  id: string;
  authorId: string;
  modelName: string;
  input: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
