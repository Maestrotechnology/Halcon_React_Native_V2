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
  master_task_map_id?: number;
}
export type DeleteApiResposneProps = {
  msg: string;
  status: number;
};

export type AddEditNavigationScreenProsp<T> = {
  type: 'Create' | 'Update' | 'View';
  lineData?: T;
};
export type AddEditModalScreenProsp<T> = {
  type: 'Create' | 'Update' | 'View' | 'Assigntask' | 'time' | 'settings' | '';
  lineData?: T | null;
  show: boolean;
};

export type TableItemProps<T> = {
  item: T;
  index: number;
};
export type AddEditModalProps<T> = {
  onApplyChanges: () => void;
  onClose: () => void;
  type: 'Create' | 'Update' | 'View' | 'Assigntask' | 'time' | 'settings' | '';
  lineData: T | null;
  category?: number;
};

export type FilterModalProps<T> = {
  filterData: T | null;
  onApplyFilter: (val: T | null) => void;
  onClose: () => void;
  initialValue?: T;
  isReport?: boolean;
};
