export type ApiResponse<T> = {
  status: number;
  msg: string;
  data: PaginationData<T>;
  items: PaginationData<T>;
  total_page?: number;
};
export interface PaginationData<T> {
  page: number;
  size: number;
  total_count: number;
  total_page: number;
  items: T[];
}
export type DeleteApiResposneProps = {
  msg: string;
  status: number;
};
