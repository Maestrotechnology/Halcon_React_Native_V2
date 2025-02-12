export type ApiResponse<T> = {
  status: number;
  msg: string;
  data: PaginationData<T>;
  items: PaginationData<T>;
  total_page?: number;
};
export interface PaginationData<T> {
  page: number;
  size: number;
  total_count: number;
  total_page: number;
  items: T[];
}
export type DashboardCountApiResponseProps = {
  data: DashboardChartProps[];
  msg: string;
  pendingData: number;
  status: number;
  totalCompleted: number;
  totalOnGoing: number;
  totalService: number;
};

export type DashboardCardsApiResponseProps = {
  data: DashboardCardsApiDataProps;
  msg: Success;
  status: number;
};
export type DashboardCardsApiDataProps = {
  SR: {
    total: number;
    pending: number;
    ongoing: number;
    completed: number;
  };
  PreventiveSR: {
    total: number;
    pending: number;
    ongoing: number;
    completed: number;
  };
};

export type DashboardCardKeyProps =
  | 'ongoing'
  | 'completed'
  | 'total'
  | 'pending';

export type DashboardChartDetailsApiResponseProps = {
  status: number;
  msg: string;
  data: DashboardChartDetailsDataResponseProps;
};

export type DashboardChartDetailsDataResponseProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: DashboardChartDetailsItemsResponseProps[];
};

export type DashboardChartDetailsItemsResponseProps = {
  machine_id: number;
  machine_name: string;
  service_count: number;
  CompletedServiceCount: number;
  TotalServiceCount: number;
  completedPreventive: number;
  totalPreventive: number;
};

export type DashboardMonthlyReportProps = {
  serviceRequest: ServiceRequestReportDataProps[];
  preventiveRequest: PreventiveRequestReportDataProps[];
};

export type ServiceRequestReportDataProps = {
  created_at: string;
  total_sr: number;
  totalCompleted: number;
  toatlOngoing: number;
};
export type PreventiveRequestReportDataProps = {
  created_at: string;
  total_preventive: number;
  totalCompletedPr: number;
  toatlOngoingPr: number;
};
// Preventive Service Request

export type PreventiveSRListApiProps = {
  msg: string;
  status: number;
  data: PreventiveSRListApiDataProps;
};

export type PreventiveSRListApiDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: PreventiveSRListDataProps[];
};

export type PreventiveSRListDataProps = {
  comments: string;
  completed_date: string;
  duration: string;
  expected_completion_date: string;
  machine_id: number;
  machine_name: string;
  req_date: string;
  request_id: number;
  request_status: number;
  request_status_name: string;
  schedule_date: string;
};
export type PreventiveViewApiProps = {
  msg: string;
  status: number;
  data: PreventiveViewApiDataProps;
};

export type PreventiveViewApiDataProps = {
  comments: string;
  completed_date: string;
  equipment_id: string;
  expected_completion_date: string;
  machine_id: number;
  machine_name: string;
  material_list: [];
  req_date: string;
  request_id: number;
  request_status: number;
  request_status_name: string;
  schedule_date: string;
  selected_task: PreventiveViewSelectedTaskProps[];
  all_task: PreventiveViewAllTaskProps[];
};

export type PreventiveViewSelectedTaskProps = {
  created_at: string;
  end_date: string;
  preventive_request_id: number;
  start_date: string;
  status: number;
  task_id: number;
};

export type PreventiveViewAllTaskProps = {
  created_at: string;
  created_by: number;
  division_description: string;
  division_id: number;
  equipment_id: string;
  id: number;
  machine_id: number;
  machine_name: string;
  task_id: number;
  task_name: string;
  updated_at: string;
};

export type PreventiveTaskListApiProps = {
  msg: string;
  status: number;
  data: PreventiveTaskListApiDataProps;
};

export type PreventiveTaskListApiDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: PreventiveTaskListProps[];
};

export type PreventiveTaskListProps = {
  control_key: string;
  created_at: string;
  task_id: number;
  task_name: string;
  updated_at: string;
};

export type DashboardChartProps = {
  month: number;
  total: number;
  on_going: number;
  completed: number;
};
// User List Response

export type DeleteUserApiResposneProps = {
  msg: string;
  status: number;
};
export interface UserRequestListDataProps {
  address: string;
  city: string;
  country: string;
  created_by: number;
  email: string;
  mobile_no: any;
  name: string;
  role_id: number;
  role_name: string;
  state: string;
  status: number;
  user_id: number;
  username: string;
}

export type ServiceRequestListApiResponseProps = {
  status: number;
  msg: string;
  data: ServiceRequestListDataProps;
};

export type ServiceRequestListDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: ServiceRequestItemsProps[];
};

export type ServiceRequestItemsProps = {
  availablity_reason: string;
  clear_alarm: number;
  completed_date: string;
  created_at: string;
  created_by: number;
  created_by_name: string;
  date_of_error_occur: string;
  division_description: string;
  division_id: number;
  division_name: string;
  efmea_date: string;
  efmea_status: string;
  employee_id: number;
  engineer_completion_date: string;
  engineer_id: number;
  engineer_name: string;
  equipment_id: string;
  error_message_alarm: string;
  error_verify_date: string;
  expected_completion_date: string;
  failure_time: string;
  geometry_status: number;
  identified_error: string;
  location: string;
  machine_id: number;
  machine_limitations: string;
  machine_name: string;
  machine_serial_no: number;
  machine_status: number;
  machine_status_at_alarm: number;
  machine_status_name: string;
  material_list_reason: string;
  operator_id: string;
  operator_name: string;
  perceived_inadequacy: string;
  pr_number: string;
  problem_description: string;
  problem_deviation: string;
  problem_rectified_status: string;
  problem_status: null;
  promise_date: string;
  received_by: string;
  receiving_date: string;
  recurring_problem: string;
  relevant_details: string;
  report_no: string;
  request_id: number;
  request_status: number;
  request_status_name: string;
  requested_by: string;
  requested_comments: string;
  requested_date: string;
  required_spare_parts: string;
  restart_machine: string;
  restart_program: string;
  schedule_date: string;
  service_date: string;
  service_deviation: string;
  service_order: string;
  service_team_comments: string;
  serviceable_or_not: string;
  shift: number;
  spare_availablity: string;
  start_date: string;
  status: number;
  supervisor_name: string;
  technician_completion_date: string;
  technician_id: number;
  technician_name: string;
  test_try_details: string;
  total_down_time: number;
  updated_at: string;
  updated_by: string;
  updated_by_name: string;
  why1: string;
  why2: string;
  why3: string;
  work_center_id: number;
  work_center_name: string;
  work_description: string;
};

export type DeleteServiceRequestApiResposneProps = {
  msg: string;
  status: number;
};

export type DeleteWorkOrderApiResposneProps = {
  msg: string;
  status: number;
};

export type MachineDropdownListApiResponseProps = {
  status: number;
  msg: string;
  machine_dropdown: MachineDropdownListDataProps[];
};

export type MachineDropdownListDataProps = {
  machine_id: number;
  machine_name: string;
};
export type UserDropdownListDataProps = {
  name: string;
  status?: number;
  user_id: number;
  user_type?: number;
  username?: string;
};
export type CreateServiceReqApiResponseProps = {
  msg: string;
  request_id: number;
  status: number;
};

export type FileUploadApiResponseProps = {msg: string; status: number};

export type ViewServiceRequestApiResponseProps = {
  data: ViewServiceRequestDataProps;
  msg: string;
  status: number;
};

export type ViewServiceRequestDataProps = {
  availablity_reason: string;
  clear_alarm: string;
  completed_date: string;
  created_at: string;
  created_by: number;
  created_by_name: string;
  date_of_error_occur: string;
  division_description: string;
  division_id: number;
  division_name: string;
  efmea_date: string;
  efmea_status: string;
  employee_id: number;
  engineer_completion_date: string;
  engineer_id: number;
  engineer_name: string;
  equipment_id: string;
  error_message_alarm: string;
  error_verify_date: string;
  expected_completion_date: string;
  failure_time: string;
  geometry_status: string;
  identified_error: string;
  location: string;
  machine_id: number;
  machine_limitations: string;
  machine_name: string;
  machine_serial_no: string;
  machine_status: number;
  machine_status_at_alarm: number;
  machine_status_name: string;
  material_list: [];
  material_list_reason: string;
  operator_id: string;
  operator_name: string;
  perceived_inadequacy: string;
  pr_number: string;
  problem_description: string;
  problem_deviation: string;
  problem_rectified_status: string;
  problem_status: string;
  promise_date: string;
  received_by: string;
  receiving_date: string;
  recurring_problem: string;
  relevant_details: string;
  report_no: string;
  request_id: number;
  request_status: number;
  request_status_name: string;
  requested_by: string;
  requested_comments: string;
  requested_date: string;
  required_spare_parts: string;
  restart_machine: string;
  restart_program: string;
  schedule_date: string;
  service_date: string;
  service_deviation: string;
  service_order: string;
  service_team_comments: string;
  serviceable_or_not: string;
  shift: number;
  spare_availablity: string;
  start_date: string;
  status: number;
  supervisor_name: string;
  priority: number;
  technician_completion_date: string;
  technician_id: number;
  technician_name: string;
  test_try_details: string;
  updated_at: string;
  updated_by: string;
  updated_by_name: string;
  why1: string;
  why2: string;
  why3: string;
  work_description: string;
};

export type AttachmentsListApiResponseProps = {
  status: number;
  msg: string;
  data: AttachmentsListApiDataProps;
};

export type AttachmentsListApiDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: AttachmentsListItemsProps[];
};

export type AttachmentsListItemsProps = {
  created_at: string;
  file: string;
  file_title: string;
  id: number;
  note: string;
  request_id: number;
  status: number;
  upload_for: number;
};

export type DeleteAttachmentApiResposneProps = {
  msg: string;
  status: number;
};

export type WorkStartApiResposneProps = {
  msg: string;
  status: number;
};

export type TaskDetailsListApiResponseProps = {
  status: number;
  msg: string;
  data: TaskDetailsListDataProps;
};

export type TaskDetailsListDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: TaskDetailsDataItemsProps[];
};

export type TaskDetailsDataItemsProps = {
  endDatetime: string;
  end_status: number;
  intervention_by: {name: string; user_id: number; user_type: number}[];
  intervention_end_date: string;
  intervention_start_date: string;
  report_id: number;
  request_id: number;
  startDatetime: string;
  start_status: number;
  task_description: string;
  task_done_by: number;
  total_labor_hours: number;
};

export type DeleteTaskDetailApiResposneProps = {
  msg: string;
  status: number;
};

export type CreateTaskDetailApiResposneProps = {
  msg: string;
  status: number;
};

export type CloseWorkServiceApiResposneProps = {
  msg: string;
  status: number;
};

export type GetAccessPermissionApiResponseProps = {
  status: number;
  msg: string;
  data: GetAccessPermissionDataProps;
};

export type GetAccessPermissionDataProps = {
  dashboard: {
    dashboard_menu: number;
    today_report: number;
    machine_operational_stats: number;
    target_vs_actual: number;
    machine_performance: number;
  };
  management: {
    device_management: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      device_management_menu: number;
    };
    machine_management: {
      machine_management_menu: number;
      machine: {
        add: number;
        view: number;
        edit: number;
        delete: number;
        task: number;
        machine_menu: number;
        task_data: {
          add: number;
          delete: number;
          edit: number;
          task_menu: number;
        };
      };
      machine_group: {
        add: number;
        view: number;
        edit: number;
        delete: number;
        machine_group_menu: number;
      };
      machine_type: {
        add: number;
        view: number;
        edit: number;
        delete: number;
        machine_type_menu: number;
      };
    };
    employee_management: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      employee_management_menu: number;
      change_password: number;
    };
    shift: {
      shift_menu: number;
      add: number;
      edit: number;
      delete: number;
    };
    work_schedule: {
      work_schedule_menu: number;
      special_holiday: {
        add: number;
        edit: number;
        delete: number;
        special_holiday_menu: number;
      };
      over_time: {
        add: number;
        edit: number;
        delete: number;
        over_time_menu: number;
      };
      regular_holiday: {
        add: number;
        regular_holiday_menu: number;
      };
    };
    access_group: {
      access_group_menu: number;
      add: number;
      edit: number;
      view: number;
      delete: number;
    };
    task: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      task_menu: number;
    };
    management_menu: number;
  };
  production: {
    production_menu: number;
    resource_planning: {
      resource_palnning_menu: number;
      add: number;
      view: number;
      edit: number;
      delete: number;
      actual_resource_planning: number;
      work_order: {
        work_order_menu: number;
        add: number;
        edit: number;
        view: number;
        delete: number;
      };
    };
  };
  maintenance: {
    maintenance_menu: number;
    service_request: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      service_request_menu: number;
      update: number;
    };
    preventive_sr: {
      preventive_sr_menu: number;
      add: number;
      view: number;
      delete: number;
      update: number;
    };
    service_dashboard: {
      service_dashboard_menu: number;
      machine_list: number;
    };
  };
  work_definition: {
    work_definition_menu: number;
    item_repository: {
      item_repository_menu: number;
      add: number;
      edit: number;
      delete: number;
    };
    work_definition: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      sub_work_definition: number;
    };
    routing: {
      add: number;
      view: number;
      edit: number;
      delete: number;
      routing_menu: number;
    };
  };
  subscription: {
    subscription_menu: number;
  };
  report: {
    report_menu: number;
    statistic_report: number;
    mttr_report: number;
    mtbf_report: number;
    general: {
      general_menu: number;
      employee_login_report: number;
      machine_report: number;
      work_report: number;
      work_order_plan_report: number;
    };
  };
};

export type MaintenacneWorkOrderApiResponseProps = {
  status: number;
  msg: string;
  data: MaintenacneWorkOrderDataProps;
};

export type MaintenacneWorkOrderDataProps = {
  page: number;
  size: number;
  total_page: number;
  total_count: number;
  items: MaintenacneWorkOrderItemsProps[];
};

export type MaintenacneWorkOrderItemsProps = {
  work_order_id: number;
  name: string;
  company_name: string;
  mobile_no: string;
  email: string;
  work_title: string;
  work_order: string;
  color_code: string;
  description: string;
  status: number;
  rootingID: number;
  rootingName: string;
  work_definition_id: number | string;
  workDefinitionName: string;
  qty: number;
};

export type CreateWorkOrderApiResposneProps = {
  msg: string;
  status: number;
};

// Service Request Subscription
export type ServiceRequestSubscriptionProps = {
  available_machine_credits: number;
  is_subscription: number;
  status: number;
  subscription_expiry: string;
};
