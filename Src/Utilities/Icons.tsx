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

export type IconType =
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
  | 'work_order_active_icon';

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
  ApprovalIcon,
  FilterIcon,
};
