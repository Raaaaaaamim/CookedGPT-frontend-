export interface RenderTransformationsProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  allItems: any[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  searchQuery?: string;
  selectedTag?: string;
  isRefetching?: boolean;
}
