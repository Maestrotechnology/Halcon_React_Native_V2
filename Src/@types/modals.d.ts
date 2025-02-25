import {number, string} from 'yup';
import {IconType} from '../Utilities/Icons';
import {DeviceStatusProps} from '../Utilities/StaticDropdownOptions';
import {
  DevisionDropdownListReponseProps,
  MachineDropdownListDataProps,
  WorkCenterropdownListReponseProps,
} from './api';
import {DivisionDropdownProp, WorkCenterDropdownProp} from './dropdown';

export interface SearchDropdownBoxModalProps {
  options?: any[];
  apiType?:
    | 'machineList'
    | 'user'
    | 'work_center'
    | 'division'
    | 'roleList'
    | 'assignedUsersList'
    | 'MaterialList'
    | 'TaskList';

  searchFieldName?: string;
  icon?: IconType;
  onEndReached?: ((info: {distanceFromEnd: number}) => void) | null | undefined;
  onRefresh?: (() => void) | undefined;
  isEndReached?: boolean;
  isRefreshing?: boolean;
  isLocalSearch?: boolean;
  title: string;
  onClose?: () => void;
  onSelect?: (val: any) => void;
  fieldName?: string;
  multiSelect?: boolean;
  value?: any;
  uniqueKey?: 'role_id' | 'task_id';
  onMultipleSelect?: (items: any[]) => void;
}

export type TaskListFilterProps = {
  task_name?: string;
  control_key?: string;
};
export type SpindleReportFilterProps = {
  division_id: DevisionDropdownListReponseProps | null;
  work_center_id: WorkCenterropdownListReponseProps | nul;
};
export type SearchDropdownBoxModalRenderOptionsProps = {
  item: any;
  index: number;
};
export type StatusOptionProps = {
  name: string;
  id: number;
};
export type UserListFilterdataProps = {
  role_id: {role_id: null} | null;
  username: string;
};
export type UserListFilterModalProps = {
  filterData: UserListFilterdataProps | null;
  onApplyFilter: (val: UserListFilterdataProps | null) => void;
  onClose: () => void;
  initialValue?: UserListFilterdataProps;
};

export type ServiceRequestFilterDataProps = {
  machine: MachineDropdownListDataProps | null;
  sort_type: DeviceStatusProps | null;
  reqStatus: DeviceStatusProps | null;
  from_date?: string;
  to_date?: string;
  work_center: WorkCenterDropdownProp | null;
  division: DivisionDropdownProp | null;
  report_no?: string;
};
export type ApprovalStatusFilterProps = {
  role_name: '';
  status: StatusOptionProps | null;
};

export type ServiceRequestListFilterModalProps = {
  filterData: ServiceRequestFilterDataProps | null;
  onApplyFilter: (val: ServiceRequestFilterDataProps | null) => void;
  onClose: () => void;
  initialValue?: ServiceRequestFilterInitialProp;
};

export type ServiceRequestFilterInitialProp = {
  type: number;
};
export type DivisionListFilterProps = {
  description?: string;
};
export type WorkCenterListFilterProps = {
  name?: string;
};
export type HolidayListFilterProps = {
  reason?: string;
};
export type RoleListFilterdataProps = {
  role_name: string;
};

export type MeterialListFilterdataProps = {
  material_name: string;
};
export type MachinesListFilterProps = {
  machine_name: string;
  machine_id?: any;
  division_id?: any;
  equipment_id?: any;
  serial_no?: number | string;
  model?: string;
  work_center_id?: any;
  equipment_description?: string;
  is_spindle?: string | number;
  division_description?: string;
  work_center_name?: string;
};

export type MachineTasksFilterprops = {
  starting_date: string;
  starting_time: string;
  duration: string;
  tasks: Array[any];
  category: any;
};
