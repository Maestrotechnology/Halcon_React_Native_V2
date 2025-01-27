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
  return axios.post('srStatusCards', data);
};

export const getDashboardMonthlyReportService = (data: FormData) => {
  return axios.post('monthly_report', data);
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
  return axios.post(`list_preventive?page=${page}&size=${'20'}`, data);
};

export const viewPreventiveSRService = (
  data: FormData,
  page: number,
  size: number,
) => {
  return axios.post(`view_preventive?page=${page}&size=${size}`, data);
};

export const preventiveTaskListService = (
  data: FormData,
  page: number,
  size: number,
) => {
  return axios.post(`list_tasks?page=${page}&size=${size}`, data);
};

export const deletePreventiveRequestService = (data: FormData) => {
  return axios.post('delete_preventive', data);
};

export const updatePreventiveTaskService = (data: any) => {
  return axios.post('edit_preventive', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createTaskMappingService = (data: any) => {
  return axios.post('create_task_mapping', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
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

export const getServiceRequestListService = (data: FormData, page: number) => {
  return axios.post(`list_request?page=${page}&size=10`, data);
};

export const deleteServiceRequestService = (data: FormData) => {
  return axios.post('delete_request', data);
};

export const createServiceRequestService = (data: any) => {
  return axios.post('/create_request', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateServiceRequestService = (data: any) => {
  return axios.post('update_request', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const fileUploadService = (data: FormData) => {
  return axios.post('file_upload', data);
};

export const viewServiceRequestService = (data: FormData) => {
  return axios.post('view_request', data);
};

export const getAttachmentsListService = (data: FormData, page: number) => {
  return axios.post(`list_file_upload?page=${page}&size=20`, data);
};

export const deleteAttachmentsService = (data: FormData) => {
  return axios.post('delete_file_upload', data);
};

export const workStartService = (data: FormData) => {
  return axios.post('service_request/startService', data);
};

export const getTaskDetailsListService = (data: FormData, page: number) => {
  return axios.post(`list_intervention?page=${page}&size=10`, data);
};

export const deleteTaskDetailService = (data: FormData) => {
  return axios.post('delete_intervention', data);
};

export const createTaskDetailService = (data: any) => {
  return axios.post('add_intervention', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateTaskDetailService = (data: any) => {
  return axios.post('edit_intervention', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const closeWorkService = (data: FormData) => {
  return axios.post('service_request/requestClose', data);
};

// Dropdown List Service's

export const getMachineDropdownListService = (data: FormData) => {
  return axios.post('machine_dropdown', data);
};
export const getUserDropdownListService = (data: FormData) => {
  return axios.post('user_dropdown', data);
};
export const getWorkCenterDropdownListService = (data: FormData) => {
  return axios.post('workCenterDropdown', data);
};
export const getDivisionDropdownListService = (data: FormData) => {
  return axios.post('division_dropdown', data);
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
