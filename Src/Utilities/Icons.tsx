import successIcon from '../Assets/Svg/toast_tick.svg';
import failureIcon from '../Assets/Svg/toast_untick.svg';
import backArrowIcon from '../Assets/Svg/backArrow.svg';
import applogo from '../Assets/Svg/applogo.svg';
import visibleIcon from '../Assets/Svg/eyeVisible.svg';
import hideIcon from '../Assets/Svg/eyeInvisible.svg';
import userIcon from '../Assets/Svg/usericon.svg';
import organizationIcon from '../Assets/Svg/organization.svg';
import passwordIcon from '../Assets/Svg/password.svg';
import emailIcon from '../Assets/Svg/email.svg';
import DashboardIcon from '../Assets/Svg/dashboard_icon.svg';
import ServiceReqIcon from '../Assets/Svg/service_req_icon.svg';
import PreventiveIcon from '../Assets/Svg/preventive_icon.svg';
import LogoutIcon from '../Assets/Svg/logout_icon.svg';
import MenuIcon from '../Assets/Svg/menu_icon.svg';
import BackArrowIcon from '../Assets/Svg/back_arrow_icon.svg';
import WhiteCrossIcon from '../Assets/Svg/cross_cancel_icon.svg';
import ProfileVectorIcon from '../Assets/Svg/profile_vector.svg';
import totalServiceIcon from '../Assets/Svg/total.svg';
import onGoingServiceIcon from '../Assets/Svg/onGoing.svg';
import pendingServiceIcon from '../Assets/Svg/pending.svg';
import completedServiceIcon from '../Assets/Svg/completed.svg';
import viewIcon from '../Assets/Svg/ViewIcon.svg';
import updateIcon from '../Assets/Svg/updateIcon.svg';
import deleteIcon from '../Assets/Svg/deleteIcon.svg';
import DownArrowIcon from '../Assets/Svg/down_arrow_icon.svg';
import CloseRoundedIcon from '../Assets/Svg/close_rounded_black.svg';
import doneIcon from '../Assets/Svg/done.svg';
import editIcon from '../Assets/Svg/editIcon.svg';
import CalendarIcon from '../Assets/Svg/calendar_icon.svg';
import ProfileOptionCameraIcon from '../Assets/Svg/profile_option_camera_icon.svg';
import ProfileOptionGalleryIcon from '../Assets/Svg/profile_option_gallery_icon.svg';
import MoreOptionsIcon from '../Assets/Svg/more_option_icon.svg';
import uploadIcon from '../Assets/Svg/upload.svg';
import profileIcon from '../Assets/Svg/profileIcon.svg';
import profileEditIcon from '../Assets/Svg/profileEdit.svg';
import dashboardActiveIcon from '../Assets/Svg/dashboardActive.svg';
import serviceReqActiveIcon from '../Assets/Svg/serviceReqActive.svg';
import preventiveActiveIcon from '../Assets/Svg/preventiveActive.svg';
import profileActiveIcon from '../Assets/Svg/profileActive.svg';
import service_icon from '../Assets/Svg/Service_icon.svg';
import preventive_icon from '../Assets/Svg/preventive_req_icon.svg';
import WorkOrderIcon from '../Assets/Svg/work_order_icon.svg';
import WorkOrderActiveIcon from '../Assets/Svg/work_order_active_icon.svg';
import RoleIcon from '../Assets/Svg/userRole.svg';
import UserMenuIcon from '../Assets/Svg/userMenuIcon.svg';
import ApprovalIcon from '../Assets/Svg/ApprovalStatus.svg';
import FilterIcon from '../Assets/Svg/FilterIcon.svg';

import DummyImage from '../Assets/Images/dummyImage.png';
import TaskAssignIcon from '../Assets/Svg/task_assign_icon.svg';
import ChartIcon from '../Assets/Svg/ChartIcon.svg';
import leftArrowIcon from '../Assets/Svg/leftArrow.svg';
import rightArrowIcon from '../Assets/Svg/rightArrow.svg';

//
import MasterIconWhite from '../Assets/Icons/MasterIconWhite.png';
import MasterIconBlack from '../Assets/Icons/MasterIconDark.png';
import MachinesIconBlack from '../Assets/Icons/MachinesIconBlack.png';
import MachinesIconWhite from '../Assets/Icons/MachinesIconWhite.png';

import TaskIconBlack from '../Assets/Icons/TaskIconBlack.png';
import TaskIconWhite from '../Assets/Icons/TaskIconWhite.png';
import PolicyIconBlack from '../Assets/Icons/PolicyIconBlack.png';
import PolicyIconWhite from '../Assets/Icons/PolicyIconWhite.png';
import DivisionIconBlack from '../Assets/Icons/DivisionIconBlack.png';
import DivisionIconWhite from '../Assets/Icons/DivisionIconWhite.png';
import MaterialIconBlack from '../Assets/Icons/materialIconBlack.png';
import MaterialIconWhite from '../Assets/Icons/materialIconWhite.png';
import WorkCenterIconBlack from '../Assets/Icons/WorkCenterBlack.png';
import WorkCenterIconWhite from '../Assets/Icons/WorkCenterBlack.png';
import HolidayIconBlack from '../Assets/Icons/HolidayIconBlack.png';
import HolidayIconWhite from '../Assets/Icons/HolidayIconWhite.png';
import PreventiveIconBlack from '../Assets/Icons/PreventiveIconBlack.png';
import PreventiveIconWhite from '../Assets/Icons/PreventiveIconWhite.png';

import DowntimeIconBlack from '../Assets/Icons/DowntimeIconBlack.png';
import DowntimeIconWhite from '../Assets/Icons/DowntimeIconWhite.png';
import UserIconBlack from '../Assets/Icons/userIconBlack.png';
import UserIconWhite from '../Assets/Icons/userIconWhite.png';

import UserListIconBlack from '../Assets/Icons/userListIconBlack.png';
import UserListIconWhite from '../Assets/Icons/userListIconWhite.png';

import RoleIconBlack from '../Assets/Icons/RoleIconBlack.png';
import RoleIconWhite from '../Assets/Icons/RoleIconWhite.png';

import MTTRMonthlyIconBlack from '../Assets/Icons/MttrMonthlyBlack.png';
import MTTRMonthlyIconWhite from '../Assets/Icons/MttrMonthlyWhite.png';
import SpindleIconBlack from '../Assets/Icons/spindleIconBlack.png';
import SpindleIconWhite from '../Assets/Icons/spindleIconWhite.png';
import YearlyIconBlack from '../Assets/Icons/YearlyReportBlackIcon.png';
import YearlyIconWhite from '../Assets/Icons/YearlyReportWhiteIcon.png';

import MTBFIconBlack from '../Assets/Icons/MtbfIconBlack.png';
import MTBFIconWhite from '../Assets/Icons/MtbfIconWhite.png';
export type IconType =
  | 'MTBFIconBlack'
  | 'MTBFIconWhite'
  | 'YearlyIconBlack'
  | 'YearlyIconWhite'
  | 'SpindleIconBlack'
  | 'SpindleIconWhite'
  | 'MTTRMonthlyIconBlack'
  | 'MTTRMonthlyIconWhite'
  | 'RoleIconBlack'
  | 'RoleIconWhite'
  | 'UserListIconBlack'
  | 'UserListIconWhite'
  | 'UserIconBlack'
  | 'UserIconWhite'
  | 'DowntimeIconBlack'
  | 'DowntimeIconWhite'
  | 'PreventiveIconBlack'
  | 'PreventiveIconWhite'
  | 'MaterialIconBlack'
  | 'MaterialIconWhite'
  | 'WorkCenterIconBlack'
  | 'WorkCenterIconWhite'
  | 'HolidayIconBlack'
  | 'HolidayIconWhite'
  | 'DivisionIconBlack'
  | 'DivisionIconWhite'
  | 'PolicyIconBlack'
  | 'PolicyIconWhite'
  | 'TaskIconBlack'
  | 'TaskIconWhite'
  | 'MachinesIconWhite'
  | 'MachinesIconBlack'
  | 'MasterIconBlack'
  | 'MasterIconWhite'
  | 'leftArrowIcon'
  | 'rightArrowIcon'
  | 'ChartIcon'
  | 'FilterIcon'
  | 'ApprovalIcon'
  | 'DummyImage'
  | 'RoleIcon'
  | 'UserMenuIcon'
  | 'successIcon'
  | 'failureIcon'
  | 'backArrowIcon'
  | 'applogo'
  | 'visibleIcon'
  | 'hideIcon'
  | 'userIcon'
  | 'organizationIcon'
  | 'passwordIcon'
  | 'emailIcon'
  | 'preventive_icon'
  | 'service_req_icon'
  | 'dashboard_icon'
  | 'logout'
  | 'menu'
  | 'back_arrow'
  | 'white_cross'
  | 'profile_vector'
  | 'totalServiceIcon'
  | 'onGoingServiceIcon'
  | 'pendingServiceIcon'
  | 'completedServiceIcon'
  | 'viewIcon'
  | 'updateIcon'
  | 'deleteIcon'
  | 'down_arrow'
  | 'close_rounded_black'
  | 'doneIcon'
  | 'editIcon'
  | 'calendar'
  | 'profile_option_camera'
  | 'profile_option_gallery'
  | 'more_option'
  | 'uploadIcon'
  | 'profileIcon'
  | 'profileEditIcon'
  | 'dashboardActiveIcon'
  | 'serviceReqActiveIcon'
  | 'preventiveActiveIcon'
  | 'profileActiveIcon'
  | 'service_icon'
  | 'preventive_req__icon'
  | 'work_order_icon'
  | 'work_order_active_icon'
  | 'TaskAssignIcon';

export const ICONS = {
  successIcon,
  failureIcon,
  backArrowIcon,
  applogo,
  visibleIcon,
  hideIcon,
  userIcon,
  organizationIcon,
  passwordIcon,
  emailIcon,
  preventive_icon: PreventiveIcon,
  service_req_icon: ServiceReqIcon,
  dashboard_icon: DashboardIcon,
  logout: LogoutIcon,
  back_arrow: BackArrowIcon,
  menu: MenuIcon,
  white_cross: WhiteCrossIcon,
  profile_vector: ProfileVectorIcon,
  totalServiceIcon,
  onGoingServiceIcon,
  pendingServiceIcon,
  completedServiceIcon,
  viewIcon,
  updateIcon,
  deleteIcon,
  down_arrow: DownArrowIcon,
  close_rounded_black: CloseRoundedIcon,
  doneIcon,
  editIcon,
  calendar: CalendarIcon,
  profile_option_camera: ProfileOptionCameraIcon,
  profile_option_gallery: ProfileOptionGalleryIcon,
  more_option: MoreOptionsIcon,
  uploadIcon,
  profileIcon,
  profileEditIcon,
  dashboardActiveIcon,
  serviceReqActiveIcon,
  preventiveActiveIcon,
  profileActiveIcon,
  service_icon,
  preventive_req__icon: preventive_icon,
  work_order_icon: WorkOrderIcon,
  work_order_active_icon: WorkOrderActiveIcon,
  RoleIcon,
  UserMenuIcon,
  DummyImage,
  TaskAssignIcon,
  ApprovalIcon,
  FilterIcon,
  ChartIcon,
  rightArrowIcon,
  leftArrowIcon,
  MasterIconWhite,
  MasterIconBlack,
  MachinesIconBlack,
  MachinesIconWhite,
  TaskIconBlack,
  TaskIconWhite,
  PolicyIconBlack,
  PolicyIconWhite,
  DivisionIconBlack,
  DivisionIconWhite,
  MaterialIconBlack,
  MaterialIconWhite,
  WorkCenterIconBlack,
  WorkCenterIconWhite,
  HolidayIconBlack,
  HolidayIconWhite,
  PreventiveIconBlack,
  PreventiveIconWhite,
  DowntimeIconBlack,
  DowntimeIconWhite,
  UserIconBlack,
  UserIconWhite,
  UserListIconBlack,
  UserListIconWhite,
  RoleIconBlack,
  RoleIconWhite,
  MTTRMonthlyIconBlack,
  MTTRMonthlyIconWhite,
  SpindleIconBlack,
  SpindleIconWhite,
  YearlyIconBlack,
  YearlyIconWhite,

  MTBFIconBlack,
  MTBFIconWhite,
};
