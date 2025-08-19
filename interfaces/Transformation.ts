export interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onPress: (type: string) => void;
  size?: "small" | "large";
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
export interface TransformationsRes {
  transformations: Transformation[];
  hasNextPage: boolean;
  foundTransformations: number;
  totalTransformations: number;
  page: number;
  limit: number;
}
