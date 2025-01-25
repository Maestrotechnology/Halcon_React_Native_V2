import {IconType} from '../Utilities/Icons';
import {DeviceStatusProps} from '../Utilities/StaticDropdownOptions';
import {MachineDropdownListDataProps} from './api';
import {DivisionDropdownProp, WorkCenterDropdownProp} from './dropdown';

export interface SearchDropdownBoxModalProps {
  options?: any[];
  apiType?: 'machineList' | 'user' | 'work_center' | 'division';
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
}

export type SearchDropdownBoxModalRenderOptionsProps = {
  item: any;
  index: number;
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

export type ServiceRequestListFilterModalProps = {
  filterData: ServiceRequestFilterDataProps | null;
  onApplyFilter: (val: ServiceRequestFilterDataProps | null) => void;
  onClose: () => void;
  initialValue?: ServiceRequestFilterInitialProp;
};

export type ServiceRequestFilterInitialProp = {
  type: number;
};
