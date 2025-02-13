import {RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ServiceRequestItemsProps,
  TaskDetailsDataItemsProps,
  UserRequestListDataProps,
} from './api';

export type MainStackParamList = {
  DrawerNavigation: undefined;
  DemoScreen: undefined;
};

export type DrawerNavigationParamList = {
  Dashboard: undefined;
  User: undefined;
  ServiceRequestStack: undefined;
  PreventiveSRStack: undefined;
  PermisionDeniedStack: undefined;
  ProfileStack: undefined;
  MaintenaceWorkOrderStack: undefined;
  UserManagementStack: undefined;
  MastersStack: undefined;
};

export type DrawerScreensProps = {
  name: keyof DrawerNavigationParamList;
  component:
    | ScreenComponentType<
        DrawerNavigationParamList,
        keyof DrawerNavigationParamList
      >
    | undefined;
  hasPermission: number;
};

export type ServiceRequestCreationStackParamsDataProps = {
  serviceReqData?: ServiceRequestItemsProps;
  isCreate?: boolean;
  isView?: boolean;
  isUpdate?: boolean;
  isServiceUpdate?: boolean;
};

export type ServiceRequestParamsDataProps = {
  machineId?: number;
  serviceType?: number;
};

export type ServiceRequestStackParamList = {
  ServiceRequest: undefined;
  ServiceRequestCreationStack: ServiceRequestCreationStackParamsDataProps;
};
export type AddEditUserNavigationProps = {
  type: 'Create' | 'Update' | 'View';
  lineData?: UserRequestListDataProps;
};
export type UserStackStackParamList = {
  UserList: undefined;
  AddEditUser: AddEditUserNavigationProps;
  AccessRoleList: undefined;
};
export type MasterStackStackParamList = {
  TasksList: undefined;
};

export type PreventiveSRStackParamList = {
  PreventiveSR: undefined;
  UpdatePreventiveRequest: undefined;
  PreventiveFileUpload: undefined;
  PreventiveTasks: undefined;
  AssignTasks: undefined;
};

export type MaintananceWorkOrderParamList = {
  MaintenacneWorkOrder: undefined;
  AddWorkOrder: undefined;
};

export type FileUploadingScreenParamDataProps = {
  isFrom: 'deviceFailure' | 'TaskDetails';
};

export type CreateTaskScreenParamsDataProps = {
  isCreate?: boolean;
  isUpdate?: boolean;
  isView?: boolean;
  taskItemData?: TaskDetailsDataItemsProps;
  isFrom?: 'deviceFailure' | 'TaskDetails';
};

export type ServiceRequestCreationStackParamList = {
  DeviceFailreInfo: undefined;
  FileUploading: FileUploadingScreenParamDataProps &
    CreateTaskScreenParamsDataProps;
  TaskDetails: undefined;
  ServiceRequest?: undefined;
  CreateTask: CreateTaskScreenParamsDataProps;
  TaskDetailsFileUploading: CreateTaskScreenParamsDataProps;
};

export type DrawerNavigationProps = {
  route: RouteProp<DrawerNavigationParamList, keyof DrawerNavigationParamList>;
  navigation: DrawerNavigationScreensProps<DrawerNavigationParamList>;
};
export type MastersStackNavigationProps =
  NativeStackScreenProps<MasterStackStackParamList>;

export type UserScreensNavigationProps =
  NativeStackScreenProps<UserStackStackParamList>;

export type ServiceRequestScreensNavigationProps =
  NativeStackScreenProps<ServiceRequestStackParamList>;

export type PreventiveSRScreensNavigationProps =
  NativeStackScreenProps<PreventiveSRStackParamList>;

export type ServiceRequestCreationScreensNavigationProps =
  NativeStackScreenProps<ServiceRequestCreationStackParamList>;

export type PreventiveRequestUpdateScreensNavigationProps =
  NativeStackScreenProps<ServiceRequestCreationStackParamList>;
