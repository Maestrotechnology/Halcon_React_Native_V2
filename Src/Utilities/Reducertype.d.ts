import {Insets} from 'react-native';

export type ReducerProps = {
  login: LoginReducersProp;
  loader: LoaderReducerProp;
  route: RouteReducerProp;
  utility: UtilityReducerProp;
  permission: PermissionReducerProp;
};

export type LoginReducersProp = {
  token: string;
  userDetails: userDataProp;
  rememberData: userDataProp;
  userProfileData: UserProfileDataProp;
  confirmationModal: boolean;
  location: LocationProp | null;
  baseurl: string;
  selectedDrawerOption: number;
};
export type LoaderReducerProp = {
  loader: boolean;
};

export type RouteReducerProp = {
  activeRoute: string;
};
export type UtilityReducerProp = {
  insets: Insets;
  deepLinkData: any;
};

export type PermissionReducerProp = {
  permissions: AccessPermissionProps;
};

export type userDataProp = {
  base_url: string;
  duration: number;
  image: string;
  msg: string;
  org_code: string;
  permissionData: AccessPermissionProps;
  projectId: number;
  resetKey: null;
  status: number;
  token: string;
  userSubscriptionPlan: number;
  user_code: string;
  user_id: number;
  user_name: string;
  username: string;
  user_type: number;
  verifyStatus: number;
  remember: boolean;
  password: string;
};

export type UserProfileDataProp = {
  alternative_mobile: string;
  designation: string;
  email_id: string;
  employeeEntry: number;
  name: string;
  org_code: string;
  phone_no: string;
  pic: string;
  rfid: string;
  user_id: string;
};
export type LocationProp = {
  latitude: number;
  longitude: number;
};

export type AccessPermissionProps = {
  maintenance_menu: number;
  preventive_sr: PreventivePermissionProps;
  service_dashboard: DashboardPermissionProps;
  service_request: ServiceRequestPermissionProps;
  maintenance_workorder: MaintenanceWorkOrderPermissions;
};
export type PreventivePermissionProps = {
  add: number;
  delete: number;
  preventive_sr_menu: number;
  update: number;
  view: number;
};

export type ServiceRequestPermissionProps = {
  add: number;
  delete: number;
  edit: 1;
  service_request_menu: number;
  update: number;
  view: number;
};

export type MaintenanceWorkOrderPermissions = {
  add: number;
  delete: number;
  edit: number;
  work_order_menu: number;
};

export type DashboardPermissionProps = {
  machine_list: number;
  service_dashboard_menu: number;
};

export type UserPermissionKeyProps =
  | 'maintenance_menu'
  | 'preventive_sr'
  | 'service_dashboard'
  | 'service_request'
  | 'maintenance_workorder';
