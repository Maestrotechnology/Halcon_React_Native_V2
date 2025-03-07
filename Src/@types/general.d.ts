import {
  KeyboardType,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {IconType} from '../Utilities/Icons';
import {
  DashboardChartDetailsApiResponseProps,
  DashboardChartProps,
  PolicyListDataProps,
  TaskDetailsDataItemsProps,
  TaskDetailsListDataProps,
  TaskListDataProps,
} from './api';
import {FormikErrors} from 'formik';
import {SearchDropdownBoxModalProps} from './modals';
import {LegacyRef, Ref} from 'react';
import {NativePickerProps} from 'react-native-modal-datetime-picker';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetModalProps} from '@gorhom/bottom-sheet';
import {DeviceStatusProps} from '../Utilities/StaticDropdownOptions';
import {ObjectType} from '../Components/types';

export type DashboardDetailsStateProps = {
  data: DashboardChartProps[];
  pendingData: number;
  totalCompleted: number;
  totalOnGoing: number;
  totalService: number;
};

export type CustomDrawerNavigationOptionsProps = {
  id: number;
  displayName: string;
  navigate: string;
  leftIcon: IconType;
  isVisible: boolean;
  activeIcon: IconType;
  isMenu?: boolean;
  screenName?: string;
  isImage?: boolean;
  children?: CustomDrawerNavigationOptionsProps[];
};

export type SVGIconProps = {
  height?: number;
  width?: number;
  icon?: IconType;
  color?: string;
  marginLeft?: number;
  isButton?: boolean;
  onPress?: () => void;
  marginBottom?: number;
  fill?: string;
  padding?: number;
  paddingRight?: number;
  marginTop?: number;
  marginRight?: number;
};

export type RenderDrawerOptionsProps = {
  item: CustomDrawerNavigationOptionsProps;
  index: number;
};
export type RenderSubMenuItemProps = {
  children: CustomDrawerNavigationOptionsProps[];
  mainItem: any;
};

export type AlertBoxProps = {
  title?: string;
  alertMsg?: string;
  positiveBtnText?: string;
  negativeBtntext?: string;
  onPressPositiveButton?: () => void;
  onPressNegativeButton?: () => void;
};

export interface HOCViewProps extends CustomHeaderProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
  isEnableKeyboardAware?: boolean;
  isEnableScrollView?: boolean;
  keyboardAwareContentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewContentContainerStyle?: StyleProp<ViewStyle>;
  paddingHorizontal?: number;
  paddingVertical?: number;
  refreshControl?: ScrollViewProps | undefined | any;
  isShowHeader?: boolean;
  isShowSecondaryHeader?: boolean;
  secondaryHeaderTitle?: string;
  secondaryBtnTitle?: string;
  secondaryBtnStyle?: StyleProp<ViewStyle>;
  isShowSecondaryHeaderBtn?: boolean;
  isDisabledSecondaryHeaderBtn?: boolean;
  onHeaderBtnPress?: () => void;
  secondaryHeaderBtnIcon?: IconType | undefined;
  isLoading?: boolean;
  isListLoading?: boolean;
  loaderText?: string;
  isShowCartIcon?: boolean;
  headerProps?: CustomHeaderProps;
  secondaryBtnTextStyle?: StyleProp<TextStyle>;
  isBtnLoading?: boolean;
  isShowFilterBtn?: boolean;
  onPressisShowFilterBtn?: () => void;
  isShowImportBtn?: boolean;
  onPressImportBtn?: () => void;
  isShowIconGroups?: boolean;
  onPressTimeIcon?: () => void;
  onPressSettingIcon?: () => void;
}

export interface CustomHeaderProps {
  onBackPress?: () => void;
  isEnableMenu?: boolean;
  headerTitle?: string;
  rightIcon?: IconType;
  onRightIconPress?: () => void;
  isRightIconEnable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isEnableTickIcon?: boolean;
  onPressTickIcon?: () => void;
}

export type StyledTextProps = {
  children: string | ReactNode;
  style?: StyleProp<TextStyle>;
  textProps?: TextProps;
  onPress?: () => void;
  textMode?: 'normal' | 'read_more';
  readMoreButtonTextStyle?: TextStyle;
  numberOfLines?: number;
};

export interface ItemSelectionMiniListProps {
  title?: string;
  listData?: any[];
  fieldName?: string;
  containerWidth?: DimensionValue;
  maxHeight?: DimensionValue;
  onSelectItem?: (item: any) => void;
  onClose?: () => void;
  secondaryName?: string;
}

export interface DropdownBoxProps
  extends ItemSelectionMiniListProps,
    SearchDropdownBoxModalProps {
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
  onSelect?: (val: any) => void;
  searchFieldName?: string;
  isEndReached?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  apiType?:
    | 'machineList'
    | 'user'
    | 'work_center'
    | 'division'
    | 'roleList'
    | 'assignedUsersList'
    | 'MaterialList'
    | 'TaskList';
  isRequired?: boolean;
  placeHolder?: string;
  iconHeight?: number;
  iconWidth?: number;
  onIconPress?: () => void;
  isEnableRightIcon?: boolean;
  bigListProps?: SearchDropdownBoxModalProps;
  ContainerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  multiSelect?: boolean;
  uniqueKey?: 'role_id' | 'task_id';
  onMultipleSelect?: (item: any[]) => void;
  isDisabledInPopup?: boolean;
  isShowClearIcon?: boolean;
  apiFilters?: ObjectType;
}

export type TextInputBoxProps = {
  title?: string;
  value?: string | number;
  onChangeText?: (text: string) => void;
  textInputProps?: TextInputProps;
  innerRef?: LegacyRef<TextInput> | undefined;
  errorText?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  customInputBoxStyle?: StyleProp<ViewStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  customInputBoxContainerStyle?: StyleProp<ViewStyle>;
  isSecure?: boolean;
  showIcon?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  icon?: IconType;
  isIconDisabled?: boolean;
  isEditable?: boolean;
  placeHolder?: string;
  isRequired?: boolean;
  keyboardType?: KeyboardType | undefined;
  disableNonEditableBg?: boolean;
  hasVerify?: boolean;
  onVerifyPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  validationType?:
    | 'NUMBER'
    | 'CHARACTER'
    | 'ALPHA_NUMERIC'
    | 'AMOUNT'
    | 'CHAR_AND_SPACE'
    | 'SEO_URL'
    | 'PREVENT_EMOJI'
    | 'PREVENT_SPECIAL_CHAR'
    | 'PREVENT_SPACE'
    | 'FLOAT'
    | 'RESTRICKT_SPACE';
};

export type DateTimePickerProps = {
  title?: string;
  mode?: 'date' | 'time' | 'datetime';
  errorText?: string;
  placeHolder?: string;
  maximumDate?: any;
  minimumDate?: any;
  isDisabled?: bolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  inputFieldStyle?: StyleProp<ViewStyle>;
  value: any;
  onSelect: (val: any) => void;
  icon?: IconType;
  isRequired?: boolean;
  dateTimePickerProps?: DateTimePickerProps | NativePickerProps;
  format?: string;
  date?: string;
};

export type BottomSheetProps = {
  bottomSheetModalRef?: Ref<BottomSheetModalMethods> | undefined;
  onClose?: () => void;
  bottomSheetModalProps?: BottomSheetModalProps;
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  snapPoints?: string[] | number[];
};

export interface ImageInputBoxProps {
  value: ImageProps[];
  onSelect: (val: ImageProps) => void;
  title?: string;
  errorText?:
    | string
    | string[]
    | FormikErrors<any>
    | FormikErrors<any>[]
    | undefined;
  isRequired?: boolean;
  imgOptions: ImageInputBoxOptionsProps[];
  onPressImgOption?: (id: number, val: ImageProps) => void;
  isShowSelectImage?: boolean;
  isRefreshing?: boolean;
  isEndRefresh?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isPreventive?: boolean;
}

export type ImageInputBoxOptionsProps = {
  id: number;
  buttonName: string;
  isVisible?: boolean;
};

export type ImageProps = {
  type: string;
  file_title: string;
  file: string;
  id?: number;
  path?: string;
  attachmentType?: number;
  created_at?: string;
  id?: number;
  note?: string;
  request_id?: number;
  status?: number;
  upload_for?: number;
  attachment_id?: number;
};

export type CameraOptionsType = {
  icon: any;
  text: string;
  id: number;
};

export type RenderImageProps = {
  item: ImageProps;
  index: number;
};

export type CreateTaskFormikDataOProps = {
  startDate: string;
  endDate: string;
  totalHrs: string;
  deviceStatusBefore: DeviceStatusProps | null;
  deviceStatusAfter: DeviceStatusProps | null;
  description: string;
  comments: string;
  doneBy: DeviceStatusProps | null;
  performedBy: any;
};

export type ColorPickerModalProps = {
  isVisible: boolean;
  colorValueType?:
    | 'hex'
    | 'rgb'
    | 'rgba'
    | 'hsv'
    | 'hsva'
    | 'hwb'
    | 'hwba'
    | 'hsl'
    | 'hsla';
  colorValue: string;
  onClose: () => void;
  onSelect: (val: string) => void;
  title?: string;
};

export type AddEdittaskProps = {
  type: 'Create' | 'Update' | 'View' | '';
  lineData: TaskListDataProps | null;
  show: boolean;
};

export type UpdatePolicyProps = {
  lineData: PolicyListDataProps | null;
  show: boolean;
};
export type ImageBoxProps = {
  src: any;
  alt: string;
  width?: any;
  height?: any;
  ImageStyle?: StyleProp<TextStyle>;
  onPress?: ((event?: any) => void) | false;
  resizeMode?: any;
  keyData?: number;
  isProfile?: boolean;
};

export type TaskPerformanceDataProps = {
  completedTaskPercentage: number;
  faultTaskPercentage: number;
};
export type LegendItemProps = {
  color: string;
  label: string;
};
export type DotProps = {
  color: string;
};

export type ChangesPasswordProps = {
  show: boolean;
  lineData: UserRequestListDataProps | null;
};
export type ActionButtonsProps = {
  onPressNegativeBtn: () => void;
  onPressPositiveBtn: () => void;
  NegativeBtnTitle?: string;
  PositiveBtnTitle?: string;
};
