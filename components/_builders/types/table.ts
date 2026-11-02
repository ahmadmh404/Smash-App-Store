// Re-using the Column type from TableBuilder for consistency
export interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
}

export interface InfiniteTableProps<T> {
  data: T[];

  columns: Column<T>[];
  fetchMoreData?: () => void;
  pageSize?: number;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  errorMessage?: string;
  scrollAreaHeight?: string; // e.g., "400px", "calc(100vh - 200px)"
}
