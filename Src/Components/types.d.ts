// Loader Props

import {ListRenderItem} from 'react-native';
import {IconType} from '../Utilities/Icons';
export type ObjectType = {
  [key: string]: any;
};

export type LoaderProps = {
  isVisible: boolean;
  text?: string;
  color?: string;
  backgroundColor?: string;
};

// Table Props

export type TableViewProps = {
  viewPortColumnDivisionCount?: number;
  dataList: any[];
  headingList?: string[];
  itemKeysList?: ItemKeyListProps[];
  isActionAvailable?: boolean;
  isRefreshing?: boolean;
  actionsList?: actionListProps[];
  isEndRefresh?: boolean;
  onEndReached?: () => void;
  onPressItem?: (val: any) => void;
  onRefresh?: () => void;
  isDisabled?: boolean;
  onActionPress?: (actionType: number, val: any) => void;
  removeActionsIds?: number[];
  removeActionItemKey?: string;
  removeActionRefKey?: string;
  viewAction?: boolean;
  showFullText?: boolean;
  selectable?: boolean;
  selectedIds?: number[];
  checkedKey?: string;
  onCheckPress?: (val: any) => void;
  rowData: TableRowDataProps[];
  customRenderer?: ListRenderItem<any> | null | undefined;
  onChangeStatus?: (status: number, data: any) => void;
  lineTextNumberofLines?: number;
};

export type TableRowDataProps = {
  label: string;
  key: string;
  type?: 'date' | 'converttoHours';
  ListType?:
    | 'deviceStatusOptions'
    | 'TASK_DONE_BY_OPTIONS'
    | 'APPROVAL_STATUS_OPTIONS';
  subChildName?: 'name';
};

export type ItemKeyListProps = {
  key: string;
  center?: boolean;
};

export type ListEmptyComponentProps = {
  errorText: string;
  alignItems: 'flex-start' | 'center' | 'flex-end';
};

export type actionListProps = {
  name: IconType;
  id: number;
  isDisabled?: boolean;
  isShow?: boolean;
  activename?: IconType;
  activekey?: string;
  disableKey?: string;
  width?: number;
  height?: number;
};

// Dropdown Props

export interface ItemSelectionMiniListProps {
  title?: string;
  listData?: any[];
  fieldName?: string;
  containerWidth?: DimensionValue;
  maxHeight?: DimensionValue;
  onSelectItem?: (item: any) => void;
  onClose?: () => void;
  isEnableClickItem?: boolean;
  isEnableCloseIcon?: boolean;
}

export interface DropdownProps extends ItemSelectionMiniListProps {
  value: any;
  options?: any[];
  type?: 'normal' | 'search' | 'miniList';
  fieldName?: string;
  icon?: IconType;
  errorText?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  isDisabled?: boolean;
  title?: string;
  onSelect: (val: ProjectListProps | any) => void;
  selectedFieldName?: string;
  searchFieldName?: string;
  isEndReached?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  apiType?:
    | 'state'
    | 'city'
    | 'customer_category'
    | 'enquiry'
    | 'requirements'
    | 'customer'
    | 'custom';
  isRequired?: boolean;
  placeHolder?: string;
  isEnableHocMenu?: boolean;
  stateId?: string;
  hasOther?: boolean;
  fieldIdName?: string;
  othersName?: string;
  multiSelect?: boolean;
  readOnly?: boolean;
}

export interface DropdownProps extends ItemSelectionMiniListProps {
  value: any;
  options?: any[];
  type?: 'normal' | 'search' | 'miniList';
  fieldName?: string;
  icon?: IconType;
  errorText?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  isDisabled?: boolean;
  title?: string;
  onSelect: (val: ProjectListProps | any) => void;
  selectedFieldName?: string;
  searchFieldName?: string;
  isEndReached?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  apiType?:
    | 'state'
    | 'city'
    | 'customer_category'
    | 'enquiry'
    | 'requirements'
    | 'customer';
  isRequired?: boolean;
  placeHolder?: string;
  isEnableHocMenu?: boolean;
}

export type SearchSelectionModalProps = {
  title?: string;
  onClose: () => void;
  onSelect: (val: any) => void;
  options: any[];
  searchFieldName?: string;
  fieldName: string;
  selectedFieldName: string;
  isEndReached?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  apiType?:
    | 'state'
    | 'city'
    | 'customer_category'
    | 'enquiry'
    | 'requirements'
    | 'customer'
    | 'custom';
  isEnableHocMenu?: boolean;
  stateId?: string;
  hasOther?: boolean;
  fieldIdName?: string;
  othersName?: string;
  multiSelect?: boolean;
  value: any;
};

export type SearchSelectionModalRenderOptionsProps = {
  item: ProjectListProps;
  index: number;
};

//  Date Time picker Types

export type DateTimeModalPickerProps = {
  title?: string;
  mode?: 'date' | 'time' | 'datetime';
  errorText?: string;
  placeHolder?: string;
  maximumDate?: any;
  minimumDate?: any;
  customContainerStyle?: StyleProp<ViewStyle>;
  customDatePickerContainerStyle?: StyleProp<ViewStyle>;
  customIconContainerStyle?: StyleProp<ViewStyle>;
  customInputFieldStyle?: StyleProp<ViewStyle>;
  value: any;
  onSelect: (val: any) => void;
  icon?: any;
  isRequired?: boolean;
  dateTimePickerProps?: DateTimePickerProps | NativePickerProps;
  is24Hour?: boolean;
  readOnly?: boolean;
  margin?: number;
};

export type CommonSwitchProps = {
  isEnabled: boolean;
  ActiveColor?: string;
  inActiveColor?: string;
  onChangeSwitch: (val: boolean) => void;
};
