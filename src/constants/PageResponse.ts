export interface PageResponse<T> {
  results: T[];
  page: number;
  pageSize: number;
}
