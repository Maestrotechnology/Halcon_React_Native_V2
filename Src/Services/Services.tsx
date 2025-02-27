import {ObjectType} from '../Components/types';
import {JSONHeaderType} from '../Utilities/Constants';
import axios from './Axios';

// Authentication Services

export const loginService = (data: FormData) => {
  return axios.post('/login', data);
};

export const forgotPasswordService = (data: FormData) => {
  return axios.post('/forgotPassword', data);
};

export const verifyOtpService = (data: FormData) => {
  return axios.post('/verify_otp', data);
};

export const resendOtpService = (data: FormData) => {
  return axios.post('/resend_otp', data);
};

export const resetPasswordService = (data: FormData) => {
  return axios.post('/reset_password', data);
};

export const logoutService = (data: FormData) => {
  return axios.post('/logout', data);
};

// Dashboard Service's

export const getServiceRequestReportService = (data: FormData) => {
  return axios.post('/service_dashboard/serviceCard', data);
};
export const getPreventiveRequestReportService = (data: FormData) => {
  return axios.post('/service_dashboard/preventiveSr_card', data);
};

export const getMachineListService = (
  data: FormData,
  page: number,
  size: number,
) => {
  return axios.post(
    `/service_dashboard/list_machine_service?page=${page}&size=${size}`,
    data,
  );
};

export const getDashboardCardsService = (data: FormData) => {
  return axios.post('dashboard/srStatusCards', data);
};

export const getDashboardMonthlyReportService = (data: FormData) => {
  return axios.post('report/monthly_report', data);
};

// Preventive Service Request
export const addPreventiveRequestService = (data: any) => {
  return axios.post('add_preventive', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const getPreventiveSRListService = (data: FormData, page: number) => {
  return axios.post(
    `service_request/list_preventive?page=${page}&size=${'20'}`,
    data,
  );
};

export const viewPreventiveSRService = (
  data: FormData,
  page: number,
  size: number,
) => {
  return axios.post(
    `service_request/view_preventive?page=${page}&size=${size}`,
    data,
  );
};

export const preventiveTaskListService = (
  data: FormData,
  page: number,
  size: number,
) => {
  return axios.post(`list_tasks?page=${page}&size=${size}`, data);
};

export const deletePreventiveRequestService = (data: FormData) => {
  return axios.post('service_request/delete_preventive', data);
};

export const updatePreventiveTaskService = (data: any) => {
  return axios.post('service_request/edit_preventive', data, JSONHeaderType);
};

export const createTaskMappingService = (data: any) => {
  return axios.post('create_task_mapping', data, JSONHeaderType);
};

export const createPreventiveTaskService = (data: FormData) => {
  return axios.post('/service_request/create_preventive_task', data);
};

export const editPreventiveTaskService = (data: FormData) => {
  return axios.post('/service_request/edit_preventive_task', data);
};

export const deletePreventiveTaskServices = (data: FormData) => {
  return axios.post('/service_request/deletePreventive_task', data);
};

// Service Request Service's

export const checkSubscriptionService = (data: FormData) => {
  return axios.post('checkSubscription', data);
};

export const exportServiceRequestService = (data: FormData) => {
  return axios.post('export_request', data);
};

export const getServiceRequestApprovalStatusListService = (
  data: FormData,
  page: number,
) => {
  return axios.post(
    `service_request/list_approval_status?page=${page}&size=10`,
    data,
  );
};
export const editApprovalStatus = (data: FormData) => {
  return axios.post(`service_request/edit_approval`, data);
};
export const getServiceRequestListService = (data: FormData, page: number) => {
  return axios.post(`service_request/list_request?page=${page}&size=10`, data);
};

export const deleteServiceRequestService = (data: FormData) => {
  return axios.post('service_request/delete_request', data);
};

export const createServiceRequestService = (data: any) => {
  return axios.post('service_request/create_request', data, JSONHeaderType);
};

export const updateServiceRequestService = (data: any) => {
  return axios.post('service_request/update_request', data, JSONHeaderType);
};

export const fileUploadService = (data: FormData) => {
  return axios.post('service_request/file_upload', data);
};

export const viewServiceRequestService = (data: FormData) => {
  return axios.post('service_request/view_request', data);
};

export const getAttachmentsListService = (data: FormData, page: number) => {
  return axios.post(
    `service_request/list_file_upload?page=${page}&size=20`,
    data,
  );
};

export const deleteAttachmentsService = (data: FormData) => {
  return axios.post('service_request/delete_file_upload', data);
};

export const workStartService = (data: FormData) => {
  return axios.post('service_request/startService', data);
};

export const getTaskDetailsListService = (data: FormData, page: number) => {
  return axios.post(
    `service_request/list_intervention?page=${page}&size=10`,
    data,
  );
};

export const deleteTaskDetailService = (data: FormData) => {
  return axios.post('service_request/delete_intervention', data);
};

export const createTaskDetailService = (data: any) => {
  return axios.post('service_request/add_intervention', data, JSONHeaderType);
};

export const updateTaskDetailService = (data: ObjectType) => {
  return axios.post('service_request/edit_intervention', data, JSONHeaderType);
};

export const closeWorkService = (data: FormData) => {
  return axios.post('service_request/requestClose', data);
};

// Dropdown List Service's

export const getMachineDropdownListService = (data: FormData) => {
  return axios.post('dropdown/machine_dropdown', data);
};
export const getUserDropdownListService = (data: FormData) => {
  return axios.post('dropdown/user_dropdown', data);
};
export const getWorkCenterDropdownListService = (data: FormData) => {
  return axios.post('dropdown/work_center_dropdown', data);
};
export const getDivisionDropdownListService = (data: FormData) => {
  return axios.post('dropdown/dropdown_division', data);
};
export const getRoleDropdownListService = (data: FormData) => {
  return axios.post('dropdown/dropdown_role', data);
};
export const getTasksListService = (data: FormData, page: number) => {
  return axios.post(`masters/list_tasks?page=${page}&size=500`, data);
};

// Profile
export const getProfileService = (data: FormData) => {
  return axios.post('masters/view_profile', data);
};

export const updateProfileService = (data: FormData) => {
  return axios.post('masters/update_profile', data);
};

export const verifyProfileEmailAndPhoneService = (data: FormData) => {
  return axios.post('masters/verify_email_mobile', data);
};

export const verifyOtpProfileService = (data: FormData) => {
  return axios.post('masters/verify_otp_profile', data);
};
export const getAccessUserService = (data: FormData) => {
  return axios.post('masters/get_access_user', data);
};

export const listWorkOrderService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_work_order?page=${page}&size=20`, data);
};

export const deleteWorkOrderService = (data: FormData) => {
  return axios.post('masters/delete_work_order', data);
};

export const createWorkOrderService = (data: FormData) => {
  return axios.post('masters/create_work_order', data);
};

export const updateWorkOrderService = (data: FormData) => {
  return axios.post('masters/update_work_order', data);
};

// User Management

// User

export const listUserService = (data: FormData, page: number) => {
  return axios.post(`/user/list_user?page=${page}&size=20`, data);
};

export const CreateUserService = (data: ObjectType) => {
  return axios.post(`/user/create_user`, data, JSONHeaderType);
};

export const UpdateUserService = (data: ObjectType) => {
  return axios.post(`/user/update_user`, data, JSONHeaderType);
};
export const deleteUserService = (data: FormData) => {
  return axios.post('/user/delete_user', data);
};
export const ChangeStatusUserService = (data: FormData) => {
  return axios.post('/user/update_status', data);
};

// Access Roles

export const listAccessRoleService = (data: FormData, page: number) => {
  return axios.post(`/user/list_role?page=${page}&size=20`, data);
};

export const CreateAccessRoleService = (data: ObjectType) => {
  return axios.post(`/user/create_role`, data, JSONHeaderType);
};

export const UpdateAccessRoleService = (data: ObjectType) => {
  return axios.post(`/user/update_role`, data, JSONHeaderType);
};
export const ViewAccessRoleService = (data: ObjectType) => {
  return axios.post(`/user/view_role`, data);
};
export const deleteAccessRoleService = (data: FormData) => {
  return axios.post('/user/delete_role', data);
};
// export const ChangeStatusAccessRoleService = (data: FormData) => {
//   return axios.post('/user/update_status', data);
// };

// Task

export const listTasksService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_tasks?page=${page}&size=20`, data);
};

export const CreateTasksService = (data: FormData) => {
  return axios.post(`/masters/create_task`, data);
};

export const UpdateTasksService = (data: FormData) => {
  return axios.post(`/masters/update_task`, data);
};
export const deleteTasksService = (data: FormData) => {
  return axios.post('/masters/delete_task', data);
};

// Policy

export const listPolicyService = (data: FormData, page: number) => {
  return axios.post(`/masters/listPolicy?page=${page}&size=20`, data);
};

export const UpdatePlicyService = (data: FormData) => {
  return axios.post(`/masters/updatePolicy`, data);
};
// Division

export const listDivisionService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_divisions?page=${page}&size=20`, data);
};

export const CreateDivisionService = (data: FormData) => {
  return axios.post(`/masters/create_division`, data);
};

export const UpdateDivisionService = (data: FormData) => {
  return axios.post(`/masters/update_division`, data);
};
export const deleteDivisionService = (data: FormData) => {
  return axios.post('/masters/delete_division', data);
};
// Meterial List

export const listMaterialService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_materials?page=${page}&size=20`, data);
};

export const CreateMaterialService = (data: ObjectType) => {
  return axios.post(`/masters/add_material`, data, JSONHeaderType);
};

export const UpdateMaterialService = (data: ObjectType) => {
  return axios.post(`/masters/edit_material`, data, JSONHeaderType);
};
export const deleteMaterialService = (data: FormData) => {
  return axios.post('/masters/delete_material', data);
};
// Meterial List

export const listWorkCenterService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_work_center?page=${page}&size=20`, data);
};

export const CreateWorkCenterService = (data: ObjectType) => {
  return axios.post(`/masters/create_work_center`, data);
};

export const UpdateWorkCenterService = (data: ObjectType) => {
  return axios.post(`/masters/edit_work_center`, data);
};
export const deleteWorkCenterService = (data: FormData) => {
  return axios.post('/masters/delete_work_center', data);
};

// Holiday List

export const listSpecialHolidayService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_special_holiday?page=${page}&size=20`, data);
};

export const CreateSpecialHolidayService = (data: ObjectType) => {
  return axios.post(`/masters/add_special_holiday`, data);
};

export const UpdateSpecialHolidayService = (data: ObjectType) => {
  return axios.post(`/masters/update_specialholiday`, data);
};
export const deleteSpecialHolidayService = (data: FormData) => {
  return axios.post('/masters/delete_specialholiday', data);
};
export const listRegularHolidayService = (data: FormData) => {
  return axios.post('/masters/list_regular_holiday', data);
};
export const CreateRegularHolidayService = (data: FormData) => {
  return axios.post('/masters/add_regular_holiday', data);
};

//machine list
export const listMachinesService = (data: FormData, page: number) => {
  return axios.post(`/masters/list_machines?page=${page}&size=20`, data);
};

export const CreateMachineService = (data: FormData) => {
  return axios.post('masters/create_machine', data);
};

export const UpdateMachineService = (data: FormData) => {
  return axios.post('masters/update_machine', data);
};

export const DeleteMachineService = (data: FormData) => {
  return axios.post('masters/delete_machine', data);
};

export const MachineMappingListService = (data: FormData, page: number) => {
  return axios.post(
    `machine_task_mapping/viewTaskMachineMapping?page=${page}&size=20`,
    data,
  );
};

export const CreateTasksMachineService = (data: any) => {
  return axios.post(
    `machine_task_mapping/createTaskstoMachine`,
    data,
    JSONHeaderType,
  );
};
export const deleteMachineMappedTasksService = (data: ObjectType) => {
  return axios.post(
    '/machine_task_mapping/deleteTaskMapping',
    data,
    JSONHeaderType,
  );
};
// Dropdown Lists
export const RoleDropdownListService = (data: FormData) => {
  return axios.post('dropdown/dropdown_role', data);
};
export const AssignedUserDropdownListService = (data: FormData) => {
  return axios.post('dropdown/get_assigned_users', data);
};
export const MaterialDropdownListService = (data: FormData) => {
  return axios.post('dropdown/material_dropdown', data);
};

// Reports

export const SpindleReportGraphListService = (data: FormData, page = 1) => {
  return axios.post(`/report/spindle_report_graph?page=${page}&size=10`, data);
};
export const TaskPerformanceService = (data: FormData) => {
  return axios.post('dashboard/performance', data);
};

export const SpindleReportListService = (data: FormData, page: number) => {
  return axios.post(`/report/spindle_report?page=${page}&size=${10}`, data);
};

export const AddSpindleHoursService = (data: FormData) => {
  return axios.post(`/spindle/add_spindle`, data);
};
export const ListMTTRreportService = (data: FormData) => {
  return axios.post(`/report/mttrReport`, data);
};
export const ListMTBFreportService = (data: FormData) => {
  return axios.post(`/report/mtbfReport`, data);
};
export const ListMTTRMonthlyreportService = (data: FormData, page: number) => {
  return axios.post(`/report/month_mttrReport?page=${page}&size=10`, data);
};
export const UpdateTaskMappingService = (data: any) => {
  return axios.post(
    '/machine_task_mapping/updateTaskMachineMapping',
    data,
    JSONHeaderType,
  );
};
export const AddNewTasksMappingService = (data: any) => {
  return axios.post(
    '/machine_task_mapping/addMachineTasks',
    data,
    JSONHeaderType,
  );
};
